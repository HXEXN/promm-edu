/**
 * PROMM Semantic Token Compression (STC) Engine
 * 
 * Patent-Pending Technology: "의미 보존 기반 토큰 압축 및 재구성 시스템"
 * 
 * Based on research:
 * - Semantic Compression (Zhou et al., 2024)
 * - Prompt Compression via Knowledge Distillation (Mu et al., 2024)
 * - LLMLingua: Compressing Prompts (Jiang et al., 2023)
 */

/**
 * 의미 핵심 요소 타입 정의
 */
export const SemanticElements = {
    ROLE: 'role',
    CONTEXT: 'context',
    TASK: 'task',
    CONSTRAINT: 'constraint',
    FORMAT: 'format',
    EXAMPLE: 'example'
};

/**
 * 압축 레벨 설정
 */
export const CompressionLevels = {
    LIGHT: { targetRatio: 0.85, qualityThreshold: 0.98 },
    MODERATE: { targetRatio: 0.70, qualityThreshold: 0.95 },
    AGGRESSIVE: { targetRatio: 0.55, qualityThreshold: 0.90 },
    EXTREME: { targetRatio: 0.40, qualityThreshold: 0.85 }
};

/**
 * 불필요한 패턴 정의 (제거 대상)
 */
const RedundantPatterns = {
    politeness: [
        /\b(please|kindly|could you|would you|I would appreciate|if you don't mind)\b/gi,
        /\b(thank you|thanks|grateful)\b/gi,
        /\b(sorry|apologize|excuse me)\b/gi
    ],
    intensifiers: [
        /\b(very|really|extremely|incredibly|absolutely|definitely|certainly)\b/gi,
        /\b(quite|rather|fairly|pretty much)\b/gi
    ],
    hedging: [
        /\b(maybe|perhaps|possibly|probably|might|could be|seems like)\b/gi,
        /\b(I think|I believe|I guess|in my opinion)\b/gi
    ],
    fillers: [
        /\b(basically|essentially|actually|literally|obviously|clearly)\b/gi,
        /\b(you know|I mean|like|just|so|well)\b/gi,
        /\b(in order to|for the purpose of|with the intention of)\b/g
    ],
    whitespace: [
        /\s{2,}/g,
        /\n{3,}/g,
        /\.\s*\./g
    ]
};

/**
 * 의미 보존 필수 패턴 (보호 대상)
 */
const ProtectedPatterns = {
    roleDefinition: /(?:you are|act as|serve as|function as|role of)\s+(?:a|an|the)?\s*([^\.,\n]+)/gi,
    coreActions: /(?:must|should|need to|have to|required to)\s+([^\.,\n]+)/gi,
    constraints: /(?:do not|don't|never|avoid|ensure|always)\s+([^\.,\n]+)/gi,
    formatSpec: /(?:format|structure|output|response|return)\s*(?:as|in|using)?\s*([^\.,\n]+)/gi,
    numerics: /\b\d+(?:\.\d+)?(?:\s*(?:%|percent|words?|characters?|items?|steps?|points?))?\b/gi,
    codeBlocks: /```[\s\S]*?```/g,
    examples: /(?:example|for instance|such as|e\.g\.|i\.e\.)[\s:]+([^\n]+)/gi
};

/**
 * 메인 STC Engine 클래스
 */
export class SemanticTokenCompressor {
    constructor(model = 'gpt-4o') {
        this.model = model;
    }

    /**
     * 간단한 토큰 수 추정 (실제로는 tiktoken 사용)
     */
    countTokens(text) {
        // 간단한 휴리스틱: 평균 4자당 1토큰
        return Math.ceil(text.length / 4);
    }

    /**
     * 의미적 지문 생성 (Semantic Fingerprint)
     */
    generateSemanticFingerprint(text) {
        const fingerprint = {
            entities: this.extractEntities(text),
            actions: this.extractActions(text),
            constraints: this.extractConstraints(text),
            format: this.extractFormat(text),
            intent: this.classifyIntent(text)
        };

        fingerprint.hash = this.hashFingerprint(fingerprint);
        fingerprint.score = this.calculateFingerprintScore(fingerprint);

        return fingerprint;
    }

    extractEntities(text) {
        const entities = [];

        const roleMatches = text.match(ProtectedPatterns.roleDefinition);
        if (roleMatches) {
            entities.push(...roleMatches.map(m => ({ type: 'role', value: m.trim() })));
        }

        const codeLanguages = text.match(/\b(python|javascript|java|c\+\+|typescript|go|rust|sql)\b/gi);
        if (codeLanguages) {
            entities.push(...codeLanguages.map(lang => ({ type: 'language', value: lang.toLowerCase() })));
        }

        const domains = text.match(/\b(marketing|finance|education|healthcare|technology|legal|creative)\b/gi);
        if (domains) {
            entities.push(...domains.map(d => ({ type: 'domain', value: d.toLowerCase() })));
        }

        return entities;
    }

    extractActions(text) {
        const actionVerbs = [
            'write', 'create', 'generate', 'analyze', 'explain', 'summarize',
            'translate', 'refactor', 'optimize', 'review', 'debug', 'design',
            'implement', 'convert', 'extract', 'compare', 'evaluate', 'recommend'
        ];

        const actions = [];

        actionVerbs.forEach(verb => {
            const regex = new RegExp(`\\b${verb}\\b[^.\\n]*`, 'gi');
            const matches = text.match(regex);
            if (matches) {
                actions.push({
                    verb: verb,
                    context: matches[0].substring(0, 100)
                });
            }
        });

        return actions;
    }

    extractConstraints(text) {
        const constraints = [];

        const constraintMatches = text.match(ProtectedPatterns.constraints);
        if (constraintMatches) {
            constraints.push(...constraintMatches.map(c => c.trim()));
        }

        const lengthConstraints = text.match(/\b(\d+)\s*(words?|characters?|sentences?|paragraphs?|lines?)\b/gi);
        if (lengthConstraints) {
            constraints.push(...lengthConstraints);
        }

        return constraints;
    }

    extractFormat(text) {
        const formats = [];

        const formatMatches = text.match(ProtectedPatterns.formatSpec);
        if (formatMatches) {
            formats.push(...formatMatches);
        }

        if (/\b(json|xml|yaml|markdown|csv|table|list|bullet points?)\b/i.test(text)) {
            const match = text.match(/\b(json|xml|yaml|markdown|csv|table|list|bullet points?)\b/i);
            if (match) formats.push(match[0]);
        }

        return formats;
    }

    classifyIntent(text) {
        const intents = {
            generation: /\b(write|create|generate|compose|draft|produce)\b/i.test(text),
            analysis: /\b(analyze|examine|evaluate|assess|review|investigate)\b/i.test(text),
            transformation: /\b(convert|translate|transform|refactor|rewrite|change)\b/i.test(text),
            explanation: /\b(explain|describe|clarify|elaborate|define|illustrate)\b/i.test(text),
            extraction: /\b(extract|find|identify|locate|detect|discover)\b/i.test(text),
            comparison: /\b(compare|contrast|differentiate|distinguish)\b/i.test(text)
        };

        const primaryIntent = Object.keys(intents).find(key => intents[key]) || 'general';

        return {
            primary: primaryIntent,
            all: Object.keys(intents).filter(key => intents[key])
        };
    }

    hashFingerprint(fingerprint) {
        const str = JSON.stringify({
            e: fingerprint.entities.map(e => e.value).sort(),
            a: fingerprint.actions.map(a => a.verb).sort(),
            c: fingerprint.constraints.sort(),
            f: fingerprint.format.sort(),
            i: fingerprint.intent.primary
        });

        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(16);
    }

    calculateFingerprintScore(fingerprint) {
        let score = 0;
        score += Math.min(fingerprint.entities.length * 5, 25);
        score += Math.min(fingerprint.actions.length * 8, 25);
        score += Math.min(fingerprint.constraints.length * 5, 25);
        score += Math.min(fingerprint.format.length * 5, 15);
        score += fingerprint.intent.all.length > 0 ? 10 : 0;
        return Math.min(score, 100);
    }

    compress(text, level = 'MODERATE') {
        const config = CompressionLevels[level] || CompressionLevels.MODERATE;

        const originalTokens = this.countTokens(text);
        const originalFingerprint = this.generateSemanticFingerprint(text);

        const techniques = [];
        let { processed, protected: protectedAreas } = this.markProtectedAreas(text);
        processed = this.removeRedundancy(processed, techniques);
        processed = this.optimizeStructure(processed, techniques);
        processed = this.compressSentences(processed, techniques);
        processed = this.restoreProtectedAreas(processed, protectedAreas);
        processed = this.finalCleanup(processed, techniques);

        const compressedTokens = this.countTokens(processed);
        const compressedFingerprint = this.generateSemanticFingerprint(processed);

        const qualityScore = this.validateQuality(originalFingerprint, compressedFingerprint);

        return {
            original: {
                text: text,
                tokens: originalTokens,
                fingerprint: originalFingerprint
            },
            compressed: {
                text: processed,
                tokens: compressedTokens,
                fingerprint: compressedFingerprint
            },
            metrics: {
                compressionRatio: (1 - compressedTokens / originalTokens) * 100,
                tokensSaved: originalTokens - compressedTokens,
                qualityScore: qualityScore,
                qualityPreserved: qualityScore >= config.qualityThreshold * 100,
                level: level,
                techniques: techniques
            }
        };
    }

    markProtectedAreas(text) {
        const protectedAreas = [];
        let processed = text;
        let index = 0;

        processed = processed.replace(ProtectedPatterns.codeBlocks, (match) => {
            const placeholder = `__PROTECTED_${index}__`;
            protectedAreas.push({ placeholder, content: match });
            index++;
            return placeholder;
        });

        processed = processed.replace(ProtectedPatterns.numerics, (match) => {
            const placeholder = `__PROTECTED_${index}__`;
            protectedAreas.push({ placeholder, content: match });
            index++;
            return placeholder;
        });

        return { processed, protected: protectedAreas };
    }

    removeRedundancy(text, techniques) {
        let result = text;

        Object.entries(RedundantPatterns).forEach(([category, patterns]) => {
            patterns.forEach(pattern => {
                const before = result;
                result = result.replace(pattern, ' ');
                if (before !== result && techniques) {
                    techniques.push({
                        name: `${category} removal`,
                        category: 'filler_removal',
                        impact: 'low'
                    });
                }
            });
        });

        return result;
    }

    optimizeStructure(text, techniques) {
        let result = text;
        const before = result;

        result = result.replace(/\bin order to\b/gi, 'to');
        result = result.replace(/\bfor the purpose of\b/gi, 'to');
        result = result.replace(/\bwith regard to\b/gi, 'about');
        result = result.replace(/\bin the event that\b/gi, 'if');
        result = result.replace(/\bis able to\b/gi, 'can');
        result = result.replace(/\bdue to the fact that\b/gi, 'because');
        result = result.replace(/\bat the present time\b/gi, 'now');
        result = result.replace(/\bprior to\b/gi, 'before');

        if (before !== result && techniques) {
            techniques.push({ name: 'Simplify verbose phrases', category: 'verbose_reduction', impact: 'medium' });
        }

        return result;
    }

    compressSentences(text, techniques) {
        const sentences = text.split(/(?<=[.!?])\s+/);
        let changed = false;

        const compressed = sentences.map(sentence => {
            if (sentence.split(' ').length <= 5) return sentence;

            const before = sentence;
            let result = sentence
                .replace(/^(and|but|so|however|therefore|moreover|furthermore)\s+/gi, '')
                .replace(/,\s*(and|but|so)\s+/gi, ', ');

            if (before !== result) changed = true;
            return result;
        });

        if (changed && techniques) {
            techniques.push({ name: 'Sentence structure simplification', category: 'structure', impact: 'medium' });
        }

        return compressed.join(' ');
    }

    restoreProtectedAreas(text, protectedAreas) {
        let result = text;

        protectedAreas.forEach(area => {
            result = result.replace(area.placeholder, area.content);
        });

        return result;
    }

    finalCleanup(text, techniques) {
        const result = text
            .replace(/\s+/g, ' ')
            .replace(/\s+([.,!?;:])/g, '$1')
            .replace(/\n\s*\n/g, '\n\n')
            .trim();

        if (text.length > result.length && techniques) {
            techniques.push({ name: 'Whitespace cleanup', category: 'whitespace', impact: 'low' });
        }
        return result;
    }

    validateQuality(original, compressed) {
        let score = 100;

        const originalEntities = new Set(original.entities.map(e => e.value));
        const compressedEntities = new Set(compressed.entities.map(e => e.value));
        const missingEntities = [...originalEntities].filter(e => !compressedEntities.has(e));
        score -= missingEntities.length * 5;

        const originalActions = new Set(original.actions.map(a => a.verb));
        const compressedActions = new Set(compressed.actions.map(a => a.verb));
        const missingActions = [...originalActions].filter(a => !compressedActions.has(a));
        score -= missingActions.length * 8;

        const missingConstraints = original.constraints.length - compressed.constraints.length;
        score -= Math.max(0, missingConstraints) * 10;

        if (original.intent.primary !== compressed.intent.primary) {
            score -= 15;
        }

        return Math.max(0, score);
    }
}

/**
 * Express 라우터 핸들러
 */
export async function handleCompression(req, res) {
    try {
        const { text, level = 'MODERATE', model = 'gpt-4o' } = req.body;

        if (!text || text.trim().length === 0) {
            return res.status(400).json({
                error: 'Text is required',
                code: 'EMPTY_TEXT'
            });
        }

        const compressor = new SemanticTokenCompressor(model);
        const result = compressor.compress(text, level);

        res.json({
            success: true,
            data: result,
            metadata: {
                algorithm: 'PROMM-STC-v1.0',
                patent: 'Semantic Token Compression Engine',
                timestamp: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('Compression error:', error);
        res.status(500).json({
            error: 'Compression failed',
            message: error.message
        });
    }
}
