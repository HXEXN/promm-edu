from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
import models
from routers import lessons, prompt, user

# 테이블이 존재하지 않을 경우 생성 (이미 존재하는 경우 무시됨)
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Smart Farm Prompt Engineering API (FastAPI)")

# CORS Configuration
# 프론트엔드 React 개발 환경을 고려하여 모든 출처 허용(MVP용)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(lessons.router)
app.include_router(prompt.router)
app.include_router(user.router)

@app.get("/")
def read_root():
    return {
        "message": "Smart Farm Prompt Engineering Education Platform API",
        "status": "running on FastAPI",
        "endpoints": {
            "lessons": "/api/lessons",
            "analyze": "/api/prompt/analyze",
            "execute": "/api/prompt/execute",
            "websocket": "ws://localhost:3001/ws"
        }
    }
