import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CaseStudiesPage.css';

function CaseStudiesPage() {
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] = useState('all');

    const caseStudies = [
        {
            id: 1,
            company: 'A 제조사',
            industry: 'manufacturing',
            industryLabel: '제조',
            logo: '🏭',
            costSavings: '월 ₩1,200만원',
            productivityGain: '+45%',
            completionRate: '92%',
            quote: 'SmartFarm 덕분에 AI 프롬프트 비용을 35% 절감했습니다. 실시간 최적화 엔진이 정말 강력합니다.',
            quoter: '김철수',
            role: 'AI팀 리더',
            challenge: '높은 AI API 비용과 프롬프트 품질 관리 어려움',
            solution: 'SmartFarm의 Multi-LLM Router와 프롬프트 최적화 엔진 도입',
            results: [
                'AI 비용 35% 절감 (월 ₩1,200만원)',
                '프롬프트 응답 속도 28% 향상',
                '직원 100명 교육 완료 (3주)',
                '프롬프트 품질 점수 평균 4.2/5.0'
            ]
        },
        {
            id: 2,
            company: 'B 금융사',
            industry: 'finance',
            industryLabel: '금융',
            logo: '🏦',
            costSavings: '월 ₩2,500만원',
            productivityGain: '+60%',
            completionRate: '88%',
            quote: '직원 100명이 3주 만에 프롬프트 엔지니어링을 마스터했습니다. ROI는 예상을 초과했어요.',
            quoter: '이영희',
            role: 'CTO',
            challenge: '금융 데이터 보안을 유지하면서 AI를 활용해야 하는 과제',
            solution: 'SmartFarm의 다층 보안 시스템과 엔터프라이즈 맞춤 교육',
            results: [
                'AI 비용 40% 절감 (월 ₩2,500만원)',
                '고객 문의 처리 시간 60% 단축',
                '컴플라이언스 100% 준수',
                '직원 만족도 4.8/5.0'
            ]
        },
        {
            id: 3,
            company: 'C 스타트업',
            industry: 'healthcare',
            industryLabel: '헬스케어',
            logo: '🏥',
            costSavings: '월 ₩300만원',
            productivityGain: '+80%',
            completionRate: '95%',
            quote: '소규모 팀이지만 엔터프라이즈급 AI 시스템을 구축할 수 있었습니다. 특히 AI Tutor가 훌륭했어요.',
            quoter: '박민수',
            role: 'CEO',
            challenge: '제한된 예산과 인력으로 빠른 AI 도입 필요',
            solution: 'SmartFarm Freemium 플랜으로 시작, Pro로 업그레이드',
            results: [
                '개발 시간 80% 단축',
                '의료 AI 모델 정확도 93%',
                '환자 만족도 +25% 증가',
                '시리즈 A 투자 유치 성공'
            ]
        },
        {
            id: 4,
            company: 'D 이커머스',
            industry: 'ecommerce',
            industryLabel: '이커머스',
            logo: '🛒',
            costSavings: '월 ₩800만원',
            productivityGain: '+52%',
            completionRate: '90%',
            quote: 'GraphRAG 엔진으로 상품 추천 시스템을 혁신했습니다. 고객 전환율이 크게 올랐어요.',
            quoter: '최지훈',
            role: '데이터 사이언티스트',
            challenge: '대량의 상품 데이터를 효율적으로 처리해야 함',
            solution: 'SmartFarm의 GraphRAG와 Corrective RAG 엔진 활용',
            results: [
                '상품 추천 정확도 +35%',
                'AI 프롬프트 비용 30% 절감',
                '고객 전환율 +18%',
                '매출 +42% 증가'
            ]
        }
    ];

    const filteredStudies = activeFilter === 'all'
        ? caseStudies
        : caseStudies.filter(study => study.industry === activeFilter);

    const handleFilterClick = (filter) => {
        setActiveFilter(filter);
    };

    return (
        <div className="case-studies-page">
            <header className="case-hero">
                <h1>📊 활용 사례</h1>
                <p className="hero-subtitle">
                    PROMM을 활용한 다양한 시나리오와 예상 효과를 확인하세요
                </p>

            </header>

            <div className="case-container">
                {/* Filter Bar */}
                <div className="filter-bar">
                    <button
                        className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
                        onClick={() => handleFilterClick('all')}
                    >
                        전체 ({caseStudies.length})
                    </button>
                    <button
                        className={`filter-btn ${activeFilter === 'manufacturing' ? 'active' : ''}`}
                        onClick={() => handleFilterClick('manufacturing')}
                    >
                        🏭 제조
                    </button>
                    <button
                        className={`filter-btn ${activeFilter === 'finance' ? 'active' : ''}`}
                        onClick={() => handleFilterClick('finance')}
                    >
                        🏦 금융
                    </button>
                    <button
                        className={`filter-btn ${activeFilter === 'healthcare' ? 'active' : ''}`}
                        onClick={() => handleFilterClick('healthcare')}
                    >
                        🏥 헬스케어
                    </button>
                    <button
                        className={`filter-btn ${activeFilter === 'ecommerce' ? 'active' : ''}`}
                        onClick={() => handleFilterClick('ecommerce')}
                    >
                        🛒 이커머스
                    </button>
                </div>

                {/* Case Cards Grid */}
                <div className="case-grid">
                    {filteredStudies.map(study => (
                        <div key={study.id} className="case-card">
                            <div className="card-header">
                                <div className="company-logo">
                                    <span className="logo-icon">{study.logo}</span>
                                </div>
                                <div className="company-info">
                                    <h3>{study.company}</h3>
                                    <p className="industry">{study.industryLabel}</p>
                                </div>
                            </div>

                            <div className="metrics-grid">
                                <div className="metric">
                                    <span className="metric-label">비용 절감</span>
                                    <span className="metric-value">{study.costSavings}</span>
                                </div>
                                <div className="metric">
                                    <span className="metric-label">생산성</span>
                                    <span className="metric-value">{study.productivityGain}</span>
                                </div>
                                <div className="metric">
                                    <span className="metric-label">교육 완료율</span>
                                    <span className="metric-value">{study.completionRate}</span>
                                </div>
                            </div>

                            <blockquote className="testimonial">
                                "{study.quote}"
                                <cite>— {study.quoter}, {study.role}</cite>
                            </blockquote>

                            <div className="case-summary">
                                <div className="summary-section">
                                    <h5>도전 과제</h5>
                                    <p>{study.challenge}</p>
                                </div>
                                <div className="summary-section">
                                    <h5>솔루션</h5>
                                    <p>{study.solution}</p>
                                </div>
                                <div className="summary-section">
                                    <h5>성과</h5>
                                    <ul>
                                        {study.results.map((result, idx) => (
                                            <li key={idx}>✓ {result}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredStudies.length === 0 && (
                    <div className="empty-state">
                        <p>해당 산업의 케이스 스터디가 곧 추가됩니다.</p>
                    </div>
                )}

                {/* CTA Section */}
                <div className="case-cta">
                    <h2>당신의 성공 사례를 만들어보세요</h2>
                    <p>
                        PROMM으로 비용을 절감하고 생산성을 높여보세요.
                    </p>
                    <div className="cta-buttons">
                        <button
                            onClick={() => navigate('/free-trial')}
                            className="btn-primary"
                        >
                            무료로 시작하기
                        </button>
                        <button
                            onClick={() => navigate('/contact')}
                            className="btn-secondary"
                        >
                            데모 요청
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CaseStudiesPage;
