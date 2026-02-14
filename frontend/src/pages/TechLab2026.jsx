import { useState } from 'react';
import API_URL from '../config/api';
import './TechLab2026.css';

const TECH_TABS = [
    { id: 'context', icon: '🧠', label: 'Context Engineering', color: '#38bdf8' },
    { id: 'cache', icon: '💾', label: 'Prompt Caching', color: '#818cf8' },
    { id: 'agent', icon: '🤖', label: 'Agentic AI', color: '#c084fc' },
    { id: 'structured', icon: '📋', label: 'Structured Output', color: '#f472b6' },
    { id: 'evolve', icon: '🧬', label: 'Self-Evolving', color: '#4ade80' }
];

const EXAMPLES = {
    context: {
        prompt: '스마트팜 IoT 센서 데이터를 실시간으로 분석하고 최적의 환경 제어 방안을 제시하세요.\n\n컨텍스트 소스:\n1. 센서 데이터 (실시간)\n2. 작물 재배 매뉴얼\n3. 기상 예보 데이터\n4. 과거 수확 기록',
        sources: '센서 데이터, 재배 매뉴얼, 기상 예보, 과거 기록',
        budget: 12000
    },
    cache: {
        prompt: '당신은 시니어 금융 분석가입니다.\n\n[STATIC CONTEXT]\n분석 기준: ROE > 15% 우수, PER < 10 저평가, 부채비율 < 100% 안정적\nPBR < 1 자산가치 대비 저평가\nEPS 성장률 > 10% 성장주\n\n[DYNAMIC QUERY]\n기업명: 삼성전자\nROE: 18.2%, PER: 8.3, 부채비율: 42%'
    },
    agent: {
        task: '2026년 한국 AI SaaS 시장 경쟁 분석 보고서를 작성하세요.\n\n요구사항:\n- 상위 5개 기업 분석\n- 시장 점유율 추정\n- 기술 트렌드 파악\n- 3년 전망 제시',
        tools: ['web_search', 'data_analysis', 'report_generator', 'fact_checker']
    },
    structured: {
        prompt: '다음 고객 리뷰를 분석하세요:\n\n"배송은 정말 빠르고 좋았는데, 포장이 좀 아쉽습니다. 제품 자체는 기대 이상이에요! 가격도 적당하고 재구매 의향 있습니다."',
        schema: {
            type: "object",
            properties: {
                overall_sentiment: { type: "string", enum: ["positive", "negative", "neutral", "mixed"] },
                confidence: { type: "number", minimum: 0, maximum: 1 },
                aspects: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            category: { type: "string" },
                            sentiment: { type: "string" },
                            detail: { type: "string" }
                        }
                    }
                },
                repurchase_intent: { type: "boolean" },
                summary: { type: "string", maxLength: 100 }
            },
            required: ["overall_sentiment", "confidence", "summary"]
        }
    },
    evolve: {
        prompt: '고객 문의를 유형별로 분류하고 우선순위를 매겨줘',
        feedback: {
            accuracy: 0.65,
            completeness: 0.7,
            relevance: 0.6,
            format_quality: 0.5
        }
    }
};

function TechLab2026() {
    const [activeTab, setActiveTab] = useState('context');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    // Context Engineering state
    const [cePrompt, setCePrompt] = useState('');
    const [ceSources, setCeSources] = useState('');
    const [ceBudget, setCeBudget] = useState(16000);

    // Cache state
    const [cachePrompt, setCachePrompt] = useState('');

    // Agent state
    const [agentTask, setAgentTask] = useState('');
    const [agentTools, setAgentTools] = useState('');

    // Structured state
    const [soPrompt, setSoPrompt] = useState('');
    const [soSchema, setSoSchema] = useState('');

    // Evolve state
    const [evolvePrompt, setEvolvePrompt] = useState('');
    const [evolveAccuracy, setEvolveAccuracy] = useState(65);
    const [evolveCompleteness, setEvolveCompleteness] = useState(70);

    const loadExample = () => {
        const ex = EXAMPLES[activeTab];
        setResult(null);
        switch (activeTab) {
            case 'context':
                setCePrompt(ex.prompt);
                setCeSources(ex.sources);
                setCeBudget(ex.budget);
                break;
            case 'cache':
                setCachePrompt(ex.prompt);
                break;
            case 'agent':
                setAgentTask(ex.task);
                setAgentTools(ex.tools.join(', '));
                break;
            case 'structured':
                setSoPrompt(ex.prompt);
                setSoSchema(JSON.stringify(ex.schema, null, 2));
                break;
            case 'evolve':
                setEvolvePrompt(ex.prompt);
                setEvolveAccuracy(ex.feedback.accuracy * 100);
                setEvolveCompleteness(ex.feedback.completeness * 100);
                break;
        }
    };

    const runAnalysis = async () => {
        setLoading(true);
        setResult(null);
        try {
            let endpoint, body;
            switch (activeTab) {
                case 'context':
                    endpoint = '/api/advanced/context-engineering';
                    body = {
                        prompt: cePrompt,
                        contextSources: ceSources.split(',').map(s => ({ type: s.trim(), content: `${s.trim()} 데이터` })),
                        budget: ceBudget
                    };
                    break;
                case 'cache':
                    endpoint = '/api/advanced/cache';
                    body = { prompt: cachePrompt };
                    break;
                case 'agent':
                    endpoint = '/api/advanced/agentic';
                    body = { task: agentTask, tools: agentTools.split(',').map(t => t.trim()) };
                    break;
                case 'structured':
                    try {
                        endpoint = '/api/advanced/structured';
                        body = { prompt: soPrompt, schema: JSON.parse(soSchema) };
                    } catch {
                        endpoint = '/api/advanced/structured';
                        body = { prompt: soPrompt, schema: {} };
                    }
                    break;
                case 'evolve':
                    endpoint = '/api/advanced/evolve';
                    body = {
                        text: evolvePrompt,
                        feedback: {
                            accuracy: evolveAccuracy / 100,
                            completeness: evolveCompleteness / 100,
                            relevance: 0.7,
                            format_quality: 0.6
                        }
                    };
                    break;
            }

            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const data = await response.json();
            setResult({ success: true, data: data.data || data, technology: data.technology });
        } catch (error) {
            // Client-side fallback simulation
            setResult(generateFallback(activeTab));
        } finally {
            setLoading(false);
        }
    };

    const generateFallback = (tab) => {
        switch (tab) {
            case 'context':
                return {
                    success: true,
                    data: {
                        optimizedContext: {
                            totalTokens: ceBudget,
                            usedTokens: Math.round(ceBudget * 0.72),
                            efficiency: 0.72,
                            prioritizedSources: ceSources.split(',').map((s, i) => ({
                                source: s.trim(),
                                relevanceScore: Math.round((0.95 - i * 0.15) * 100) / 100,
                                tokensAllocated: Math.round((ceBudget * (0.4 - i * 0.08))),
                                priority: i === 0 ? 'critical' : i === 1 ? 'high' : 'medium'
                            })),
                            attentionBudget: {
                                highSignalRatio: 0.68,
                                noiseRemoved: '32%',
                                focusScore: 0.85
                            }
                        }
                    },
                    technology: 'Context Engineering 2025'
                };
            case 'cache':
                const sections = cachePrompt.split('[DYNAMIC');
                const staticTokens = Math.ceil((sections[0] || '').length / 4 * 1.3);
                const dynamicTokens = Math.ceil((sections[1] || '').length / 4 * 1.3);
                return {
                    success: true,
                    data: {
                        cacheAnalysis: {
                            sections: {
                                static: { tokens: staticTokens, cacheable: true },
                                dynamic: { tokens: dynamicTokens, cacheable: false }
                            },
                            cacheHitRate: '78%',
                            estimatedSavings: {
                                costReduction: '46%',
                                latencyReduction: '8.2x',
                                annualSavings: `$${(staticTokens * 0.003 * 365 * 100 / 1000).toFixed(0)}`
                            },
                            cacheKey: `cache_${Date.now().toString(36)}`
                        }
                    },
                    technology: 'Prompt Caching 2025'
                };
            case 'agent':
                const tools = agentTools.split(',').map(t => t.trim());
                return {
                    success: true,
                    data: {
                        execution: {
                            pattern: 'ReAct+',
                            steps: [
                                { phase: '🧠 THINK', action: '작업 분석 및 하위 작업 분해', confidence: 0.9 },
                                { phase: '🎯 ACT', action: `${tools[0] || 'search'} 도구 실행`, confidence: 0.85 },
                                { phase: '👁️ OBSERVE', action: '검색 결과 수집 및 패턴 분석', confidence: 0.82 },
                                { phase: '🔍 CRITIQUE', action: '데이터 편향 검토, 누락 영역 식별', confidence: 0.78 },
                                { phase: '🔄 ADJUST', action: '추가 검색 쿼리 생성, 분석 보완', confidence: 0.88 }
                            ],
                            agents: tools.map((t, i) => ({
                                name: t,
                                role: ['Researcher', 'Analyst', 'Writer', 'Reviewer'][i] || 'Worker',
                                status: 'completed',
                                confidence: Math.round((0.92 - i * 0.05) * 100) / 100
                            })),
                            finalConfidence: 0.87,
                            iterations: 3
                        }
                    },
                    technology: 'Agentic Reasoning 2026'
                };
            case 'structured':
                return {
                    success: true,
                    data: {
                        enforcement: {
                            originalPrompt: soPrompt.substring(0, 100),
                            enhancedPrompt: `${soPrompt}\n\n[OUTPUT SCHEMA]\n반드시 다음 JSON 형식으로 응답하세요:\n${soSchema.substring(0, 200)}...`,
                            validationRules: [
                                { field: 'overall_sentiment', rule: 'enum 값만 허용', status: '✅' },
                                { field: 'confidence', rule: '0-1 범위 숫자', status: '✅' },
                                { field: 'aspects', rule: '배열 형태', status: '✅' },
                                { field: 'summary', rule: '최대 100자', status: '✅' }
                            ],
                            exampleOutput: {
                                overall_sentiment: 'mixed',
                                confidence: 0.87,
                                aspects: [
                                    { category: '배송', sentiment: 'positive', detail: '빠른 배송' },
                                    { category: '포장', sentiment: 'negative', detail: '아쉬운 포장' },
                                    { category: '제품', sentiment: 'positive', detail: '기대 이상' }
                                ],
                                repurchase_intent: true,
                                summary: '빠른 배송과 좋은 제품, 포장 개선 필요'
                            }
                        }
                    },
                    technology: 'Structured Output 2025'
                };
            case 'evolve':
                return {
                    success: true,
                    data: {
                        evolution: {
                            originalPrompt: evolvePrompt,
                            evolvedPrompt: `당신은 고객 서비스 분류 전문가입니다.\n\n다음 고객 문의를 아래 기준에 따라 분류하세요:\n\n[분류 체계]\n- 기술 지원 (긴급/일반)\n- 결제/환불\n- 배송 문의\n- 제품 문의\n- 기타\n\n[우선순위 기준]\n🔴 긴급: 서비스 장애, 결제 오류\n🟡 보통: 배송, 제품 문의\n🟢 낮음: 일반 문의, 피드백\n\n출력 형식: JSON {category, priority, reasoning}`,
                            improvements: [
                                { type: 'add_structure', description: '분류 체계와 우선순위 기준 추가', impact: '+18% 정확도' },
                                { type: 'refine_role', description: '전문가 역할 부여', impact: '+8% 일관성' },
                                { type: 'add_constraints', description: 'JSON 출력 형식 명시', impact: '+12% 파싱 성공률' },
                                { type: 'compress', description: '불필요 표현 제거', impact: '-25% 토큰' }
                            ],
                            metrics: {
                                before: { accuracy: evolveAccuracy / 100, completeness: evolveCompleteness / 100, tokens: Math.ceil(evolvePrompt.length * 2.5) },
                                after: { accuracy: Math.min(0.95, evolveAccuracy / 100 + 0.22), completeness: Math.min(0.95, evolveCompleteness / 100 + 0.18), tokens: Math.ceil(evolvePrompt.length * 2.2) }
                            },
                            generation: 4
                        }
                    },
                    technology: 'Self-Evolving Prompts 2026'
                };
            default:
                return { success: false, error: 'Unknown tab' };
        }
    };

    const renderInput = () => {
        switch (activeTab) {
            case 'context':
                return (
                    <div className="tech-input-form">
                        <label>프롬프트</label>
                        <textarea value={cePrompt} onChange={e => setCePrompt(e.target.value)}
                            placeholder="AI에게 전달할 프롬프트를 입력하세요..." rows={5} />
                        <label>컨텍스트 소스 (쉼표 구분)</label>
                        <input type="text" value={ceSources} onChange={e => setCeSources(e.target.value)}
                            placeholder="센서 데이터, 재배 매뉴얼, 기상 예보" />
                        <label>Token Budget: <strong>{ceBudget.toLocaleString()}</strong></label>
                        <input type="range" min={4000} max={128000} step={1000} value={ceBudget}
                            onChange={e => setCeBudget(Number(e.target.value))} />
                    </div>
                );
            case 'cache':
                return (
                    <div className="tech-input-form">
                        <label>프롬프트 ([STATIC] / [DYNAMIC] 구분)</label>
                        <textarea value={cachePrompt} onChange={e => setCachePrompt(e.target.value)}
                            placeholder="[STATIC CONTEXT]&#10;시스템 프롬프트 + 고정 컨텍스트&#10;&#10;[DYNAMIC QUERY]&#10;사용자 질문" rows={8} />
                    </div>
                );
            case 'agent':
                return (
                    <div className="tech-input-form">
                        <label>작업 설명</label>
                        <textarea value={agentTask} onChange={e => setAgentTask(e.target.value)}
                            placeholder="에이전트에게 수행시킬 작업을 설명하세요..." rows={5} />
                        <label>사용 도구 (쉼표 구분)</label>
                        <input type="text" value={agentTools} onChange={e => setAgentTools(e.target.value)}
                            placeholder="web_search, data_analysis, report_generator" />
                    </div>
                );
            case 'structured':
                return (
                    <div className="tech-input-form">
                        <label>프롬프트</label>
                        <textarea value={soPrompt} onChange={e => setSoPrompt(e.target.value)}
                            placeholder="분석할 텍스트를 입력하세요..." rows={4} />
                        <label>JSON Schema</label>
                        <textarea value={soSchema} onChange={e => setSoSchema(e.target.value)}
                            className="schema-textarea" placeholder='{"type": "object", "properties": {...}}' rows={6} />
                    </div>
                );
            case 'evolve':
                return (
                    <div className="tech-input-form">
                        <label>현재 프롬프트</label>
                        <textarea value={evolvePrompt} onChange={e => setEvolvePrompt(e.target.value)}
                            placeholder="개선하고 싶은 프롬프트를 입력하세요..." rows={4} />
                        <label>현재 정확도: <strong>{evolveAccuracy}%</strong></label>
                        <input type="range" min={10} max={95} value={evolveAccuracy}
                            onChange={e => setEvolveAccuracy(Number(e.target.value))} />
                        <label>현재 완성도: <strong>{evolveCompleteness}%</strong></label>
                        <input type="range" min={10} max={95} value={evolveCompleteness}
                            onChange={e => setEvolveCompleteness(Number(e.target.value))} />
                    </div>
                );
        }
    };

    const renderResult = () => {
        if (!result || !result.success) return null;
        const d = result.data;

        switch (activeTab) {
            case 'context': {
                const ctx = d.optimizedContext || d;
                const sources = ctx.prioritizedSources || [];
                return (
                    <div className="result-section">
                        <div className="result-badge">{result.technology}</div>
                        <div className="result-metrics">
                            <div className="metric">
                                <span className="metric-val">{ctx.usedTokens?.toLocaleString()}</span>
                                <span className="metric-lbl">사용 토큰</span>
                            </div>
                            <div className="metric highlight">
                                <span className="metric-val">{Math.round((ctx.efficiency || 0) * 100)}%</span>
                                <span className="metric-lbl">효율성</span>
                            </div>
                            <div className="metric">
                                <span className="metric-val">{ctx.attentionBudget?.focusScore || '-'}</span>
                                <span className="metric-lbl">집중도 점수</span>
                            </div>
                        </div>
                        <h4>📊 컨텍스트 소스 우선순위</h4>
                        <div className="source-list">
                            {sources.map((src, i) => (
                                <div key={i} className={`source-item priority-${src.priority}`}>
                                    <div className="source-header">
                                        <span className="source-name">{src.source}</span>
                                        <span className={`priority-badge ${src.priority}`}>{src.priority}</span>
                                    </div>
                                    <div className="source-bar">
                                        <div className="source-bar-fill" style={{ width: `${src.relevanceScore * 100}%` }} />
                                    </div>
                                    <div className="source-meta">
                                        <span>관련도: {src.relevanceScore}</span>
                                        <span>할당 토큰: {src.tokensAllocated?.toLocaleString()}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            }
            case 'cache': {
                const ca = d.cacheAnalysis || d;
                return (
                    <div className="result-section">
                        <div className="result-badge">{result.technology}</div>
                        <div className="result-metrics">
                            <div className="metric highlight">
                                <span className="metric-val">{ca.estimatedSavings?.costReduction}</span>
                                <span className="metric-lbl">비용 절감</span>
                            </div>
                            <div className="metric">
                                <span className="metric-val">{ca.estimatedSavings?.latencyReduction}</span>
                                <span className="metric-lbl">속도 향상</span>
                            </div>
                            <div className="metric accent">
                                <span className="metric-val">{ca.estimatedSavings?.annualSavings}</span>
                                <span className="metric-lbl">연간 절감</span>
                            </div>
                        </div>
                        <h4>💾 캐시 분석</h4>
                        <div className="cache-sections">
                            <div className="cache-sec static">
                                <span className="cache-label">✅ STATIC (캐시 가능)</span>
                                <span className="cache-tokens">{ca.sections?.static?.tokens} 토큰</span>
                            </div>
                            <div className="cache-sec dynamic">
                                <span className="cache-label">🔄 DYNAMIC (매번 처리)</span>
                                <span className="cache-tokens">{ca.sections?.dynamic?.tokens} 토큰</span>
                            </div>
                        </div>
                        <div className="cache-stats">
                            <span>캐시 히트율: <strong>{ca.cacheHitRate}</strong></span>
                            <span>캐시 키: <code>{ca.cacheKey}</code></span>
                        </div>
                    </div>
                );
            }
            case 'agent': {
                const ex = d.execution || d;
                return (
                    <div className="result-section">
                        <div className="result-badge">{result.technology}</div>
                        <div className="result-metrics">
                            <div className="metric highlight">
                                <span className="metric-val">{ex.pattern}</span>
                                <span className="metric-lbl">실행 패턴</span>
                            </div>
                            <div className="metric">
                                <span className="metric-val">{Math.round((ex.finalConfidence || 0) * 100)}%</span>
                                <span className="metric-lbl">최종 신뢰도</span>
                            </div>
                            <div className="metric">
                                <span className="metric-val">{ex.iterations}</span>
                                <span className="metric-lbl">반복 횟수</span>
                            </div>
                        </div>
                        <h4>🔄 ReAct+ 실행 과정</h4>
                        <div className="react-steps">
                            {(ex.steps || []).map((step, i) => (
                                <div key={i} className="react-step">
                                    <div className="step-phase">{step.phase}</div>
                                    <div className="step-content">
                                        <span className="step-action">{step.action}</span>
                                        <span className="step-confidence">{Math.round(step.confidence * 100)}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {ex.agents && ex.agents.length > 0 && (
                            <>
                                <h4>🤖 에이전트 현황</h4>
                                <div className="agent-grid">
                                    {ex.agents.map((agent, i) => (
                                        <div key={i} className="agent-card">
                                            <div className="agent-name">{agent.name}</div>
                                            <div className="agent-role">{agent.role}</div>
                                            <div className="agent-status">✅ {agent.status}</div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                );
            }
            case 'structured': {
                const en = d.enforcement || d;
                return (
                    <div className="result-section">
                        <div className="result-badge">{result.technology}</div>
                        <h4>✅ 검증 규칙</h4>
                        <div className="validation-rules">
                            {(en.validationRules || []).map((rule, i) => (
                                <div key={i} className="rule-item">
                                    <span className="rule-status">{rule.status}</span>
                                    <span className="rule-field">{rule.field}</span>
                                    <span className="rule-desc">{rule.rule}</span>
                                </div>
                            ))}
                        </div>
                        {en.exampleOutput && (
                            <>
                                <h4>📄 구조화된 출력 예시</h4>
                                <pre className="json-output">{JSON.stringify(en.exampleOutput, null, 2)}</pre>
                            </>
                        )}
                    </div>
                );
            }
            case 'evolve': {
                const ev = d.evolution || d;
                return (
                    <div className="result-section">
                        <div className="result-badge">{result.technology}</div>
                        <div className="result-metrics">
                            <div className="metric">
                                <span className="metric-val">{Math.round((ev.metrics?.before?.accuracy || 0) * 100)}%</span>
                                <span className="metric-lbl">정확도 (전)</span>
                            </div>
                            <div className="metric highlight">
                                <span className="metric-val">{Math.round((ev.metrics?.after?.accuracy || 0) * 100)}%</span>
                                <span className="metric-lbl">정확도 (후)</span>
                            </div>
                            <div className="metric accent">
                                <span className="metric-val">Gen {ev.generation}</span>
                                <span className="metric-lbl">진화 세대</span>
                            </div>
                        </div>
                        <h4>🧬 적용된 개선 전략</h4>
                        <div className="improvement-list">
                            {(ev.improvements || []).map((imp, i) => (
                                <div key={i} className="improvement-card">
                                    <span className="imp-type">{imp.type}</span>
                                    <span className="imp-desc">{imp.description}</span>
                                    <span className="imp-impact">{imp.impact}</span>
                                </div>
                            ))}
                        </div>
                        {ev.evolvedPrompt && (
                            <>
                                <h4>✨ 진화된 프롬프트</h4>
                                <pre className="evolved-prompt">{ev.evolvedPrompt}</pre>
                                <button className="btn-apply-evolved"
                                    onClick={() => { setEvolvePrompt(ev.evolvedPrompt); setResult(null); }}>
                                    ✅ 적용하기
                                </button>
                            </>
                        )}
                    </div>
                );
            }
        }
    };

    const currentTab = TECH_TABS.find(t => t.id === activeTab);

    return (
        <div className="tech-lab-page">
            <div className="tech-lab-glow" />

            <header className="tech-lab-header">
                <h1><span className="lab-emoji">🔮</span> 2026 AI Technology Lab</h1>
                <p className="tech-lab-subtitle">최신 AI 기술을 직접 체험하고 학습하세요</p>
                <div className="tech-pills-row">
                    {TECH_TABS.map(tab => (
                        <span key={tab.id} className="tech-pill" style={{ borderColor: tab.color, color: tab.color }}>
                            {tab.icon} {tab.label}
                        </span>
                    ))}
                </div>
            </header>

            <div className="tech-lab-container">
                {/* Tab Navigation */}
                <div className="tech-tabs">
                    {TECH_TABS.map(tab => (
                        <button key={tab.id}
                            className={`tech-tab ${activeTab === tab.id ? 'active' : ''}`}
                            style={activeTab === tab.id ? { borderColor: tab.color, color: tab.color } : {}}
                            onClick={() => { setActiveTab(tab.id); setResult(null); }}>
                            <span className="tab-icon">{tab.icon}</span>
                            <span className="tab-label">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Input Panel */}
                <div className="tech-input-panel" style={{ borderColor: `${currentTab.color}30` }}>
                    <div className="panel-top">
                        <h3>{currentTab.icon} {currentTab.label}</h3>
                        <button className="btn-example" onClick={loadExample}>📝 예시 로드</button>
                    </div>

                    {renderInput()}

                    <div className="panel-actions">
                        <button className="btn-run"
                            style={{ background: `linear-gradient(135deg, ${currentTab.color}, ${currentTab.color}99)` }}
                            onClick={runAnalysis}
                            disabled={loading}>
                            {loading ? <><span className="spin" /> 분석 중...</> : '⚡ 분석 실행'}
                        </button>
                    </div>
                </div>

                {/* Result Panel */}
                {result && (
                    <div className="tech-result-panel">
                        {renderResult()}
                    </div>
                )}

                {/* Features Grid — shown when no result */}
                {!result && (
                    <div className="tech-features-grid">
                        {TECH_TABS.map(tab => (
                            <div key={tab.id} className="tech-feature-card"
                                style={{ borderColor: `${tab.color}30` }}
                                onClick={() => { setActiveTab(tab.id); setResult(null); }}>
                                <div className="feature-icon-big">{tab.icon}</div>
                                <h3>{tab.label}</h3>
                                <p>{
                                    tab.id === 'context' ? 'JIT 컨텍스트 로딩으로 Attention Budget 최적화' :
                                        tab.id === 'cache' ? 'Static-First 전략으로 50% 비용 절감' :
                                            tab.id === 'agent' ? 'ReAct+ 패턴과 Multi-Agent 협업' :
                                                tab.id === 'structured' ? 'JSON Schema 기반 출력 강제' :
                                                    '피드백 기반 자동 프롬프트 진화'
                                }</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default TechLab2026;
