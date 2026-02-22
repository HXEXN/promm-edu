import { useState } from 'react';
import './Advanced2026Demo.css';

/**
 * 2026 AI 기술 데모 컴포넌트
 * GraphRAG, Corrective RAG, DSPy, ToT, LangGraph 시각화
 */
function Advanced2026Demo() {
    const [activeTab, setActiveTab] = useState('graph-rag');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [inputText, setInputText] = useState('');

    const technologies = [
        {
            id: 'graph-rag',
            name: 'GraphRAG',
            icon: '🕸️',
            description: '지식 그래프 기반 멀티홉 추론',
            paper: 'Microsoft Research 2024-2025'
        },
        {
            id: 'corrective-rag',
            name: 'Corrective RAG',
            icon: '🔄',
            description: '자기 수정 검색 증강 생성',
            paper: 'Yan et al. 2024'
        },
        {
            id: 'dspy-optimizer',
            name: 'DSPy 3.0',
            icon: '⚡',
            description: '선언적 프롬프트 자동 최적화',
            paper: 'Stanford NLP 2025'
        },
        {
            id: 'tree-of-thoughts',
            name: 'Tree of Thoughts',
            icon: '🌳',
            description: '다중 추론 경로 탐색',
            paper: 'Yao et al. 2024'
        },
        {
            id: 'langgraph',
            name: 'LangGraph',
            icon: '🔗',
            description: '상태 기반 에이전트 워크플로우',
            paper: 'LangChain 2025'
        }
    ];

    const samplePrompts = {
        'graph-rag': '토마토 재배 시 온도와 습도가 생산량에 미치는 영향을 분석해주세요. Temperature affects tomato growth.',
        'corrective-rag': 'Smart farm systems use sensors to monitor temperature and humidity levels. The optimal temperature for tomatoes is 25°C.',
        'dspy-optimizer': '스마트팜에서 작물 생육을 모니터링하는 프롬프트를 작성해주세요.',
        'tree-of-thoughts': '스마트팜 자동화 시스템을 개선하기 위한 최적의 전략을 찾아주세요.',
        'langgraph': '사용자 질문에 대해 문서를 검색하고 답변을 생성하는 워크플로우'
    };

    const runDemo = async () => {
        setLoading(true);
        setResult(null);

        try {
            const response = await fetch('/api/advanced2026', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: inputText || samplePrompts[activeTab],
                    feature: activeTab,
                    options: getOptionsForTab(activeTab)
                })
            });

            const data = await response.json();
            setResult(data);
        } catch (error) {
            setResult({ error: error.message });
        } finally {
            setLoading(false);
        }
    };

    const getOptionsForTab = (tab) => {
        switch (tab) {
            case 'graph-rag':
                return {
                    documents: [inputText || samplePrompts[tab]],
                    maxHops: 3
                };
            case 'corrective-rag':
                return {
                    sources: [(inputText || samplePrompts[tab])],
                    response: inputText || samplePrompts[tab]
                };
            case 'tree-of-thoughts':
                return { method: 'bfs', maxDepth: 3 };
            case 'langgraph':
                return { workflowType: 'rag' };
            default:
                return {};
        }
    };

    const renderResult = () => {
        if (!result) return null;
        if (result.error) {
            return <div className="demo-error">❌ {result.error}</div>;
        }

        const data = result.data;

        switch (activeTab) {
            case 'graph-rag':
                return (
                    <div className="result-section">
                        <h4>🕸️ Knowledge Graph</h4>
                        <div className="stats-grid">
                            <div className="stat-card">
                                <span className="stat-value">{data?.graph?.entities || 0}</span>
                                <span className="stat-label">Entities</span>
                            </div>
                            <div className="stat-card">
                                <span className="stat-value">{data?.graph?.relationships || 0}</span>
                                <span className="stat-label">Relationships</span>
                            </div>
                            <div className="stat-card">
                                <span className="stat-value">{data?.paths?.length || 0}</span>
                                <span className="stat-label">Paths Found</span>
                            </div>
                        </div>
                        {data?.reasoning && (
                            <div className="reasoning-box">
                                <strong>Multi-hop Reasoning:</strong>
                                <p>{data.reasoning}</p>
                            </div>
                        )}
                        {data?.graph?.communities?.length > 0 && (
                            <div className="communities-list">
                                <strong>Communities:</strong>
                                {data.graph.communities.map((c, i) => (
                                    <div key={i} className="community-item">
                                        {c.summary}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );

            case 'corrective-rag':
                return (
                    <div className="result-section">
                        <h4>🔄 Self-Critique Results</h4>
                        <div className="critique-grid">
                            {data?.selfCritique?.checks && Object.entries(data.selfCritique.checks).map(([key, value]) => (
                                <div key={key} className="critique-card">
                                    <div className="critique-header">
                                        <span className="critique-name">{key}</span>
                                        <span className={`critique-score ${value.score >= 70 ? 'good' : 'warning'}`}>
                                            {value.score?.toFixed(0)}%
                                        </span>
                                    </div>
                                    {value.issue && <p className="critique-issue">⚠️ {value.issue}</p>}
                                </div>
                            ))}
                        </div>
                        <div className="hallucination-summary">
                            <strong>Hallucination Rate:</strong> {data?.hallucinationCheck?.hallucinationRate || 'N/A'}
                        </div>
                    </div>
                );

            case 'dspy-optimizer':
                return (
                    <div className="result-section">
                        <h4>⚡ Prompt Optimization</h4>
                        {data?.original && (
                            <div className="optimization-comparison">
                                <div className="opt-card original">
                                    <h5>Original</h5>
                                    <p>{data.original.text}</p>
                                    <div className="score-bar">
                                        <div
                                            className="score-fill"
                                            style={{ width: `${data.original.score?.overall || 0}%` }}
                                        />
                                        <span>{data.original.score?.overall?.toFixed(1)}%</span>
                                    </div>
                                </div>
                                <div className="opt-arrow">→</div>
                                <div className="opt-card optimized">
                                    <h5>Optimized ({data.optimized?.mutation})</h5>
                                    <p>{data.optimized?.text}</p>
                                    <div className="score-bar optimized">
                                        <div
                                            className="score-fill"
                                            style={{ width: `${data.optimized?.score?.overall || 0}%` }}
                                        />
                                        <span>{data.optimized?.score?.overall?.toFixed(1)}%</span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="improvement-badge">
                            📈 Improvement: {data?.improvement || 'N/A'}
                        </div>
                    </div>
                );

            case 'tree-of-thoughts':
                return (
                    <div className="result-section">
                        <h4>🌳 Tree of Thoughts</h4>
                        <div className="stats-grid">
                            <div className="stat-card">
                                <span className="stat-value">{data?.exploredNodes || 0}</span>
                                <span className="stat-label">Nodes Explored</span>
                            </div>
                            <div className="stat-card">
                                <span className="stat-value">{data?.solutions?.length || 0}</span>
                                <span className="stat-label">Solutions Found</span>
                            </div>
                        </div>
                        {data?.bestSolution && (
                            <div className="best-solution">
                                <h5>Best Solution (Score: {data.bestSolution.score?.toFixed(1)})</h5>
                                <p><strong>Strategy:</strong> {data.bestSolution.thought?.content?.strategy}</p>
                                <div className="steps-list">
                                    {data.bestSolution.thought?.content?.steps?.map((step, i) => (
                                        <div key={i} className="step-item">
                                            <span className="step-num">{i + 1}</span>
                                            {step}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {data?.consensus && (
                            <div className="consensus-box">
                                <strong>Self-Consistency:</strong> {data.consensus.consensusRatio} agreement
                            </div>
                        )}
                    </div>
                );

            case 'langgraph':
                return (
                    <div className="result-section">
                        <h4>🔗 Workflow Execution</h4>
                        <p className="workflow-desc">{data?.description}</p>
                        <div className="workflow-graph">
                            {data?.graph?.nodes?.map((node, i) => (
                                <div key={i} className={`graph-node ${node.type}`}>
                                    <span className="node-name">{node.label}</span>
                                    <span className="node-type">{node.type}</span>
                                </div>
                            ))}
                        </div>
                        <div className="execution-summary">
                            <strong>Execution:</strong>
                            {data?.execution?.success ? ' ✅ Completed' : ' ⏳ In Progress'}
                            ({data?.execution?.totalSteps || 0} steps)
                        </div>
                    </div>
                );

            default:
                return <pre>{JSON.stringify(data, null, 2)}</pre>;
        }
    };

    return (
        <div className="advanced-2026-demo">
            <div className="demo-header">
                <h2>🚀 2026 AI Technologies</h2>
                <p>최신 AI 연구 기반 프롬프트 엔지니어링 기술</p>
            </div>

            <div className="tech-tabs">
                {technologies.map(tech => (
                    <button
                        key={tech.id}
                        className={`tech-tab ${activeTab === tech.id ? 'active' : ''}`}
                        onClick={() => {
                            setActiveTab(tech.id);
                            setResult(null);
                            setInputText('');
                        }}
                    >
                        <span className="tech-icon">{tech.icon}</span>
                        <span className="tech-name">{tech.name}</span>
                    </button>
                ))}
            </div>

            <div className="demo-content">
                <div className="tech-info">
                    {technologies.find(t => t.id === activeTab) && (
                        <>
                            <h3>
                                {technologies.find(t => t.id === activeTab).icon}{' '}
                                {technologies.find(t => t.id === activeTab).name}
                            </h3>
                            <p>{technologies.find(t => t.id === activeTab).description}</p>
                            <span className="paper-ref">
                                📄 {technologies.find(t => t.id === activeTab).paper}
                            </span>
                        </>
                    )}
                </div>

                <div className="demo-input">
                    <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder={samplePrompts[activeTab]}
                        rows={4}
                    />
                    <button
                        className="run-demo-btn"
                        onClick={runDemo}
                        disabled={loading}
                    >
                        {loading ? '⏳ Processing...' : '▶️ Run Demo'}
                    </button>
                </div>

                <div className="demo-result">
                    {loading && (
                        <div className="loading-indicator">
                            <div className="spinner" />
                            <p>Processing with {technologies.find(t => t.id === activeTab)?.name}...</p>
                        </div>
                    )}
                    {renderResult()}
                </div>
            </div>
        </div>
    );
}

export default Advanced2026Demo;
