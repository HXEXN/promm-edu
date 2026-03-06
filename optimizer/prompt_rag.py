"""
유사 사례 기반 최적화 제안 (RAG 개념)
====================================
기존 벤치마크 데이터셋을 검색 가능한 지식 베이스로 활용하여,
입력 프롬프트와 유사한 최적화 사례를 찾아 동적 최적화 가이드를 제공한다.

RAG 개념: 실시간으로 유사 사례를 "검색(Retrieval)"하여
정확한 최적화 제안을 "생성(Generation)"한다.
"""

import re
import math
from dataclasses import dataclass, field
from collections import Counter

from optimizer.tokenizer import TokenCounter
from optimizer.refiner import PromptRefiner


@dataclass
class KnowledgeEntry:
    """지식 베이스의 개별 항목"""
    entry_id: int
    category: str
    original_text: str
    refined_text: str
    original_tokens: int
    refined_tokens: int
    reduction_rate: float
    patterns_found: list[str]
    applied_rules: list[str]
    # TF-IDF 벡터 (검색용)
    tfidf_vector: dict = field(default_factory=dict)


@dataclass
class SearchResult:
    """유사 사례 검색 결과"""
    entry: KnowledgeEntry
    similarity_score: float
    rank: int


@dataclass
class OptimizationAdvice:
    """최적화 가이드 제안"""
    input_text: str
    similar_cases: list[SearchResult]
    predicted_reduction_rate: float
    predicted_reduction_range: tuple  # (min, max)
    recommended_patterns: list[dict]
    optimization_tips: list[str]
    confidence: float


class PromptKnowledgeBase:
    """
    벤치마크 데이터를 지식 베이스로 구축.
    RAG의 'R' (Retrieval) 기반이 되는 인덱스.
    """

    def __init__(self, model: str = "gpt-4o-mini"):
        self.counter = TokenCounter(model=model)
        self.refiner = PromptRefiner(model=model)
        self.entries: list[KnowledgeEntry] = []
        self._idf: dict[str, float] = {}
        self._built = False

    def build(self, dataset: dict[str, list[str]]):
        """
        데이터셋을 인덱싱하여 검색 가능한 지식 베이스를 구축한다.
        """
        self.entries = []
        entry_id = 0

        for category, prompts in dataset.items():
            for prompt in prompts:
                result = self.refiner.refine(prompt)

                # 패턴 & 규칙 정보
                patterns = []
                if result.analysis:
                    patterns = [p.category for p in result.analysis.patterns_found]
                rules = [r.get("category", "") for r in result.applied_rules]

                entry = KnowledgeEntry(
                    entry_id=entry_id,
                    category=category,
                    original_text=prompt,
                    refined_text=result.refined,
                    original_tokens=result.original_tokens,
                    refined_tokens=result.refined_tokens,
                    reduction_rate=result.reduction_rate,
                    patterns_found=patterns,
                    applied_rules=list(set(rules)),
                )
                self.entries.append(entry)
                entry_id += 1

        # TF-IDF 인덱스 구축
        self._build_tfidf_index()
        self._built = True

    @property
    def is_built(self) -> bool:
        return self._built

    @property
    def size(self) -> int:
        return len(self.entries)

    def _tokenize_text(self, text: str) -> list[str]:
        """텍스트를 단어 단위로 분리한다."""
        # 한국어 + 영어를 모두 처리
        # 특수 문자 제거, 공백 분리
        cleaned = re.sub(r'[^\w\s가-힣a-zA-Z]', ' ', text)
        words = cleaned.split()
        # 1글자 제거 (조사 등 불용어 제거 효과)
        return [w for w in words if len(w) > 1]

    def _compute_tf(self, words: list[str]) -> dict[str, float]:
        """TF(Term Frequency) 계산"""
        counter = Counter(words)
        total = len(words) if words else 1
        return {word: count / total for word, count in counter.items()}

    def _build_tfidf_index(self):
        """TF-IDF 인덱스를 구축한다."""
        # 1. 모든 문서에서 단어 추출
        doc_words = []
        for entry in self.entries:
            words = self._tokenize_text(entry.original_text)
            doc_words.append(words)

        # 2. IDF 계산
        n_docs = len(doc_words)
        word_doc_count: dict[str, int] = {}
        for words in doc_words:
            unique_words = set(words)
            for w in unique_words:
                word_doc_count[w] = word_doc_count.get(w, 0) + 1

        self._idf = {}
        for word, doc_count in word_doc_count.items():
            self._idf[word] = math.log((n_docs + 1) / (doc_count + 1)) + 1

        # 3. 각 항목에 TF-IDF 벡터 저장
        for entry, words in zip(self.entries, doc_words):
            tf = self._compute_tf(words)
            tfidf = {}
            for word, tf_val in tf.items():
                tfidf[word] = tf_val * self._idf.get(word, 1.0)
            entry.tfidf_vector = tfidf

    def get_tfidf_vector(self, text: str) -> dict[str, float]:
        """텍스트의 TF-IDF 벡터를 계산한다."""
        words = self._tokenize_text(text)
        tf = self._compute_tf(words)
        tfidf = {}
        for word, tf_val in tf.items():
            tfidf[word] = tf_val * self._idf.get(word, 1.0)
        return tfidf


class SimilaritySearcher:
    """
    유사 사례 검색 — RAG의 핵심 'Retrieval' 엔진
    TF-IDF 코사인 유사도 기반으로 가장 유사한 프롬프트를 찾는다.
    """

    def __init__(self, knowledge_base: PromptKnowledgeBase):
        self.kb = knowledge_base

    @staticmethod
    def _cosine_similarity(vec_a: dict[str, float], vec_b: dict[str, float]) -> float:
        """두 TF-IDF 벡터 간 코사인 유사도를 계산한다."""
        # 공통 키
        common_keys = set(vec_a.keys()) & set(vec_b.keys())
        if not common_keys:
            return 0.0

        dot_product = sum(vec_a[k] * vec_b[k] for k in common_keys)

        norm_a = math.sqrt(sum(v ** 2 for v in vec_a.values()))
        norm_b = math.sqrt(sum(v ** 2 for v in vec_b.values()))

        if norm_a == 0 or norm_b == 0:
            return 0.0

        return dot_product / (norm_a * norm_b)

    def search(self, query_text: str, top_k: int = 3) -> list[SearchResult]:
        """
        입력 프롬프트와 가장 유사한 사례를 검색한다.

        Args:
            query_text: 검색할 프롬프트
            top_k: 반환할 최대 결과 수

        Returns:
            유사도 순으로 정렬된 SearchResult 리스트
        """
        if not self.kb.is_built:
            return []

        query_vector = self.kb.get_tfidf_vector(query_text)
        if not query_vector:
            return []

        scored = []
        for entry in self.kb.entries:
            sim = self._cosine_similarity(query_vector, entry.tfidf_vector)
            scored.append((entry, sim))

        # 유사도 내림차순 정렬
        scored.sort(key=lambda x: x[1], reverse=True)

        results = []
        for rank, (entry, sim) in enumerate(scored[:top_k], start=1):
            results.append(SearchResult(
                entry=entry,
                similarity_score=round(sim, 4),
                rank=rank,
            ))

        return results


class OptimizationAdvisor:
    """
    최적화 가이드 동적 생성 — RAG의 'Augmented Generation'

    유사 사례 분석 결과를 기반으로 최적화 가이드라인을 제안한다.
    """

    def __init__(
        self,
        knowledge_base: PromptKnowledgeBase,
        searcher: SimilaritySearcher | None = None,
    ):
        self.kb = knowledge_base
        self.searcher = searcher or SimilaritySearcher(knowledge_base)

    def advise(self, text: str, top_k: int = 3) -> OptimizationAdvice:
        """
        프롬프트에 대한 최적화 가이드를 생성한다.

        Args:
            text: 분석할 프롬프트
            top_k: 참조할 유사 사례 수

        Returns:
            OptimizationAdvice: 최적화 가이드 제안
        """
        # 1. 유사 사례 검색
        similar = self.searcher.search(text, top_k=top_k)

        # 2. 유사 사례 기반 예상 절감률 계산
        if similar:
            rates = [r.entry.reduction_rate for r in similar]
            weights = [r.similarity_score for r in similar]
            total_weight = sum(weights)
            if total_weight > 0:
                predicted_rate = sum(
                    r * w for r, w in zip(rates, weights)
                ) / total_weight
            else:
                predicted_rate = sum(rates) / len(rates)
            rate_range = (min(rates), max(rates))
        else:
            predicted_rate = 0.0
            rate_range = (0.0, 0.0)

        # 3. 추천 패턴 추출 (유사 사례에서 공통으로 발견된 패턴)
        pattern_freq: dict[str, int] = {}
        pattern_detail: dict[str, list[float]] = {}
        for sr in similar:
            for p in sr.entry.patterns_found:
                pattern_freq[p] = pattern_freq.get(p, 0) + 1
                if p not in pattern_detail:
                    pattern_detail[p] = []
                pattern_detail[p].append(sr.entry.reduction_rate)

        recommended = []
        for pattern, freq in sorted(
            pattern_freq.items(), key=lambda x: -x[1]
        ):
            avg_rate = (
                sum(pattern_detail[pattern]) / len(pattern_detail[pattern])
                if pattern_detail.get(pattern)
                else 0
            )
            recommended.append({
                "pattern": pattern,
                "frequency": freq,
                "avg_reduction_when_present": round(avg_rate, 4),
                "recommendation": (
                    "강력 추천" if freq >= top_k * 0.7
                    else "추천" if freq >= top_k * 0.4
                    else "참고"
                ),
            })

        # 4. 최적화 팁 생성
        tips = self._generate_tips(text, similar, recommended)

        # 5. 신뢰도 계산 (유사도 기반)
        confidence = 0.0
        if similar:
            avg_sim = sum(r.similarity_score for r in similar) / len(similar)
            confidence = min(avg_sim * 1.5, 1.0)  # 스케일링

        return OptimizationAdvice(
            input_text=text,
            similar_cases=similar,
            predicted_reduction_rate=round(predicted_rate, 4),
            predicted_reduction_range=rate_range,
            recommended_patterns=recommended,
            optimization_tips=tips,
            confidence=round(confidence, 4),
        )

    def _generate_tips(
        self,
        text: str,
        similar: list[SearchResult],
        recommended_patterns: list[dict],
    ) -> list[str]:
        """유사 사례 기반 최적화 팁을 생성한다."""
        tips = []

        # 일반 팁
        if not similar:
            tips.append(
                "유사한 기존 사례가 없습니다. 기본 규칙 기반 최적화를 권장합니다."
            )
            return tips

        # 유사 사례 기반 팁
        best_case = similar[0]
        if best_case.similarity_score > 0.5:
            tips.append(
                f"유사도 {best_case.similarity_score:.0%}의 사례에서 "
                f"{best_case.entry.reduction_rate:.1%} 토큰 절감을 달성했습니다."
            )

        # 패턴별 팁
        for pat in recommended_patterns:
            if pat["recommendation"] == "강력 추천":
                tips.append(
                    f"'{pat['pattern']}' 패턴이 유사 사례에서 자주 발견됩니다. "
                    f"해당 규칙으로 평균 {pat['avg_reduction_when_present']:.1%} 절감이 가능합니다."
                )

        # 도메인 팁
        if similar:
            domains = [r.entry.category for r in similar]
            most_common = max(set(domains), key=domains.count)
            tips.append(
                f"이 프롬프트는 '{most_common}' 유형에 가장 가까운 것으로 분석됩니다."
            )

        # 구체적 절감 가능성
        if any("과잉 공손 표현" in r.entry.patterns_found for r in similar):
            has_polite = bool(
                re.search(r"안녕하세요|감사합니다|부탁드립니다|죄송", text)
            )
            if has_polite:
                tips.append(
                    "공손 표현(인사, 감사, 부탁)을 제거하면 "
                    "LLM 응답 품질에 영향 없이 토큰을 크게 절감할 수 있습니다."
                )

        return tips
