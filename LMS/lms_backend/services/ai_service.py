import os
import json
import re
from openai import AsyncOpenAI
from .cost_analysis import estimate_token_count, compare_all_models

openai_client = None
if os.getenv("OPENAI_API_KEY"):
    openai_client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    print('✅ OpenAI API 연결 완료')
else:
    print('⚠️ OPENAI_API_KEY 미설정 — 폴백 분석 모드로 동작합니다')

ANALYSIS_SYSTEM_PROMPT = """You are PROMM, an expert AI prompt engineering analyst. 
Analyze the user's prompt and return a JSON object with this exact structure:

{
  "qualityScore": <number 0-100>,
  "grade": "<S/A/B/C/D>",
  "structureAnalysis": {
    "hasRole": <boolean>,
    "hasContext": <boolean>,
    "hasTask": <boolean>,
    "hasFormat": <boolean>,
    "hasConstraints": <boolean>
  },
  "strengths": ["<strength1>", "<strength2>"],
  "weaknesses": ["<weakness1>", "<weakness2>"],
  "improvements": ["<specific improvement suggestion 1>", "<specific improvement suggestion 2>"],
  "optimizedPrompt": "<improved version of the prompt>",
  "category": "<coding/writing/business/education/creative/general>"
}

Scoring criteria:
- Role clarity (20pts): Does the prompt define who the AI should be?
- Context richness (25pts): Is there enough background/situation info?
- Task specificity (25pts): Is the request clear and specific?
- Output format (15pts): Does it specify desired format?
- Constraints & examples (15pts): Are there boundaries, examples, or edge cases?

IMPORTANT: 
- Respond ONLY with valid JSON, no markdown, no explanation.
- Write all analysis text in Korean (한국어).
- The optimizedPrompt should be a meaningfully improved version in the same language as input."""

async def analyze_prompt_with_ai(prompt: str):
    if not prompt or not prompt.strip():
        raise ValueError('프롬프트를 입력해주세요')

    input_tokens = estimate_token_count(prompt)
    cost_comparison = compare_all_models(input_tokens, 200)

    if openai_client:
        try:
            response = await openai_client.chat.completions.create(
                model='gpt-4o-mini',
                messages=[
                    {'role': 'system', 'content': ANALYSIS_SYSTEM_PROMPT},
                    {'role': 'user', 'content': prompt}
                ],
                temperature=0.3,
                max_tokens=1500,
                response_format={'type': 'json_object'}
            )
            analysis = json.loads(response.choices[0].message.content)
            
            return {
                'success': True,
                'mode': 'ai',
                'analysis': {
                    **analysis,
                    'tokenCount': input_tokens,
                    'estimatedCost': cost_comparison['cheapest']['totalCost'],
                    'costComparison': cost_comparison['models'][:4], 
                },
                'usage': {
                    'promptTokens': response.usage.prompt_tokens,
                    'completionTokens': response.usage.completion_tokens,
                    'totalTokens': response.usage.total_tokens,
                    'analysisCost': f"${response.usage.total_tokens * 0.00000015:.6f}"
                }
            }
        except Exception as e:
            print(f'OpenAI API 실패, 폴백 전환: {str(e)}')
            
    return fallback_analysis(prompt, input_tokens, cost_comparison)

def fallback_analysis(prompt: str, input_tokens: int, cost_comparison: dict):
    score = 40
    strengths, weaknesses, improvements = [], [], []
    
    struct = {
        'hasRole': False, 'hasContext': False, 'hasTask': False,
        'hasFormat': False, 'hasConstraints': False
    }

    if re.search(r'you are|act as|as a|역할|전문가|expert|specialist|assistant', prompt, re.I):
        struct['hasRole'] = True
        score += 15
        strengths.append('역할(Role)이 명확하게 정의되어 있습니다')
    else:
        weaknesses.append('역할(Role) 정의가 없습니다')
        improvements.append('프롬프트 시작에 "You are an expert..."와 같은 역할 정의를 추가하세요')

    if re.search(r'context|background|given|상황|배경|현재|조건|scenario', prompt, re.I) or len(prompt) > 100:
        struct['hasContext'] = True
        score += 15
        strengths.append('충분한 맥락(Context) 정보가 제공되었습니다')
    else:
        weaknesses.append('맥락(Context) 정보가 부족합니다')
        improvements.append('배경 상황, 제약 조건, 현재 상태 등의 맥락을 추가하세요')

    if re.search(r'write|create|generate|analyze|explain|build|design|작성|만들|생성|분석|설명', prompt, re.I):
        struct['hasTask'] = True
        score += 15
        strengths.append('작업(Task) 지시가 명확합니다')
    else:
        weaknesses.append('구체적인 작업(Task) 지시가 없습니다')
        improvements.append('"~해주세요", "~를 작성하세요"와 같은 명확한 작업 지시를 추가하세요')

    if re.search(r'format|구조|형식|json|markdown|table|list|목록|표|단계', prompt, re.I):
        struct['hasFormat'] = True
        score += 10
        strengths.append('출력 형식(Format)이 지정되어 있습니다')
    else:
        weaknesses.append('원하는 출력 형식이 명시되지 않았습니다')
        improvements.append('원하는 응답 형식(목록, 표, JSON 등)을 명시하세요')

    if re.search(r'constraint|limit|example|예시|제약|제한|최소|최대|반드시|주의', prompt, re.I):
        struct['hasConstraints'] = True
        score += 10
        strengths.append('제약조건이나 예시가 포함되어 있습니다')
    else:
        weaknesses.append('제약조건이나 예시가 없습니다')
        improvements.append('구체적인 예시(few-shot)나 제약조건을 추가하면 품질이 크게 향상됩니다')

    if len(prompt) > 200: score += 5
    if len(prompt) > 500: score += 5
    score = max(0, min(100, score))
    grade = 'S' if score >= 90 else 'A' if score >= 75 else 'B' if score >= 60 else 'C' if score >= 40 else 'D'

    opt_prompt = ""
    if not struct['hasRole']: opt_prompt += 'You are an expert assistant with deep domain knowledge.\n\n'
    if not struct['hasContext']: opt_prompt += 'Context: Please consider the following background information.\n\n'
    opt_prompt += f"Task: {prompt}\n\n"
    if not struct['hasFormat']: opt_prompt += 'Please provide a well-structured response with clear sections.\n'
    if not struct['hasConstraints']: opt_prompt += 'Include practical examples where applicable.\n'

    return {
        'success': True,
        'mode': 'fallback',
        'analysis': {
            'qualityScore': score,
            'grade': grade,
            'structureAnalysis': struct,
            'strengths': strengths if strengths else ['프롬프트가 입력되었습니다'],
            'weaknesses': weaknesses,
            'improvements': improvements if improvements else ['현재 프롬프트도 충분히 사용 가능합니다'],
            'optimizedPrompt': opt_prompt.strip(),
            'category': 'general',
            'tokenCount': input_tokens,
            'estimatedCost': cost_comparison['cheapest']['totalCost'],
            'costComparison': cost_comparison['models'][:4],
        },
        'usage': None
    }
