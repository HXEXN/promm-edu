"""
벤치마크 실험 모듈
==================
다양한 프롬프트에 대해 체계적인 최적화 실험을 수행하고,
논문에 실을 수 있는 수준의 통계 분석 결과를 생성한다.
"""

import json
import csv
import os
from dataclasses import dataclass, field, asdict
from datetime import datetime
from statistics import mean, stdev, median

from optimizer.tokenizer import TokenCounter
from optimizer.analyzer import PatternAnalyzer
from optimizer.refiner import PromptRefiner
from optimizer.cost import CostCalculator


# ─── 벤치마크 데이터셋 ───
# 카테고리별 프롬프트 샘플 (한국어 + 영어)

BENCHMARK_DATASET = {
    "질문응답": [
        "안녕하세요, 혹시 괜찮으시다면 부탁드립니다. 바쁘시겠지만 죄송하지만 다음에 대해 자세하게 상세히 설명해 주세요. 파이썬에서 리스트와 튜플의 차이점이 뭔가요? 최대한 자세하게 알려주세요. 감사합니다.",
        "안녕하세요! 실례지만 혹시 시간 되시면 제가 지금부터 질문할게요. 머신러닝에서 과적합이란 무엇이며 어떻게 방지할 수 있을까요? 꼭 반드시 쉽게 설명해 주세요. 부탁드립니다. 감사합니다.",
        "안녕하세요, 죄송하지만 바쁘시겠지만 질문이 있습니다. 그리고 또한 추가적으로 예시도 부탁드립니다. REST API와 GraphQL의 차이점은 무엇인가요? 기본적으로 일반적으로 말하자면 어떤 것이 더 좋은지도 알려주세요.",
        "혹시 괜찮으시다면 가능하시다면 다음 질문에 답변 부탁드립니다. SQL에서 JOIN의 종류와 각각의 차이점을 정말 정말 자세히 설명해 주세요. 아주 매우 중요합니다. 감사합니다.",
        "안녕하세요, 바쁘시겠지만 죄송합니다. 혹시 시간 되시면 답변 부탁드립니다. Git에서 merge와 rebase의 차이점이 뭔가요? 꼭 반드시 실제 예시를 들어서 설명해 주세요. 감사합니다.",
        "안녕하세요! 실례지만 질문이 있어요. 제가 지금부터 물어볼게요. 도커(Docker)가 뭔지 그리고 또한 추가적으로 왜 사용하는지 최대한 자세하게 설명해 주세요. 부탁드립니다.",
        "혹시 괜찮으시다면 한 가지 질문 드리겠습니다. 죄송하지만 CSS에서 Flexbox와 Grid의 차이를 정말 정말 명확하게 명확히 설명해 주세요. 그래서 결국 언제 어떤 것을 써야 하는지도요. 감사합니다.",
        "안녕하세요, 바쁘시겠지만 질문이 있습니다. 아래의 내용을 잘 읽고 답해 주세요. 비동기 프로그래밍이 무엇이며 어쨌든 왜 필요한지 기본적으로 사실상 어떻게 동작하는지 알려주세요. 감사합니다.",
        # ── 보강 데이터 ──
        "안녕하세요, 죄송하지만 바쁘시겠지만 혹시 괜찮으시다면 질문이 있습니다. 쿠버네티스(Kubernetes)가 무엇인지 그리고 또한 추가적으로 도커와의 차이점을 꼭 반드시 자세하게 설명해 주세요. 감사합니다.",
        "안녕하세요! 실례지만 혹시 시간 되시면 부탁드립니다. 마이크로서비스 아키텍처와 모놀리식 아키텍처의 차이를 정말 정말 자세히 최대한 자세하게 비교해 주세요. 아주 매우 중요합니다.",
        "바쁘시겠지만 죄송합니다. 혹시 괜찮으시다면 다음에 대해 설명해 주세요. OAuth 2.0 인증 흐름이 무엇인지 그리고 또한 추가적으로 JWT와의 관계도 알려주세요. 꼭 반드시 예시 포함 부탁드립니다.",
        "안녕하세요, 혹시 가능하시다면 질문 하나 드리겠습니다. 데이터베이스에서 인덱스란 무엇이며 기본적으로 일반적으로 말하자면 어떤 상황에서 사용해야 하는지 정말 정말 쉽게 설명해 주세요. 감사합니다.",
        "안녕하세요! 죄송하지만 바쁘시겠지만 부탁드립니다. CI/CD 파이프라인이 뭔지 그리고 또한 추가적으로 왜 필요한지 최대한 자세하게 상세히 설명해 주세요. 꼭 반드시 실제 사례도 들어주세요.",
        "혹시 괜찮으시다면 가능하시다면 답변 부탁드립니다. 웹소켓(WebSocket)이 HTTP와 어떻게 다른지 아주 매우 명확하게 설명해 주세요. 기본적으로 사실상 실시간 통신에서 왜 사용되는지도 알려주세요.",
        "안녕하세요, 실례지만 혹시 시간 되시면 제가 지금부터 질문할게요. NoSQL과 관계형 DB의 차이점이 무엇인지 정말 정말 자세히 비교 설명해 주세요. 그리고 또한 추가적으로 언제 어떤 것을 선택해야 하는지도 부탁드립니다.",
    ],
    "코드생성": [
        "안녕하세요, 혹시 괜찮으시다면 코드 작성을 부탁드립니다. 죄송하지만 바쁘시겠지만 파이썬으로 버블 정렬 알고리즘을 구현해 주세요. 꼭 반드시 주석도 달아주세요. 감사합니다.",
        "안녕하세요! 가능하시다면 부탁드립니다. 자바스크립트로 투두 리스트 CRUD 기능을 만들어 주세요. 최대한 자세하게 코드를 작성해 주세요. 그리고 또한 추가적으로 에러 처리도 해주세요.",
        "혹시 괜찮으시다면 파이썬으로 웹 스크래핑 코드를 작성해 주세요. 꼭 반드시 BeautifulSoup을 사용하고 정말 정말 깔끔하게 작성해 주세요. 아주 매우 중요합니다. 감사합니다.",
        "안녕하세요, 죄송하지만 바쁘시겠지만 부탁드립니다. React로 간단한 카운터 컴포넌트를 만들어 주세요. 기본적으로 일반적으로 말하자면 함수형 컴포넌트로 작성해 주세요. 감사합니다.",
        "실례지만 혹시 시간 되시면 SQL 쿼리를 작성해 주세요. 고객 테이블에서 최근 30일 이내 주문한 고객을 그리고 또한 추가적으로 주문 금액 합계를 구하는 쿼리를 부탁드립니다.",
        "안녕하세요, 혹시 괜찮으시다면 파이썬으로 이진 탐색 알고리즘을 구현해 주세요. 꼭 반드시 재귀 버전과 반복 버전 둘 다 작성해 주세요. 정말 정말 중요합니다. 감사합니다.",
        "바쁘시겠지만 죄송합니다. Node.js로 간단한 REST API 서버를 만들어 주세요. 기본적으로 Express를 사용하고 최대한 자세하게 코드를 작성해 주세요. 부탁드립니다.",
        "안녕하세요! 가능하시다면 파이썬으로 파일 읽기/쓰기 유틸리티를 만들어 주세요. 그리고 또한 추가적으로 예외 처리와 로깅도 포함해 주세요. 아주 매우 감사합니다.",
        # ── 보강 데이터 ──
        "안녕하세요, 죄송하지만 바쁘시겠지만 부탁드립니다. 파이썬으로 데코레이터 패턴을 구현해 주세요. 꼭 반드시 실용적인 예제도 포함해 주세요. 그리고 또한 추가적으로 타입 힌트도 달아주세요. 감사합니다.",
        "혹시 괜찮으시다면 가능하시다면 자바스크립트로 무한 스크롤 기능을 구현해 주세요. 정말 정말 깔끔하게 작성해 주세요. 기본적으로 Intersection Observer API를 사용해 주세요. 감사합니다.",
        "안녕하세요! 실례지만 혹시 시간 되시면 파이썬으로 싱글턴 패턴을 구현해 주세요. 최대한 자세하게 코드를 작성해 주세요. 꼭 반드시 스레드 안전하게 만들어 주세요. 부탁드립니다.",
        "바쁘시겠지만 죄송합니다. 혹시 괜찮으시다면 TypeScript로 제네릭을 활용한 API 클라이언트를 만들어 주세요. 그리고 또한 추가적으로 에러 핸들링도 포함해 주세요. 아주 매우 중요합니다.",
        "안녕하세요, 혹시 가능하시다면 코드 작성 부탁드립니다. 파이썬으로 LRU 캐시를 직접 구현해 주세요. 꼭 반드시 딕셔너리와 더블 링크드 리스트를 사용해 주세요. 정말 정말 깔끔하게 작성해 주세요.",
        "죄송하지만 바쁘시겠지만 부탁드립니다. FastAPI로 CRUD REST API를 만들어 주세요. 기본적으로 일반적으로 말하자면 Pydantic 모델과 SQLAlchemy를 사용해 주세요. 최대한 자세하게 작성 부탁드립니다.",
        "안녕하세요! 혹시 괜찮으시다면 가능하시다면 파이썬으로 간단한 채팅 서버를 만들어 주세요. 그리고 또한 추가적으로 비동기로 동작하게 해주세요. 꼭 반드시 주석도 꼼꼼히 달아주세요. 감사합니다.",
    ],
    "요약": [
        "안녕하세요, 혹시 괜찮으시다면 부탁드립니다. 아래의 내용을 잘 읽고 핵심 내용만 꼭 반드시 간결하게 요약해 주세요. 3줄 이내로 최대한 자세하게 정리해 주세요. 감사합니다. 인공지능(AI)은 기계가 인간의 학습, 추론, 문제 해결 능력을 모방하는 기술입니다.",
        "죄송하지만 바쁘시겠지만 다음 텍스트를 요약해 주세요. 정말 정말 중요한 포인트만 추려주세요. 그리고 또한 추가적으로 키워드도 뽑아주세요. 클라우드 컴퓨팅은 인터넷을 통해 서버, 스토리지, 데이터베이스 등의 컴퓨팅 서비스를 제공하는 것입니다.",
        "안녕하세요! 혹시 시간 되시면 다음 내용을 요약 부탁드립니다. 기본적으로 일반적으로 말하자면 핵심만 추려서 아주 매우 명확하게 작성해 주세요. 블록체인은 분산 원장 기술로 거래 기록을 안전하게 보관하는 시스템입니다.",
        "실례지만 가능하시다면 아래 글을 3문장으로 요약해 주세요. 꼭 반드시 중요한 내용만 포함해 주세요. 사물인터넷(IoT)은 다양한 기기들이 인터넷에 연결되어 데이터를 주고받는 기술 생태계입니다. 감사합니다.",
        "안녕하세요, 바쁘시겠지만 죄송합니다. 다음 텍스트의 핵심을 정말 정말 간결하게 요약해 주세요. 다시 말해서 핵심만 뽑아주세요. 사이버 보안은 디지털 시스템을 무단 접근이나 공격으로부터 보호하는 기술과 관행입니다.",
        "혹시 괜찮으시다면 아래 내용을 요약해 주세요. 최대한 자세하게 하되 3문장 이내로 부탁드립니다. 그리고 또한 추가적으로 시사점도 알려주세요. 디지털 트윈은 물리적 객체의 가상 복제본을 만들어 시뮬레이션하는 기술입니다.",
        "안녕하세요! 죄송하지만 다음 글을 꼭 반드시 핵심만 간추려서 요약해 주세요. 기본적으로 사실상 중요한 것만 포함해 주세요. 엣지 컴퓨팅은 데이터를 클라우드가 아닌 데이터 소스 근처에서 처리하는 분산 컴퓨팅 아키텍처입니다.",
        "바쁘시겠지만 실례지만 아래 텍스트를 간단히 요약 부탁드립니다. 정말 정말 명확하게 명확히 정리해 주세요. 양자 컴퓨팅은 양자역학 원리를 이용해 기존 컴퓨터보다 훨씬 빠르게 특정 문제를 해결하는 기술입니다. 감사합니다.",
        # ── 보강 데이터 ──
        "안녕하세요, 혹시 괜찮으시다면 부탁드립니다. 아래 글을 꼭 반드시 핵심만 간추려서 3줄로 요약해 주세요. 기본적으로 사실상 중요한 것만 포함해 주세요. 메타버스는 가상현실과 증강현실이 결합된 3차원 가상 세계로, 사용자가 아바타를 통해 상호작용하는 플랫폼입니다.",
        "죄송하지만 바쁘시겠지만 다음 내용을 아주 매우 간결하게 요약해 주세요. 그리고 또한 추가적으로 핵심 키워드 3개도 뽑아주세요. 생성형 AI는 텍스트, 이미지, 코드 등을 새롭게 생성할 수 있는 인공지능 기술로, GPT와 같은 대규모 언어 모델이 대표적입니다.",
        "안녕하세요! 혹시 시간 되시면 다음 텍스트를 정말 정말 핵심만 추려서 요약해 주세요. 최대한 자세하게 하되 간결하게 부탁드립니다. 제로 트러스트 보안은 네트워크 내부와 외부를 구분하지 않고 모든 접근을 검증하는 보안 모델입니다. 감사합니다.",
        "실례지만 가능하시다면 아래 글을 꼭 반드시 중요한 내용만 포함해서 요약해 주세요. 기본적으로 일반적으로 말하자면 3문장 이내로 부탁드립니다. 서버리스 컴퓨팅은 개발자가 서버 관리 없이 코드를 실행할 수 있는 클라우드 실행 모델입니다.",
        "안녕하세요, 바쁘시겠지만 죄송합니다. 혹시 괜찮으시다면 다음 글을 정말 정말 간결하게 핵심만 뽑아서 요약해 주세요. 그리고 또한 추가적으로 미래 전망도 한 줄 추가해 주세요. 자율주행 기술은 센서와 AI를 활용해 차량이 스스로 주행하는 기술입니다.",
        "혹시 괜찮으시다면 가능하시다면 아래 내용을 꼭 반드시 핵심만 간추려서 요약해 주세요. 아주 매우 명확하게 정리 부탁드립니다. 디지털 트랜스포메이션은 디지털 기술을 활용해 기업의 비즈니스 모델과 프로세스를 근본적으로 혁신하는 것입니다.",
        "안녕하세요! 죄송하지만 바쁘시겠지만 다음 글을 정말 정말 간결하게 요약해 주세요. 기본적으로 사실상 3줄 이내로 핵심만 정리 부탁드립니다. 로보틱스 프로세스 자동화(RPA)는 소프트웨어 로봇이 사람의 반복적인 업무를 자동화하는 기술입니다.",
    ],
    "번역": [
        "안녕하세요, 혹시 괜찮으시다면 번역을 부탁드립니다. 죄송하지만 바쁘시겠지만 다음 한국어 문장을 영어로 꼭 반드시 자연스럽게 번역해 주세요. '오늘 날씨가 정말 좋습니다.' 감사합니다.",
        "실례지만 혹시 시간 되시면 다음 영어를 한국어로 번역해 주세요. 정말 정말 자연스럽게 부탁드립니다. 'Machine learning is a subset of artificial intelligence.' 그리고 또한 추가적으로 의역도 해주세요.",
        "안녕하세요! 가능하시다면 부탁드립니다. 다음 기술 문서를 한국어로 번역해 주세요. 최대한 자세하게 전문 용어도 설명해 주세요. 'The API returns a JSON response with the following fields.' 감사합니다.",
        "바쁘시겠지만 죄송합니다. 아래의 내용을 잘 읽고 자연스러운 영어로 번역해 주세요. 꼭 반드시 문맥에 맞게 해주세요. '이 프로젝트는 인공지능을 활용한 비용 최적화 연구입니다.' 감사합니다.",
        "안녕하세요, 혹시 괜찮으시다면 다음 문장을 영어로 번역 부탁드립니다. 기본적으로 일반적으로 말하자면 비즈니스 영어로 작성해 주세요. '회의 일정을 확인해 주시기 바랍니다.' 감사합니다.",
        "죄송하지만 혹시 시간 되시면 다음 영어를 한국어로 정말 정말 정확하게 번역해 주세요. 아주 매우 중요한 문서입니다. 'Please review the attached proposal and provide your feedback by Friday.' 감사합니다.",
        # ── 보강 데이터 ──
        "안녕하세요, 죄송하지만 바쁘시겠지만 부탁드립니다. 다음 문장을 영어로 꼭 반드시 자연스럽게 번역해 주세요. 정말 정말 자연스럽게 부탁드립니다. '이번 분기 실적이 전년 대비 크게 향상되었습니다.' 감사합니다.",
        "혹시 괜찮으시다면 가능하시다면 아래 영어 문장을 한국어로 번역해 주세요. 기본적으로 일반적으로 말하자면 전문 용어는 원어를 병기해 주세요. 'Kubernetes orchestrates containerized applications across distributed clusters.' 감사합니다.",
        "안녕하세요! 실례지만 혹시 시간 되시면 다음 한국어를 영어로 번역 부탁드립니다. 꼭 반드시 비즈니스 이메일 톤으로 정말 정말 격식 있게 작성해 주세요. '프로젝트 진행 상황에 대해 업데이트 드립니다.' 감사합니다.",
        "바쁘시겠지만 죄송합니다. 혹시 괜찮으시다면 다음 영어를 정말 정말 자연스러운 한국어로 번역해 주세요. 그리고 또한 추가적으로 의역 버전도 달아주세요. 'The model achieves state-of-the-art performance on multiple benchmarks.' 아주 매우 중요합니다.",
        "안녕하세요, 혹시 가능하시다면 부탁드립니다. 다음 문장을 영어로 꼭 반드시 학술 논문 스타일로 번역해 주세요. 최대한 자세하게 전문적으로 작성해 주세요. '본 연구에서는 프롬프트 토큰 최적화를 통한 비용 절감 방안을 제시한다.' 감사합니다.",
        "죄송하지만 바쁘시겠지만 혹시 시간 되시면 아래 영어를 한국어로 번역해 주세요. 기본적으로 사실상 IT 전문가가 이해하기 쉽게 번역 부탁드립니다. 'Microservices architecture enables scalable and independently deployable services.' 정말 정말 감사합니다.",
        "안녕하세요! 혹시 괜찮으시다면 가능하시다면 다음 한국어 문장을 영어로 번역해 주세요. 그리고 또한 추가적으로 격식체와 비격식체 두 가지 버전으로 작성해 주세요. '다음 주 월요일까지 보고서를 제출해 주시기 바랍니다.' 부탁드립니다.",
        "바쁘시겠지만 죄송합니다. 실례지만 다음 영어를 정말 정말 자연스러운 한국어로 번역해 주세요. 꼭 반드시 문맥에 맞게 해주세요. 'We regret to inform you that the scheduled maintenance will cause a temporary service disruption.' 감사합니다.",
        "안녕하세요, 죄송하지만 혹시 시간 되시면 다음 문장을 영어로 번역 부탁드립니다. 최대한 자세하게 정확하게 번역해 주세요. 기본적으로 일반적으로 말하자면 공식적인 톤으로 작성해 주세요. '귀사의 제안서를 검토한 결과, 몇 가지 수정 사항을 요청 드립니다.'",
    ],
}



@dataclass
class ExperimentResult:
    """단일 프롬프트에 대한 실험 결과"""
    category: str
    prompt_id: int
    original_text: str
    refined_text: str
    original_tokens: int
    refined_tokens: int
    saved_tokens: int
    reduction_rate: float
    patterns_found: list[str]
    pattern_count: int
    rules_applied: int
    cost_original: float
    cost_optimized: float
    cost_saved: float


@dataclass
class CategoryStats:
    """카테고리별 통계"""
    category: str
    sample_count: int
    avg_original_tokens: float
    avg_refined_tokens: float
    avg_saved_tokens: float
    avg_reduction_rate: float
    median_reduction_rate: float
    std_reduction_rate: float
    min_reduction_rate: float
    max_reduction_rate: float
    total_patterns_found: int
    avg_patterns_per_prompt: float
    avg_cost_saved: float


@dataclass
class BenchmarkReport:
    """전체 벤치마크 리포트"""
    timestamp: str
    model: str
    total_samples: int
    results: list[ExperimentResult]
    category_stats: list[CategoryStats]
    overall_stats: dict


class BenchmarkRunner:
    """체계적 벤치마크 실험 실행기"""

    def __init__(self, model: str = "gpt-4o-mini"):
        self.model = model
        self.refiner = PromptRefiner(model=model)
        self.calculator = CostCalculator(model=model)

    def run(self, dataset: dict[str, list[str]] | None = None) -> BenchmarkReport:
        """
        벤치마크 데이터셋에 대해 전체 실험을 수행한다.

        Args:
            dataset: 카테고리별 프롬프트 딕셔너리. None이면 내장 데이터셋 사용.
        """
        if dataset is None:
            dataset = BENCHMARK_DATASET

        all_results: list[ExperimentResult] = []

        for category, prompts in dataset.items():
            for idx, prompt in enumerate(prompts):
                result = self._run_single(category, idx, prompt)
                all_results.append(result)

        # 카테고리별 통계 계산
        category_stats = self._compute_category_stats(all_results)

        # 전체 통계 계산
        overall_stats = self._compute_overall_stats(all_results)

        return BenchmarkReport(
            timestamp=datetime.now().isoformat(),
            model=self.model,
            total_samples=len(all_results),
            results=all_results,
            category_stats=category_stats,
            overall_stats=overall_stats,
        )

    def _run_single(self, category: str, idx: int, prompt: str) -> ExperimentResult:
        """단일 프롬프트 실험"""
        refinement = self.refiner.refine(prompt)
        cost_report = self.calculator.compare(prompt, refinement.refined)

        patterns = []
        if refinement.analysis:
            patterns = [p.category for p in refinement.analysis.patterns_found]

        return ExperimentResult(
            category=category,
            prompt_id=idx + 1,
            original_text=prompt,
            refined_text=refinement.refined,
            original_tokens=refinement.original_tokens,
            refined_tokens=refinement.refined_tokens,
            saved_tokens=refinement.saved_tokens,
            reduction_rate=refinement.reduction_rate,
            patterns_found=patterns,
            pattern_count=len(patterns),
            rules_applied=len(refinement.applied_rules),
            cost_original=cost_report.original_input_cost,
            cost_optimized=cost_report.optimized_input_cost,
            cost_saved=cost_report.saved_cost,
        )

    def _compute_category_stats(self, results: list[ExperimentResult]) -> list[CategoryStats]:
        """카테고리별 통계 계산"""
        categories = {}
        for r in results:
            categories.setdefault(r.category, []).append(r)

        stats = []
        for cat, items in categories.items():
            rates = [r.reduction_rate for r in items]
            stats.append(CategoryStats(
                category=cat,
                sample_count=len(items),
                avg_original_tokens=round(mean([r.original_tokens for r in items]), 1),
                avg_refined_tokens=round(mean([r.refined_tokens for r in items]), 1),
                avg_saved_tokens=round(mean([r.saved_tokens for r in items]), 1),
                avg_reduction_rate=round(mean(rates), 4),
                median_reduction_rate=round(median(rates), 4),
                std_reduction_rate=round(stdev(rates), 4) if len(rates) > 1 else 0.0,
                min_reduction_rate=round(min(rates), 4),
                max_reduction_rate=round(max(rates), 4),
                total_patterns_found=sum(r.pattern_count for r in items),
                avg_patterns_per_prompt=round(mean([r.pattern_count for r in items]), 2),
                avg_cost_saved=round(mean([r.cost_saved for r in items]), 10),
            ))
        return stats

    def _compute_overall_stats(self, results: list[ExperimentResult]) -> dict:
        """전체 통계 계산"""
        rates = [r.reduction_rate for r in results]
        tokens_orig = [r.original_tokens for r in results]
        tokens_ref = [r.refined_tokens for r in results]
        saved = [r.saved_tokens for r in results]

        return {
            "total_samples": len(results),
            "avg_reduction_rate": round(mean(rates), 4),
            "median_reduction_rate": round(median(rates), 4),
            "std_reduction_rate": round(stdev(rates), 4) if len(rates) > 1 else 0.0,
            "min_reduction_rate": round(min(rates), 4),
            "max_reduction_rate": round(max(rates), 4),
            "avg_original_tokens": round(mean(tokens_orig), 1),
            "avg_refined_tokens": round(mean(tokens_ref), 1),
            "avg_saved_tokens": round(mean(saved), 1),
            "total_tokens_saved": sum(saved),
            "total_cost_saved": round(sum(r.cost_saved for r in results), 10),
            # 패턴별 빈도
            "pattern_frequency": self._count_pattern_frequency(results),
        }

    def _count_pattern_frequency(self, results: list[ExperimentResult]) -> dict:
        """전체 데이터에서 패턴별 출현 빈도"""
        freq = {}
        for r in results:
            for p in r.patterns_found:
                freq[p] = freq.get(p, 0) + 1
        return dict(sorted(freq.items(), key=lambda x: -x[1]))

    @staticmethod
    def export_csv(report: BenchmarkReport, filepath: str):
        """실험 결과를 CSV로 내보낸다."""
        os.makedirs(os.path.dirname(filepath) if os.path.dirname(filepath) else ".", exist_ok=True)

        with open(filepath, "w", newline="", encoding="utf-8-sig") as f:
            writer = csv.writer(f)
            writer.writerow([
                "카테고리", "번호", "원본 토큰", "최적화 토큰",
                "절감 토큰", "절감률(%)", "감지 패턴 수",
                "적용 규칙 수", "원본 비용($)", "최적화 비용($)", "절감 비용($)",
            ])
            for r in report.results:
                writer.writerow([
                    r.category, r.prompt_id, r.original_tokens, r.refined_tokens,
                    r.saved_tokens, round(r.reduction_rate * 100, 1), r.pattern_count,
                    r.rules_applied, r.cost_original, r.cost_optimized, r.cost_saved,
                ])

        # 카테고리별 통계 CSV
        stats_path = filepath.replace(".csv", "_stats.csv")
        with open(stats_path, "w", newline="", encoding="utf-8-sig") as f:
            writer = csv.writer(f)
            writer.writerow([
                "카테고리", "샘플 수", "평균 원본 토큰", "평균 최적화 토큰",
                "평균 절감 토큰", "평균 절감률(%)", "중앙값 절감률(%)",
                "표준편차", "최소 절감률(%)", "최대 절감률(%)",
            ])
            for s in report.category_stats:
                writer.writerow([
                    s.category, s.sample_count, s.avg_original_tokens, s.avg_refined_tokens,
                    s.avg_saved_tokens, round(s.avg_reduction_rate * 100, 1),
                    round(s.median_reduction_rate * 100, 1),
                    round(s.std_reduction_rate * 100, 1),
                    round(s.min_reduction_rate * 100, 1), round(s.max_reduction_rate * 100, 1),
                ])

    @staticmethod
    def export_json(report: BenchmarkReport, filepath: str):
        """실험 결과를 JSON으로 내보낸다."""
        os.makedirs(os.path.dirname(filepath) if os.path.dirname(filepath) else ".", exist_ok=True)

        data = {
            "timestamp": report.timestamp,
            "model": report.model,
            "total_samples": report.total_samples,
            "overall_stats": report.overall_stats,
            "category_stats": [asdict(s) for s in report.category_stats],
            "results": [
                {k: v for k, v in asdict(r).items() if k not in ("original_text", "refined_text")}
                for r in report.results
            ],
        }

        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)


# ═══════════════════════════════════════
# A/B 벤치마크: 규칙 기반 vs 하이브리드
# ═══════════════════════════════════════

@dataclass
class HybridExperimentResult:
    """A/B 실험 개별 결과"""
    category: str
    prompt_id: int
    original_tokens: int
    # 규칙 기반
    rule_based_tokens: int
    rule_based_reduction: float
    rule_based_text: str
    # 하이브리드
    hybrid_tokens: int
    hybrid_reduction: float
    hybrid_text: str
    # 비교
    additional_savings: int
    improvement: float  # 하이브리드 - 규칙 기반 절감률
    detected_domain: str
    learned_patterns_count: int


@dataclass
class HybridCategoryStats:
    """A/B 카테고리별 통계"""
    category: str
    sample_count: int
    # 규칙 기반 통계
    rb_avg_reduction: float
    rb_std_reduction: float
    # 하이브리드 통계
    hy_avg_reduction: float
    hy_std_reduction: float
    # 비교
    avg_improvement: float
    max_improvement: float


@dataclass
class HybridBenchmarkReport:
    """A/B 벤치마크 보고서"""
    timestamp: str
    model: str
    total_samples: int
    results: list[HybridExperimentResult]
    category_stats: list[HybridCategoryStats]
    # 전체 통계
    overall_rb_avg_reduction: float
    overall_hy_avg_reduction: float
    overall_improvement: float
    # 통계 검정 결과
    statistical_tests: dict = field(default_factory=dict)
    # {
    #   "paired_ttest": {"t_statistic": ..., "p_value": ..., "significant": ...},
    #   "wilcoxon": {"statistic": ..., "p_value": ..., "significant": ...},
    #   "effect_size": {"cohens_d": ..., "interpretation": ...},
    # }


class HybridBenchmarkRunner:
    """
    A/B 벤치마크: 규칙 기반 vs 하이브리드 비교 실험

    논문에 필요한 통계 검정(paired t-test, Wilcoxon, Cohen's d)을
    포함한 체계적 비교 실험을 수행한다.
    """

    def __init__(self, model: str = "gpt-4o-mini"):
        self.model = model
        self.counter = TokenCounter(model=model)
        self.refiner = PromptRefiner(model=model)

    def run(self, dataset: dict[str, list[str]] | None = None, progress_callback=None) -> HybridBenchmarkReport:
        """
        A/B 비교 벤치마크를 실행한다.

        Args:
            dataset: 데이터셋 (None이면 기본 BENCHMARK_DATASET 사용)
            progress_callback: UI 업데이트용 콜백 함수, 인자 (current, total, result_info)

        Returns:
            HybridBenchmarkReport
        """
        if dataset is None:
            dataset = BENCHMARK_DATASET

        # Lazy import to avoid circular dependency
        from optimizer.hybrid_engine import HybridOptimizer

        engine = HybridOptimizer(model=self.model)
        engine.initialize(dataset)

        results = []
        prompt_id = 0

        total_prompts = sum(len(p) for p in dataset.values())

        for category, prompts in dataset.items():
            for prompt in prompts:
                prompt_id += 1

                # 규칙 기반
                rb_result = self.refiner.refine(prompt)
                original_tokens = rb_result.original_tokens

                # 하이브리드
                h_result = engine.optimize(prompt, top_k=3)

                res = HybridExperimentResult(
                    category=category,
                    prompt_id=prompt_id,
                    original_tokens=original_tokens,
                    rule_based_tokens=rb_result.refined_tokens,
                    rule_based_reduction=rb_result.reduction_rate,
                    rule_based_text=rb_result.refined,
                    hybrid_tokens=h_result.hybrid_tokens,
                    hybrid_reduction=h_result.hybrid_reduction,
                    hybrid_text=h_result.hybrid_refined_text,
                    additional_savings=rb_result.refined_tokens - h_result.hybrid_tokens,
                    improvement=round(
                        h_result.hybrid_reduction - rb_result.reduction_rate, 4
                    ),
                    detected_domain=h_result.detected_domain,
                    learned_patterns_count=len(h_result.learned_patterns_applied),
                )
                results.append(res)
                
                if progress_callback:
                    progress_callback(prompt_id, total_prompts, {
                        "category": category,
                        "original_tokens": original_tokens,
                        "hybrid_tokens": h_result.hybrid_tokens,
                        "reduction": h_result.hybrid_reduction,
                        "domain": h_result.detected_domain
                    })

        # 카테고리별 통계
        cat_stats = self._compute_category_stats(results)

        # 전체 통계
        rb_rates = [r.rule_based_reduction for r in results]
        hy_rates = [r.hybrid_reduction for r in results]

        overall_rb = mean(rb_rates) if rb_rates else 0
        overall_hy = mean(hy_rates) if hy_rates else 0
        overall_imp = overall_hy - overall_rb

        # 통계 검정
        stat_tests = self._run_statistical_tests(rb_rates, hy_rates)

        return HybridBenchmarkReport(
            timestamp=datetime.now().isoformat(),
            model=self.model,
            total_samples=len(results),
            results=results,
            category_stats=cat_stats,
            overall_rb_avg_reduction=round(overall_rb, 4),
            overall_hy_avg_reduction=round(overall_hy, 4),
            overall_improvement=round(overall_imp, 4),
            statistical_tests=stat_tests,
        )

    def _compute_category_stats(
        self, results: list[HybridExperimentResult]
    ) -> list[HybridCategoryStats]:
        """카테고리별 비교 통계 계산"""
        cat_data: dict[str, list[HybridExperimentResult]] = {}
        for r in results:
            cat_data.setdefault(r.category, []).append(r)

        stats = []
        for category, items in cat_data.items():
            rb_rates = [r.rule_based_reduction for r in items]
            hy_rates = [r.hybrid_reduction for r in items]
            improvements = [r.improvement for r in items]

            stats.append(HybridCategoryStats(
                category=category,
                sample_count=len(items),
                rb_avg_reduction=round(mean(rb_rates), 4),
                rb_std_reduction=round(stdev(rb_rates) if len(rb_rates) > 1 else 0, 4),
                hy_avg_reduction=round(mean(hy_rates), 4),
                hy_std_reduction=round(stdev(hy_rates) if len(hy_rates) > 1 else 0, 4),
                avg_improvement=round(mean(improvements), 4),
                max_improvement=round(max(improvements), 4),
            ))

        return stats

    @staticmethod
    def _run_statistical_tests(
        rb_rates: list[float], hy_rates: list[float]
    ) -> dict:
        """통계 검정 실행 (paired t-test, Wilcoxon, Cohen's d)"""
        tests = {}

        if len(rb_rates) < 2:
            return tests

        # Cohen's d (effect size)
        diffs = [h - r for h, r in zip(hy_rates, rb_rates)]
        mean_diff = mean(diffs)
        if len(diffs) > 1:
            std_diff = stdev(diffs)
        else:
            std_diff = 0.0
        cohens_d = mean_diff / std_diff if std_diff > 0 else 0.0

        # 효과 크기 해석
        abs_d = abs(cohens_d)
        if abs_d < 0.2:
            interpretation = "무시할 수준 (negligible)"
        elif abs_d < 0.5:
            interpretation = "작은 효과 (small)"
        elif abs_d < 0.8:
            interpretation = "중간 효과 (medium)"
        else:
            interpretation = "큰 효과 (large)"

        tests["effect_size"] = {
            "cohens_d": round(cohens_d, 4),
            "interpretation": interpretation,
        }

        # scipy 사용 가능 시 통계 검정 수행
        try:
            from scipy import stats as scipy_stats

            # Paired t-test
            t_stat, t_p = scipy_stats.ttest_rel(hy_rates, rb_rates)
            tests["paired_ttest"] = {
                "t_statistic": round(float(t_stat), 4),
                "p_value": round(float(t_p), 6),
                "significant_005": float(t_p) < 0.05,
                "significant_001": float(t_p) < 0.01,
            }

            # Wilcoxon signed-rank test
            try:
                w_stat, w_p = scipy_stats.wilcoxon(diffs)
                tests["wilcoxon"] = {
                    "statistic": round(float(w_stat), 4),
                    "p_value": round(float(w_p), 6),
                    "significant_005": float(w_p) < 0.05,
                    "significant_001": float(w_p) < 0.01,
                }
            except ValueError:
                tests["wilcoxon"] = {
                    "note": "모든 차이가 0이어서 검정 불가",
                }
        except ImportError:
            # scipy 없이도 기본 통계 제공
            import math
            n = len(diffs)
            se = std_diff / math.sqrt(n) if n > 0 else 0
            t_stat = mean_diff / se if se > 0 else 0
            tests["paired_ttest"] = {
                "t_statistic": round(t_stat, 4),
                "p_value_note": "scipy 미설치로 정확한 p-value 계산 불가",
                "n": n,
                "mean_diff": round(mean_diff, 6),
                "se": round(se, 6),
            }

        return tests

    @staticmethod
    def export_csv(report: HybridBenchmarkReport, filepath: str):
        """A/B 벤치마크 결과를 CSV로 내보낸다."""
        os.makedirs(os.path.dirname(filepath) if os.path.dirname(filepath) else ".", exist_ok=True)

        with open(filepath, "w", newline="", encoding="utf-8-sig") as f:
            writer = csv.writer(f)
            writer.writerow([
                "카테고리", "ID", "원본 토큰",
                "규칙기반 토큰", "규칙기반 절감률(%)",
                "하이브리드 토큰", "하이브리드 절감률(%)",
                "추가 절감 토큰", "개선률(%p)",
                "감지 도메인", "학습패턴 수",
            ])
            for r in report.results:
                writer.writerow([
                    r.category, r.prompt_id, r.original_tokens,
                    r.rule_based_tokens, round(r.rule_based_reduction * 100, 1),
                    r.hybrid_tokens, round(r.hybrid_reduction * 100, 1),
                    r.additional_savings, round(r.improvement * 100, 1),
                    r.detected_domain, r.learned_patterns_count,
                ])

    @staticmethod
    def export_json(report: HybridBenchmarkReport, filepath: str):
        """A/B 벤치마크 결과를 JSON으로 내보낸다."""
        os.makedirs(os.path.dirname(filepath) if os.path.dirname(filepath) else ".", exist_ok=True)

        data = {
            "timestamp": report.timestamp,
            "model": report.model,
            "total_samples": report.total_samples,
            "overall": {
                "rule_based_avg_reduction": report.overall_rb_avg_reduction,
                "hybrid_avg_reduction": report.overall_hy_avg_reduction,
                "improvement": report.overall_improvement,
            },
            "statistical_tests": report.statistical_tests,
            "category_stats": [asdict(s) for s in report.category_stats],
            "results": [asdict(r) for r in report.results],
        }

        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
