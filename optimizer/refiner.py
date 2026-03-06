"""
프롬프트 정제 엔진
=================
분석기에서 식별된 낭비 패턴을 실제로 제거/축약하여
최적화된 프롬프트를 생성한다.
"""

import re
from dataclasses import dataclass, field

from optimizer.tokenizer import TokenCounter
from optimizer.analyzer import PatternAnalyzer, AnalysisReport
from optimizer.rules.korean import apply_korean_rules


@dataclass
class RefinementResult:
    """정제 결과"""
    original: str
    refined: str
    original_tokens: int
    refined_tokens: int
    saved_tokens: int
    reduction_rate: float  # 0~1
    applied_rules: list[dict] = field(default_factory=list)
    analysis: AnalysisReport | None = None


class PromptRefiner:
    """규칙 기반 프롬프트 정제 엔진"""

    def __init__(self, model: str = "gpt-4o-mini"):
        self.counter = TokenCounter(model=model)
        self.analyzer = PatternAnalyzer(model=model)

    def refine(
        self,
        text: str,
        *,
        fix_whitespace: bool = True,
        fix_polite: bool = True,
        fix_fillers: bool = True,
        fix_repetitive: bool = True,
        fix_unnecessary: bool = True,
    ) -> RefinementResult:
        """
        프롬프트를 정제한다. 각 규칙을 개별적으로 켜고 끌 수 있다.

        Args:
            text: 원본 프롬프트
            fix_whitespace: 중복 공백/줄바꿈 정리
            fix_polite: 과잉 공손 표현 제거
            fix_fillers: 불필요 접속사/수식어 제거
            fix_repetitive: 반복 강조 표현 통합
            fix_unnecessary: 불필요 지시 문구 제거

        Returns:
            RefinementResult: 정제 결과
        """
        # 1. 먼저 분석을 실행
        analysis = self.analyzer.analyze(text)

        # 2. 정제 적용
        refined = text
        all_applied = []

        if fix_whitespace:
            refined, applied = self._fix_whitespace(refined)
            all_applied.extend(applied)

        if fix_polite or fix_fillers or fix_repetitive or fix_unnecessary:
            # 한국어 규칙 적용 (원하는 카테고리만)
            refined, applied = self._apply_selective_korean_rules(
                refined,
                polite=fix_polite,
                fillers=fix_fillers,
                repetitive=fix_repetitive,
                unnecessary=fix_unnecessary,
            )
            all_applied.extend(applied)

        # 3. 후처리: 정제 규칙이 하나라도 적용된 경우에만 실행
        any_rule_on = fix_whitespace or fix_polite or fix_fillers or fix_repetitive or fix_unnecessary
        if any_rule_on:
            refined = self._post_clean(refined)

        # 4. 토큰 비교
        orig_tokens = self.counter.count(text)
        ref_tokens = self.counter.count(refined)
        saved = orig_tokens - ref_tokens
        rate = saved / orig_tokens if orig_tokens > 0 else 0.0

        return RefinementResult(
            original=text,
            refined=refined,
            original_tokens=orig_tokens,
            refined_tokens=ref_tokens,
            saved_tokens=saved,
            reduction_rate=round(rate, 4),
            applied_rules=all_applied,
            analysis=analysis,
        )

    def _fix_whitespace(self, text: str) -> tuple[str, list[dict]]:
        """중복 공백/줄바꿈 정리"""
        applied = []
        original = text

        # 연속 공백 → 단일 공백
        new_text = re.sub(r" {2,}", " ", text)
        if new_text != text:
            applied.append({"rule": "연속 공백 제거", "category": "중복 공백/줄바꿈"})
            text = new_text

        # 연속 줄바꿈 → 최대 2개
        new_text = re.sub(r"\n{3,}", "\n\n", text)
        if new_text != text:
            applied.append({"rule": "연속 줄바꿈 정리", "category": "중복 공백/줄바꿈"})
            text = new_text

        # 탭 → 공백
        new_text = text.replace("\t", " ")
        if new_text != text:
            applied.append({"rule": "탭 → 공백 변환", "category": "중복 공백/줄바꿈"})
            text = new_text

        # 줄 끝 공백 제거
        new_text = re.sub(r" +\n", "\n", text)
        if new_text != text:
            applied.append({"rule": "줄 끝 공백 제거", "category": "중복 공백/줄바꿈"})
            text = new_text

        return text, applied

    def _apply_selective_korean_rules(
        self,
        text: str,
        *,
        polite: bool,
        fillers: bool,
        repetitive: bool,
        unnecessary: bool,
    ) -> tuple[str, list[dict]]:
        """선택된 한국어 규칙만 적용"""
        from optimizer.rules.korean import (
            POLITE_PATTERNS,
            FILLER_PATTERNS,
            REPETITIVE_INSTRUCTION_PATTERNS,
            UNNECESSARY_INSTRUCTION_PATTERNS,
        )

        applied = []
        rule_groups = []

        if polite:
            rule_groups.append(("과잉 공손 표현", POLITE_PATTERNS))
        if fillers:
            rule_groups.append(("불필요 접속사/수식어", FILLER_PATTERNS))
        if repetitive:
            rule_groups.append(("반복 강조 표현", REPETITIVE_INSTRUCTION_PATTERNS))
        if unnecessary:
            rule_groups.append(("불필요 지시 문구", UNNECESSARY_INSTRUCTION_PATTERNS))

        for category, patterns in rule_groups:
            for pattern, replacement in patterns:
                matches = re.findall(pattern, text)
                if matches:
                    applied.append({
                        "rule": f"'{matches[0]}' → '{replacement}'" if replacement else f"'{matches[0]}' 제거",
                        "category": category,
                        "count": len(matches),
                    })
                    text = re.sub(pattern, replacement, text)

        return text, applied

    def _post_clean(self, text: str) -> str:
        """정제 후 후처리"""
        # 다시 연속 공백 정리 (규칙 적용 후 발생 가능)
        text = re.sub(r" {2,}", " ", text)
        # 앞뒤 공백 제거
        text = text.strip()
        return text
