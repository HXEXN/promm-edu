from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
import asyncio
from typing import Optional
import json
import re

from database import get_db
import models
from services import cost_analysis, ai_service, prompt_service, quality_scorer

router = APIRouter(prefix="/api/prompt", tags=["prompt"])

class PromptPayload(BaseModel):
    role: Optional[str] = None
    context: Optional[str] = None
    action: Optional[str] = None
    model: Optional[str] = 'gpt-4o'
    prompt: Optional[str] = None
    domain: Optional[str] = 'general'
    requestsPerMonth: Optional[int] = 1000

@router.post("/analyze")
def analyze_prompt(payload: PromptPayload):
    analysis = cost_analysis.analyze_prompt_cost(payload.role, payload.context, payload.action)
    return {"success": True, "data": analysis}

@router.post("/execute")
async def execute_prompt(payload: PromptPayload, db: Session = Depends(get_db)):
    result = await prompt_service.execute_prompt(payload.role, payload.context, payload.action, payload.model)
    
    db_prompt = models.Prompt(
        role_text=payload.role,
        context_text=payload.context,
        action_text=payload.action,
        model_used=payload.model,
        token_count=result['analysis']['tokenCount'],
        efficiency_score=result['analysis']['efficiencyScore'],
        hardware_command=json.dumps(result['command'])
    )
    db.add(db_prompt)
    db.commit()
    
    return {"success": True, "data": result}

@router.post("/ai-analyze")
async def ai_analyze_prompt(payload: PromptPayload):
    if not payload.prompt or not payload.prompt.strip():
        return {"success": False, "error": "프롬프트를 입력해주세요"}
        
    try:
        result = await ai_service.analyze_prompt_with_ai(payload.prompt)
        return result
    except Exception as e:
        return {"success": False, "error": str(e)}

@router.post("/optimize")
def optimize_prompt(payload: PromptPayload):
    if not payload.prompt or not payload.prompt.strip():
        return {"success": False, "error": "프롬프트를 입력해주세요"}
        
    prompt = payload.prompt
    domain = payload.domain
    requests_per_month = payload.requestsPerMonth
    
    original_tokens = cost_analysis.estimate_token_count(prompt)
    scorer = quality_scorer.MultiDimensionalQualityScorer(domain)
    original_quality = scorer.evaluate(prompt)
    original_cost = cost_analysis.compare_all_models(original_tokens, 50)

    optimized = prompt
    techniques = []

    filler_patterns = [
        (r'제발\s*', '', '불필요한 감정 표현 제거'),
        (r'부탁드립니다\.?\s*', '', '불필요한 요청어 제거'),
        (r'감사합니다\.?\s*', '', '불필요한 감사 표현 제거'),
        (r'(?i)please\s*', '', '"please" 제거'),
        (r'(?i)could you (please\s*)?', '', '"could you" 간소화'),
        (r'(?i)I would like you to\s*', '', '"I would like you to" 간소화'),
        (r'(?i)would you (kindly\s*)?(please\s*)?', '', '"would you" 간소화'),
        (r'(?i)I want you to\s*', '', '"I want you to" 간소화'),
    ]
    
    for pat, rep, name in filler_patterns:
        before = optimized
        optimized = re.sub(pat, rep, optimized)
        if before != optimized:
            techniques.append({'name': name, 'category': 'filler_removal', 'impact': 'low'})

    lines = optimized.split('\n')
    seen = set()
    dedup = []
    for line in lines:
        norm = line.strip().lower()
        if norm and norm not in seen:
            seen.add(norm)
            dedup.append(line)
        elif not norm:
            dedup.append(line)
        else:
            techniques.append({'name': f'중복 지시 제거: "{line.strip()[:30]}..."', 'category': 'deduplication', 'impact': 'medium'})
    
    optimized = '\n'.join(dedup)
    
    before_ws = optimized
    optimized = re.sub(r'\n{3,}', '\n\n', optimized)
    optimized = re.sub(r'[ \t]{2,}', ' ', optimized).strip()
    if before_ws != optimized:
        techniques.append({'name': '과도한 공백/줄바꿈 정리', 'category': 'whitespace', 'impact': 'low'})

    verbose = [
        (r'(?i)in order to', 'to', '"in order to" → "to"'),
        (r'(?i)due to the fact that', 'because', '"due to the fact that" → "because"'),
        (r'(?i)at this point in time', 'now', '"at this point in time" → "now"'),
        (r'(?i)in the event that', 'if', '"in the event that" → "if"'),
        (r'(?i)with regard to', 'about', '"with regard to" → "about"'),
        (r'~에 대해서', '~에 대해', '~에 대해서 → ~에 대해'),
    ]
    for pat, rep, name in verbose:
        before = optimized
        optimized = re.sub(pat, rep, optimized)
        if before != optimized:
            techniques.append({'name': name, 'category': 'verbose_reduction', 'impact': 'medium'})

    optimized_tokens = cost_analysis.estimate_token_count(optimized)
    optimized_quality = scorer.evaluate(optimized)
    optimized_cost = cost_analysis.compare_all_models(optimized_tokens, 50)

    tokens_saved = original_tokens - optimized_tokens
    comp_ratio = (tokens_saved / original_tokens * 100) if original_tokens > 0 else 0
    quality_delta = optimized_quality['overall']['score'] - original_quality['overall']['score']

    model_savings = {}
    req_per_year = requests_per_month * 12
    for model_id, pricing in cost_analysis.MODEL_PRICING.items():
        savings = cost_analysis.calculate_annual_savings(original_tokens, optimized_tokens, req_per_year, model_id)
        model_savings[model_id] = {
            'modelName': pricing['name'],
            'provider': pricing['provider'],
            **savings
        }

    return {
        "success": True,
        "data": {
            "original": {
                "text": prompt,
                "tokens": original_tokens,
                "quality": original_quality,
                "cost": original_cost
            },
            "optimized": {
                "text": optimized,
                "tokens": optimized_tokens,
                "quality": optimized_quality,
                "cost": optimized_cost
            },
            "compression": {
                "tokensSaved": tokens_saved,
                "compressionRatio": round(comp_ratio, 1),
                "qualityDelta": quality_delta,
                "qualityPreserved": quality_delta >= -5,
                "techniques": techniques
            },
            "modelSavings": model_savings,
            "requestsPerMonth": requests_per_month
        }
    }
