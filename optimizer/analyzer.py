"""
프롬프트 낭비 패턴 분석기
========================
프롬프트에서 토큰이 낭비되는 패턴을 식별하고,
각 패턴별 감지 건수를 보고한다.

5가지 낭비 패턴:
1. 중복 공백/줄바꿈
2. 과잉 공손 표현
3. 불필요 접속사/수식어
4. 반복 강조 표현
5. 불필요 지시 문구
"""

import re
from dataclasses import dataclass, field

from optimizer.tokenizer import TokenCounter
from optimizer.rules.korean import (
    POLITE_PATTERNS,
    FILLER_PATTERNS,
    REPETITIVE_INSTRUCTION_PATTERNS,
    UNNECESSARY_INSTRUCTION_PATTERNS,
)


@dataclass
class PatternMatch:
    """하나의 낭비 패턴 감지 결과"""
    category: str          # 패턴 카테고리
    description: str       # 패턴 설명
    matches: list[str]     # 감지된 텍스트 목록
    count: int             # 감지 건수
    estimated_waste: int   # 추정 낭비 토큰 수


@dataclass
class AnalysisReport:
    """프롬프트 분석 리포트"""
    original_text: str
    total_tokens: int
    patterns_found: list[PatternMatch] = field(default_factory=list)
    total_waste_estimate: int = 0

    @property
    def waste_rate(self) -> float:
        """토큰 낭비 비율 (0~1)"""
        if self.total_tokens == 0:
            return 0.0
        return self.total_waste_estimate / self.total_tokens


class PatternAnalyzer:
    """프롬프트 낭비 패턴 분석기"""

    def __init__(self, model: str = "gpt-4o-mini"):
        self.counter = TokenCounter(model=model)

    def analyze(self, text: str) -> AnalysisReport:
        """
        프롬프트를 분석하여 낭비 패턴 리포트를 생성한다.
        """
        total_tokens = self.counter.count(text)
        report = AnalysisReport(
            original_text=text,
            total_tokens=total_tokens,
        )

        # 각 패턴 분석 실행
        checkers = [
            self._check_whitespace,
            self._check_polite,
            self._check_fillers,
            self._check_repetitive,
            self._check_unnecessary,
        ]

        for checker in checkers:
            match = checker(text)
            if match and match.count > 0:
                report.patterns_found.append(match)
                report.total_waste_estimate += match.estimated_waste

        return report

    def _estimate_tokens(self, texts: list[str]) -> int:
        """텍스트 목록의 총 토큰 수를 추정한다."""
        total = 0
        for t in texts:
            total += self.counter.count(t)
        return total

    def _check_whitespace(self, text: str) -> PatternMatch | None:
        """패턴 1: 중복 공백/줄바꿈 검사"""
        # 연속 공백
        multi_spaces = re.findall(r" {2,}", text)
        # 연속 줄바꿈
        multi_newlines = re.findall(r"\n{3,}", text)
        # 탭 문자
        tabs = re.findall(r"\t+", text)

        all_matches = multi_spaces + multi_newlines + tabs
        if not all_matches:
            return None

        return PatternMatch(
            category="중복 공백/줄바꿈",
            description="연속된 공백, 빈 줄, 탭 문자가 감지되었습니다.",
            matches=all_matches[:5],  # 최대 5개만 표시
            count=len(all_matches),
            estimated_waste=self._estimate_tokens(all_matches),
        )

    def _check_polite(self, text: str) -> PatternMatch | None:
        """패턴 2: 과잉 공손 표현 검사"""
        all_matches = []
        for pattern, _ in POLITE_PATTERNS:
            found = re.findall(pattern, text)
            all_matches.extend(found)

        if not all_matches:
            return None

        return PatternMatch(
            category="과잉 공손 표현",
            description="불필요한 인사, 부탁, 겸양 표현이 감지되었습니다.",
            matches=all_matches[:5],
            count=len(all_matches),
            estimated_waste=self._estimate_tokens(all_matches),
        )

    def _check_fillers(self, text: str) -> PatternMatch | None:
        """패턴 3: 불필요 접속사/수식어 검사"""
        all_matches = []
        for pattern, _ in FILLER_PATTERNS:
            found = re.findall(pattern, text)
            all_matches.extend(found)

        if not all_matches:
            return None

        return PatternMatch(
            category="불필요 접속사/수식어",
            description="의미에 기여하지 않는 접속사나 수식어가 감지되었습니다.",
            matches=all_matches[:5],
            count=len(all_matches),
            estimated_waste=self._estimate_tokens(all_matches),
        )

    def _check_repetitive(self, text: str) -> PatternMatch | None:
        """패턴 4: 반복 강조 표현 검사"""
        all_matches = []
        for pattern, _ in REPETITIVE_INSTRUCTION_PATTERNS:
            found = re.findall(pattern, text)
            all_matches.extend(found)

        if not all_matches:
            return None

        return PatternMatch(
            category="반복 강조 표현",
            description="같은 의미를 중복하여 강조하는 표현이 감지되었습니다.",
            matches=all_matches[:5],
            count=len(all_matches),
            estimated_waste=self._estimate_tokens(all_matches),
        )

    def _check_unnecessary(self, text: str) -> PatternMatch | None:
        """패턴 5: 불필요 지시 문구 검사"""
        all_matches = []
        for pattern, _ in UNNECESSARY_INSTRUCTION_PATTERNS:
            found = re.findall(pattern, text)
            all_matches.extend(found)

        if not all_matches:
            return None

        return PatternMatch(
            category="불필요 지시 문구",
            description="핵심 지시 없이 토큰만 차지하는 문구가 감지되었습니다.",
            matches=all_matches[:5],
            count=len(all_matches),
            estimated_waste=self._estimate_tokens(all_matches),
        )
