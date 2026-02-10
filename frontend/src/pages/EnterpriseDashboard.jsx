import { useEffect, useState } from 'react';
import { generateEnterpriseData } from '../services/enterpriseData';
import ROICalculator from '../components/ROICalculator';
import './EnterpriseDashboard.css';

function EnterpriseDashboard() {
    const [data, setData] = useState(null);

    useEffect(() => {
        setData(generateEnterpriseData());
    }, []);

    if (!data) return <div className="loading">Loading enterprise data...</div>;

    return (
        <div className="enterprise-dashboard">
            {/* KPI Section */}
            <section className="kpi-grid">
                <div className="kpi-card total-savings">
                    <h3>총 비용 절감액 (YTD)</h3>
                    <div className="value">${data.overview.totalSavings.toLocaleString()}</div>
                    <div className="trend positive">▲ 12.5% vs 지난 달</div>
                </div>
                <div className="kpi-card active-learners">
                    <h3>활성 학습자</h3>
                    <div className="value">{data.overview.activeLearners}명</div>
                    <div className="sub-text">전체 {data.overview.totalEmployees}명 중 83%</div>
                </div>
                <div className="kpi-card efficiency">
                    <h3>평균 프롬프트 효율</h3>
                    <div className="value">{data.overview.avgEfficiencyScore}점</div>
                    <div className="progress-mini">
                        <div className="fill" style={{ width: `${data.overview.avgEfficiencyScore}%` }}></div>
                    </div>
                </div>
            </section>

            <div className="dashboard-grid">
                {/* Main Charts Area */}
                <div className="main-content">
                    <div className="card department-performance">
                        <h3>📊 부서별 성과 분석</h3>
                        <div className="dept-list">
                            {data.departments.map((dept, index) => (
                                <div key={index} className="dept-item">
                                    <div className="dept-info">
                                        <span className="dept-name">{dept.name}</span>
                                        <span className="dept-meta">{dept.employees}명</span>
                                    </div>
                                    <div className="dept-metrics">
                                        <div className="metric">
                                            <span className="label">이수율</span>
                                            <div className="bar-container">
                                                <div className="bar fill-blue" style={{ width: `${dept.completion}%` }}></div>
                                            </div>
                                            <span className="val">{dept.completion}%</span>
                                        </div>
                                        <div className="metric">
                                            <span className="label">효율성</span>
                                            <div className="bar-container">
                                                <div className="bar fill-green" style={{ width: `${dept.efficiency}%` }}></div>
                                            </div>
                                            <span className="val">{dept.efficiency}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="card monthly-trend">
                        <h3>📈 월간 비용 최적화 추이</h3>
                        <div className="trend-chart">
                            {/* Simple CSS Bar Chart Visualization */}
                            <div className="chart-legend">
                                <span className="legend-item original">예상 비용</span>
                                <span className="legend-item optimized">최적화 비용</span>
                            </div>
                            <div className="bars-wrapper">
                                {data.monthlyUsage.map((month, idx) => (
                                    <div key={idx} className="month-group">
                                        <div className="bar-pair">
                                            <div className="bar original" style={{ height: `${month.cost / 10}px` }} title={`$${month.cost}`}></div>
                                            <div className="bar optimized" style={{ height: `${month.optimizedCost / 10}px` }} title={`$${month.optimizedCost}`}></div>
                                        </div>
                                        <span className="month-label">{month.month}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar: ROI & Actions */}
                <div className="side-content">
                    <ROICalculator />

                    <div className="card action-card">
                        <h3>관리자 도구</h3>
                        <div className="action-buttons">
                            <button
                                className="btn-action primary"
                                onClick={() => window.location.href = '/enterprise/report'}
                            >
                                🔍 맞춤형 AI 솔루션 분석
                            </button>
                            <button className="btn-action">👥 직원 관리</button>
                            <button className="btn-action">⚙️ 설정</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EnterpriseDashboard;
