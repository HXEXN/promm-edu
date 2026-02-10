import { useState, useEffect } from 'react';
import './ModelCostComparison.css';

function ModelCostComparison({ costAnalysis }) {
    const [showDetails, setShowDetails] = useState(false);

    if (!costAnalysis || !costAnalysis.models) {
        return null;
    }

    const { models, cheapest, mostExpensive, maxSavings, maxSavingsPercentage } = costAnalysis;

    // Format currency
    const formatCost = (cost) => {
        if (cost < 0.00001) return `$${(cost * 1000000).toFixed(2)}/1M`;
        if (cost < 0.01) return `$${(cost * 1000).toFixed(4)}/1K`;
        return `$${cost.toFixed(6)}`;
    };

    return (
        <div className="model-cost-comparison">
            <div className="comparison-header">
                <h3>💰 모델별 비용 비교</h3>
                <button
                    className="toggle-details-btn"
                    onClick={() => setShowDetails(!showDetails)}
                >
                    {showDetails ? '간단히 보기' : '상세 보기'}
                </button>
            </div>

            <div className="best-choice-banner">
                <div className="banner-icon">🏆</div>
                <div className="banner-content">
                    <div className="banner-title">최적 모델</div>
                    <div className="banner-model">{cheapest.modelName}</div>
                    <div className="banner-cost">{formatCost(cheapest.totalCost)}</div>
                </div>
                <div className="banner-savings">
                    <div className="savings-label">최대 절감</div>
                    <div className="savings-value">{maxSavingsPercentage.toFixed(0)}%</div>
                </div>
            </div>

            {showDetails && (
                <div className="models-list fade-in">
                    {models.map((model, index) => (
                        <div
                            key={model.modelId}
                            className={`model-card ${index === 0 ? 'cheapest' : ''} ${index === models.length - 1 ? 'expensive' : ''}`}
                        >
                            <div className="model-header">
                                <div className="model-info">
                                    <div className="model-name">{model.modelName}</div>
                                    <div className="model-provider">{model.provider}</div>
                                </div>
                                {index === 0 && <span className="badge best">최저가</span>}
                                {index === models.length - 1 && <span className="badge expensive">최고가</span>}
                            </div>

                            <div className="cost-breakdown">
                                <div className="cost-row">
                                    <span className="cost-label">입력 토큰:</span>
                                    <span className="cost-value">{formatCost(model.inputCost)}</span>
                                </div>
                                <div className="cost-row">
                                    <span className="cost-label">출력 토큰:</span>
                                    <span className="cost-value">{formatCost(model.outputCost)}</span>
                                </div>
                                <div className="cost-row total">
                                    <span className="cost-label">총 비용:</span>
                                    <span className="cost-value">{formatCost(model.totalCost)}</span>
                                </div>
                            </div>

                            {model.savingsVsMostExpensive > 0 && (
                                <div className="savings-info">
                                    <span className="savings-icon">💵</span>
                                    <span className="savings-text">
                                        최고가 대비 {formatCost(model.savingsVsMostExpensive)} 절감
                                        ({model.savingsPercentage.toFixed(0)}%)
                                    </span>
                                </div>
                            )}

                            <div className="annual-projection">
                                <div className="projection-label">연간 10만회 기준</div>
                                <div className="projection-value">
                                    {formatCost(model.totalCost * 100000)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!showDetails && (
                <div className="quick-comparison">
                    <div className="quick-item best">
                        <div className="quick-label">가장 저렴</div>
                        <div className="quick-model">{cheapest.modelName}</div>
                        <div className="quick-cost">{formatCost(cheapest.totalCost)}</div>
                    </div>
                    <div className="quick-divider">vs</div>
                    <div className="quick-item">
                        <div className="quick-label">가장 비쌈</div>
                        <div className="quick-model">{mostExpensive.modelName}</div>
                        <div className="quick-cost">{formatCost(mostExpensive.totalCost)}</div>
                    </div>
                </div>
            )}

            <div className="recommendation-box">
                <div className="rec-icon">💡</div>
                <div className="rec-content">
                    <strong>추천:</strong> 일반적인 작업의 경우 <strong>{cheapest.modelName}</strong>을 사용하면
                    비용 효율이 가장 좋습니다. 복잡한 작업은 GPT-4o를 고려하세요.
                </div>
            </div>
        </div>
    );
}

export default ModelCostComparison;
