import OpenAI from 'openai';
import { estimateTokenCount, compareAllModels } from './costAnalysisService.js';

// Initialize OpenAI client (only if API key is available)
let openai = null;
if (process.env.OPENAI_API_KEY) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    console.log('✅ OpenAI API 연결 완료');
} else {
    console.log('⚠️ OPENAI_API_KEY 미설정 — 폴백 분석 모드로 동작합니다');
}

const ANALYSIS_SYSTEM_PROMPT = `You are PROMM, an expert AI prompt engineering analyst. 
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
- The optimizedPrompt should be a meaningfully improved version in the same language as input.`;

/**
 * Analyze a prompt using OpenAI API
 * Falls back to rule-based analysis if API key is not available
 */
export async function analyzePromptWithAI(prompt) {
    if (!prompt || prompt.trim().length === 0) {
        throw new Error('프롬프트를 입력해주세요');
    }

    // Token estimation for cost analysis
    const inputTokens = estimateTokenCount(prompt);
    const costComparison = compareAllModels(inputTokens, 200);

    // Try OpenAI API first
    if (openai) {
        try {
            const response = await openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: ANALYSIS_SYSTEM_PROMPT },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.3,
                max_tokens: 1500,
                response_format: { type: 'json_object' }
            });

            const analysis = JSON.parse(response.choices[0].message.content);

            return {
                success: true,
                mode: 'ai',
                analysis: {
                    ...analysis,
                    tokenCount: inputTokens,
                    estimatedCost: costComparison.cheapest.totalCost,
                    costComparison: costComparison.models.slice(0, 4), // Top 4 cheapest
                },
                usage: {
                    promptTokens: response.usage?.prompt_tokens,
                    completionTokens: response.usage?.completion_tokens,
                    totalTokens: response.usage?.total_tokens,
                    analysisCost: `$${((response.usage?.total_tokens || 0) * 0.00000015).toFixed(6)}`
                }
            };
        } catch (error) {
            console.error('OpenAI API 호출 실패, 폴백 모드로 전환:', error.message);
            // Fall through to fallback
        }
    }

    // Fallback: Rule-based analysis
    return fallbackAnalysis(prompt, inputTokens, costComparison);
}

/**
 * Rule-based fallback analysis when OpenAI API is unavailable
 */
function fallbackAnalysis(prompt, inputTokens, costComparison) {
    const lower = prompt.toLowerCase();
    let score = 40; // Base score
    const strengths = [];
    const weaknesses = [];
    const improvements = [];

    const structureAnalysis = {
        hasRole: false,
        hasContext: false,
        hasTask: false,
        hasFormat: false,
        hasConstraints: false
    };

    // Role detection
    const rolePatterns = /you are|act as|as a|역할|전문가|expert|specialist|assistant/i;
    if (rolePatterns.test(prompt)) {
        structureAnalysis.hasRole = true;
        score += 15;
        strengths.push('역할(Role)이 명확하게 정의되어 있습니다');
    } else {
        weaknesses.push('역할(Role) 정의가 없습니다');
        improvements.push('프롬프트 시작에 "You are an expert..."와 같은 역할 정의를 추가하세요');
    }

    // Context detection
    const contextPatterns = /context|background|given|상황|배경|현재|조건|scenario/i;
    if (contextPatterns.test(prompt) || prompt.length > 100) {
        structureAnalysis.hasContext = true;
        score += 15;
        strengths.push('충분한 맥락(Context) 정보가 제공되었습니다');
    } else {
        weaknesses.push('맥락(Context) 정보가 부족합니다');
        improvements.push('배경 상황, 제약 조건, 현재 상태 등의 맥락을 추가하세요');
    }

    // Task detection
    const taskPatterns = /write|create|generate|analyze|explain|build|design|작성|만들|생성|분석|설명/i;
    if (taskPatterns.test(prompt)) {
        structureAnalysis.hasTask = true;
        score += 15;
        strengths.push('작업(Task) 지시가 명확합니다');
    } else {
        weaknesses.push('구체적인 작업(Task) 지시가 없습니다');
        improvements.push('"~해주세요", "~를 작성하세요"와 같은 명확한 작업 지시를 추가하세요');
    }

    // Format detection
    const formatPatterns = /format|구조|형식|json|markdown|table|list|목록|표|단계/i;
    if (formatPatterns.test(prompt)) {
        structureAnalysis.hasFormat = true;
        score += 10;
        strengths.push('출력 형식(Format)이 지정되어 있습니다');
    } else {
        weaknesses.push('원하는 출력 형식이 명시되지 않았습니다');
        improvements.push('원하는 응답 형식(목록, 표, JSON 등)을 명시하세요');
    }

    // Constraints/examples detection
    const constraintPatterns = /constraint|limit|example|예시|제약|제한|최소|최대|반드시|주의/i;
    if (constraintPatterns.test(prompt)) {
        structureAnalysis.hasConstraints = true;
        score += 10;
        strengths.push('제약조건이나 예시가 포함되어 있습니다');
    } else {
        weaknesses.push('제약조건이나 예시가 없습니다');
        improvements.push('구체적인 예시(few-shot)나 제약조건을 추가하면 품질이 크게 향상됩니다');
    }

    // Length bonus
    if (prompt.length > 200) score += 5;
    if (prompt.length > 500) score += 5;

    score = Math.min(100, Math.max(0, score));

    const grade = score >= 90 ? 'S' : score >= 75 ? 'A' : score >= 60 ? 'B' : score >= 40 ? 'C' : 'D';

    // Generate simple optimized prompt
    let optimizedPrompt = '';
    if (!structureAnalysis.hasRole) {
        optimizedPrompt += 'You are an expert assistant with deep domain knowledge.\n\n';
    }
    if (!structureAnalysis.hasContext) {
        optimizedPrompt += 'Context: Please consider the following background information.\n\n';
    }
    optimizedPrompt += `Task: ${prompt}\n\n`;
    if (!structureAnalysis.hasFormat) {
        optimizedPrompt += 'Please provide a well-structured response with clear sections.\n';
    }
    if (!structureAnalysis.hasConstraints) {
        optimizedPrompt += 'Include practical examples where applicable.\n';
    }

    return {
        success: true,
        mode: 'fallback',
        analysis: {
            qualityScore: score,
            grade,
            structureAnalysis,
            strengths: strengths.length > 0 ? strengths : ['프롬프트가 입력되었습니다'],
            weaknesses: weaknesses.length > 0 ? weaknesses : [],
            improvements: improvements.length > 0 ? improvements : ['현재 프롬프트도 충분히 사용 가능합니다'],
            optimizedPrompt: optimizedPrompt.trim(),
            category: 'general',
            tokenCount: inputTokens,
            estimatedCost: costComparison.cheapest.totalCost,
            costComparison: costComparison.models.slice(0, 4),
        },
        usage: null
    };
}
