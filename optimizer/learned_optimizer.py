"""
학습형 최적화 엔진 (Fine-tuning 개념)
====================================
벤치마크 데이터를 분석하여 규칙별 효과를 학습하고,
도메인별 최적 규칙 프로파일을 자동 생성한다.

Fine-tuning 개념: 데이터에서 "깊이 있는 지식"을 추출하여
도메인 특화된 최적화 수행.
"""

import re
from dataclasses import dataclass, field
from statistics import mean, stdev

from optimizer.tokenizer import TokenCounter
from optimizer.analyzer import PatternAnalyzer
from optimizer.refiner import PromptRefiner, RefinementResult
from optimizer.rules.korean import (
    POLITE_PATTERNS,
    FILLER_PATTERNS,
    REPETITIVE_INSTRUCTION_PATTERNS,
    UNNECESSARY_INSTRUCTION_PATTERNS,
)


# ─── 도메인별 학습 기반 추가 패턴 ───
# 벤치마크 데이터 분석에서 발견된 도메인 특화 비효율 패턴들.
# 기존 46개 규칙으로 커버되지 않는 추가 축약을 제공한다.

LEARNED_DOMAIN_PATTERNS = {
    "질문응답": [
        # 장황한 질문 구조 축약
        (r"다음에\s+대해\s+(?:설명해|알려)\s+주세요[.]?\s*", "설명해 주세요. "),
        (r"(?:에\s+대해서?|에\s+관해서?)\s+(?:자세히|자세하게)\s+", "에 대해 "),
        (r"(?:최대한\s+)?(?:자세히|자세하게)\s+(?:설명해\s*주세요|알려\s*주세요)", "설명해 주세요"),
        (r"(?:이|그)\s+(?:것이|게)\s+(?:무엇인지|뭔지|무엇이며)\s+", ""),
        (r"꼭\s+반드시\s+예시도\s+(?:들어주세요|포함해\s*주세요)", "예시 포함."),
        (r"(?:도|또)\s+알려\s*주세요[.]?", "도 설명해 주세요."),
        # 불필요 메타 질문
        (r"한\s+가지\s+질문\s+드리겠습니다[.]?\s*", ""),
        (r"질문이\s+있(?:습니다|어요)[.]?\s*", ""),
        (r"답변\s+(?:부탁드립니다|해\s+주세요)[.]?\s*", ""),
        # 보강: 비교/설명 통합 축약
        (r"(?:차이점이|차이를)\s+(?:뭔가요|무엇인가요)[?]?\s*", "차이점은? "),
        (r"(?:자세히|자세하게)\s+(?:비교|설명|분석)해\s+주세요", "비교해 주세요"),
        (r"(?:와|과)의\s+(?:차이점|관계|연관성)(?:을|도)\s+", "과 "),
        (r"어떤\s+상황에서\s+사용해야\s+하는지", "사용 시기"),
        (r"언제\s+어떤\s+것을\s+(?:선택|사용)해야\s+하는지(?:도)?", "선택 기준"),
    ],
    "코드생성": [
        # 코드 요청 축약
        (r"코드\s+작성을?\s+", ""),
        (r"(?:깔끔하게|정돈되게)\s+작성해\s+주세요", "작성해 주세요"),
        (r"주석도\s+(?:꼼꼼히\s+)?달아\s*주세요", "주석 포함"),
        (r"그리고\s+또한\s+추가적으로\s+(.+?)도\s+작성해\s+주세요", r"\1 포함"),
        # 불필요 기술 지시
        (r"(?:간단한|기본적인)\s+", ""),
        (r"(?:에러|예외)\s+처리도?\s+(?:해\s*주세요|포함해\s*주세요)", "예외 처리 포함"),
        # 보강: 설계 패턴/프레임워크 축약
        (r"꼭\s+반드시\s+(?:실용적인\s+)?예제도\s+포함해\s+주세요", "예제 포함"),
        (r"꼭\s+반드시\s+(.+?)(?:하게|으로)\s+만들어\s+주세요", r"\1"),
        (r"타입\s+힌트도\s+달아\s*주세요", "타입 힌트 포함"),
        (r"(.+?)를?\s+(?:사용하고|활용하고)\s+", r"\1 사용, "),
        (r"(?:둘\s+다|모두)\s+작성해\s+주세요", "둘 다 포함"),
        (r"(?:비동기로|async로)\s+동작하게\s+해주세요", "비동기 포함"),
    ],
    "요약": [
        # 요약 지시 축약
        (r"아래\s+(?:글|텍스트|내용)을?\s+", ""),
        (r"꼭\s+반드시\s+핵심만\s+간추려서\s+([0-9]+줄로)\s+요약해\s+주세요", r"핵심 \1 요약"),
        (r"기본적으로\s+사실상\s+중요한\s+것만\s+포함해\s+주세요[.]?", ""),
        (r"핵심\s+(?:내용|포인트)만\s+(?:추려|골라)\s*(?:서|주세요)", "핵심만"),
        (r"(?:간결하게|간단히|짧게)\s+(?:정리해|요약해)\s+주세요", "요약해 주세요"),
        (r"시사점도\s+알려\s*주세요[.]?", "시사점 포함."),
        # 보강: 키워드/형식 요청 축약
        (r"(?:핵심\s+)?키워드\s+(?:[0-9]+개도?\s+)?뽑아\s*주세요", "키워드 포함"),
        (r"(?:미래\s+)?전망도\s+(?:한\s+줄\s+)?추가해\s+주세요", "전망 포함"),
        (r"(?:3문장|3줄)\s+이내로\s+(?:부탁드립니다|정리해\s+주세요)", "3줄 요약"),
        (r"핵심만\s+뽑아서\s+요약해\s+주세요", "핵심 요약"),
        (r"(?:정말\s+정말\s+)?(?:간결하게|핵심만)\s+(?:핵심만\s+)?뽑아서", "핵심"),
    ],
    "번역": [
        # 번역 지시 축약
        (r"다음\s+(?:한국어\s+)?문장을?\s+(?:영어로|한국어로)\s+", ""),
        (r"정말\s+정말\s+자연스럽게\s+부탁드립니다[.]?", "자연스럽게 번역해 주세요."),
        (r"자연스럽게\s+(?:번역해\s+주세요|해\s*주세요)", "자연스럽게 번역해 주세요"),
        (r"문맥에\s+맞게\s+(?:해\s*주세요|번역해\s*주세요)", "번역해 주세요"),
        (r"비즈니스\s+영어로\s+작성해\s+주세요", "비즈니스 영어로 번역해 주세요"),
        # 보강: 톤/형식 요청 축약
        (r"(?:비즈니스\s+)?이메일\s+톤으로\s+(?:정말\s+정말\s+)?격식\s+있게\s+작성해\s+주세요", "격식체 번역"),
        (r"(?:학술\s+)?논문\s+스타일로\s+번역해\s+주세요", "학술체 번역"),
        (r"전문\s+용어는?\s+(?:원어를?\s+)?병기해\s+주세요", "전문 용어 병기"),
        (r"격식체와\s+비격식체\s+두\s+가지\s+버전으로\s+작성해\s+주세요", "격식/비격식 두 버전"),
        (r"의역\s+(?:버전도?\s+)?(?:달아|해)\s*주세요", "의역 포함"),
        (r"(?:공식적인|격식\s+있는)\s+톤으로\s+작성해\s+주세요", "공식 톤 번역"),
        (r"IT\s+전문가가\s+이해하기\s+쉽게\s+번역", "IT 용어 번역"),
    ],
}



def apply_learned_patterns(text: str, domain: str) -> tuple[str, list[dict]]:
    """
    도메인 특화 학습 패턴을 적용한다.

    Args:
        text: 정제할 텍스트 (기존 규칙 적용 후)
        domain: 감지된 도메인

    Returns:
        (정제된 텍스트, 적용된 패턴 목록)
    """
    patterns = LEARNED_DOMAIN_PATTERNS.get(domain, [])
    applied = []

    for pattern, replacement in patterns:
        matches = re.findall(pattern, text)
        if matches:
            applied.append({
                "rule": f"'{matches[0]}' → '{replacement}'" if replacement else f"'{matches[0]}' 제거",
                "category": f"학습 패턴 ({domain})",
                "count": len(matches),
            })
            text = re.sub(pattern, replacement, text)

    # 후처리: 이중 공백 정리
    text = re.sub(r" {2,}", " ", text).strip()

    return text, applied


# ─── 도메인 감지용 키워드 ───

DOMAIN_KEYWORDS = {
    "질문응답": [
        "설명", "알려", "무엇", "뭔가", "차이점", "어떻게", "왜",
        "이유", "방법", "개념", "정의", "비교", "장단점",
    ],
    "코드생성": [
        "코드", "구현", "작성", "프로그래밍", "함수", "클래스", "알고리즘",
        "파이썬", "자바스크립트", "SQL", "React", "Node", "API",
        "스크립트", "버그", "디버그", "리팩토링",
    ],
    "요약": [
        "요약", "정리", "핵심", "간추", "줄여", "축약",
        "포인트", "키워드", "3줄", "한줄", "간결",
    ],
    "번역": [
        "번역", "영어로", "한국어로", "영문", "한글",
        "translate", "영작", "통역", "의역",
    ],
}


@dataclass
class RuleEffectiveness:
    """단일 규칙의 효과 통계"""
    rule_category: str
    pattern: str
    total_matches: int = 0           # 전체 매칭 횟수
    total_tokens_saved: float = 0.0  # 총 절감 토큰 수 (추정)
    apply_count: int = 0             # 적용된 프롬프트 수
    avg_tokens_per_match: float = 0.0  # 매칭당 평균 절감 토큰
    effectiveness_score: float = 0.0   # 효과 점수 (0~1)


@dataclass
class DomainProfile:
    """도메인별 최적 규칙 프로파일"""
    domain: str
    recommended_rules: dict = field(default_factory=dict)
    # 규칙 카테고리별 On/Off 및 우선순위
    # {"과잉 공손 표현": {"enabled": True, "priority": 1, "avg_reduction": 0.15}, ...}
    avg_reduction_rate: float = 0.0
    sample_count: int = 0
    top_effective_patterns: list = field(default_factory=list)
    confidence: float = 0.0  # 프로파일 신뢰도 (0~1)


@dataclass
class AdaptiveResult:
    """적응형 최적화 결과"""
    detected_domain: str
    domain_confidence: float
    profile_used: DomainProfile
    base_result: RefinementResult       # 기존 규칙 기반 결과
    adaptive_result: RefinementResult   # 적응형 결과
    improvement: float                  # 추가 절감률 (적응형 - 기존)
    rule_recommendations: list = field(default_factory=list)


class RuleEffectivenessAnalyzer:
    """규칙별 효과 분석기 — Fine-tuning의 '학습' 단계"""

    def __init__(self, model: str = "gpt-4o-mini"):
        self.counter = TokenCounter(model=model)
        self.refiner = PromptRefiner(model=model)

    def analyze_rule_effectiveness(
        self, dataset: dict[str, list[str]]
    ) -> dict[str, list[RuleEffectiveness]]:
        """
        데이터셋에서 각 규칙 카테고리의 효과를 분석한다.

        Returns:
            카테고리별 규칙 효과 딕셔너리
        """
        all_rule_groups = {
            "과잉 공손 표현": POLITE_PATTERNS,
            "불필요 접속사/수식어": FILLER_PATTERNS,
            "반복 강조 표현": REPETITIVE_INSTRUCTION_PATTERNS,
            "불필요 지시 문구": UNNECESSARY_INSTRUCTION_PATTERNS,
        }

        domain_results = {}

        for domain, prompts in dataset.items():
            rule_stats = {}

            for prompt in prompts:
                orig_tokens = self.counter.count(prompt)

                for category, patterns in all_rule_groups.items():
                    for pattern, replacement in patterns:
                        key = f"{category}::{pattern}"
                        if key not in rule_stats:
                            rule_stats[key] = RuleEffectiveness(
                                rule_category=category,
                                pattern=pattern,
                            )

                        matches = re.findall(pattern, prompt)
                        if matches:
                            rule_stats[key].total_matches += len(matches)
                            rule_stats[key].apply_count += 1

                            # 매칭된 텍스트의 토큰 수 추정
                            for m in matches:
                                matched_text = m if isinstance(m, str) else m[0]
                                saved = self.counter.count(matched_text)
                                if replacement:
                                    saved -= self.counter.count(replacement)
                                rule_stats[key].total_tokens_saved += max(saved, 0)

            # 효과 점수 계산
            for key, stat in rule_stats.items():
                if stat.total_matches > 0:
                    stat.avg_tokens_per_match = (
                        stat.total_tokens_saved / stat.total_matches
                    )
                total_prompts = len(prompts)
                if total_prompts > 0:
                    apply_rate = stat.apply_count / total_prompts
                    token_impact = min(stat.avg_tokens_per_match / 5.0, 1.0)
                    stat.effectiveness_score = round(
                        0.6 * apply_rate + 0.4 * token_impact, 4
                    )

            domain_results[domain] = sorted(
                rule_stats.values(),
                key=lambda x: x.effectiveness_score,
                reverse=True,
            )

        return domain_results

    def build_domain_profiles(
        self, dataset: dict[str, list[str]]
    ) -> dict[str, DomainProfile]:
        """
        데이터 분석을 바탕으로 도메인별 최적 프로파일을 생성한다.
        이것이 Fine-tuning의 '학습 결과'에 해당한다.
        """
        effectiveness = self.analyze_rule_effectiveness(dataset)
        profiles = {}

        for domain, prompts in dataset.items():
            # 도메인별 평균 절감률 계산
            rates = []
            for prompt in prompts:
                result = self.refiner.refine(prompt)
                rates.append(result.reduction_rate)

            avg_rate = mean(rates) if rates else 0.0
            std_rate = stdev(rates) if len(rates) > 1 else 0.0

            # 규칙 카테고리별 권장 설정 계산
            domain_effectiveness = effectiveness.get(domain, [])
            category_scores = {}
            for rule in domain_effectiveness:
                cat = rule.rule_category
                if cat not in category_scores:
                    category_scores[cat] = []
                category_scores[cat].append(rule.effectiveness_score)

            recommended = {}
            for idx, (cat, scores) in enumerate(
                sorted(
                    category_scores.items(),
                    key=lambda x: mean(x[1]),
                    reverse=True,
                )
            ):
                avg_score = mean(scores)
                recommended[cat] = {
                    "enabled": avg_score > 0.05,
                    "priority": idx + 1,
                    "avg_effectiveness": round(avg_score, 4),
                }

            # 상위 효과 패턴 추출
            top_patterns = [
                {
                    "category": r.rule_category,
                    "pattern": r.pattern,
                    "score": r.effectiveness_score,
                    "matches": r.total_matches,
                }
                for r in domain_effectiveness[:5]
                if r.effectiveness_score > 0
            ]

            # 신뢰도: 샘플 수 기반
            confidence = min(len(prompts) / 10.0, 1.0)

            profiles[domain] = DomainProfile(
                domain=domain,
                recommended_rules=recommended,
                avg_reduction_rate=round(avg_rate, 4),
                sample_count=len(prompts),
                top_effective_patterns=top_patterns,
                confidence=round(confidence, 4),
            )

        return profiles


class AdaptiveRefiner:
    """
    적응형 정제 엔진 — Fine-tuning된 지식을 활용한 최적화

    도메인을 자동 감지하고, 해당 도메인의 학습된 프로파일로
    최적화를 수행한다.
    """

    def __init__(self, model: str = "gpt-4o-mini"):
        self.model = model
        self.refiner = PromptRefiner(model=model)
        self.profiles: dict[str, DomainProfile] = {}
        self._trained = False

    def train(self, dataset: dict[str, list[str]]):
        """
        데이터셋으로 도메인 프로파일을 학습한다. (Fine-tuning 수행)
        """
        analyzer = RuleEffectivenessAnalyzer(model=self.model)
        self.profiles = analyzer.build_domain_profiles(dataset)
        self._trained = True

    @property
    def is_trained(self) -> bool:
        return self._trained

    def detect_domain(self, text: str) -> tuple[str, float]:
        """
        프롬프트의 도메인을 자동 감지한다.

        Returns:
            (도메인명, 신뢰도)
        """
        text_lower = text.lower()
        scores = {}

        for domain, keywords in DOMAIN_KEYWORDS.items():
            score = 0
            for kw in keywords:
                if kw.lower() in text_lower:
                    score += 1
            if len(keywords) > 0:
                scores[domain] = score / len(keywords)

        if not scores or max(scores.values()) == 0:
            return "질문응답", 0.1  # 기본값

        best_domain = max(scores, key=scores.get)
        best_score = scores[best_domain]

        # 정규화
        total = sum(scores.values())
        confidence = best_score / total if total > 0 else 0.0

        return best_domain, round(min(confidence, 1.0), 4)

    def refine(self, text: str) -> AdaptiveResult:
        """
        적응형 최적화를 수행한다.

        1. 도메인 감지
        2. 해당 도메인 프로파일의 규칙 우선순위로 최적화
        3. 기존 방식과 비교
        """
        # 1. 도메인 감지
        domain, confidence = self.detect_domain(text)

        # 2. 기존 방식 실행 (기준선)
        base_result = self.refiner.refine(text)

        # 3. 프로파일 기반 최적화
        profile = self.profiles.get(domain)

        if profile and self._trained:
            # 프로파일에 따라 활성화/비활성화 결정
            rule_settings = profile.recommended_rules
            adaptive_result = self.refiner.refine(
                text,
                fix_whitespace=True,  # 항상 활성화
                fix_polite=rule_settings.get(
                    "과잉 공손 표현", {}
                ).get("enabled", True),
                fix_fillers=rule_settings.get(
                    "불필요 접속사/수식어", {}
                ).get("enabled", True),
                fix_repetitive=rule_settings.get(
                    "반복 강조 표현", {}
                ).get("enabled", True),
                fix_unnecessary=rule_settings.get(
                    "불필요 지시 문구", {}
                ).get("enabled", True),
            )
        else:
            # 학습되지 않은 경우 기존 방식 그대로
            adaptive_result = base_result
            profile = DomainProfile(domain=domain)

        # 4. 개선 효과 계산
        improvement = adaptive_result.reduction_rate - base_result.reduction_rate

        # 5. 규칙 추천 생성
        recommendations = []
        if profile and profile.top_effective_patterns:
            for pat_info in profile.top_effective_patterns[:3]:
                recommendations.append(
                    f"[{pat_info['category']}] "
                    f"효과 점수 {pat_info['score']:.2f} — "
                    f"{pat_info['matches']}회 매칭"
                )

        return AdaptiveResult(
            detected_domain=domain,
            domain_confidence=confidence,
            profile_used=profile,
            base_result=base_result,
            adaptive_result=adaptive_result,
            improvement=round(improvement, 4),
            rule_recommendations=recommendations,
        )
