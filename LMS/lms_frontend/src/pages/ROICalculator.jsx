import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ROICalculator.css';

function ROICalculator() {
    const navigate = useNavigate();

    const [promptsPerMonth, setPromptsPerMonth] = useState(5000);
    const [avgTokens, setAvgTokens] = useState(1500);
    const [selectedModel, setSelectedModel] = useState('gpt-5.2');

    // Model pricing (per 1K tokens) - 2026 Feb Latest
    const modelPricing = {
        'gpt-5.2': { name: 'GPT-5.2 (Garlic)', price: 0.025 },
        'gpt-5': { name: 'GPT-5', price: 0.02 },
        'claude-opus-4.6': { name: 'Claude Opus 4.6', price: 0.018 },
        'gemini-3-pro': { name: 'Gemini 3 Pro', price: 0.00175 }
    };


    // Calculate costs
    const model = modelPricing[selectedModel];
    const originalCost = (promptsPerMonth * avgTokens * model.price) / 1000;

    // Optimization assumptions
    const optimizationRate = 0.30; // 30% reduction
    const optimizedTokens = avgTokens * (1 - optimizationRate);
    const optimizedCost = (promptsPerMonth * optimizedTokens * model.price) / 1000;

    const monthlySavings = originalCost - optimizedCost;
    const annualSavings = monthlySavings * 12;

    // Platform cost
    const platformCostMonthly = 800; // $800/month (Professional plan)
    const platformCostAnnual = platformCostMonthly * 12;

    // ROI calculation
    const netMonthlySavings = monthlySavings - platformCostMonthly;
    const netAnnualSavings = annualSavings - platformCostAnnual;
    const roi = (netAnnualSavings / platformCostAnnual) * 100;

    // Monthly savings data for chart
    const monthlySavingsData = Array.from({ length: 12 }, (_, i) => ({
        month: i + 1,
        savings: monthlySavings * (i + 1) - platformCostMonthly * (i + 1)
    }));

    return (
        <div className="roi-calculator-page">
            <header className="roi-hero">
                <h1>💰 ROI 계산기</h1>
                <p className="hero-subtitle">
                    SmartFarm으로 절감할 수 있는 비용을 확인해보세요
                </p>
            </header>

            <div className="roi-container">
                {/* Input Section */}
                <div className="input-section">
                    <h2>회사 정보 입력</h2>

                    <div className="input-group">
                        <label>
                            월간 프롬프트 실행 횟수
                            <span className="current-value">{promptsPerMonth.toLocaleString()}회</span>
                        </label>
                        <input
                            type="range"
                            min="100"
                            max="100000"
                            step="100"
                            value={promptsPerMonth}
                            onChange={(e) => setPromptsPerMonth(parseInt(e.target.value))}
                            className="slider"
                        />
                        <div className="slider-labels">
                            <span>100</span>
                            <span>50K</span>
                            <span>100K+</span>
                        </div>
                    </div>

                    <div className="input-group">
                        <label>
                            평균 프롬프트 토큰 수
                        </label>
                        <input
                            type="number"
                            value={avgTokens}
                            onChange={(e) => setAvgTokens(parseInt(e.target.value) || 0)}
                            className="number-input"
                            placeholder="1500"
                        />
                        <p className="input-hint">
                            💡 일반적인 프롬프트는 500-2000 토큰입니다
                        </p>
                    </div>

                    <div className="input-group">
                        <label>사용 중인 AI 모델</label>
                        <select
                            value={selectedModel}
                            onChange={(e) => setSelectedModel(e.target.value)}
                            className="model-select"
                        >
                            {Object.entries(modelPricing).map(([key, value]) => (
                                <option key={key} value={key}>
                                    {value.name} (${value.price}/1K tokens)
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Results Section */}
                <div className="results-section">
                    <h2>💎 절감 효과</h2>

                    <div className="result-cards">
                        <div className="result-card highlight">
                            <div className="card-icon">📅</div>
                            <h3>월간 절감액</h3>
                            <div className="amount">${monthlySavings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                            <p className="card-detail">
                                원본 비용: ${originalCost.toFixed(2)}<br />
                                최적화 후: ${optimizedCost.toFixed(2)}
                            </p>
                        </div>

                        <div className="result-card">
                            <div className="card-icon">📆</div>
                            <h3>연간 절감액</h3>
                            <div className="amount">${annualSavings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                            <p className="card-detail">
                                플랫폼 비용 차감 전
                            </p>
                        </div>

                        <div className={`result-card ${roi > 0 ? 'positive' : 'neutral'}`}>
                            <div className="card-icon">📈</div>
                            <h3>ROI</h3>
                            <div className="percentage">{roi.toFixed(0)}%</div>
                            <p className="roi-explanation">
                                {roi > 100
                                    ? `플랫폼 비용보다 ${(roi - 100).toFixed(0)}% 더 절감`
                                    : roi > 0
                                        ? '플랫폼 비용 대비 긍정적 ROI'
                                        : '더 많은 사용량으로 ROI 개선 가능'}
                            </p>
                        </div>
                    </div>

                    {/* Net Savings */}
                    <div className="net-savings-box">
                        <h4>순 절감액 (플랫폼 비용 차감 후)</h4>
                        <div className="net-savings-grid">
                            <div className="net-item">
                                <span className="label">월간</span>
                                <span className={`value ${netMonthlySavings > 0 ? 'positive' : 'negative'}`}>
                                    ${netMonthlySavings.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                            <div className="net-item">
                                <span className="label">연간</span>
                                <span className={`value ${netAnnualSavings > 0 ? 'positive' : 'negative'}`}>
                                    ${netAnnualSavings.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                        </div>
                        <p className="platform-cost-note">
                            * 플랫폼 비용: ${platformCostMonthly}/월 (Professional 플랜)
                        </p>
                    </div>

                    {/* Simple Bar Chart */}
                    <div className="savings-chart">
                        <h4>12개월 누적 순 절감 효과</h4>
                        <div className="chart-bars">
                            {monthlySavingsData.map((data, index) => {
                                const maxSavings = Math.max(...monthlySavingsData.map(d => d.savings));
                                const barHeight = maxSavings > 0 ? (data.savings / maxSavings) * 100 : 0;
                                const isPositive = data.savings >= 0;

                                return (
                                    <div key={index} className="bar-wrapper">
                                        <div
                                            className={`bar ${isPositive ? 'positive' : 'negative'}`}
                                            style={{ height: `${Math.abs(barHeight)}%` }}
                                            title={`${data.month}월: $${data.savings.toFixed(0)}`}
                                        />
                                        <span className="bar-label">{data.month}월</span>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="chart-legend">
                            <span className="legend-item">
                                <span className="legend-color positive"></span>
                                순 이익
                            </span>
                            <span className="legend-item">
                                <span className="legend-color negative"></span>
                                손실
                            </span>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="roi-cta">
                    <h3>🚀 당신의 기업도 이만큼 절감할 수 있습니다</h3>
                    <p>
                        SmartFarm의 프롬프트 최적화 엔진으로 평균 30% 비용을 절감하고<br />
                        생산성은 45% 향상시킬 수 있습니다.
                    </p>
                    <div className="cta-buttons">
                        <button onClick={() => navigate('/free-trial')} className="btn-primary">
                            무료로 체험하기
                        </button>
                        <button onClick={() => navigate('/contact')} className="btn-secondary">
                            무료 상담 신청
                        </button>
                    </div>
                </div>

                {/* Assumptions */}
                <div className="assumptions-note">
                    <h4>📌 계산 가정</h4>
                    <ul>
                        <li>프롬프트 최적화율: <strong>30%</strong> (토큰 수 감소)</li>
                        <li>성능 유지율: <strong>97%</strong> (품질 거의 동일)</li>
                        <li>플랫폼 비용: <strong>${platformCostMonthly}/월</strong> (Professional 플랜 기준)</li>
                        <li>추가 이점: 생산성 향상, 응답 속도 개선은 미포함</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default ROICalculator;
