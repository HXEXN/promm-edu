# 🎓 PROMM EDU - AI 프롬프트 엔지니어링 교육 플랫폼

> **기업의 AI 생산성을 높이는 프롬프트 엔지니어링 전문 교육 SaaS**

[![Deploy Status](https://img.shields.io/badge/deploy-Render-46e3b7.svg)](https://render.com)
[![Node.js](https://img.shields.io/badge/node-20%2B-brightgreen.svg)](https://nodejs.org)
[![React](https://img.shields.io/badge/react-19-61dafb.svg)](https://react.dev)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o-412991.svg)](https://openai.com)
[![License](https://img.shields.io/badge/license-MIT-yellow.svg)](LICENSE)

---

## 🚀 프로젝트 개요

| 항목 | 내용 |
|------|------|
| **목표** | 기업/개인 대상 AI 프롬프트 엔지니어링 교육 |
| **핵심 가치** | AI 비용 30% 절감 + 생산성 45% 향상 |
| **현재 단계** | MVP 진행중, Render 배포 완료 |
| **기술 기반** | GraphRAG, DSPy, Corrective RAG, Tree of Thoughts |

---

## 🔑 주요 기능

### 🤖 AI 프롬프트 분석기 (NEW)
- **OpenAI GPT-4o-mini 연동** — 실시간 프롬프트 품질 분석
- **7D Quality Assessment** — 5가지 구조(Role, Context, Task, Format, Constraints) 정량 평가
- **자동 폴백** — API 장애 시 규칙 기반 분석으로 자동 전환
- **비용 비교** — GPT-4, Claude, Gemini 등 8개 모델 토큰 비용 시뮬레이션

### 📚 교육 플랫폼
- **프롬프트 생성기** — Role/Context/Action 구조화 + AI 분석 + 템플릿
- **고급 최적화** — 의미 압축, 품질 분석, 개선 제안
- **기업 교육 LMS** — 8주 커리큘럼, 퀴즈, 수료증
- **ROI 계산기** — 토큰 절감 비용 시뮬레이션

### 🏢 엔터프라이즈
- **기업 대시보드** — 팀 성과 분석, ROI 리포트
- **AI 엔진 데모** — 2026 최신 기술 (GraphRAG, DSPy 등 9개 모델)
- **보안 모듈** — 프롬프트 인젝션 방어, PII 마스킹

---

## 📦 기술 스택

### Frontend
- React 19 + Vite 7
- React Router 7
- Vanilla CSS (반응형, 다크모드)

### Backend
- Node.js 20+ + Express
- OpenAI API (GPT-4o-mini)
- WebSocket (ws)
- SQLite (better-sqlite3) / PostgreSQL (프로덕션)
- 보안: helmet, cors, express-rate-limit, dotenv

### Deployment
- **Platform**: Render
- **Frontend**: Static Site
- **Backend**: Web Service
- **CI/CD**: GitHub → Render 자동 배포

---

## ⚡ 로컬 개발 환경

### 필수 요구사항
- Node.js 20 이상
- npm 10 이상
- OpenAI API Key (선택, 없으면 규칙 기반 분석)

### 설치 & 실행

```bash
# 1. 레포 클론
git clone https://github.com/HXEXN/promm-edu.git
cd smartfarm-prompt-edu

# 2. 백엔드 설치 & 실행
cd backend
npm install
cp .env.example .env          # 환경변수 설정
# .env 파일에 OPENAI_API_KEY 추가
npm start                     # http://localhost:3000

# 3. 프론트엔드 설치 & 실행 (새 터미널)
cd frontend
npm install
npm run dev                   # http://localhost:5173
```

### 환경 변수

```bash
# Backend (.env)
OPENAI_API_KEY=sk-xxx         # OpenAI API 키 (선택)
NODE_ENV=production           # 프로덕션 모드
PORT=3000

# Frontend
VITE_API_URL=<backend-url>    # 백엔드 API 주소
```

---

## 📂 프로젝트 구조

```
smartfarm-prompt-edu/
├── backend/                    # Express API 서버
│   ├── src/
│   │   ├── server.js           # 엔트리포인트 (dotenv, CORS, 보안)
│   │   ├── routes/
│   │   │   └── api.js          # API 라우트 (/api/prompt/ai-analyze 등)
│   │   ├── services/
│   │   │   ├── aiService.js    # 🆕 OpenAI 연동 + 폴백 분석
│   │   │   ├── costAnalysisService.js  # 토큰 비용 계산
│   │   │   └── promptService.js
│   │   └── models/
│   │       └── database.js     # SQLite DB
│   ├── .env                    # 환경변수 (git 제외)
│   └── package.json
│
├── frontend/                   # React SPA
│   ├── src/
│   │   ├── main.jsx            # React 엔트리
│   │   ├── App.jsx             # 라우터 (18+ 페이지)
│   │   ├── config/
│   │   │   └── api.js          # API URL 설정
│   │   ├── components/         # 재사용 컴포넌트
│   │   └── pages/
│   │       ├── PromptGenerator.jsx  # 🆕 AI 분석 탭 포함
│   │       ├── AdvancedOptimizer.jsx
│   │       ├── EnterprisePage.jsx
│   │       └── ...
│   └── package.json
│
├── render.yaml                 # Render 배포 설정
└── README.md
```

---

## 🌐 배포

### Render 배포 (자동)

1. GitHub `main` 브랜치에 푸시
2. Render가 자동 감지 → 빌드 → 배포
3. Render 대시보드에서 환경 변수 설정:
   - `OPENAI_API_KEY` — OpenAI API 키
   - `DATABASE_URL` — PostgreSQL 연결 (선택)
   - `FRONTEND_URL` — 프론트엔드 URL (CORS용)

---

## 📚 참고 논문

| 기술 | 논문 | 링크 |
|------|------|------|
| GraphRAG | Edge et al. (2024), Microsoft Research | [arXiv:2404.16130](https://arxiv.org/abs/2404.16130) |
| Corrective RAG | Yan et al. (2024) | [arXiv:2401.15884](https://arxiv.org/abs/2401.15884) |
| DSPy | Khattab et al. (ICLR 2024), Stanford NLP | [arXiv:2310.03714](https://arxiv.org/abs/2310.03714) |
| Tree of Thoughts | Yao et al. (NeurIPS 2023) | [arXiv:2305.10601](https://arxiv.org/abs/2305.10601) |

---

## 🤝 기여

```bash
# 브랜치 전략
main              # 안정 배포 버전
├── dev           # 개발 통합
│   ├── feature/<기능명>
│   ├── fix/<버그명>
│   └── refactor/<대상>
```

---

## 📞 문의

- **GitHub**: [HXEXN/promm-edu](https://github.com/HXEXN/promm-edu)
- **Email**: promm.hyeonmin@gmail.com

## 📄 라이선스

MIT License

---

**Made with ❤️ by PROMM EDU Team**
