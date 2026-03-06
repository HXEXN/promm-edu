"""
AI 프롬프트 토큰 최적화 도구
============================
규칙 기반으로 프롬프트의 불필요한 토큰을 분석·제거하여
LLM API 비용을 절감하는 Python 패키지.
"""

from optimizer.tokenizer import TokenCounter
from optimizer.analyzer import PatternAnalyzer
from optimizer.refiner import PromptRefiner
from optimizer.cost import CostCalculator

__version__ = "1.0.0"
__all__ = ["TokenCounter", "PatternAnalyzer", "PromptRefiner", "CostCalculator"]
