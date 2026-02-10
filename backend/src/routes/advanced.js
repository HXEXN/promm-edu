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
        const { text, domain = 'general', compressionLevel = 'MODERATE' } = req.body;

        if (!text || text.trim().length === 0) {
            return res.status(400).json({ error: 'Text is required', code: 'EMPTY_TEXT' });
        }

        const qualityScorer = new MultiDimensionalQualityScorer(domain);
        const originalQuality = qualityScorer.evaluate(text);

        const compressor = new SemanticTokenCompressor('gpt-4o');
        const compression = compressor.compress(text, compressionLevel);

        const compressedQuality = qualityScorer.evaluate(compression.compressed.text);

        const costAnalysis = calculateCostSavings(compression.original.tokens, compression.compressed.tokens);

        res.json({
            success: true,
            data: {
                original: { text, tokens: compression.original.tokens, quality: originalQuality },
                optimized: { text: compression.compressed.text, tokens: compression.compressed.tokens, quality: compressedQuality },
                compression: compression.metrics,
                costSavings: costAnalysis,
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
        const { text, budget = 100, minQuality = 80, priority = 'balanced' } = req.body;

        if (!text || text.trim().length === 0) {
            return res.status(400).json({ error: 'Text is required', code: 'EMPTY_TEXT' });
        }

        const qualityScorer = new MultiDimensionalQualityScorer('general');
        const quality = qualityScorer.evaluate(text);

        const modelAnalysis = analyzeModelOptions(text, quality.overall.score, priority);
        const optimalStrategy = determineOptimalStrategy(modelAnalysis, budget, minQuality, priority);

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
        const { text, feedback } = req.body;
        const system = new Advanced2026.SelfEvolvingPromptSystem();
        const result = system.evolvePrompt(text, feedback || {
            clarityScore: 60,
            specificityScore: 60,
            tokenEfficiency: 60,
            outputQuality: 60
        });
        res.json({ success: true, data: result, technology: 'Self-Evolving Prompts 2026' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/advanced/config - Updated config with 2026 technologies
router.get('/config', (req, res) => {
    res.json({
        compressionLevels: Object.keys(CompressionLevels),
        domains: Object.keys(DomainWeights),
        models: [
            // OpenAI - 2026 Feb Latest
            { id: 'gpt-5.2', name: 'GPT-5.2 (Garlic)', inputCost: 2.5, outputCost: 10.0, context: '512K', isNew: true },
            { id: 'gpt-5', name: 'GPT-5', inputCost: 2.0, outputCost: 8.0, context: '256K' },
            { id: 'o3', name: 'o3 Reasoning', inputCost: 12.0, outputCost: 48.0, context: '256K', isNew: true },
            { id: 'o1', name: 'o1 Reasoning', inputCost: 15, outputCost: 60, context: '200K' },
            // Anthropic - Claude Opus 4.6 (Released Feb 5, 2026)
            { id: 'claude-opus-4.6', name: 'Claude Opus 4.6', inputCost: 15, outputCost: 75, context: '1M', isNew: true },
            { id: 'claude-opus-4.5', name: 'Claude Opus 4.5', inputCost: 12, outputCost: 60, context: '1M' },
            { id: 'claude-sonnet-5', name: 'Claude Sonnet 5', inputCost: 3, outputCost: 15, context: '500K', isNew: true },
            // Google - Gemini 3 (Released Nov 2025)
            { id: 'gemini-3-pro', name: 'Gemini 3 Pro', inputCost: 1.75, outputCost: 7.0, context: '2M', isNew: true },
            { id: 'gemini-3-flash', name: 'Gemini 3 Flash', inputCost: 0.1, outputCost: 0.4, context: '1M', isNew: true }
        ],
        technologies2026: [
            { id: 'context-engineering', name: 'Context Engineering', description: 'JIT context loading and attention budget optimization' },
            { id: 'prompt-caching', name: 'Prompt Caching', description: 'Up to 50% cost reduction and 85% latency improvement' },
            { id: 'agentic-reasoning', name: 'Agentic Reasoning', description: 'ReAct+ with self-critique and multi-agent coordination' },
            { id: 'structured-output', name: 'Structured Output', description: 'JSON Schema enforcement for reliable outputs' },
            { id: 'self-evolving', name: 'Self-Evolving Prompts', description: 'Meta-prompting and automatic prompt improvement' }
        ],
        version: '3.0.0-2026-feb',
        lastUpdated: '2026-02-06'
    });
});


// Helper Functions
function calculateCostSavings(originalTokens, compressedTokens) {
    const models = {
        'gpt-4o': { input: 2.5, output: 10 },
        'gpt-4o-mini': { input: 0.15, output: 0.6 },
        'claude-3.5-sonnet': { input: 3, output: 15 }
    };

    const savings = {};

    Object.entries(models).forEach(([model, costs]) => {
        const originalCost = (originalTokens * costs.input) / 1000000;
        const compressedCost = (compressedTokens * costs.input) / 1000000;
        const savedPerCall = originalCost - compressedCost;

        savings[model] = {
            originalCostPerCall: originalCost.toFixed(6),
            compressedCostPerCall: compressedCost.toFixed(6),
            savedPerCall: savedPerCall.toFixed(6),
            savedPercentage: ((savedPerCall / originalCost) * 100).toFixed(1),
            monthly1000Calls: (savedPerCall * 1000).toFixed(2),
            monthly10000Calls: (savedPerCall * 10000).toFixed(2)
        };
    });

    return savings;
}

function analyzeModelOptions(text, qualityScore, priority) {
    const wordCount = text.split(/\s+/).length;
    const estimatedTokens = Math.ceil(wordCount * 1.3);

    const models = [
        { id: 'gpt-4o-mini', name: 'GPT-4o Mini', costPer1M: { input: 0.15, output: 0.6 }, qualityMultiplier: 0.92, speedMultiplier: 1.5, bestFor: ['simple', 'high-volume'] },
        { id: 'gpt-4o', name: 'GPT-4o', costPer1M: { input: 2.5, output: 10 }, qualityMultiplier: 1.0, speedMultiplier: 1.0, bestFor: ['complex', 'nuanced'] },
        { id: 'claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', costPer1M: { input: 3, output: 15 }, qualityMultiplier: 0.98, speedMultiplier: 0.9, bestFor: ['creative', 'code'] }
    ];

    return models.map(model => {
        const inputCost = (estimatedTokens * model.costPer1M.input) / 1000000;
        const outputCost = (estimatedTokens * 2 * model.costPer1M.output) / 1000000;
        const totalCost = inputCost + outputCost;
        const expectedQuality = Math.min(100, qualityScore * model.qualityMultiplier);
        const efficiencyScore = (expectedQuality / (totalCost * 10000)) || 0;

        return {
            ...model,
            estimatedCost: { input: inputCost.toFixed(6), output: outputCost.toFixed(6), total: totalCost.toFixed(6), monthly1000: (totalCost * 1000).toFixed(2) },
            expectedQuality: expectedQuality.toFixed(1),
            efficiencyScore: efficiencyScore.toFixed(2),
            recommended: false
        };
    });
}

function determineOptimalStrategy(modelAnalysis, budget, minQuality, priority) {
    let recommended;

    switch (priority) {
        case 'cost':
            recommended = modelAnalysis.filter(m => parseFloat(m.expectedQuality) >= minQuality)
                .sort((a, b) => parseFloat(a.estimatedCost.total) - parseFloat(b.estimatedCost.total))[0];
            break;
        case 'quality':
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

    return {
        model: recommended.id,
        modelName: recommended.name,
        reason: reasons[recommended.id] || '균형 잡힌 성능을 제공합니다.',
        compression: recommended.id !== 'gpt-4o-mini' ? { recommended: true, level: 'MODERATE', reason: '고비용 모델이므로 토큰 압축으로 비용 절감 가능' } : { recommended: false, reason: '이미 저비용 모델 사용' },
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
