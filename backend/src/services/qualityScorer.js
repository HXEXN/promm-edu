/**
 * PROMM Multi-Dimensional Quality Scoring (MDQS) System
 * 
 * Patent-Pending Technology: "다차원 프롬프트 품질 평가 및 개선 추천 시스템"
 */

/**
 * 도메인별 가중치 프리셋
 */
export const DomainWeights = {
    coding: {
        clarity: 0.15, specificity: 0.20, structure: 0.20, completeness: 0.15,
        efficiency: 0.10, actionability: 0.15, domainFit: 0.05
    },
    creative: {
        clarity: 0.20, specificity: 0.10, structure: 0.10, completeness: 0.15,
        efficiency: 0.05, actionability: 0.20, domainFit: 0.20
    },
    business: {
        clarity: 0.15, specificity: 0.15, structure: 0.20, completeness: 0.20,
        efficiency: 0.10, actionability: 0.15, domainFit: 0.05
    },
    education: {
        clarity: 0.25, specificity: 0.15, structure: 0.15, completeness: 0.15,
        efficiency: 0.05, actionability: 0.15, domainFit: 0.10
    },
    general: {
        clarity: 0.20, specificity: 0.15, structure: 0.15, completeness: 0.15,
        efficiency: 0.10, actionability: 0.15, domainFit: 0.10
    }
};

/**
 * 각 차원별 평가 규칙
 */
const EvaluationRules = {
    clarity: {
        positivePatterns: [
            { pattern: /^you are/i, points: 10, label: 'Clear role definition' },
            { pattern: /\b(specifically|exactly|precisely)\b/i, points: 5, label: 'Precision words' },
            { pattern: /\b(must|should|need to)\b/i, points: 5, label: 'Clear requirements' }
        ],
        negativePatterns: [
            { pattern: /\b(maybe|perhaps|possibly|might)\b/i, points: -5, label: 'Ambiguous hedging' },
            { pattern: /\b(stuff|things|something|whatever)\b/i, points: -8, label: 'Vague terms' },
            { pattern: /\b(etc|and so on|and more)\b/i, points: -5, label: 'Incomplete listing' }
        ],
        baseScore: 50
    },
    specificity: {
        positivePatterns: [
            { pattern: /\b\d+\s*(words?|characters?|lines?|sentences?)\b/i, points: 15, label: 'Quantified output' },
            { pattern: /\b(example|for instance|such as)\b/i, points: 10, label: 'Examples provided' },
            { pattern: /\b(between|range|from\s+\d+\s+to\s+\d+)\b/i, points: 10, label: 'Specific ranges' },
            { pattern: /```[\s\S]*?```/g, points: 15, label: 'Code examples' }
        ],
        negativePatterns: [
            { pattern: /\b(some|a few|several|many)\b/i, points: -5, label: 'Vague quantities' },
            { pattern: /\b(good|nice|better|best|great)\b/i, points: -3, label: 'Subjective quality' }
        ],
        baseScore: 40
    },
    structure: {
        positivePatterns: [
            { pattern: /\n\d+\.\s/g, points: 15, label: 'Numbered list' },
            { pattern: /\n[-•]\s/g, points: 10, label: 'Bullet points' },
            { pattern: /#{1,6}\s/g, points: 10, label: 'Headers' },
            { pattern: /\*\*[^*]+\*\*/g, points: 5, label: 'Bold emphasis' },
            { pattern: /context:|background:|task:|output:|format:/i, points: 15, label: 'Section labels' }
        ],
        negativePatterns: [
            { pattern: /^[^\n]{500,}$/m, points: -15, label: 'Wall of text' },
            { pattern: /([.!?])\s*\1/g, points: -5, label: 'Repeated punctuation' }
        ],
        baseScore: 45
    },
    completeness: {
        positivePatterns: [
            { pattern: /you are|act as|role/i, points: 15, label: 'Role defined' },
            { pattern: /context|background|given/i, points: 15, label: 'Context provided' },
            { pattern: /task|goal|objective|purpose/i, points: 15, label: 'Task stated' },
            { pattern: /format|structure|output/i, points: 10, label: 'Format specified' },
            { pattern: /constraint|requirement|rule|must not/i, points: 10, label: 'Constraints listed' }
        ],
        negativePatterns: [],
        baseScore: 25
    },
    efficiency: {
        checkTokenEfficiency: true,
        optimalTokenRange: { min: 50, max: 500 },
        penaltyPerExtraToken: 0.05,
        positivePatterns: [],
        negativePatterns: [
            { pattern: /\b(please|kindly|would you|could you)\b/i, points: -3, label: 'Unnecessary politeness' },
            { pattern: /\b(very|really|extremely|absolutely)\b/i, points: -2, label: 'Excessive intensifiers' }
        ],
        baseScore: 70
    },
    actionability: {
        positivePatterns: [
            { pattern: /\b(write|create|generate|analyze|summarize|explain|describe)\b/i, points: 15, label: 'Action verb' },
            { pattern: /\b(first|then|next|finally|step\s+\d+)\b/i, points: 10, label: 'Sequenced actions' },
            { pattern: /\b(provide|include|ensure|make sure)\b/i, points: 8, label: 'Clear deliverables' }
        ],
        negativePatterns: [
            { pattern: /\?$/m, points: -5, label: 'Ends with question' }
        ],
        baseScore: 45
    },
    domainFit: {
        domains: {
            coding: [/\b(code|function|class|variable|algorithm|debug|refactor|api|database)\b/i],
            creative: [/\b(story|poem|creative|imaginative|artistic|narrative|character)\b/i],
            business: [/\b(business|market|strategy|roi|revenue|customer|sales|marketing)\b/i],
            education: [/\b(teach|learn|explain|student|lesson|curriculum|educational)\b/i],
            analysis: [/\b(analyze|data|statistics|trend|insight|research|evaluate)\b/i]
        },
        baseScore: 50
    }
};

/**
 * 개선 추천 생성 규칙
 */
export const ImprovementSuggestions = {
    clarity: {
        low: [
            'Add a clear role definition at the beginning (e.g., "You are an expert...")',
            'Replace vague terms like "stuff" or "things" with specific nouns',
            'Use definitive language instead of "maybe" or "possibly"'
        ],
        medium: ['Consider adding more precision words like "exactly" or "specifically"']
    },
    specificity: {
        low: [
            'Add specific numbers for output length (e.g., "500 words")',
            'Include concrete examples of desired output'
        ],
        medium: ['Consider adding sample inputs and outputs']
    },
    structure: {
        low: [
            'Break the prompt into labeled sections (Role, Context, Task, Format)',
            'Use numbered lists for sequential instructions'
        ],
        medium: ['Consider using headers or bold text for key sections']
    },
    completeness: {
        low: [
            'Add a role definition (who should the AI be?)',
            'Include context or background information',
            'Specify the desired output format'
        ],
        medium: ['Consider adding examples of expected output']
    },
    efficiency: {
        low: [
            'Remove polite phrases like "please" or "would you"',
            'Eliminate filler words and redundant expressions'
        ],
        medium: ['Consider more concise phrasing for long sentences']
    },
    actionability: {
        low: [
            'Start with a clear action verb (write, create, analyze, etc.)',
            'Specify the exact deliverable expected'
        ],
        medium: ['Consider sequencing multiple tasks with "first", "then", "finally"']
    },
    domainFit: {
        low: ['Include domain-specific terminology'],
        medium: ['Consider adding domain-specific constraints']
    }
};

/**
 * 메인 MDQS 클래스
 */
export class MultiDimensionalQualityScorer {
    constructor(domain = 'general') {
        this.domain = domain;
        this.weights = DomainWeights[domain] || DomainWeights.general;
    }

    evaluateDimension(text, dimension) {
        const rules = EvaluationRules[dimension];
        if (!rules) return { score: 0, details: [] };

        let score = rules.baseScore;
        const details = [];

        if (rules.positivePatterns) {
            rules.positivePatterns.forEach(rule => {
                const matches = text.match(rule.pattern);
                if (matches) {
                    const points = rule.points * Math.min(matches.length, 3);
                    score += points;
                    details.push({ type: 'positive', label: rule.label, points, count: matches.length });
                }
            });
        }

        if (rules.negativePatterns) {
            rules.negativePatterns.forEach(rule => {
                const matches = text.match(rule.pattern);
                if (matches) {
                    const points = rule.points * Math.min(matches.length, 3);
                    score += points;
                    details.push({ type: 'negative', label: rule.label, points, count: matches.length });
                }
            });
        }

        if (dimension === 'efficiency' && rules.checkTokenEfficiency) {
            const wordCount = text.split(/\s+/).length;
            if (wordCount > rules.optimalTokenRange.max) {
                const excess = wordCount - rules.optimalTokenRange.max;
                const penalty = Math.min(excess * rules.penaltyPerExtraToken, 30);
                score -= penalty;
                details.push({ type: 'negative', label: `Exceeds optimal length by ${excess} words`, points: -penalty });
            }
        }

        if (dimension === 'domainFit') {
            const detectedDomains = [];
            Object.entries(rules.domains).forEach(([dom, patterns]) => {
                patterns.forEach(pattern => {
                    if (pattern.test(text)) detectedDomains.push(dom);
                });
            });

            if (detectedDomains.length > 0) {
                score += 20;
                details.push({ type: 'positive', label: `Detected domains: ${detectedDomains.join(', ')}`, points: 20 });
            }

            if (detectedDomains.includes(this.domain)) {
                score += 15;
                details.push({ type: 'positive', label: 'Matches target domain', points: 15 });
            }
        }

        return { score: Math.max(0, Math.min(100, score)), details };
    }

    evaluate(text) {
        const dimensions = ['clarity', 'specificity', 'structure', 'completeness',
            'efficiency', 'actionability', 'domainFit'];

        const results = {};
        let weightedTotal = 0;
        let totalWeight = 0;

        dimensions.forEach(dim => {
            const evaluation = this.evaluateDimension(text, dim);
            results[dim] = {
                score: evaluation.score,
                weight: this.weights[dim],
                weightedScore: evaluation.score * this.weights[dim],
                details: evaluation.details,
                level: this.getLevel(evaluation.score)
            };

            weightedTotal += results[dim].weightedScore;
            totalWeight += this.weights[dim];
        });

        const overallScore = Math.round(weightedTotal / totalWeight);

        return {
            overall: { score: overallScore, grade: this.getGrade(overallScore), level: this.getLevel(overallScore) },
            dimensions: results,
            recommendations: this.generateRecommendations(results),
            radarData: this.formatForRadar(results),
            metadata: { domain: this.domain, weights: this.weights, algorithm: 'PROMM-MDQS-v1.0', timestamp: new Date().toISOString() }
        };
    }

    getLevel(score) {
        if (score >= 80) return 'high';
        if (score >= 50) return 'medium';
        return 'low';
    }

    getGrade(score) {
        if (score >= 95) return 'A+';
        if (score >= 90) return 'A';
        if (score >= 85) return 'A-';
        if (score >= 80) return 'B+';
        if (score >= 75) return 'B';
        if (score >= 70) return 'B-';
        if (score >= 65) return 'C+';
        if (score >= 60) return 'C';
        if (score >= 55) return 'C-';
        if (score >= 50) return 'D';
        return 'F';
    }

    generateRecommendations(results) {
        const recommendations = [];
        const sorted = Object.entries(results).sort((a, b) => a[1].score - b[1].score);

        sorted.slice(0, 3).forEach(([dim, data]) => {
            const suggestions = ImprovementSuggestions[dim];
            if (suggestions) {
                const level = data.level;
                const relevantSuggestions = [
                    ...(suggestions[level] || []),
                    ...(level === 'low' ? (suggestions['medium'] || []) : [])
                ];

                recommendations.push({
                    dimension: dim,
                    score: data.score,
                    priority: sorted.findIndex(s => s[0] === dim) + 1,
                    suggestions: relevantSuggestions.slice(0, 3)
                });
            }
        });

        return recommendations;
    }

    formatForRadar(results) {
        const names = {
            clarity: '명확성', specificity: '구체성', structure: '구조성',
            completeness: '완전성', efficiency: '효율성', actionability: '실행가능성', domainFit: '도메인 적합성'
        };

        return Object.entries(results).map(([dim, data]) => ({
            dimension: dim,
            displayName: names[dim] || dim,
            score: data.score,
            fullMark: 100
        }));
    }
}

export async function handleQualityScore(req, res) {
    try {
        const { text, domain = 'general' } = req.body;

        if (!text || text.trim().length === 0) {
            return res.status(400).json({ error: 'Text is required', code: 'EMPTY_TEXT' });
        }

        const scorer = new MultiDimensionalQualityScorer(domain);
        const result = scorer.evaluate(text);

        res.json({ success: true, data: result });

    } catch (error) {
        console.error('Quality scoring error:', error);
        res.status(500).json({ error: 'Quality scoring failed', message: error.message });
    }
}
