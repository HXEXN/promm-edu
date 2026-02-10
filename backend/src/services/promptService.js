import { analyzePromptCost, compareAllModels, calculateAnnualSavings } from './costAnalysisService.js';

// 구조화된 프롬프트를 자연어로 결합
export function buildPrompt(role, context, action) {
    const parts = [];

    if (role) parts.push(`역할: ${role}`);
    if (context) parts.push(`상황: ${context}`);
    if (action) parts.push(`행동: ${action}`);

    return parts.join('\n');
}

// 실시간 토큰 및 비용 분석
export function analyzePrompt(role, context, action) {
    return analyzePromptCost(role, context, action);
}

// Mock LLM API 호출 (실제로는 OpenAI API 사용)
export async function executePrompt(role, context, action, model = 'gpt-4o') {
    const fullPrompt = buildPrompt(role, context, action);
    const costAnalysisResult = analyzePromptCost(role, context, action);

    // 1. Structural Analysis (Smart Check)
    const structureAnalysis = analyzeStructure(role, context, action);

    // 시뮬레이션을 위한 지연
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock 응답 생성 (상황 기반 하드웨어 명령 결정)
    let command = { device: 'none', action: 'OFF', duration: 0 };
    const contextLower = (context || '').toLowerCase();
    const actionLower = (action || '').toLowerCase();

    if (contextLower.includes('건조') || contextLower.includes('습도') ||
        contextLower.includes('dry') || contextLower.includes('humidity') ||
        actionLower.includes('물') || actionLower.includes('water')) {
        command = { device: 'pump', action: 'ON', duration: 10 };
    } else if (contextLower.includes('더위') || contextLower.includes('환기') ||
        contextLower.includes('hot') || contextLower.includes('ventilat') ||
        actionLower.includes('팬') || actionLower.includes('fan')) {
        command = { device: 'fan', action: 'ON', duration: 15 };
    } else if (contextLower.includes('어두') || contextLower.includes('광합성') ||
        contextLower.includes('dark') || contextLower.includes('light') ||
        actionLower.includes('조명') || actionLower.includes('led')) {
        command = { device: 'led', action: 'ON', duration: 30 };
    }

    return {
        success: true,
        model,
        analysis: {
            tokenCount: costAnalysisResult.inputTokens,
            efficiencyScore: costAnalysisResult.efficiencyScore, // Keep cost score
            structureScore: structureAnalysis.score, // New structural score
            feedback: structureAnalysis.feedback,    // New detailed feedback
            status: costAnalysisResult.status,
            costAnalysis: costAnalysisResult.modelComparison,
            recommendation: costAnalysisResult.recommendation
        },
        command,
        message: generateResponseMessage(command)
    };
}

// Helper: Analyze Prompt Structure
function analyzeStructure(role, context, action) {
    let score = 100;
    const feedback = [];

    // Role Check
    if (!role || role.length < 5) {
        score -= 20;
        feedback.push('⚠️ 역할(Role) 정의가 불명확합니다. 구체적인 페르소나를 지정하세요.');
    } else {
        feedback.push('✅ 역할 정의가 훌륭합니다.');
    }

    // Context Check
    if (!context || context.length < 10) {
        score -= 30;
        feedback.push('⚠️ 상황(Context) 설명이 부족합니다. 현재 상태를 더 자세히 묘사하세요.');
    } else {
        feedback.push('✅ 상황 설명이 명확합니다.');
    }

    // Action Check
    if (!action || action.length < 5) {
        score -= 20;
        feedback.push('⚠️ 행동(Action) 지시가 모호합니다. 원하는 결과를 명확히 요청하세요.');
    } else {
        feedback.push('✅ 행동 지시가 구체적입니다.');
    }

    // Integrity Check (Overall cohesion simulation)
    if (score < 60) {
        feedback.push('💡 전체적으로 프롬프트의 완성도가 낮습니다. 3요소를 모두 갖춰보세요.');
    } else if (score >= 90) {
        feedback.push('🏆 완벽한 프롬프트 구조입니다!');
    }

    return { score, feedback };
}

function generateResponseMessage(command) {
    const messages = {
        pump: `펌프를 ${command.duration}초간 작동하여 물을 공급합니다.`,
        fan: `환풍기를 ${command.duration}초간 작동하여 환기를 실시합니다.`,
        led: `LED 조명을 ${command.duration}초간 켜서 광합성을 촉진합니다.`,
        none: '상황 분석 완료. 현재 조치가 필요하지 않습니다.'
    };

    return messages[command.device] || messages.none;
}
