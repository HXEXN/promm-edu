# ⚡ AI 프롬프트 토큰 최적화 도구

> **하이브리드 전략 (Fine-tuning + RAG)** 기반 한국어 프롬프트 토큰 최적화 도구  
> 산업공학과 캡스톤 프로젝트

## 📊 주요 성과

| 최적화 방식 | 평균 절감률 | Cohen's d | p-value |
|------------|-----------|-----------|---------|
| 규칙 기반 | 29.72% | — | — |
| **하이브리드** | **33.73%** | **0.8466** (큰 효과) | **0.000070** |

## 🧠 하이브리드 전략

```
입력 프롬프트
  ├── [규칙 기반] 46개 정제 규칙 적용
  ├── [Fine-tuning] 도메인 감지 → 학습된 프로파일 적용
  ├── [RAG] 유사 사례 검색 → 최적화 가이드 생성
  └── [학습 패턴] 도메인 특화 추가 패턴 적용
```

- **Fine-tuning 개념**: 벤치마크 데이터에서 도메인별(질문응답/코드생성/요약/번역) 규칙 효과를 학습
- **RAG 개념**: TF-IDF 유사도 기반으로 유사 사례를 검색하여 최적화 가이드 동적 생성
- **하이브리드 통합**: 두 전략을 결합한 6단계 파이프라인

## 🛠️ 기술 스택

| 기술 | 용도 |
|------|------|
| Python 3.10+ | 핵심 언어 |
| tiktoken | 토큰 측정 |
| Streamlit | 웹 대시보드 |
| scipy | 통계 검정 |
| matplotlib | 논문용 차트 |

## 🚀 실행 방법

```bash
# 의존성 설치
pip install -r requirements.txt

# 대시보드 실행
streamlit run app.py
```

## 📁 프로젝트 구조

```
prompt-token-optimizer/
├── app.py                      # Streamlit 웹 대시보드
├── requirements.txt            # 의존성
├── optimizer/
│   ├── tokenizer.py            # 토큰 카운터 (tiktoken)
│   ├── analyzer.py             # 낭비 패턴 분석기
│   ├── refiner.py              # 규칙 기반 정제 엔진
│   ├── cost.py                 # API 비용 계산기
│   ├── benchmark.py            # 벤치마크 + A/B 비교 실험
│   ├── charts.py               # 논문용 차트 (300 DPI)
│   ├── learned_optimizer.py    # Fine-tuning 개념 모듈
│   ├── prompt_rag.py           # RAG 개념 모듈
│   ├── hybrid_engine.py        # 하이브리드 통합 엔진
│   └── rules/
│       └── korean.py           # 한국어 정제 규칙 (46+)
└── tests/
    └── test_optimizer.py       # 단위 테스트 (47건)
```

## 📋 대시보드 기능

| 탭 | 기능 |
|----|------|
| 🔧 개별 최적화 | 프롬프트 입력 → 분석 → 최적화 → 비용 비교 |
| 🧠 하이브리드 | Fine-tuning + RAG 통합 최적화, A/B 벤치마크 |
| 🏗️ 모델 설명 | 시스템 아키텍처, 파이프라인, 규칙 상세 |
| 📊 벤치마크 | 30건 체계적 실험, 통계 분석, 차트 |
