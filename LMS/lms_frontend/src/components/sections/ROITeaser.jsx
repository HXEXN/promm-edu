import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ROITeaser.css';

export default function ROITeaser() {
    const navigate = useNavigate();
    const [prompts, setPrompts] = useState(5000);

    // Simple calculation logic
    const avgTokens = 1500;
    const pricePer1K = 0.02; // GPT-5 approx
    const originalCost = (prompts * avgTokens * pricePer1K) / 1000;
    const savings = originalCost * 0.35; // 35% savings with PROMM

    return (
        <section id="roi" className="section roi-teaser-section">
            {/* Background Glow */}
            <div className="roi-bg-glow"></div>

            <div className="container roi-container">
                <div className="roi-content fade-in">
                    <h2>
                        ROI를 <span className="text-highlight">즉시 확인</span>하세요
                    </h2>
                    <p className="roi-desc">
                        단순한 교육이 아닙니다. 실제 비즈니스 비용을 절감하는 솔루션입니다.
                        월간 프롬프트 사용량만 입력하면 절감액을 예측해드립니다.
                    </p>

                    <div className="glass-panel-pro roi-input-panel">
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label className="roi-label">월간 프롬프트 실행 횟수</label>
                            <div className="roi-value-display">
                                <span className="range-minmax">100</span>
                                <span className="current-value">{prompts.toLocaleString()}</span>
                                <span className="range-minmax">50,000</span>
                            </div>
                            <input
                                type="range"
                                min="100"
                                max="50000"
                                step="100"
                                value={prompts}
                                onChange={(e) => setPrompts(parseInt(e.target.value))}
                                className="roi-range"
                            />
                        </div>
                    </div>

                    <button
                        onClick={() => navigate('/roi-calculator')}
                        className="btn-primary"
                    >
                        상세 ROI 계산기 열기
                    </button>
                </div>

                <div className="fade-in delay-1">
                    <div className="glass-panel-pro roi-result-card">
                        <div className="result-header">
                            <h3 className="result-title">예상 월간 절감액</h3>
                            <div className="result-amount">
                                ${savings.toFixed(0).toLocaleString()}
                            </div>
                            <p className="result-badge">
                                ▼ 35% 비용 절감 효과
                            </p>

                            <div className="breakdown-list">
                                <div className="breakdown-item original">
                                    <span className="breakdown-label label-original">기존 비용</span>
                                    <span className="breakdown-value value-original">${originalCost.toFixed(0)}</span>
                                </div>
                                <div className="breakdown-item optimized">
                                    <span className="breakdown-label label-optimized">PROMM 최적화 비용</span>
                                    <span className="breakdown-value value-optimized">${(originalCost - savings).toFixed(0)}</span>
                                </div>
                            </div>

                            <div className="disclaimer">
                                * GPT-5 기준, 평균 1,500 토큰/요청 가정
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
