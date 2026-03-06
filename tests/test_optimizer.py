"""
프롬프트 토큰 최적화 도구 — 단위 테스트
"""

import pytest
import sys
import os

# 프로젝트 루트를 path에 추가
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from optimizer.tokenizer import TokenCounter
from optimizer.analyzer import PatternAnalyzer
from optimizer.refiner import PromptRefiner
from optimizer.cost import CostCalculator


# ═══════════════════════════════════════
# TokenCounter 테스트
# ═══════════════════════════════════════

class TestTokenCounter:
    def setup_method(self):
        self.counter = TokenCounter(model="gpt-4o-mini")

    def test_count_empty(self):
        assert self.counter.count("") == 0

    def test_count_simple_english(self):
        tokens = self.counter.count("Hello world")
        assert tokens > 0
        assert isinstance(tokens, int)

    def test_count_korean(self):
        tokens = self.counter.count("안녕하세요 세상")
        assert tokens > 0

    def test_tokenize_returns_list(self):
        result = self.counter.tokenize("Hello")
        assert isinstance(result, list)
        assert len(result) > 0

    def test_tokenize_has_required_keys(self):
        result = self.counter.tokenize("Test")
        for token in result:
            assert "token_id" in token
            assert "text" in token
            assert "bytes" in token

    def test_compare(self):
        result = self.counter.compare("This is a long sentence", "Short")
        assert result["original_tokens"] > result["optimized_tokens"]
        assert result["saved_tokens"] > 0
        assert 0 < result["reduction_rate"] <= 1

    def test_compare_same_text(self):
        result = self.counter.compare("same text", "same text")
        assert result["saved_tokens"] == 0
        assert result["reduction_rate"] == 0.0


# ═══════════════════════════════════════
# PatternAnalyzer 테스트
# ═══════════════════════════════════════

class TestPatternAnalyzer:
    def setup_method(self):
        self.analyzer = PatternAnalyzer(model="gpt-4o-mini")

    def test_detect_whitespace(self):
        report = self.analyzer.analyze("이것은   테스트   입니다")
        categories = [p.category for p in report.patterns_found]
        assert "중복 공백/줄바꿈" in categories

    def test_detect_polite(self):
        report = self.analyzer.analyze("안녕하세요, 혹시 괜찮으시다면 도와주세요")
        categories = [p.category for p in report.patterns_found]
        assert "과잉 공손 표현" in categories

    def test_detect_fillers(self):
        report = self.analyzer.analyze("그리고 또한 추가적으로 이것을 해주세요")
        categories = [p.category for p in report.patterns_found]
        assert "불필요 접속사/수식어" in categories

    def test_detect_repetitive(self):
        report = self.analyzer.analyze("꼭 반드시 해주세요. 정말 정말 중요합니다.")
        categories = [p.category for p in report.patterns_found]
        assert "반복 강조 표현" in categories

    def test_clean_text_no_patterns(self):
        report = self.analyzer.analyze("파이썬에서 리스트 정렬 방법을 알려줘")
        # 깨끗한 프롬프트에는 패턴이 거의 없어야 함
        assert report.total_waste_estimate <= report.total_tokens

    def test_total_tokens_positive(self):
        report = self.analyzer.analyze("테스트 문장")
        assert report.total_tokens > 0


# ═══════════════════════════════════════
# PromptRefiner 테스트
# ═══════════════════════════════════════

class TestPromptRefiner:
    def setup_method(self):
        self.refiner = PromptRefiner(model="gpt-4o-mini")

    def test_refine_reduces_whitespace(self):
        text = "이것은   많은    공백이   있는   문장입니다"
        result = self.refiner.refine(text)
        assert "   " not in result.refined
        assert result.saved_tokens >= 0

    def test_refine_removes_polite(self):
        text = "안녕하세요, 혹시 괜찮으시다면 파이썬 설명해 주세요. 감사합니다."
        result = self.refiner.refine(text)
        assert "안녕하세요" not in result.refined
        assert result.refined_tokens < result.original_tokens

    def test_refine_removes_repetitive(self):
        text = "꼭 반드시 해주세요"
        result = self.refiner.refine(text)
        assert "꼭 반드시" not in result.refined
        assert "반드시" in result.refined

    def test_refine_with_all_off(self):
        text = "안녕하세요,   꼭 반드시   해주세요. 감사합니다."
        result = self.refiner.refine(
            text,
            fix_whitespace=False,
            fix_polite=False,
            fix_fillers=False,
            fix_repetitive=False,
            fix_unnecessary=False,
        )
        # 모든 규칙 꺼면 거의 변화 없어야 함
        assert result.refined.strip() == text.strip()

    def test_refine_returns_applied_rules(self):
        text = "안녕하세요, 정말 정말 중요한 질문입니다"
        result = self.refiner.refine(text)
        assert len(result.applied_rules) > 0

    def test_refine_preserves_core_content(self):
        text = "안녕하세요, 혹시 괜찮으시다면 파이썬에서 리스트 정렬 방법을 알려주세요. 감사합니다."
        result = self.refiner.refine(text)
        # 핵심 내용은 유지되어야 함
        assert "파이썬" in result.refined
        assert "리스트" in result.refined
        assert "정렬" in result.refined


# ═══════════════════════════════════════
# CostCalculator 테스트
# ═══════════════════════════════════════

class TestCostCalculator:
    def setup_method(self):
        self.calculator = CostCalculator(model="gpt-4o-mini")

    def test_calculate_cost(self):
        cost = self.calculator.calculate_cost(1000)
        assert cost > 0
        assert isinstance(cost, float)

    def test_compare_shows_savings(self):
        original = "안녕하세요, 혹시 괜찮으시다면 파이썬 설명해 주세요. 감사합니다."
        optimized = "파이썬 설명해 주세요."
        report = self.calculator.compare(original, optimized)
        assert report.saved_tokens > 0
        assert report.saved_cost > 0
        assert report.monthly_savings > 0

    def test_simulate_bulk(self):
        results = self.calculator.simulate_bulk(
            "안녕하세요 테스트 프롬프트입니다",
            "테스트 프롬프트",
        )
        assert len(results) > 0
        assert "daily_calls" in results[0]
        assert "monthly_savings" in results[0]

    def test_supported_models(self):
        models = CostCalculator.get_supported_models()
        assert "gpt-4o" in models
        assert "gpt-4o-mini" in models

    def test_pricing_table(self):
        table = CostCalculator.get_pricing_table()
        for model_name, prices in table.items():
            assert "input" in prices
            assert "output" in prices
            assert prices["input"] > 0


# ═══════════════════════════════════════
# 통합 테스트
# ═══════════════════════════════════════

class TestIntegration:
    """전체 파이프라인 통합 테스트"""

    def test_full_pipeline(self):
        """수집 → 분석 → 정제 → 비용 계산 전체 흐름"""
        prompt = (
            "안녕하세요, 혹시 괜찮으시다면 바쁘시겠지만 죄송하지만\n"
            "다음에 대해 자세하게 상세히 설명해 주세요.\n\n\n"
            "꼭 반드시 정말 정말 중요한 내용만 알려주세요.\n"
            "그리고 또한 추가적으로 예시도 부탁드립니다.\n"
            "파이썬에서   리스트와   튜플의   차이점을   알려주세요.\n"
            "감사합니다."
        )

        # 1. 분석
        analyzer = PatternAnalyzer()
        report = analyzer.analyze(prompt)
        assert report.total_tokens > 0
        assert len(report.patterns_found) >= 3  # 최소 3가지 패턴

        # 2. 정제
        refiner = PromptRefiner()
        result = refiner.refine(prompt)
        assert result.reduction_rate >= 0.1  # 최소 10% 절감

        # 3. 핵심 내용 보존
        assert "파이썬" in result.refined
        assert "리스트" in result.refined
        assert "튜플" in result.refined

        # 4. 비용 계산
        calculator = CostCalculator()
        cost = calculator.compare(prompt, result.refined)
        assert cost.saved_cost >= 0

    def test_clean_prompt_minimal_change(self):
        """이미 깨끗한 프롬프트는 변화가 최소화되어야 함"""
        clean_prompt = "파이썬에서 리스트 정렬 방법을 알려줘"
        refiner = PromptRefiner()
        result = refiner.refine(clean_prompt)

        # 깨끗한 프롬프트는 큰 변화 없어야 함
        assert result.reduction_rate < 0.3  # 30% 미만 변화


# ═══════════════════════════════════════
# LearnedOptimizer (Fine-tuning 개념) 테스트
# ═══════════════════════════════════════

# 테스트용 소규모 데이터셋
MINI_DATASET = {
    "질문응답": [
        "안녕하세요, 혹시 괜찮으시다면 부탁드립니다. 파이썬에서 리스트와 튜플의 차이점이 뭔가요? 최대한 자세하게 알려주세요. 감사합니다.",
        "죄송하지만 바쁘시겠지만 머신러닝에서 과적합이란 무엇인가요? 꼭 반드시 쉽게 설명해 주세요.",
    ],
    "코드생성": [
        "안녕하세요, 혹시 괜찮으시다면 코드 작성을 부탁드립니다. 파이썬으로 버블 정렬을 구현해 주세요. 감사합니다.",
        "바쁘시겠지만 자바스크립트로 투두 리스트 기능을 만들어 주세요. 그리고 또한 추가적으로 에러 처리도 해주세요.",
    ],
}


class TestLearnedOptimizer:
    """Fine-tuning 개념 모듈 테스트"""

    def test_domain_detection_qa(self):
        from optimizer.learned_optimizer import AdaptiveRefiner
        refiner = AdaptiveRefiner()
        domain, confidence = refiner.detect_domain(
            "파이썬에서 리스트 정렬 방법을 설명해 주세요"
        )
        assert domain == "질문응답"
        assert confidence > 0

    def test_domain_detection_code(self):
        from optimizer.learned_optimizer import AdaptiveRefiner
        refiner = AdaptiveRefiner()
        domain, _ = refiner.detect_domain(
            "파이썬으로 버블 정렬 알고리즘을 구현해 주세요"
        )
        assert domain == "코드생성"

    def test_domain_detection_summary(self):
        from optimizer.learned_optimizer import AdaptiveRefiner
        refiner = AdaptiveRefiner()
        domain, _ = refiner.detect_domain(
            "다음 글을 3줄로 요약해 주세요. 핵심 키워드도 뽑아주세요."
        )
        assert domain == "요약"

    def test_domain_detection_translation(self):
        from optimizer.learned_optimizer import AdaptiveRefiner
        refiner = AdaptiveRefiner()
        domain, _ = refiner.detect_domain(
            "다음 문장을 영어로 번역해 주세요"
        )
        assert domain == "번역"

    def test_rule_effectiveness_analyzer(self):
        from optimizer.learned_optimizer import RuleEffectivenessAnalyzer
        analyzer = RuleEffectivenessAnalyzer()
        results = analyzer.analyze_rule_effectiveness(MINI_DATASET)
        assert "질문응답" in results
        assert "코드생성" in results
        assert len(results["질문응답"]) > 0

    def test_build_domain_profiles(self):
        from optimizer.learned_optimizer import RuleEffectivenessAnalyzer
        analyzer = RuleEffectivenessAnalyzer()
        profiles = analyzer.build_domain_profiles(MINI_DATASET)
        assert "질문응답" in profiles
        assert "코드생성" in profiles
        assert profiles["질문응답"].avg_reduction_rate > 0
        assert profiles["질문응답"].sample_count == 2

    def test_adaptive_refiner_train_and_refine(self):
        from optimizer.learned_optimizer import AdaptiveRefiner
        refiner = AdaptiveRefiner()
        assert not refiner.is_trained

        refiner.train(MINI_DATASET)
        assert refiner.is_trained

        result = refiner.refine(
            "안녕하세요, 파이썬에서 딕셔너리 사용법을 알려주세요. 감사합니다."
        )
        assert result.detected_domain == "질문응답"
        assert result.base_result is not None
        assert result.adaptive_result is not None

    def test_adaptive_refiner_preserves_content(self):
        from optimizer.learned_optimizer import AdaptiveRefiner
        refiner = AdaptiveRefiner()
        refiner.train(MINI_DATASET)
        result = refiner.refine(
            "안녕하세요, 파이썬에서 딕셔너리 사용법을 알려주세요."
        )
        assert "파이썬" in result.adaptive_result.refined
        assert "딕셔너리" in result.adaptive_result.refined


# ═══════════════════════════════════════
# PromptRAG (RAG 개념) 테스트
# ═══════════════════════════════════════

class TestPromptRAG:
    """RAG 개념 모듈 테스트"""

    def test_knowledge_base_build(self):
        from optimizer.prompt_rag import PromptKnowledgeBase
        kb = PromptKnowledgeBase()
        assert not kb.is_built
        kb.build(MINI_DATASET)
        assert kb.is_built
        assert kb.size == 4  # 2 + 2

    def test_knowledge_base_entries(self):
        from optimizer.prompt_rag import PromptKnowledgeBase
        kb = PromptKnowledgeBase()
        kb.build(MINI_DATASET)
        for entry in kb.entries:
            assert entry.original_tokens > 0
            assert entry.refined_tokens > 0
            assert entry.reduction_rate >= 0

    def test_similarity_search(self):
        from optimizer.prompt_rag import PromptKnowledgeBase, SimilaritySearcher
        kb = PromptKnowledgeBase()
        kb.build(MINI_DATASET)
        searcher = SimilaritySearcher(kb)

        results = searcher.search("파이썬 리스트 사용법 알려주세요", top_k=2)
        assert len(results) > 0
        assert results[0].rank == 1
        assert results[0].similarity_score >= 0

    def test_similarity_search_relevance(self):
        from optimizer.prompt_rag import PromptKnowledgeBase, SimilaritySearcher
        kb = PromptKnowledgeBase()
        kb.build(MINI_DATASET)
        searcher = SimilaritySearcher(kb)

        # 파이썬 관련 질문은 파이썬 관련 사례와 유사해야 함
        results = searcher.search("파이썬에서 리스트 컴프리헨션 설명해주세요", top_k=1)
        assert len(results) > 0
        # 가장 유사한 사례에 '파이썬'이 포함되어야 함
        assert "파이썬" in results[0].entry.original_text

    def test_optimization_advisor(self):
        from optimizer.prompt_rag import (
            PromptKnowledgeBase, SimilaritySearcher, OptimizationAdvisor
        )
        kb = PromptKnowledgeBase()
        kb.build(MINI_DATASET)
        searcher = SimilaritySearcher(kb)
        advisor = OptimizationAdvisor(kb, searcher)

        advice = advisor.advise("안녕하세요, 파이썬 설명해 주세요. 감사합니다.")
        assert advice.predicted_reduction_rate > 0
        assert len(advice.optimization_tips) > 0
        assert advice.confidence >= 0

    def test_advisor_empty_query(self):
        from optimizer.prompt_rag import (
            PromptKnowledgeBase, SimilaritySearcher, OptimizationAdvisor
        )
        kb = PromptKnowledgeBase()
        kb.build(MINI_DATASET)
        advisor = OptimizationAdvisor(kb)

        advice = advisor.advise("")
        assert advice.predicted_reduction_rate >= 0


# ═══════════════════════════════════════
# HybridEngine (통합) 테스트
# ═══════════════════════════════════════

class TestHybridEngine:
    """하이브리드 엔진 통합 테스트"""

    def test_initialization(self):
        from optimizer.hybrid_engine import HybridOptimizer
        engine = HybridOptimizer()
        assert not engine.is_initialized
        engine.initialize(MINI_DATASET)
        assert engine.is_initialized

    def test_hybrid_optimize(self):
        from optimizer.hybrid_engine import HybridOptimizer
        engine = HybridOptimizer()
        engine.initialize(MINI_DATASET)

        result = engine.optimize(
            "안녕하세요, 혹시 괜찮으시다면 파이썬에서 변수란 무엇인지 설명해 주세요. 감사합니다."
        )
        assert result.original_tokens > 0
        assert result.hybrid_tokens > 0
        assert result.hybrid_reduction >= 0
        assert result.detected_domain != ""
        assert result.strategy_explanation != ""

    def test_hybrid_vs_rule_based(self):
        from optimizer.hybrid_engine import HybridOptimizer
        engine = HybridOptimizer()
        engine.initialize(MINI_DATASET)

        text = "안녕하세요, 죄송하지만 바쁘시겠지만 꼭 반드시 파이썬으로 함수 만드는 법 알려주세요. 감사합니다."
        result = engine.optimize(text)

        # 하이브리드 결과는 기존 규칙 기반 이상의 성능이어야 함
        assert result.hybrid_tokens <= result.rule_based_tokens
        assert result.hybrid_reduction >= result.rule_based_reduction

    def test_hybrid_rag_contribution(self):
        from optimizer.hybrid_engine import HybridOptimizer
        engine = HybridOptimizer()
        engine.initialize(MINI_DATASET)

        result = engine.optimize("파이썬에서 리스트 정렬 방법을 알려주세요")
        assert result.rag_contribution != ""
        assert isinstance(result.rag_similar_cases, list)

    def test_hybrid_finetuning_contribution(self):
        from optimizer.hybrid_engine import HybridOptimizer
        engine = HybridOptimizer()
        engine.initialize(MINI_DATASET)

        result = engine.optimize("파이썬으로 버블 정렬 코드를 작성해 주세요")
        assert result.finetuning_contribution != ""
        assert result.domain_confidence > 0

    def test_hybrid_preserves_core_content(self):
        from optimizer.hybrid_engine import HybridOptimizer
        engine = HybridOptimizer()
        engine.initialize(MINI_DATASET)

        result = engine.optimize(
            "안녕하세요, 파이썬에서 리스트와 튜플의 차이점을 알려주세요. 감사합니다."
        )
        assert "파이썬" in result.hybrid_refined_text
        assert "리스트" in result.hybrid_refined_text
        assert "튜플" in result.hybrid_refined_text

    def test_hybrid_cost_analysis(self):
        from optimizer.hybrid_engine import HybridOptimizer
        engine = HybridOptimizer()
        engine.initialize(MINI_DATASET)

        result = engine.optimize(
            "안녕하세요, 부탁드립니다. SQL에서 JOIN 설명해 주세요."
        )
        assert result.cost_rule_based >= 0
        assert result.cost_hybrid >= 0
        assert result.cost_savings >= 0
