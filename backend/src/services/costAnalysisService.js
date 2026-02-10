// Real AI model pricing data (2026 Feb Latest)
export const MODEL_PRICING = {
    'gpt-5.2': {
        name: 'GPT-5.2 (Garlic)',
        provider: 'OpenAI',
        inputCostPer1M: 2.50,   // $2.50 per 1M tokens
        outputCostPer1M: 10.00, // $10.00 per 1M tokens
        contextWindow: 512000,
        description: '최신 멀티모달 모델, 코딩/로직 최강'
    },
    'gpt-5': {
        name: 'GPT-5',
        provider: 'OpenAI',
        inputCostPer1M: 2.00,
        outputCostPer1M: 8.00,
        contextWindow: 256000,
        description: '범용 최상위 모델'
    },
    'claude-opus-4.6': {
        name: 'Claude Opus 4.6',
        provider: 'Anthropic',
        inputCostPer1M: 15.00,
        outputCostPer1M: 75.00,
        contextWindow: 1000000,
        description: 'Agent Team 지원, 1M 컨텍스트'
    },
    'claude-sonnet-5': {
        name: 'Claude Sonnet 5',
        provider: 'Anthropic',
        inputCostPer1M: 3.00,
        outputCostPer1M: 15.00,
        contextWindow: 500000,
        description: '균형잡힌 성능, 500K 컨텍스트'
    },
    'gemini-3-pro': {
        name: 'Gemini 3 Pro',
        provider: 'Google',
        inputCostPer1M: 1.75,
        outputCostPer1M: 7.00,
        contextWindow: 2000000,
        description: 'Deep Think 모드, 2M 컨텍스트'
    },
    'gemini-3-flash': {
        name: 'Gemini 3 Flash',
        provider: 'Google',
        inputCostPer1M: 0.10,
        outputCostPer1M: 0.40,
        contextWindow: 1000000,
        description: '초저가 고속 모델, 대량 처리에 적합'
    }
};


// Enhanced token counting (more accurate estimation)
export function estimateTokenCount(text) {
    if (!text) return 0;

    // More sophisticated token counting:
    // - Split by whitespace and punctuation
    // - Account for Korean characters (typically 2-3 tokens per character)
    // - Account for English words (typically 1.3 tokens per word)

    const koreanChars = (text.match(/[가-힣]/g) || []).length;
    const englishWords = text.match(/[a-zA-Z]+/g) || [];
    const numbers = text.match(/\d+/g) || [];
    const punctuation = text.match(/[.,!?;:()]/g) || [];

    let tokenCount = 0;

    // Korean characters: ~2.5 tokens per character
    tokenCount += koreanChars * 2.5;

    // English words: ~1.3 tokens per word
    tokenCount += englishWords.length * 1.3;

    // Numbers and punctuation
    tokenCount += numbers.length + punctuation.length * 0.5;

    return Math.ceil(tokenCount);
}

// Calculate cost for a specific model
export function calculateModelCost(inputTokens, outputTokens, modelId) {
    const pricing = MODEL_PRICING[modelId];
    if (!pricing) return null;

    const inputCost = (inputTokens / 1000000) * pricing.inputCostPer1M;
    const outputCost = (outputTokens / 1000000) * pricing.outputCostPer1M;
    const totalCost = inputCost + outputCost;

    return {
        modelId,
        modelName: pricing.name,
        provider: pricing.provider,
        inputTokens,
        outputTokens,
        inputCost,
        outputCost,
        totalCost,
        costPer1000: totalCost * 1000 // Cost per 1000 requests
    };
}

// Compare costs across all models
export function compareAllModels(inputTokens, outputTokens) {
    const comparisons = Object.keys(MODEL_PRICING).map(modelId => {
        return calculateModelCost(inputTokens, outputTokens, modelId);
    });

    // Sort by total cost (cheapest first)
    comparisons.sort((a, b) => a.totalCost - b.totalCost);

    // Calculate savings compared to most expensive
    const mostExpensive = comparisons[comparisons.length - 1];
    comparisons.forEach(model => {
        model.savingsVsMostExpensive = mostExpensive.totalCost - model.totalCost;
        model.savingsPercentage = ((model.savingsVsMostExpensive / mostExpensive.totalCost) * 100);
    });

    return {
        models: comparisons,
        cheapest: comparisons[0],
        mostExpensive,
        maxSavings: mostExpensive.totalCost - comparisons[0].totalCost,
        maxSavingsPercentage: ((mostExpensive.totalCost - comparisons[0].totalCost) / mostExpensive.totalCost * 100)
    };
}

// Recommend best model based on criteria
export function recommendModel(inputTokens, outputTokens, priority = 'cost') {
    const comparison = compareAllModels(inputTokens, outputTokens);

    switch (priority) {
        case 'cost':
            return comparison.cheapest;

        case 'performance':
            // GPT-5.2 for performance
            return comparison.models.find(m => m.modelId === 'gpt-5.2');

        case 'balance':
            // Claude Sonnet 5 for balance
            return comparison.models.find(m => m.modelId === 'claude-sonnet-5');

        case 'context':
            // Gemini 3 Pro for long context
            return comparison.models.find(m => m.modelId === 'gemini-3-pro');

        default:
            return comparison.cheapest;
    }
}

// Calculate annual savings with optimization
export function calculateAnnualSavings(originalTokens, optimizedTokens, requestsPerYear, modelId) {
    const originalCost = calculateModelCost(originalTokens, 50, modelId); // Assume 50 output tokens
    const optimizedCost = calculateModelCost(optimizedTokens, 50, modelId);

    const savingsPerRequest = originalCost.totalCost - optimizedCost.totalCost;
    const annualSavings = savingsPerRequest * requestsPerYear;
    const savingsPercentage = ((savingsPerRequest / originalCost.totalCost) * 100);

    return {
        originalCostPerRequest: originalCost.totalCost,
        optimizedCostPerRequest: optimizedCost.totalCost,
        savingsPerRequest,
        requestsPerYear,
        annualSavings,
        savingsPercentage,
        tokenReduction: originalTokens - optimizedTokens,
        tokenReductionPercentage: ((originalTokens - optimizedTokens) / originalTokens * 100)
    };
}

// Analyze prompt and provide comprehensive cost analysis
export function analyzePromptCost(role, context, action) {
    const fullPrompt = [role, context, action].filter(Boolean).join('\n');
    const inputTokens = estimateTokenCount(fullPrompt);
    const estimatedOutputTokens = 50; // Conservative estimate

    // Get comparison across all models
    const comparison = compareAllModels(inputTokens, estimatedOutputTokens);

    // Calculate efficiency score (inverse of token count)
    const efficiencyScore = Math.max(0, Math.min(100, 100 - (inputTokens / 5)));

    // Determine status
    let status = 'efficient';
    if (inputTokens > 200) status = 'inefficient';
    else if (inputTokens > 100) status = 'moderate';

    return {
        inputTokens,
        estimatedOutputTokens,
        efficiencyScore: Math.round(efficiencyScore),
        status,
        modelComparison: comparison,
        recommendation: recommendModel(inputTokens, estimatedOutputTokens, 'cost')
    };
}
