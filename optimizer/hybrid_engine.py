"""
하이브리드 최적화 엔진
====================
Fine-tuning 개념과 RAG 개념을 통합한 최적화 엔진.

파이프라인:
1. RAG: 유사 사례 검색 → 예상 절감률/추천 규칙 확인
2. Fine-tuning: 도메인 감지 → 최적 규칙 프로파일 적용
3. 통합 의사결정 → 최종 최적화 실행
4. 결과 비교 (기존 방식 vs 하이브리드)
"""

from dataclasses import dataclass, field

from optimizer.tokenizer import TokenCounter
from optimizer.refiner import PromptRefiner, RefinementResult
from optimizer.cost import CostCalculator
from optimizer.learned_optimizer import (
    AdaptiveRefiner,
    DomainProfile,
    apply_learned_patterns,
)
from optimizer.prompt_rag import (
    PromptKnowledgeBase,
    SimilaritySearcher,
    OptimizationAdvisor,
    OptimizationAdvice,
    SearchResult,
)


@dataclass
class HybridResult:
    """하이브리드 최적화 결과"""

    # 입력
    original_text: str
    original_tokens: int

    # 기존 규칙 기반 결과
    rule_based_result: RefinementResult
    rule_based_tokens: int
    rule_based_reduction: float

    # 하이브리드 결과
    hybrid_refined_text: str
    hybrid_tokens: int
    hybrid_reduction: float

    # 차이 분석
    additional_savings: int  # 하이브리드로 인한 추가 절감 토큰
    improvement_rate: float  # 추가 개선률

    # Fine-tuning 기여
    detected_domain: str
    domain_confidence: float
    finetuning_contribution: str  # 설명 텍스트

    # RAG 기여
    rag_advice: OptimizationAdvice | None = None
    rag_similar_cases: list = field(default_factory=list)
    rag_contribution: str = ""  # 설명 텍스트

    # 비용 분석
    cost_rule_based: float = 0.0
    cost_hybrid: float = 0.0
    cost_savings: float = 0.0

    # 전략 선택 근거
    strategy_explanation: str = ""

    # 학습 패턴 적용 결과
    learned_patterns_applied: list = field(default_factory=list)


class HybridOptimizer:
    """
    하이브리드 최적화 엔진 — Fine-tuning + RAG 통합

    시칠리아 요리 전문가(Fine-tuning)가 최신 트렌드를 검색(RAG)해서
    비건 시칠리아 파스타를 제안하는 것처럼,
    도메인 전문지식 + 유사 사례 참조를 결합한다.
    """

    def __init__(self, model: str = "gpt-4o-mini"):
        self.model = model
        self.counter = TokenCounter(model=model)
        self.refiner = PromptRefiner(model=model)
        self.calculator = CostCalculator(model=model)

        # Fine-tuning 모듈
        self.adaptive_refiner = AdaptiveRefiner(model=model)

        # RAG 모듈
        self.knowledge_base = PromptKnowledgeBase(model=model)
        self.searcher: SimilaritySearcher | None = None
        self.advisor: OptimizationAdvisor | None = None

        self._initialized = False

    def initialize(self, dataset: dict[str, list[str]]):
        """
        하이브리드 엔진을 초기화한다.
        Fine-tuning 학습 + RAG 지식 베이스 구축을 동시에 수행.

        Args:
            dataset: 카테고리별 프롬프트 딕셔너리
        """
        # Fine-tuning: 도메인 프로파일 학습
        self.adaptive_refiner.train(dataset)

        # RAG: 지식 베이스 구축
        self.knowledge_base.build(dataset)
        self.searcher = SimilaritySearcher(self.knowledge_base)
        self.advisor = OptimizationAdvisor(self.knowledge_base, self.searcher)

        self._initialized = True

    @property
    def is_initialized(self) -> bool:
        return self._initialized

    def optimize(self, text: str, top_k: int = 3) -> HybridResult:
        """
        하이브리드 최적화를 수행한다.

        파이프라인:
        1. RAG: 유사 사례 검색
        2. Fine-tuning: 도메인 감지 + 프로파일 조회
        3. 통합: RAG 추천 + Fine-tuning 프로파일 결합
        4. 실행: 최적 규칙 세트로 최적화

        Args:
            text: 최적화할 프롬프트
            top_k: RAG 검색 시 참조할 유사 사례 수
        """
        original_tokens = self.counter.count(text)

        # ── Step 1: 기존 규칙 기반 실행 (Baseline) ──
        rule_based = self.refiner.refine(text)

        # ── Step 2: RAG — 유사 사례 기반 분석 ──
        rag_advice = None
        rag_similar = []
        rag_patterns = set()
        rag_contribution = "RAG 미초기화"

        if self._initialized and self.advisor:
            rag_advice = self.advisor.advise(text, top_k=top_k)
            rag_similar = rag_advice.similar_cases
            for pat in rag_advice.recommended_patterns:
                rag_patterns.add(pat["pattern"])
            if rag_advice.optimization_tips:
                rag_contribution = " | ".join(rag_advice.optimization_tips[:2])
            else:
                rag_contribution = "유사 사례 기반 분석 완료"

        # ── Step 3: Fine-tuning — 도메인 기반 분석 ──
        domain = "질문응답"
        domain_confidence = 0.0
        ft_contribution = "Fine-tuning 미학습"
        profile = DomainProfile(domain=domain)

        if self._initialized and self.adaptive_refiner.is_trained:
            adaptive_result = self.adaptive_refiner.refine(text)
            domain = adaptive_result.detected_domain
            domain_confidence = adaptive_result.domain_confidence
            profile = adaptive_result.profile_used

            if profile.top_effective_patterns:
                top_pat = profile.top_effective_patterns[0]
                ft_contribution = (
                    f"도메인 '{domain}' 감지 (신뢰도 {domain_confidence:.0%}). "
                    f"최적 규칙: {top_pat['category']} "
                    f"(효과 {top_pat['score']:.2f})"
                )
            else:
                ft_contribution = (
                    f"도메인 '{domain}' 감지 (신뢰도 {domain_confidence:.0%})"
                )

        # ── Step 4: 통합 의사결정 ──
        # RAG와 Fine-tuning의 추천을 결합하여 최적 규칙 세트 결정
        fix_settings = self._decide_rules(profile, rag_patterns, rag_advice)

        # ── Step 5: 학습 패턴 적용 (하이브리드 차별화) ──
        # 도메인 특화 학습 패턴을 원본 텍스트에 먼저 적용하여 
        # 불필요하게 장황한 문맥을 도메인 지식으로 걷어낸다 (기존 규칙에 의해 훼손되기 전).
        hybrid_text = text
        learned_applied = []
        if self._initialized:
            hybrid_text, learned_applied = apply_learned_patterns(
                hybrid_text, domain
            )

        # ── Step 5.5: 기본 규칙 최적화 실행 ──
        hybrid_result = self.refiner.refine(
            hybrid_text,
            fix_whitespace=fix_settings["fix_whitespace"],
            fix_polite=fix_settings["fix_polite"],
            fix_fillers=fix_settings["fix_fillers"],
            fix_repetitive=fix_settings["fix_repetitive"],
            fix_unnecessary=fix_settings["fix_unnecessary"],
        )
        hybrid_text = hybrid_result.refined

        # ── Step 6: 결과 비교 ──
        # 학습 패턴 적용 후 토큰 수 재계산
        hybrid_tokens = self.counter.count(hybrid_text)
        hybrid_reduction = (
            1 - hybrid_tokens / original_tokens
        ) if original_tokens > 0 else 0.0

        additional_savings = rule_based.refined_tokens - hybrid_tokens
        improvement_rate = (
            hybrid_reduction - rule_based.reduction_rate
        ) if hybrid_reduction > rule_based.reduction_rate else 0.0

        # 실제로 하이브리드가 더 나을 때만 사용
        if hybrid_tokens > rule_based.refined_tokens:
            hybrid_text = rule_based.refined
            hybrid_tokens = rule_based.refined_tokens
            hybrid_reduction = rule_based.reduction_rate
            additional_savings = 0
            improvement_rate = 0.0
            learned_applied = []

        # 비용 계산
        cost_rule = self.calculator.calculate_cost(rule_based.refined_tokens)
        cost_hybrid = self.calculator.calculate_cost(hybrid_tokens)

        # 전략 설명
        strategy = self._build_strategy_explanation(
            domain, domain_confidence, rag_advice, fix_settings,
            len(learned_applied),
        )

        return HybridResult(
            original_text=text,
            original_tokens=original_tokens,
            rule_based_result=rule_based,
            rule_based_tokens=rule_based.refined_tokens,
            rule_based_reduction=rule_based.reduction_rate,
            hybrid_refined_text=hybrid_text,
            hybrid_tokens=hybrid_tokens,
            hybrid_reduction=hybrid_reduction,
            additional_savings=additional_savings,
            improvement_rate=round(improvement_rate, 4),
            detected_domain=domain,
            domain_confidence=domain_confidence,
            finetuning_contribution=ft_contribution,
            rag_advice=rag_advice,
            rag_similar_cases=[
                {
                    "rank": r.rank,
                    "similarity": r.similarity_score,
                    "category": r.entry.category,
                    "reduction_rate": r.entry.reduction_rate,
                    "original": r.entry.original_text[:80] + "..."
                    if len(r.entry.original_text) > 80
                    else r.entry.original_text,
                    "refined": r.entry.refined_text[:80] + "..."
                    if len(r.entry.refined_text) > 80
                    else r.entry.refined_text,
                }
                for r in rag_similar
            ],
            rag_contribution=rag_contribution,
            cost_rule_based=round(cost_rule, 10),
            cost_hybrid=round(cost_hybrid, 10),
            cost_savings=round(cost_rule - cost_hybrid, 10),
            strategy_explanation=strategy,
            learned_patterns_applied=learned_applied,
        )

    def _decide_rules(
        self,
        profile: DomainProfile,
        rag_patterns: set[str],
        rag_advice: OptimizationAdvice | None,
    ) -> dict[str, bool]:
        """
        Fine-tuning 프로파일과 RAG 추천을 결합하여
        규칙 활성화 여부를 결정한다.
        """
        # 기본: 모두 활성화
        settings = {
            "fix_whitespace": True,
            "fix_polite": True,
            "fix_fillers": True,
            "fix_repetitive": True,
            "fix_unnecessary": True,
        }

        # Fine-tuning 프로파일에서 비활성화된 규칙 반영
        rule_map = {
            "과잉 공손 표현": "fix_polite",
            "불필요 접속사/수식어": "fix_fillers",
            "반복 강조 표현": "fix_repetitive",
            "불필요 지시 문구": "fix_unnecessary",
        }

        if profile and profile.recommended_rules:
            for category, setting_key in rule_map.items():
                rule_config = profile.recommended_rules.get(category, {})
                # 프로파일에서 비활성화 추천하면 비활성화
                if not rule_config.get("enabled", True):
                    settings[setting_key] = False

        # RAG가 특정 패턴을 강력 추천하면 다시 활성화
        if rag_advice and rag_advice.recommended_patterns:
            for pat in rag_advice.recommended_patterns:
                if pat["recommendation"] == "강력 추천":
                    pat_name = pat["pattern"]
                    if pat_name in rule_map:
                        settings[rule_map[pat_name]] = True

        return settings

    def _build_strategy_explanation(
        self,
        domain: str,
        confidence: float,
        rag_advice: OptimizationAdvice | None,
        fix_settings: dict[str, bool],
        learned_count: int = 0,
    ) -> str:
        """전략 선택 근거를 사람이 읽기 쉬운 텍스트로 생성한다."""
        parts = []

        parts.append(
            f"[Fine-tuning] 도메인 '{domain}' 감지 (신뢰도 {confidence:.0%})"
        )

        if rag_advice:
            parts.append(
                f"[RAG] 유사 사례 {len(rag_advice.similar_cases)}건 검색, "
                f"예상 절감률 {rag_advice.predicted_reduction_rate:.1%}"
            )

        disabled = [k for k, v in fix_settings.items() if not v]
        if disabled:
            disabled_names = ", ".join(disabled)
            parts.append(
                f"[통합 결정] 비활성화된 규칙: {disabled_names}"
            )
        else:
            parts.append("[통합 결정] 모든 규칙 활성화")

        if learned_count > 0:
            parts.append(f"[학습 패턴] {learned_count}개 추가 패턴 적용")

        return " → ".join(parts)
