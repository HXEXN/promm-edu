import json
from optimizer.hybrid_engine import HybridOptimizer
from optimizer.benchmark import BENCHMARK_DATASET
from optimizer.learned_optimizer import LEARNED_DOMAIN_PATTERNS

engine = HybridOptimizer(model='gpt-4o-mini')
engine.initialize(BENCHMARK_DATASET)

prompts = [
    "안녕하세요, 혹시 괜찮으시다면 죄송하지만 파이썬에서 GIL이 무엇인지 최대한 자세하게 설명해 주세요. 꼭 반드시 예시도 들어주세요. 감사합니다.",
    "바쁘시겠지만 부탁드립니다. 파이썬으로 피보나치 수열을 구현해 주세요. 그리고 또한 추가적으로 재귀 버전도 작성해 주세요. 감사합니다.",
    "안녕하세요, 혹시 시간 되시면 아래 글을 꼭 반드시 핵심만 간추려서 3줄로 요약해 주세요. 기본적으로 사실상 중요한 것만 포함해 주세요."
]

for p in prompts:
    print("="*40)
    print("PROMPT:", p)
    res = engine.optimize(p)
    print("DOMAIN:", res.detected_domain)
    print("CONFIDENCE:", res.domain_confidence)
    print("LEARNED APPLIED:", res.learned_patterns_applied)
    print("FT CONTRIB:", res.finetuning_contribution)
    print("RAG CONTRIB:", res.rag_contribution)
    print("IMP RATE:", res.improvement_rate)

