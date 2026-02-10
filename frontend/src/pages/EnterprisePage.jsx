import { useState } from 'react';
import EnterpriseForm from '../components/EnterpriseForm';
import InvoiceModal from '../components/InvoiceModal';
import './EnterprisePage.css';

function EnterprisePage() {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showInvoice, setShowInvoice] = useState(false);

    const handleAnalyze = async (requirements) => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:3000/api/enterprise/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requirements)
            });
            const data = await response.json();
            if (data.success) {
                setReport({ ...data.data, appliedTraining: false });
            }
        } catch (error) {
            console.error('Enterprise analysis error:', error);
            alert('분석 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleApplyClick = () => {
        setShowInvoice(true);
    };

    const handleConfirmInvoice = () => {
        setShowInvoice(false);
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setReport(prev => ({ ...prev, appliedTraining: true }));
            alert('✅ 교육 프로그램 신청이 완료되었습니다.\n교육 센터로 이동합니다.');
            // Navigate to education page
            window.location.href = '/enterprise/education';
        }, 1500);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('ko-KR', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        }).format(amount);
    };

    if (!report) {
        return <EnterpriseForm onAnalyze={handleAnalyze} />;
    }

    const { costAnalysis, trainingPlan, roiAnalysis, recommendations } = report;

    return (
        <div className="enterprise-page">
            <div className="report-header">
                <h1>🏢 기업 최적화 분석 리포트</h1>
                <button className="btn-secondary" onClick={() => setReport(null)}>
                    ← 새로운 분석
                </button>
            </div>

            {/* 현재 상태 */}
            <section className="report-section">
                <h2>📊 현재 비용 현황</h2>
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-label">월간 호출 건수</div>
                        <div className="stat-value">{costAnalysis.currentAnalysis.monthlyApiCalls.toLocaleString()}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">현재 모델</div>
                        <div className="stat-value">{costAnalysis.currentAnalysis.model}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">월간 비용</div>
                        <div className="stat-value danger">{formatCurrency(costAnalysis.currentAnalysis.monthlyCost)}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">연간 비용</div>
                        <div className="stat-value danger">{formatCurrency(costAnalysis.currentAnalysis.annualCost)}</div>
                    </div>
                </div>
            </section>

            {/* 최적 모델 추천 */}
            <section className="report-section highlight">
                <h2>🎯 최적 모델 추천</h2>
                <div className="recommendation-card">
                    <div className="rec-model">
                        <div className="rec-icon">🏆</div>
                        <div>
                            <h3>{costAnalysis.recommendation.modelName}</h3>
                            <p>{costAnalysis.recommendation.provider}</p>
                        </div>
                    </div>
                    <div className="rec-savings">
                        <div className="savings-amount">
                            {formatCurrency(costAnalysis.recommendation.annualSavings)}
                        </div>
                        <div className="savings-label">연간 절감액</div>
                        <div className="savings-percentage">
                            {costAnalysis.recommendation.savingsPercentage.toFixed(1)}% 절감
                        </div>
                    </div>
                </div>
            </section>

            {/* 교육 계획 */}
            <section className="report-section">
                <h2>🎓 교육 커리큘럼</h2>
                <div className="training-summary">
                    <div className="training-stat">
                        <span>총 모듈:</span>
                        <strong>{trainingPlan.summary.totalModules}개</strong>
                    </div>
                    <div className="training-stat">
                        <span>총 시간:</span>
                        <strong>{trainingPlan.summary.totalHours}시간</strong>
                    </div>
                    <div className="training-stat">
                        <span>교육 기간:</span>
                        <strong>{trainingPlan.summary.recommendedWeeks}주</strong>
                    </div>
                    <div className="training-stat">
                        <span>교육 비용:</span>
                        <strong>{formatCurrency(trainingPlan.summary.totalCost)}</strong>
                    </div>
                </div>

                <div className="curriculum-actions">
                    {!report.appliedTraining ? (
                        <button
                            className={`btn-primary full-width ${loading ? 'loading' : ''}`}
                            onClick={handleApplyClick}
                            disabled={loading}
                        >
                            {loading ? '처리 중...' : '🚀 전사 교육 프로그램 바로 시행하기'}
                        </button>
                    ) : (
                        <div className="application-success">
                            <span className="success-icon">✅</span>
                            <div className="success-msg">
                                <strong>교육 프로그램이 시행 되었습니다.</strong>
                                <p>각 부서장에게 커리큘럼 배포가 완료되었습니다.</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="modules-list">
                    {trainingPlan.curriculum.map((module, idx) => (
                        <div key={module.id} className="module-card">
                            <div className="module-header">
                                <span className="module-number">{idx + 1}</span>
                                <div>
                                    <h4>{module.title}</h4>
                                    <span className="module-duration">{module.duration}</span>
                                </div>
                            </div>
                            <ul className="module-topics">
                                {module.topics.slice(0, 3).map((topic, i) => (
                                    <li key={i}>{topic}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>

            {/* Invoice Modal */}
            {showInvoice && (
                <InvoiceModal
                    trainingPlan={trainingPlan}
                    onClose={() => setShowInvoice(false)}
                    onConfirm={handleConfirmInvoice}
                />
            )}

            {/* ROI 분석 */}
            <section className="report-section">
                <h2>💰 투자 수익률 (ROI)</h2>
                <div className="roi-summary">
                    <div className="roi-card">
                        <div className="roi-label">초기 투자</div>
                        <div className="roi-value">{formatCurrency(roiAnalysis.initialInvestment)}</div>
                    </div>
                    <div className="roi-card highlight">
                        <div className="roi-label">1년차 ROI</div>
                        <div className="roi-value success">{roiAnalysis.roi.firstYear}%</div>
                    </div>
                    <div className="roi-card">
                        <div className="roi-label">손익분기점</div>
                        <div className="roi-value">{roiAnalysis.roi.breakEvenMonths}개월</div>
                    </div>
                </div>

                <div className="projection-table">
                    <h4>5년 수익 예측</h4>
                    <table>
                        <thead>
                            <tr>
                                <th>연도</th>
                                <th>연간 절감액</th>
                                <th>누적 절감액</th>
                                <th>ROI</th>
                            </tr>
                        </thead>
                        <tbody>
                            {roiAnalysis.projections.map((proj) => (
                                <tr key={proj.year}>
                                    <td>{proj.year}년차</td>
                                    <td>{formatCurrency(proj.savings)}</td>
                                    <td>{formatCurrency(proj.cumulativeSavings)}</td>
                                    <td className="success">{proj.roi}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* 실행 권장사항 */}
            <section className="report-section">
                <h2>📋 실행 권장사항</h2>
                <div className="recommendations-list">
                    {recommendations.map((rec, idx) => (
                        <div key={idx} className="rec-item">
                            <div className="rec-priority">{rec.priority === 'high' ? '🔴' : '🟡'}</div>
                            <div className="rec-content">
                                <h4>{rec.title}</h4>
                                <p className="rec-impact">{rec.impact}</p>
                                <p className="rec-action">→ {rec.action}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <div className="report-actions">
                <button className="btn-primary btn-large">
                    📧 리포트 이메일로 전송
                </button>
                <button className="btn-outline btn-large">
                    📥 PDF 다운로드
                </button>
            </div>
        </div>
    );
}

export default EnterprisePage;
