import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CompetitorComparison.css';

function CompetitorComparison() {
    const navigate = useNavigate();
    const [activeFeature, setActiveFeature] = useState('all');

    const competitors = [
        {
            name: 'PROMM',
            type: '교육 플랫폼',
            logo: '📚',
            highlight: true,
            features: {
                purpose: { value: '역량 강화 교육', score: 5 },
                realtime: { value: '실시간 AI 엔진', score: 5 },
                techStack: { value: 'GraphRAG, DSPy, LangGraph', score: 5 },
                pricing: { value: '성과 기반 / Freemium', score: 5 },
                roi: { value: 'ROI 계산기 제공', score: 5 },
                korean: { value: '완벽 한국어 지원', score: 5 },
                enterprise: { value: 'B2B 맞춤 교육', score: 5 },
                support: { value: '24/7 AI Tutor', score: 5 }
            }
        },
        {
            name: '시냅스AI',
            type: '자동화 도구',
            logo: '⚡',
            highlight: false,
            features: {
                purpose: { value: 'AI 자동 선택', score: 3 },
                realtime: { value: '모델 연결만', score: 2 },
                techStack: { value: '50+ 모델 통합', score: 4 },
                pricing: { value: '구독형', score: 3 },
                roi: { value: '없음', score: 1 },
                korean: { value: '한국어 지원', score: 4 },
                enterprise: { value: '이커머스 특화', score: 3 },
                support: { value: '일반 지원', score: 3 }
            }
        },
        {
            name: 'Learn Prompting',
            type: '교육 플랫폼',
            logo: '📖',
            highlight: false,
            features: {
                purpose: { value: '프롬프트 교육', score: 4 },
                realtime: { value: '없음', score: 1 },
                techStack: { value: '기본 기술만', score: 2 },
                pricing: { value: '$21/월', score: 3 },
                roi: { value: '없음', score: 1 },
                korean: { value: '영어만', score: 1 },
                enterprise: { value: '없음', score: 1 },
                support: { value: '커뮤니티', score: 2 }
            }
        },
        {
            name: 'Coursera',
            type: '일반 교육',
            logo: '🎓',
            highlight: false,
            features: {
                purpose: { value: '일반 AI 교육', score: 3 },
                realtime: { value: '없음', score: 1 },
                techStack: { value: '기초 수준', score: 2 },
                pricing: { value: '$59/월', score: 2 },
                roi: { value: '없음', score: 1 },
                korean: { value: '부분 한국어', score: 2 },
                enterprise: { value: '제한적', score: 2 },
                support: { value: '포럼', score: 2 }
            }
        }
    ];

    const featureLabels = {
        purpose: { label: '🎯 핵심 목적', description: '플랫폼의 주요 가치' },
        realtime: { label: '⚡ 실시간 AI', description: '즉시 사용 가능한 AI 엔진' },
        techStack: { label: '🔧 기술 스택', description: '2026년 최신 기술 지원' },
        pricing: { label: '💰 가격 모델', description: '가격 경쟁력' },
        roi: { label: '📊 ROI 측정', description: '비용 절감 측정 도구' },
        korean: { label: '🇰🇷 한국어', description: '한국 시장 최적화' },
        enterprise: { label: '💼 기업용', description: 'B2B 맞춤 솔루션' },
        support: { label: '🆘 지원', description: '고객 지원 수준' }
    };

    const keyDifferentiators = [
        {
            icon: '📚',
            title: '교육 vs 도구',
            promm: '팀의 AI 역량을 영구적으로 향상',
            synapse: '도구 의존성: 도구 없으면 무용지물',
            advantage: '도구 비용 절감 + 직원 가치 상승'
        },
        {
            icon: '🚀',
            title: '2026 최신 기술',
            promm: 'GraphRAG, DSPy 3.0, LangGraph, Corrective RAG',
            synapse: 'GPT, Claude 등 기존 모델 연결만',
            advantage: '기술 리더십으로 경쟁 우위 확보'
        },
        {
            icon: '📈',
            title: 'ROI 투명성',
            promm: 'ROI 계산기로 비용 절감액 즉시 확인',
            synapse: '비용 측정 도구 없음',
            advantage: '투자 대비 효과를 수치로 증명'
        }
    ];

    const renderScore = (score) => {
        return (
            <div className="score-bar">
                {[1, 2, 3, 4, 5].map(i => (
                    <span
                        key={i}
                        className={`score-dot ${i <= score ? 'filled' : ''}`}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="competitor-comparison-page">
            <header className="comparison-header">
                <h1>🏆 왜 PROMM인가?</h1>
                <p className="header-subtitle">
                    시냅스AI, Learn Prompting, Coursera와 비교하여<br />
                    PROMM이 제공하는 <strong>독보적인 가치</strong>를 확인하세요
                </p>
            </header>

            {/* Key Differentiators */}
            <section className="key-differentiators">
                <h2>💎 핵심 차별점 3가지</h2>
                <div className="diff-cards">
                    {keyDifferentiators.map((diff, idx) => (
                        <div key={idx} className="diff-card">
                            <span className="diff-icon">{diff.icon}</span>
                            <h3>{diff.title}</h3>
                            <div className="diff-comparison">
                                <div className="diff-promm">
                                    <span className="label">PROMM</span>
                                    <p>{diff.promm}</p>
                                </div>
                                <div className="diff-synapse">
                                    <span className="label">시냅스AI</span>
                                    <p>{diff.synapse}</p>
                                </div>
                            </div>
                            <div className="diff-advantage">
                                <span>✅ {diff.advantage}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Comparison Table */}
            <section className="comparison-table-section">
                <h2>📊 상세 기능 비교</h2>
                <div className="table-scroll">
                    <table className="comparison-table">
                        <thead>
                            <tr>
                                <th className="feature-header">기능</th>
                                {competitors.map(comp => (
                                    <th
                                        key={comp.name}
                                        className={comp.highlight ? 'highlight' : ''}
                                    >
                                        <span className="comp-logo">{comp.logo}</span>
                                        <span className="comp-name">{comp.name}</span>
                                        <span className="comp-type">{comp.type}</span>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(featureLabels).map(([key, feature]) => (
                                <tr key={key}>
                                    <td className="feature-cell">
                                        <span className="feature-label">{feature.label}</span>
                                        <span className="feature-desc">{feature.description}</span>
                                    </td>
                                    {competitors.map(comp => (
                                        <td
                                            key={`${comp.name}-${key}`}
                                            className={comp.highlight ? 'highlight' : ''}
                                        >
                                            <span className="feature-value">
                                                {comp.features[key].value}
                                            </span>
                                            {renderScore(comp.features[key].score)}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* CTA Section */}
            <section className="comparison-cta">
                <h2>🚀 지금 시작하세요</h2>
                <p>10 크레딧 무료 체험으로 PROMM의 차별화된 가치를 직접 경험해보세요</p>
                <div className="cta-buttons">
                    <button
                        className="btn-primary"
                        onClick={() => navigate('/free-trial')}
                    >
                        🎁 무료 체험 시작
                    </button>
                    <button
                        className="btn-secondary"
                        onClick={() => navigate('/roi-calculator')}
                    >
                        💰 ROI 계산하기
                    </button>
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats-section">
                <div className="stat-card">
                    <span className="stat-number">30%</span>
                    <span className="stat-label">평균 비용 절감</span>
                </div>
                <div className="stat-card">
                    <span className="stat-number">9개</span>
                    <span className="stat-label">최신 AI 엔진</span>
                </div>
                <div className="stat-card">
                    <span className="stat-number">24/7</span>
                    <span className="stat-label">AI Tutor 지원</span>
                </div>
                <div className="stat-card">
                    <span className="stat-number">100%</span>
                    <span className="stat-label">한국어 지원</span>
                </div>
            </section>
        </div>
    );
}

export default CompetitorComparison;
