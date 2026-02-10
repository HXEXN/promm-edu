import { useState } from 'react';
import './AdvancedOptimizer.css';

function AdvancedOptimizer() {
    const [inputText, setInputText] = useState('');
    const [domain, setDomain] = useState('general');
    const [compressionLevel, setCompressionLevel] = useState('MODERATE');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('analyze');

    const handleAnalyze = async () => {
        if (!inputText.trim()) return;

        setLoading(true);
        try {
            const response = await fetch('http://localhost:3000/api/advanced/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: inputText, domain, compressionLevel })
            });
            const data = await response.json();

            if (data.success) {
                setResult(data.data);
            }
        } catch (error) {
            console.error('Analysis failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOptimize = async () => {
        if (!inputText.trim()) return;

        setLoading(true);
        try {
            const response = await fetch('http://localhost:3000/api/advanced/optimize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: inputText, priority: 'balanced' })
            });
            const data = await response.json();

            if (data.success) {
                setResult(data.data);
            }
        } catch (error) {
            console.error('Optimization failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderQualityRadar = (dimensions) => {
        const dimensionNames = {
            clarity: '명확성', specificity: '구체성', structure: '구조성',
            completeness: '완전성', efficiency: '효율성', actionability: '실행가능성', domainFit: '도메인'
        };

        return (
            <div className="quality-radar">
                <h4>7D Quality Analysis</h4>
                <div className="radar-grid">
                    {Object.entries(dimensions).map(([key, data]) => (
                        <div key={key} className="dimension-bar">
                            <span className="dimension-name">{dimensionNames[key]}</span>
                            <div className="bar-container">
                                <div
                                    className={`bar-fill ${data.level}`}
                                    style={{ width: `${data.score}%` }}
                                />
                                <span className="bar-score">{data.score}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderCompression = (compression) => {
        return (
            <div className="compression-result">
                <h4>Token Compression Analysis</h4>
                <div className="compression-stats">
                    <div className="stat-card">
                        <span className="stat-value">{compression.tokensSaved}</span>
                        <span className="stat-label">토큰 절감</span>
                    </div>
                    <div className="stat-card highlight">
                        <span className="stat-value">{compression.compressionRatio.toFixed(1)}%</span>
                        <span className="stat-label">압축률</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-value">{compression.qualityScore}</span>
                        <span className="stat-label">품질 점수</span>
                    </div>
                </div>
                {compression.qualityPreserved ? (
                    <div className="quality-badge success">✅ 의미 보존 성공</div>
                ) : (
                    <div className="quality-badge warning">⚠️ 품질 손실 가능</div>
                )}
            </div>
        );
    };

    const renderCostSavings = (costSavings) => {
        return (
            <div className="cost-savings">
                <h4>💰 모델별 비용 절감</h4>
                <div className="model-costs">
                    {Object.entries(costSavings).map(([model, data]) => (
                        <div key={model} className="model-cost-card">
                            <h5>{model}</h5>
                            <div className="cost-details">
                                <p><strong>호출당 절감:</strong> ${data.savedPerCall}</p>
                                <p><strong>절감률:</strong> {data.savedPercentage}%</p>
                                <p><strong>월 1000회:</strong> ${data.monthly1000Calls}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderRecommendations = (recommendations) => {
        if (!recommendations || recommendations.length === 0) return null;

        return (
            <div className="recommendations">
                <h4>🎯 개선 추천</h4>
                {recommendations.map((rec, idx) => (
                    <div key={idx} className={`recommendation-card ${rec.type}`}>
                        <div className="rec-header">
                            <span className="rec-dimension">{rec.dimension}</span>
                            <span className={`rec-priority ${rec.priority}`}>{rec.priority}</span>
                        </div>
                        {rec.message && <p className="rec-message">{rec.message}</p>}
                        {rec.suggestions && (
                            <ul className="rec-suggestions">
                                {rec.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                            </ul>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    const renderOptimizationResult = () => {
        if (!result) return null;

        if (result.modelComparison) {
            // Optimization result
            return (
                <div className="optimization-result">
                    <div className="current-quality">
                        <h3>현재 품질: {result.currentQuality.grade}</h3>
                        <p>점수: {result.currentQuality.score}/100</p>
                    </div>

                    <div className="model-recommendation">
                        <h4>🚀 추천 모델</h4>
                        <div className="recommended-model">
                            <h3>{result.recommendation.modelName}</h3>
                            <p>{result.recommendation.reason}</p>
                            <div className="rec-stats">
                                <span>예상 품질: {result.recommendation.expectedQuality}%</span>
                                <span>월간 비용: ${result.recommendation.estimatedMonthlyCost}</span>
                            </div>
                        </div>
                    </div>

                    <div className="potential-savings">
                        <h4>💵 잠재적 절감액</h4>
                        <p>월 1000회 호출 시: <strong>${result.potentialSavings.monthly1000Calls}</strong></p>
                        <p>비용 절감률: <strong>{result.potentialSavings.percentageSaved}%</strong></p>
                    </div>
                </div>
            );
        }

        // Analyze result
        return (
            <div className="analysis-result">
                <div className="result-section">
                    <h3>✅ 원본 분석</h3>
                    <p>토큰 수: {result.original.tokens}</p>
                    <p>품질 등급: {result.original.quality.overall.grade}</p>
                    {renderQualityRadar(result.original.quality.dimensions)}
                </div>

                <div className="result-section optimized">
                    <h3>🚀 최적화 결과</h3>
                    <p>토큰 수: {result.optimized.tokens}</p>
                    <p>품질 등급: {result.optimized.quality.overall.grade}</p>
                    {renderCompression(result.compression)}
                </div>

                <div className="result-section">
                    <h3>📤 최적화된 프롬프트</h3>
                    <pre className="optimized-text">{result.optimized.text}</pre>
                    <button
                        className="btn-copy"
                        onClick={() => navigator.clipboard.writeText(result.optimized.text)}
                    >
                        📋 복사
                    </button>
                </div>

                {renderCostSavings(result.costSavings)}
                {renderRecommendations(result.original.quality.recommendations)}
            </div>
        );
    };

    return (
        <div className="advanced-optimizer-page">
            <header className="optimizer-header">
                <h1>🔬 PROMM Advanced Optimizer</h1>
                <p className="header-subtitle">
                    특허 수준 기술로 프롬프트를 분석하고 최적화합니다
                </p>
                <div className="patent-badges">
                    <span className="badge">STC Engine</span>
                    <span className="badge">MDQS 7D</span>
                    <span className="badge">RCQO</span>
                </div>
            </header>

            <div className="optimizer-container">
                <div className="input-section">
                    <div className="tab-buttons">
                        <button
                            className={`tab-btn ${activeTab === 'analyze' ? 'active' : ''}`}
                            onClick={() => setActiveTab('analyze')}
                        >
                            📊 종합 분석
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'optimize' ? 'active' : ''}`}
                            onClick={() => setActiveTab('optimize')}
                        >
                            💡 비용 최적화
                        </button>
                    </div>

                    <textarea
                        className="prompt-input"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="분석할 프롬프트를 입력하세요..."
                        rows={10}
                    />

                    <div className="options-row">
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
                            <label>압축 레벨</label>
                            <select value={compressionLevel} onChange={(e) => setCompressionLevel(e.target.value)}>
                                <option value="LIGHT">경량 (85%)</option>
                                <option value="MODERATE">표준 (70%)</option>
                                <option value="AGGRESSIVE">적극적 (55%)</option>
                                <option value="EXTREME">극대화 (40%)</option>
                            </select>
                        </div>
                    </div>

                    <button
                        className="btn-analyze"
                        onClick={activeTab === 'analyze' ? handleAnalyze : handleOptimize}
                        disabled={loading || !inputText.trim()}
                    >
                        {loading ? '분석 중...' : activeTab === 'analyze' ? '🔬 종합 분석 시작' : '💡 비용 최적화'}
                    </button>
                </div>

                <div className="result-section-wrapper">
                    {result ? renderOptimizationResult() : (
                        <div className="placeholder">
                            <h3>분석 결과가 여기에 표시됩니다</h3>
                            <p>프롬프트를 입력하고 분석을 시작하세요</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="tech-info">
                <h3>🔧 적용 기술</h3>
                <div className="tech-cards">
                    <div className="tech-card">
                        <h4>STC Engine</h4>
                        <p>Semantic Token Compression - 의미 보존 토큰 압축</p>
                        <span className="tech-ref">Zhou et al., 2024</span>
                    </div>
                    <div className="tech-card">
                        <h4>MDQS 7D</h4>
                        <p>Multi-Dimensional Quality Scoring - 7차원 품질 평가</p>
                        <span className="tech-ref">Kadavath et al., 2022</span>
                    </div>
                    <div className="tech-card">
                        <h4>RCQO</h4>
                        <p>Real-time Cost-Quality Optimizer - 비용-품질 최적화</p>
                        <span className="tech-ref">Pareto Optimization</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdvancedOptimizer;
