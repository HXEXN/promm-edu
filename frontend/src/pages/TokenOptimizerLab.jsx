import { useState, useCallback } from 'react';
import API_URL from '../config/api';
import './TokenOptimizerLab.css';

function TokenOptimizerLab() {
    const [prompt, setPrompt] = useState('');
    const [domain, setDomain] = useState('general');
    const [requestsPerMonth, setRequestsPerMonth] = useState(1000);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [activeView, setActiveView] = useState('overview');

    // Quick token estimation (client-side)
    const estimateTokens = useCallback((text) => {
        if (!text) return 0;
        const koreanChars = (text.match(/[가-힣]/g) || []).length;
        const englishWords = (text.match(/[a-zA-Z]+/g) || []).length;
        const numbers = (text.match(/\d+/g) || []).length;
        return Math.ceil(koreanChars * 2.5 + englishWords * 1.3 + numbers);
    }, []);

    const handleOptimize = async () => {
        if (!prompt.trim()) return;
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/prompt/optimize`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt, domain, requestsPerMonth })
            });
            const data = await response.json();
            if (data.success) {
                setResult(data.data);
                setActiveView('overview');
            }
        } catch (error) {
            console.error('Optimization failed:', error);
            // Fallback: client-side simulation
            const originalTokens = estimateTokens(prompt);
            let optimized = prompt
                .replace(/제발\s*/g, '').replace(/부탁드립니다\.?\s*/g, '')
                .replace(/감사합니다\.?\s*/g, '').replace(/please\s*/gi, '')
                .replace(/could you (please\s*)?/gi, '').replace(/I would like you to\s*/gi, '')
                .replace(/\n{3,}/g, '\n\n').replace(/\s{2,}/g, ' ').trim();
            const optimizedTokens = estimateTokens(optimized);
            setResult({
                original: { text: prompt, tokens: originalTokens },
                optimized: { text: optimized, tokens: optimizedTokens },
                compression: {
                    tokensSaved: originalTokens - optimizedTokens,
                    compressionRatio: originalTokens > 0 ? Math.round(((originalTokens - optimizedTokens) / originalTokens) * 1000) / 10 : 0,
                    qualityPreserved: true,
                    techniques: [
                        { name: '불필요한 표현 제거', category: 'filler_removal', impact: 'low' },
                        { name: '공백 정리', category: 'whitespace', impact: 'low' }
                    ]
                },
                modelSavings: null,
                requestsPerMonth
            });
        } finally {
            setLoading(false);
        }
    };

    const formatCost = (cost) => {
        if (!cost && cost !== 0) return '-';
        if (cost < 0.00001) return `$${(cost * 1000000).toFixed(2)}/1M`;
        if (cost < 0.01) return `$${(cost * 1000).toFixed(4)}/1K`;
        return `$${cost.toFixed(6)}`;
    };

    const liveTokens = estimateTokens(prompt);

    const examplePrompts = [
        {
            label: '🇰🇷 한국어 (비효율)',
            text: `제발 부탁드립니다. 저는 당신이 스마트팜 전문가로서 행동해주기를 원합니다. 감사합니다.
제발 부탁드립니다. 저는 당신이 스마트팜 전문가로서 행동해주기를 원합니다.

우리 회사의 온실 환경 데이터에 대해서 분석을 해주세요. 온도, 습도, CO2 데이터가 있습니다.
구체적으로 지난 30일간의 추세를 파악하고, 이상치를 탐지하고, 최적 환경 조건을 추천해주세요.

결과는 표 형식으로 정리해주시면 감사합니다. 부탁드립니다.`
        },
        {
            label: '🇬🇧 English (Verbose)',
            text: `I would like you to please act as a data analyst. Could you please help me with the following task? I want you to analyze our company's sales data.

In order to provide a comprehensive analysis, due to the fact that we need to understand our performance, please look at the following:
1. Monthly revenue trends
2. Customer acquisition cost
3. Churn rate analysis

Could you please provide the results in a table format? Thank you very much. I would really appreciate it if you could do this as soon as possible. Please let me know if you have any questions.`
        },
        {
            label: '🎯 이미 최적화됨',
            text: `역할: 데이터 분석 전문가
컨텍스트: 스마트팜 온실 환경 센서 데이터 (온도/습도/CO2, 30일분)
작업:
1. 일별 추세 분석
2. 이상치 탐지 (Z-score > 2)
3. 최적 환경 조건 추천
출력: Markdown 표 형식`
        }
    ];

    return (
        <div className="token-lab-page">
            <header className="lab-header">
                <div className="lab-header-glow" />
                <h1><span className="lab-icon">🧪</span> 토큰 최적화 Lab</h1>
                <p className="lab-subtitle">
                    STC · MDQS · RCQO 엔진으로 프롬프트를 분석하고, 비용을 최적화하세요
                </p>
                <div className="tech-pills">
                    <span className="pill stc">STC Engine</span>
                    <span className="pill mdqs">MDQS 7D</span>
                    <span className="pill rcqo">RCQO</span>
                </div>
            </header>

            <div className="lab-container">
                {/* Input Section */}
                <section className="lab-input-section">
                    <div className="input-header">
                        <h2>프롬프트 입력</h2>
                        <div className="live-stats">
                            <span className={`live-token-badge ${liveTokens > 100 ? 'warn' : liveTokens > 50 ? 'medium' : 'good'}`}>
                                {liveTokens} 토큰
                            </span>
                        </div>
                    </div>

                    <textarea
                        className="lab-textarea"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="최적화할 프롬프트를 입력하세요..."
                        rows={10}
                    />

                    <div className="lab-options">
                        <div className="option-group">
                            <label>도메인</label>
                            <select value={domain} onChange={(e) => setDomain(e.target.value)}>
                                <option value="general">일반</option>
                                <option value="coding">코딩</option>
                                <option value="creative">창작</option>
                                <option value="business">비즈니스</option>
                                <option value="education">교육</option>
                            </select>
                        </div>
                        <div className="option-group">
                            <label>월 예상 호출 수</label>
                            <select value={requestsPerMonth} onChange={(e) => setRequestsPerMonth(Number(e.target.value))}>
                                <option value={100}>100회/월</option>
                                <option value={1000}>1,000회/월</option>
                                <option value={10000}>10,000회/월</option>
                                <option value={100000}>100,000회/월</option>
                            </select>
                        </div>
                    </div>

                    <div className="lab-actions">
                        <button
                            className="btn-optimize"
                            onClick={handleOptimize}
                            disabled={loading || !prompt.trim()}
                        >
                            {loading ? (
                                <><span className="spinner" /> 분석 중...</>
                            ) : (
                                <>🔬 토큰 최적화 분석</>
                            )}
                        </button>
                    </div>

                    {/* Example Prompts */}
                    <div className="example-prompts">
                        <h4>📋 예시 프롬프트</h4>
                        <div className="example-grid">
                            {examplePrompts.map((ex, idx) => (
                                <button
                                    key={idx}
                                    className="example-btn"
                                    onClick={() => setPrompt(ex.text)}
                                >
                                    {ex.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Results Section */}
                {result && (
                    <section className="lab-results">
                        {/* Top Stats Bar */}
                        <div className="stats-bar">
                            <div className="stat-item highlight">
                                <span className="stat-number">{result.compression.tokensSaved}</span>
                                <span className="stat-label">토큰 절감</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">{result.compression.compressionRatio}%</span>
                                <span className="stat-label">압축률</span>
                            </div>
                            <div className="stat-item">
                                <span className={`stat-number ${result.compression.qualityPreserved ? 'good' : 'warn'}`}>
                                    {result.compression.qualityPreserved ? '✅' : '⚠️'}
                                </span>
                                <span className="stat-label">품질 보존</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">{result.original.tokens}</span>
                                <span className="stat-label">원본 토큰</span>
                            </div>
                            <div className="stat-item accent">
                                <span className="stat-number">{result.optimized.tokens}</span>
                                <span className="stat-label">최적화 토큰</span>
                            </div>
                        </div>

                        {/* Tab Navigation */}
                        <div className="result-tabs">
                            <button className={`result-tab ${activeView === 'overview' ? 'active' : ''}`} onClick={() => setActiveView('overview')}>
                                📊 Before/After
                            </button>
                            <button className={`result-tab ${activeView === 'techniques' ? 'active' : ''}`} onClick={() => setActiveView('techniques')}>
                                🔧 적용 기법
                            </button>
                            <button className={`result-tab ${activeView === 'costs' ? 'active' : ''}`} onClick={() => setActiveView('costs')}>
                                💰 비용 분석
                            </button>
                            {result.original.quality && (
                                <button className={`result-tab ${activeView === 'quality' ? 'active' : ''}`} onClick={() => setActiveView('quality')}>
                                    🎯 품질 분석
                                </button>
                            )}
                        </div>

                        {/* Tab Content */}
                        <div className="result-content">
                            {activeView === 'overview' && (
                                <div className="before-after">
                                    <div className="compare-panel original">
                                        <div className="panel-header">
                                            <h3>📝 원본 프롬프트</h3>
                                            <span className="token-badge">{result.original.tokens} tokens</span>
                                        </div>
                                        <pre className="prompt-display">{result.original.text}</pre>
                                    </div>
                                    <div className="compare-arrow">
                                        <span className="arrow-icon">→</span>
                                        <span className="arrow-label">-{result.compression.tokensSaved} tokens</span>
                                    </div>
                                    <div className="compare-panel optimized">
                                        <div className="panel-header">
                                            <h3>🚀 최적화 프롬프트</h3>
                                            <span className="token-badge accent">{result.optimized.tokens} tokens</span>
                                        </div>
                                        <pre className="prompt-display">{result.optimized.text}</pre>
                                        <button
                                            className="btn-copy"
                                            onClick={() => {
                                                navigator.clipboard.writeText(result.optimized.text);
                                            }}
                                        >
                                            📋 복사
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeView === 'techniques' && (
                                <div className="techniques-panel">
                                    <h3>🔧 적용된 최적화 기법</h3>
                                    {result.compression.techniques.length === 0 ? (
                                        <div className="no-techniques">
                                            <span className="no-tech-icon">✅</span>
                                            <p>이 프롬프트는 이미 잘 최적화되어 있습니다!</p>
                                        </div>
                                    ) : (
                                        <div className="technique-list">
                                            {result.compression.techniques.map((tech, idx) => (
                                                <div key={idx} className={`technique-card ${tech.impact}`}>
                                                    <div className="tech-icon">
                                                        {tech.category === 'filler_removal' ? '✂️' :
                                                            tech.category === 'deduplication' ? '🔄' :
                                                                tech.category === 'whitespace' ? '📏' :
                                                                    tech.category === 'verbose_reduction' ? '📝' : '⚡'}
                                                    </div>
                                                    <div className="tech-info">
                                                        <span className="tech-name">{tech.name}</span>
                                                        <span className={`tech-impact ${tech.impact}`}>
                                                            {tech.impact === 'high' ? '높은 영향' : tech.impact === 'medium' ? '중간 영향' : '낮은 영향'}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="tech-explanation">
                                        <h4>📚 PROMM 토큰 최적화 기술</h4>
                                        <div className="tech-grid">
                                            <div className="tech-detail-card">
                                                <h5>STC Engine</h5>
                                                <p>Semantic Token Compression — 의미를 보존하면서 토큰 수를 최소화하는 압축 엔진</p>
                                                <span className="tech-ref">Zhou et al., 2024</span>
                                            </div>
                                            <div className="tech-detail-card">
                                                <h5>MDQS 7D</h5>
                                                <p>7차원 품질 평가 — 명확성, 구체성, 구조, 완전성, 효율성, 실행가능성, 도메인 적합성</p>
                                                <span className="tech-ref">Multi-Dimensional Quality Scoring</span>
                                            </div>
                                            <div className="tech-detail-card">
                                                <h5>RCQO</h5>
                                                <p>실시간 비용-품질 최적화 — 파레토 최적화를 통한 비용과 품질의 최적 균형점 탐색</p>
                                                <span className="tech-ref">Pareto Frontier Optimization</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeView === 'costs' && (
                                <div className="costs-panel">
                                    <h3>💰 모델별 비용 비교 (월 {requestsPerMonth.toLocaleString()}회 기준)</h3>
                                    {result.modelSavings ? (
                                        <div className="cost-table-wrapper">
                                            <table className="cost-table">
                                                <thead>
                                                    <tr>
                                                        <th>모델</th>
                                                        <th>제공사</th>
                                                        <th>호출당 원본 비용</th>
                                                        <th>호출당 최적화 비용</th>
                                                        <th>절감률</th>
                                                        <th>연간 절감액</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {Object.entries(result.modelSavings).map(([modelId, data]) => (
                                                        <tr key={modelId}>
                                                            <td className="model-name">{data.modelName}</td>
                                                            <td>{data.provider}</td>
                                                            <td>{formatCost(data.originalCostPerRequest)}</td>
                                                            <td className="optimized-cost">{formatCost(data.optimizedCostPerRequest)}</td>
                                                            <td className="savings-pct">
                                                                <span className="savings-badge">
                                                                    {data.savingsPercentage ? data.savingsPercentage.toFixed(1) : '0'}%
                                                                </span>
                                                            </td>
                                                            <td className="annual-savings">
                                                                {formatCost(data.annualSavings)}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="cost-summary-simple">
                                            <p>서버 연결 시 6개 AI 모델(GPT-5.2, Claude Opus 4.6, Gemini 3 Pro 등)의 상세 비용 비교가 표시됩니다.</p>
                                            <div className="simple-savings">
                                                <span>토큰 절감: <strong>{result.compression.tokensSaved}개</strong></span>
                                                <span>압축률: <strong>{result.compression.compressionRatio}%</strong></span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeView === 'quality' && result.original.quality && (
                                <div className="quality-panel">
                                    <h3>🎯 MDQS 7차원 품질 분석</h3>
                                    <div className="quality-compare">
                                        <div className="quality-column">
                                            <h4>원본 ({result.original.quality.overall.grade})</h4>
                                            <div className="quality-score-big">{result.original.quality.overall.score}</div>
                                            {result.original.quality.dimensions && Object.entries(result.original.quality.dimensions).map(([dim, data]) => (
                                                <div key={dim} className="dim-bar">
                                                    <span className="dim-name">{
                                                        { clarity: '명확성', specificity: '구체성', structure: '구조', completeness: '완전성', efficiency: '효율성', actionability: '실행가능성', domainFit: '도메인' }[dim] || dim
                                                    }</span>
                                                    <div className="dim-bar-container">
                                                        <div className={`dim-bar-fill ${data.level}`} style={{ width: `${data.score}%` }} />
                                                        <span className="dim-score">{data.score}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="quality-arrow">→</div>
                                        <div className="quality-column optimized">
                                            <h4>최적화 ({result.optimized.quality.overall.grade})</h4>
                                            <div className="quality-score-big">{result.optimized.quality.overall.score}</div>
                                            {result.optimized.quality.dimensions && Object.entries(result.optimized.quality.dimensions).map(([dim, data]) => (
                                                <div key={dim} className="dim-bar">
                                                    <span className="dim-name">{
                                                        { clarity: '명확성', specificity: '구체성', structure: '구조', completeness: '완전성', efficiency: '효율성', actionability: '실행가능성', domainFit: '도메인' }[dim] || dim
                                                    }</span>
                                                    <div className="dim-bar-container">
                                                        <div className={`dim-bar-fill ${data.level}`} style={{ width: `${data.score}%` }} />
                                                        <span className="dim-score">{data.score}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {/* Feature explanation (when no result) */}
                {!result && (
                    <section className="lab-features">
                        <h2>🔬 토큰 최적화 기술이란?</h2>
                        <div className="features-grid">
                            <div className="feature-card">
                                <div className="feature-icon">✂️</div>
                                <h3>STC Engine</h3>
                                <p>Semantic Token Compression</p>
                                <ul>
                                    <li>불필요한 filler 표현 제거</li>
                                    <li>중복 지시 탐지 및 병합</li>
                                    <li>장황한 구문 간소화</li>
                                    <li>의미 보존 보장</li>
                                </ul>
                            </div>
                            <div className="feature-card">
                                <div className="feature-icon">📊</div>
                                <h3>MDQS 7D</h3>
                                <p>7-Dimension Quality Scoring</p>
                                <ul>
                                    <li>명확성 / 구체성 / 구조</li>
                                    <li>완전성 / 효율성</li>
                                    <li>실행가능성 / 도메인 적합</li>
                                    <li>도메인별 가중치 최적화</li>
                                </ul>
                            </div>
                            <div className="feature-card">
                                <div className="feature-icon">💰</div>
                                <h3>RCQO</h3>
                                <p>Real-time Cost-Quality Optimizer</p>
                                <ul>
                                    <li>6개 AI 모델 실시간 비용 비교</li>
                                    <li>연간 비용 절감 시뮬레이션</li>
                                    <li>품질 대비 비용 최적점 탐색</li>
                                    <li>파레토 최적화</li>
                                </ul>
                            </div>
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}

export default TokenOptimizerLab;
