# PROMM EDU - AI 프롬프트 엔지니어링 교육 플랫폼

> **기업의 AI 생산성을 높이는 프롬프트 엔지니어링 전문 교육 SaaS**

[![Deploy Status](https://img.shields.io/badge/status-active-success.svg)](https://render.com)
[![Node.js](https://img.shields.io/badge/node-20%2B-brightgreen.svg)](https://nodejs.org)
[![React](https://img.shields.io/badge/react-19-blue.svg)](https://react.dev)

## 🚀 프로젝트 개요

- **목표**: 기업/개인 대상 AI 프롬프트 엔지니어링 교육
- **핵심 가치**: AI 비용 30% 절감 + 생산성 45% 향상
- **현재 단계**: MVP 완성, 배포 준비 완료

## 📦 기술 스택

### Frontend
- React 19 + Vite 7
- React Router 7
- Vanilla CSS (반응형, 다크모드)

### Backend
- Node.js 20+ + Express
- WebSocket (ws)
- SQLite (better-sqlite3)
- 보안: helmet, cors, rate-limit

### Deployment
- **Platform**: Render (Free Tier)
- **Frontend**: Static Site
- **Backend**: Web Service

## ⚡ 로컬 개발 환경

### 필수 요구사항
- Node.js 20 이상
- npm 10 이상

### 설치 & 실행

```bash
# 1. 레포 클론
git clone <your-repo-url>
cd smartfarm-prompt-edu

# 2. 백엔드 설치 & 실행
cd backend
npm install
npm start          # http://localhost:3000

# 3. 프론트엔드 설치 & 실행 (새 터미널)
cd frontend
npm install
npm run dev        # http://localhost:5173
```

## 🌐 배포

### Render 배포 (자동)

1. GitHub에 푸시
2. Render 대시보드에서 "New Blueprint" 선택
3. 레포지토리 연결
4. `render.yaml` 자동 인식
5. 배포 완료!

### 환경 변수
```bash
# Backend
NODE_ENV=production
PORT=3000

# Frontend
VITE_API_URL=<your-backend-url>
```

## 📂 프로젝트 구조

```
smartfarm-prompt-edu/
├── backend/                # Express API 서버
│   ├── src/
│   │   ├── server.js       # 엔트리포인트
│   │   ├── routes/         # API 라우트
│   │   ├── services/       # 비즈니스 로직
│   │   └── models/         # DB 스키마
│   └── package.json
│
├── frontend/               # React SPA
│   ├── src/
│   │   ├── main.jsx        # React 엔트리
│   │   ├── App.jsx         # 라우터 (18개 경로)
│   │   ├── components/     # 재사용 컴포넌트
│   │   └── pages/          # 페이지 컴포넌트
│   └── package.json
│
├── render.yaml             # Render 배포 설정
└── README.md
```

## 🔑 주요 기능

1. **프롬프트 생성기**: Role/Context/Action 구조화
2. **고급 최적화**: 의미 압축, 품질 분석
3. **기업 교육 LMS**: 8주 커리큘럼, 퀴즈, 수료증
4. **ROI 계산기**: 비용 절감 시뮬레이션
5. **AI 엔진 데모**: 2026 최신 기술 (9개 모델)

## 📚 문서

- **온보딩 가이드**: `ONBOARDING.md`
- **페이지 갤러리**: `complete_page_gallery.md` (아티팩트)
- **사업 계획서**: `startup_business_plan.md` (아티팩트)

## 🤝 기여

```bash
# 브랜치 전략
main          # 안정 배포 버전
├── dev       # 개발 통합
│   ├── feature/<기능명>
│   ├── fix/<버그명>
│   └── refactor/<대상>
```

## 📞 문의

- **대표**: 현민
- **Email**: support@promm.edu
- **Website**: (배포 후 업데이트)

## 📄 라이선스

MIT License

---

**Made with ❤️ by PROMM EDU Team**
