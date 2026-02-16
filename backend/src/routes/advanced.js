/**
 * PROMM Advanced Technology API Routes
 */

import express from 'express';
import { handleCompression, SemanticTokenCompressor, CompressionLevels } from '../services/semanticCompressor.js';
import { handleQualityScore, MultiDimensionalQualityScorer, DomainWeights } from '../services/qualityScorer.js';
import Advanced2026, { handleAdvanced2026 } from '../services/advanced2026.js';

const router = express.Router();

// POST /api/advanced/compress - Semantic Token Compression
router.post('/compress', handleCompression);

// POST /api/advanced/quality - Multi-Dimensional Quality Scoring
router.post('/quality', handleQualityScore);

// POST /api/advanced/analyze - Combined analysis
router.post('/analyze', async (req, res) => {
    try {
        const { text, domain = 'general', compressionLevel = 'MODERATE', taskType = 'text' } = req.body;

        if (!text || text.trim().length === 0) {
            return res.status(400).json({ error: 'Text is required', code: 'EMPTY_TEXT' });
        }

        const qualityScorer = new MultiDimensionalQualityScorer(domain);
        const originalQuality = qualityScorer.evaluate(text);

        const compressor = new SemanticTokenCompressor('gpt-4o');
        const compression = compressor.compress(text, compressionLevel);

        const compressedQuality = qualityScorer.evaluate(compression.compressed.text);

        const costAnalysis = calculateCostSavings(
            compression.original.tokens,
            compression.compressed.tokens,
            taskType,
            originalQuality.overall.score,
            compressedQuality.overall.score
        );

        // Generate Model Savings for Table
        const modelAnalysisOriginal = analyzeModelOptions(text, originalQuality.overall.score, 'balanced', taskType);
        // We assume optimized text has better quality/fewer retries, so we calculate its cost too
        const modelAnalysisOptimized = analyzeModelOptions(compression.compressed.text, compressedQuality.overall.score, 'balanced', taskType);

        const modelSavings = {};
        modelAnalysisOriginal.forEach((originalModel, index) => {
            const optimizedModel = modelAnalysisOptimized.find(m => m.id === originalModel.id) || modelAnalysisOptimized[index];
            const originalCost = parseFloat(originalModel.estimatedCost.total);
            const optimizedCost = parseFloat(optimizedModel.estimatedCost.total); // This will be lower for Image/Video due to fewer retries
            const annualSavings = (originalCost - optimizedCost) * 1000 * 12; // 1k/mo assumption base

            modelSavings[originalModel.id] = {
                modelName: originalModel.name,
                provider: 'AI Provider',
                originalCostPerRequest: originalCost,
                optimizedCostPerRequest: optimizedCost,
                savingsPercentage: originalCost > 0 ? ((originalCost - optimizedCost) / originalCost) * 100 : 0,
                annualSavings: annualSavings
            };
        });

        res.json({
            success: true,
            data: {
                original: { text, tokens: compression.original.tokens, quality: originalQuality },
                optimized: { text: compression.compressed.text, tokens: compression.compressed.tokens, quality: compressedQuality },
                compression: compression.metrics,
                costSavings: costAnalysis,
                modelSavings: modelSavings, // Added for Frontend Table
                recommendations: generateCombinedRecommendations(originalQuality, compression.metrics)
            },
            metadata: { algorithms: ['PROMM-STC-v1.0', 'PROMM-MDQS-v1.0'], timestamp: new Date().toISOString() }
        });

    } catch (error) {
        console.error('Analysis error:', error);
        res.status(500).json({ error: 'Analysis failed', message: error.message });
    }
});

// POST /api/advanced/optimize - Real-time Cost-Quality Optimization
router.post('/optimize', async (req, res) => {
    try {
        const { text, budget = 100, minQuality = 80, priority = 'balanced', taskType = 'text' } = req.body;

        if (!text || text.trim().length === 0) {
            return res.status(400).json({ error: 'Text is required', code: 'EMPTY_TEXT' });
        }

        const qualityScorer = new MultiDimensionalQualityScorer('general');
        const quality = qualityScorer.evaluate(text);

        const modelAnalysis = analyzeModelOptions(text, quality.overall.score, priority, taskType);
        const optimalStrategy = determineOptimalStrategy(modelAnalysis, budget, minQuality, priority, Infinity, taskType);

        res.json({
            success: true,
            data: {
                currentQuality: quality.overall,
                modelComparison: modelAnalysis,
                recommendation: optimalStrategy,
                potentialSavings: calculatePotentialSavings(modelAnalysis, optimalStrategy)
            },
            metadata: { algorithm: 'PROMM-RCQO-v1.0', timestamp: new Date().toISOString() }
        });

    } catch (error) {
        console.error('Optimization error:', error);
        res.status(500).json({ error: 'Optimization failed', message: error.message });
    }
});

// ============================================
// 2026 ADVANCED TECHNOLOGY ENDPOINTS
// ============================================

// POST /api/advanced/2026 - Unified 2026 technology handler
router.post('/2026', handleAdvanced2026);

// POST /api/advanced/context-engineering - Context Engineering
router.post('/context-engineering', async (req, res) => {
    try {
        const { text, contexts = [] } = req.body;
        const engine = new Advanced2026.ContextEngineeringEngine();
        const result = await engine.loadJITContext(text, contexts);
        res.json({ success: true, data: result, technology: 'Context Engineering 2025' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/advanced/prompt-caching - Prompt Caching Analysis
router.post('/prompt-caching', async (req, res) => {
    try {
        const { text } = req.body;
        const system = new Advanced2026.PromptCachingSystem();
        const result = system.structureForCaching(text);
        res.json({ success: true, data: result, technology: 'Prompt Caching 2025' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/advanced/agentic - Agentic Reasoning
router.post('/agentic', async (req, res) => {
    try {
        const { task, tools = [] } = req.body;
        const framework = new Advanced2026.AgenticReasoningFramework();
        const result = await framework.executeReActPlus(task, tools);
        res.json({ success: true, data: result, technology: 'ReAct+ Agentic Framework 2026' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/advanced/structured-output - Structured Output Enforcement
router.post('/structured-output', async (req, res) => {
    try {
        const { text, schema } = req.body;
        const enforcer = new Advanced2026.StructuredOutputEnforcer();
        const result = enforcer.enforceSchema(text, schema || {
            type: 'object',
            properties: { result: { type: 'string' } },
            required: ['result']
        });
        res.json({ success: true, data: result, technology: 'Structured Output 2025' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/advanced/evolve - Self-Evolving Prompt
router.post('/evolve', async (req, res) => {
    try {
        const { text, feedback, options } = req.body;
        const system = new Advanced2026.SelfEvolvingPromptSystem();
        const result = system.evolvePrompt(text, feedback || {
            clarityScore: 60,
            specificityScore: 60,
            tokenEfficiency: 60,
            outputQuality: 60
        }, options || {}); // Pass constraints and mode
        res.json({ success: true, data: result, technology: 'Self-Evolving Prompts 2026' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


function calculateCostSavings(originalTokens, compressedTokens, taskType = 'text', originalQuality = 0, optimizedQuality = 0) {

    // 1. Image/Video Logic: Retry Reduction
    if (taskType === 'image' || taskType === 'video') {
        // Quality improvement leads to fewer retries
        // e.g., Quality 60 -> 4 retries. Quality 90 -> 1 retry.
        const origRetries = Math.max(1, Math.ceil((100 - originalQuality) / 15));
        const optRetries = Math.max(1, Math.ceil((100 - optimizedQuality) / 15));
        const retriesSaved = Math.max(0, origRetries - optRetries);

        // Base cost (approx DALL-E 3 or Video sec)
        const unitCost = taskType === 'image' ? 0.040 : 1.00; // $0.04 image, $1.00 video session
        const moneySavedPerUnit = (retriesSaved * unitCost).toFixed(4);
        const percentage = origRetries > 0 ? ((retriesSaved / origRetries) * 100).toFixed(1) : 0;

        const annualSavings = (parseFloat(moneySavedPerUnit) * 1000 * 12).toFixed(2); // 1k req/mo

        return {
            tokensSaved: 0, // Not relevant
            percentage: percentage,
            moneySaved: moneySavedPerUnit,
            projectedAnnualSavings: annualSavings,
            roiScore: Math.min(100, Math.round(percentage * 1.5)),
            estimatedLatencyReduction: percentage // Fewer retries = faster total time
        };
    }

    // 2. Text/Code Logic: Token Reduction
    // Pricing (per 1M tokens) - Average Blended (Input/Output mix assumption)
    const AVG_PRICE_PER_1M = 15.00; // $15 per 1M tokens (approx GPT-4o blended)

    const saved = originalTokens - compressedTokens;
    const percentage = ((saved / originalTokens) * 100).toFixed(1);

    // Estimate output savings (Multiplier: 3x)
    // Assumption: Better prompts lead to 20-30% shorter, more direct answers
    const estimatedOutputSavings = Math.round(saved * 3.5);
    const totalEcoSystemSavings = saved + estimatedOutputSavings;

    return {
        tokensSaved: saved,
        percentage: percentage,
        moneySaved: ((saved / 1000000) * AVG_PRICE_PER_1M).toFixed(4),
        projectedAnnualSavings: ((totalEcoSystemSavings * 1000 * 12) / 1000000 * AVG_PRICE_PER_1M).toFixed(2),
        roiScore: Math.min(100, Math.round(percentage * 2.5)),
        estimatedLatencyReduction: percentage // Assumes roughly linear correlation
    };
}

function analyzeModelOptions(text, qualityScore, priority, type = 'text') {
    // 1. Image Generation Analysis
    if (type === 'image') {
        const models = [
            { id: 'dall-e-3', name: 'DALL-E 3 (HD)', costPerUnit: 0.080, quality: 95, speed: 85 },
            { id: 'dall-e-3-std', name: 'DALL-E 3 (Standard)', costPerUnit: 0.040, quality: 90, speed: 92 },
            { id: 'midjourney-v6', name: 'Midjourney v6', costPerUnit: 0.050, quality: 98, speed: 80 }, // Est. amortized
            { id: 'stable-diffusion-xl', name: 'SDXL (API)', costPerUnit: 0.004, quality: 85, speed: 98 }
        ];

        return models.map(model => {
            // Retry Rate Logic: Lower quality prompt = More retries
            // Quality 100 = 1 try. Quality 50 = 4 tries.
            const estimatedRetries = Math.max(1, Math.ceil((100 - qualityScore) / 15));
            const totalCost = (model.costPerUnit * estimatedRetries).toFixed(4);
            const monthly1000 = (parseFloat(totalCost) * 1000).toFixed(2);

            return {
                id: model.id,
                name: model.name,
                estimatedCost: { total: totalCost, monthly1000: `$${monthly1000}` },
                expectedQuality: model.quality,
                efficiencyScore: (model.quality / parseFloat(totalCost) / 100).toFixed(1),
                speed: model.speed,
                meta: { retries: estimatedRetries }
            };
        });
    }

    // 2. Video Generation Analysis
    if (type === 'video') {
        const models = [
            { id: 'sora-1.0', name: 'Sora (1.0)', costPerSec: 0.50, quality: 99, speed: 60 },
            { id: 'runway-gen-3', name: 'Runway Gen-3', costPerSec: 0.25, quality: 95, speed: 70 },
            { id: 'pika-labs', name: 'Pika 1.0', costPerSec: 0.15, quality: 90, speed: 80 }
        ];

        return models.map(model => {
            // Video length assumption: 4 seconds
            const VIDEO_LEN = 4;
            // Retry logic similar to image but more expensive
            const estimatedRetries = Math.max(1, Math.ceil((100 - qualityScore) / 12));
            const totalCost = (model.costPerSec * VIDEO_LEN * estimatedRetries).toFixed(2);
            const monthly100 = (parseFloat(totalCost) * 100).toFixed(2); // Video is lower volume

            return {
                id: model.id,
                name: model.name,
                estimatedCost: { total: totalCost, monthly1000: `$${monthly100}` }, // Label hack for frontend compatibility
                expectedQuality: model.quality,
                efficiencyScore: (model.quality / parseFloat(totalCost)).toFixed(1),
                speed: model.speed,
                meta: { retries: estimatedRetries }
            };
        });
    }

    // 3. Text & Code Analysis
    const inputTokens = Math.ceil(text.length / 4);

    // Output multiplier: Code is verbose (5x), Text is standard (2x)
    const outputMultiplier = type === 'code' ? 5 : 2;
    const estimatedOutputTokens = inputTokens * outputMultiplier;

    const models = [
        { id: 'gpt-4o', name: 'GPT-4o', input: 5.00, output: 15.00, quality: 98, speed: 90 },
        { id: 'gpt-4o-mini', name: 'GPT-4o Mini', input: 0.15, output: 0.60, quality: 82, speed: 98 },
        { id: 'claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', input: 3.00, output: 15.00, quality: 99, speed: 85 },
        { id: 'claude-3-haiku', name: 'Claude 3 Haiku', input: 0.25, output: 1.25, quality: 78, speed: 99 },
        { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', input: 3.50, output: 10.50, quality: 96, speed: 88 }
    ];

    return models.map(model => {
        const cost = ((inputTokens / 1000000 * model.input) + (estimatedOutputTokens / 1000000 * model.output)).toFixed(6);
        const monthly1000 = (parseFloat(cost) * 1000).toFixed(2);
        const adjustedQuality = Math.min(model.quality, model.quality * (qualityScore / 100));
        const efficiency = (adjustedQuality / Math.max(0.01, parseFloat(monthly1000))).toFixed(1);

        return {
            id: model.id,
            name: model.name,
            estimatedCost: { total: cost, monthly1000: `$${monthly1000}` },
            expectedQuality: adjustedQuality.toFixed(1),
            efficiencyScore: efficiency,
            speed: model.speed
        };
    });
}


function determineOptimalStrategy(modelAnalysis, budget, minQuality, priority, maxTokens = Infinity, taskType = 'text') {
    let recommended;

    switch (priority) {
        case 'cost': // Efficient Mode
            recommended = modelAnalysis.filter(m => parseFloat(m.expectedQuality) >= minQuality)
                .sort((a, b) => parseFloat(a.estimatedCost.total) - parseFloat(b.estimatedCost.total))[0];
            break;
        case 'quality': // Quality Mode
            recommended = modelAnalysis.sort((a, b) => parseFloat(b.expectedQuality) - parseFloat(a.expectedQuality))[0];
            break;
        case 'balanced':
        default:
            recommended = modelAnalysis.filter(m => parseFloat(m.expectedQuality) >= minQuality)
                .sort((a, b) => parseFloat(b.efficiencyScore) - parseFloat(a.efficiencyScore))[0];
    }

    if (!recommended) recommended = modelAnalysis[0];
    recommended.recommended = true;

    const reasons = {
        'gpt-4o-mini': '비용 효율성이 가장 높습니다. GPT-4o 대비 94% 비용 절감이 가능합니다.',
        'gpt-4o': '최고 수준의 품질이 필요한 복잡한 작업에 적합합니다.',
        'claude-3.5-sonnet': '창의적 글쓰기와 코드 생성에 탁월합니다.'
    };

    // Determine optimization settings based on priority
    let optimizationSettings;
    if (priority === 'cost') {
        optimizationSettings = {
            recommended: true,
            level: 'AGGRESSIVE',
            mode: 'efficiency',
            maxTokens: maxTokens !== Infinity ? maxTokens : 500, // Default tight limit
            reason: '비용 최적화를 위해 공격적 압축 및 구조 단순화 적용'
        };
    } else if (priority === 'quality') {
        optimizationSettings = {
            recommended: true,
            level: 'LIGHT',
            mode: 'quality',
            maxTokens: maxTokens,
            reason: '품질 극대화를 위해 구조적 강화 및 의미 보존 중심'
        };
    } else {
        optimizationSettings = {
            recommended: true,
            level: 'MODERATE',
            mode: 'balanced',
            maxTokens: maxTokens !== Infinity ? maxTokens : 1000,
            reason: '균형 잡힌 성능을 위해 적절한 압축과 구조 개선 병행'
        };
    }

    return {
        model: recommended.id,
        modelName: recommended.name,
        reason: reasons[recommended.id] || '균형 잡힌 성능을 제공합니다.',
        compression: recommended.id !== 'gpt-4o-mini' ?
            optimizationSettings :
            { ...optimizationSettings, reason: '이미 저비용 모델이지만 추가 최적화 가능' },
        estimatedMonthlyCost: recommended.estimatedCost.monthly1000,
        expectedQuality: recommended.expectedQuality
    };
}

function calculatePotentialSavings(modelAnalysis, strategy) {
    const highest = modelAnalysis.reduce((max, m) => parseFloat(m.estimatedCost.total) > parseFloat(max.estimatedCost.total) ? m : max);
    const recommended = modelAnalysis.find(m => m.id === strategy.model);
    const savingsPerCall = parseFloat(highest.estimatedCost.total) - parseFloat(recommended.estimatedCost.total);

    return {
        perCallSavings: savingsPerCall.toFixed(6),
        monthly1000Calls: (savingsPerCall * 1000).toFixed(2),
        monthly10000Calls: (savingsPerCall * 10000).toFixed(2),
        percentageSaved: ((savingsPerCall / parseFloat(highest.estimatedCost.total)) * 100).toFixed(1)
    };
}

function generateCombinedRecommendations(quality, compression) {
    const recommendations = [];

    if (quality.overall.score < 70) {
        recommendations.push({
            type: 'quality', priority: 'high',
            message: '프롬프트 품질 개선이 필요합니다.',
            actions: quality.recommendations.slice(0, 2)
        });
    }

    if (compression.compressionRatio > 30) {
        recommendations.push({
            type: 'efficiency', priority: 'medium',
            message: `${compression.compressionRatio.toFixed(1)}% 토큰 절감이 가능합니다.`,
            tokensSaved: compression.tokensSaved
        });
    }

    if (!compression.qualityPreserved) {
        recommendations.push({
            type: 'warning', priority: 'high',
            message: '압축으로 인해 품질 손실이 발생할 수 있습니다. MODERATE 레벨 사용을 권장합니다.'
        });
    }

    return recommendations;
}

export default router;
