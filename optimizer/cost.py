"""
API 비용 계산기
==============
모델별 토큰 단가를 기반으로 최적화 전후의 비용을 계산한다.
단가는 2024~2025년 공시 가격 기준이며, 변동될 수 있다.
"""

from dataclasses import dataclass

from optimizer.tokenizer import TokenCounter


# 모델별 토큰 단가 (USD per 1M tokens)
# 출처: 각 서비스 공식 가격표 (2025년 기준)
MODEL_PRICING = {
    "gpt-4o": {
        "input": 2.50,    # $2.50 / 1M input tokens
        "output": 10.00,  # $10.00 / 1M output tokens
    },
    "gpt-4o-mini": {
        "input": 0.15,    # $0.15 / 1M input tokens
        "output": 0.60,   # $0.60 / 1M output tokens
    },
    "gpt-4-turbo": {
        "input": 10.00,
        "output": 30.00,
    },
    "gpt-4": {
        "input": 30.00,
        "output": 60.00,
    },
    "gpt-3.5-turbo": {
        "input": 0.50,
        "output": 1.50,
    },
}


@dataclass
class CostReport:
    """비용 비교 리포트"""
    model: str
    original_tokens: int
    optimized_tokens: int
    saved_tokens: int
    # 단위: USD
    original_input_cost: float
    optimized_input_cost: float
    saved_cost: float
    # 월간 추정 (일 N회 호출 기준)
    daily_calls: int
    monthly_savings: float
    yearly_savings: float


class CostCalculator:
    """LLM API 비용 계산기"""

    def __init__(self, model: str = "gpt-4o-mini"):
        self.model = model
        self.counter = TokenCounter(model=model)
        self.pricing = MODEL_PRICING.get(model, MODEL_PRICING["gpt-4o-mini"])

    @staticmethod
    def get_supported_models() -> list[str]:
        """지원하는 모델 목록을 반환한다."""
        return list(MODEL_PRICING.keys())

    @staticmethod
    def get_pricing_table() -> dict:
        """전체 가격 테이블을 반환한다."""
        return MODEL_PRICING.copy()

    def calculate_cost(self, tokens: int, direction: str = "input") -> float:
        """
        토큰 수에 대한 비용을 계산한다 (USD).

        Args:
            tokens: 토큰 수
            direction: "input" 또는 "output"
        """
        price_per_1m = self.pricing.get(direction, self.pricing["input"])
        return (tokens / 1_000_000) * price_per_1m

    def compare(
        self,
        original: str,
        optimized: str,
        daily_calls: int = 100,
    ) -> CostReport:
        """
        최적화 전후의 비용을 비교한다.

        Args:
            original: 원본 프롬프트
            optimized: 최적화된 프롬프트
            daily_calls: 하루 평균 호출 횟수 (월간 비용 추정용)
        """
        orig_tokens = self.counter.count(original)
        opt_tokens = self.counter.count(optimized)
        saved_tokens = orig_tokens - opt_tokens

        orig_cost = self.calculate_cost(orig_tokens)
        opt_cost = self.calculate_cost(opt_tokens)
        saved_cost = orig_cost - opt_cost

        # 월간/연간 추정
        monthly_savings = saved_cost * daily_calls * 30
        yearly_savings = saved_cost * daily_calls * 365

        return CostReport(
            model=self.model,
            original_tokens=orig_tokens,
            optimized_tokens=opt_tokens,
            saved_tokens=saved_tokens,
            original_input_cost=round(orig_cost, 8),
            optimized_input_cost=round(opt_cost, 8),
            saved_cost=round(saved_cost, 8),
            daily_calls=daily_calls,
            monthly_savings=round(monthly_savings, 4),
            yearly_savings=round(yearly_savings, 4),
        )

    def simulate_bulk(
        self,
        original: str,
        optimized: str,
        call_counts: list[int] | None = None,
    ) -> list[dict]:
        """
        다양한 호출 횟수에 대한 비용 시뮬레이션.

        Args:
            original: 원본 프롬프트
            optimized: 최적화된 프롬프트
            call_counts: 시뮬레이션할 일일 호출 횟수 목록
        """
        if call_counts is None:
            call_counts = [10, 50, 100, 500, 1000, 5000]

        results = []
        for n in call_counts:
            report = self.compare(original, optimized, daily_calls=n)
            results.append({
                "daily_calls": n,
                "monthly_original": round(report.original_input_cost * n * 30, 4),
                "monthly_optimized": round(report.optimized_input_cost * n * 30, 4),
                "monthly_savings": report.monthly_savings,
                "yearly_savings": report.yearly_savings,
            })

        return results
