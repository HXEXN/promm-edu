import { useNavigate } from 'react-router-dom';
import './EnterpriseProcess.css';

function EnterpriseProcess() {
    const navigate = useNavigate();

    const processSteps = [
        {
            number: '01',
            title: '무료 AI 진단',
            description: '현재 AI 사용 현황과 비용을 분석하여 최적의 모델을 추천합니다',
            icon: '🔍',
            details: [
                '월간 API 호출 패턴 분석',
                '현재 비용 대비 절감액 계산',
                '업무 특성에 맞는 모델 매칭'
            ]
        },
        {
            number: '02',
            title: '맞춤형 커리큘럼',
            description: '기업의 업종과 직무에 최적화된 실전 교육 과정을 설계합니다',
            icon: '📚',
            details: [
                '직무별 필수 프롬프트 패턴',
                '업무 자동화 실습 과제',
                '즉시 활용 가능한 템플릿 제공'
            ]
        },
        {
            number: '03',
            title: '전사 교육 진행',
            description: '온라인 LMS를 통해 전 직원이 자율적으로 학습할 수 있습니다',
            icon: '🎓',
            details: [
                '인터랙티브 실습 환경',
                '실시간 진도율 모니터링',
                '퀴즈 및 과제 자동 채점'
            ]
        },
        {
            number: '04',
            title: '성과 측정',
            description: 'ROI를 정량적으로 측정하고 지속적인 개선을 제안합니다',
            icon: '📊',
            details: [
                '업무 효율 개선률 측정',
                'AI 도구 사용률 추적',
                '분기별 성과 리포트 제공'
            ]
        }
    ];

    const benefits = [
        {
            icon: '💰',
            title: '비용 절감 효과',
            description: '최적화된 모델 선택으로 불필요한 API 비용을 절감합니다'
        },
        {
            icon: '⚡',
            title: '업무 생산성 향상',
            description: '프롬프트 엔지니어링으로 반복 업무를 자동화합니다'
        },
        {
            icon: '🎯',
            title: '2주 만에 교육 완료',
            description: '빠른 온보딩으로 즉시 실무에 적용 가능합니다'
        },
        {
            icon: '📈',
            title: '지속 가능한 성장',
            description: 'AI 역량을 내재화하여 경쟁력을 확보합니다'
        }
    ];

    const caseStudies = [
        {
            company: 'A 제조사',
            industry: '제조업',
            challenge: '품질 검사 보고서 작성에 주당 20시간 소요',
            solution: 'AI 자동화 도입 → 주당 2시간으로 단축',
            result: '90% 시간 절감, 연간 1억원 인건비 절감'
        },
        {
            company: 'B 스타트업',
            industry: 'IT/SaaS',
            challenge: 'ChatGPT Enterprise 월 $60,000 지출',
            solution: 'Claude Sonnet으로 전환 → 월 $18,000',
            result: '70% 비용 절감, 연간 $504,000 절감'
        },
        {
            company: 'C 교육기관',
            industry: '교육',
            challenge: '교재 및 문제 제작에 교사 1인당 주 10시간',
            solution: 'AI 프롬프트 템플릿 활용',
            result: '80% 시간 절감, 교육 품질 향상'
        }
    ];

    return (
        <div className="enterprise-process-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">
                        AI 역량이 곧<br />
                        <span className="gradient-text">기업 경쟁력</span>입니다
                    </h1>
                    <p className="hero-subtitle">
                        업계 최초 AI 비용 진단부터 전사 교육, 성과 측정까지<br />
                        원스톱 솔루션으로 빠르게 도입하세요
                    </p>
                    <div className="hero-stats">
                        <div className="stat-item">
                            <div className="stat-value">최대 70%</div>
                            <div className="stat-label">예상 비용 절감</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-value">2주</div>
                            <div className="stat-label">교육 완료 기간</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-value">9+</div>
                            <div className="stat-label">지원 AI 모델</div>
                        </div>
                    </div>
                    <button className="cta-button" onClick={() => navigate('/enterprise/report')}>
                        🔍 무료 AI 진단 시작하기
                    </button>
                </div>
            </section>

            {/* Process Steps */}
            <section className="process-section">
                <h2 className="section-title">도입 프로세스</h2>
                <p className="section-subtitle">4단계로 간편하게 시작하세요</p>

                <div className="process-timeline">
                    {processSteps.map((step, idx) => (
                        <div key={idx} className="process-step">
                            <div className="step-number">{step.number}</div>
                            <div className="step-icon">{step.icon}</div>
                            <h3 className="step-title">{step.title}</h3>
                            <p className="step-description">{step.description}</p>
                            <ul className="step-details">
                                {step.details.map((detail, i) => (
                                    <li key={i}>✓ {detail}</li>
                                ))}
                            </ul>
                            {idx < processSteps.length - 1 && (
                                <div className="step-arrow">→</div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* Benefits */}
            <section className="benefits-section">
                <h2 className="section-title">도입 효과</h2>
                <div className="benefits-grid">
                    {benefits.map((benefit, idx) => (
                        <div key={idx} className="benefit-card">
                            <div className="benefit-icon">{benefit.icon}</div>
                            <h3>{benefit.title}</h3>
                            <p>{benefit.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Case Studies */}
            <section className="cases-section">
                <h2 className="section-title">도입 사례</h2>
                <p className="section-subtitle">실제 기업의 성공 스토리</p>

                <div className="cases-grid">
                    {caseStudies.map((study, idx) => (
                        <div key={idx} className="case-card">
                            <div className="case-header">
                                <h3>{study.company}</h3>
                                <span className="industry-tag">{study.industry}</span>
                            </div>
                            <div className="case-challenge">
                                <strong>문제:</strong> {study.challenge}
                            </div>
                            <div className="case-solution">
                                <strong>해결:</strong> {study.solution}
                            </div>
                            <div className="case-result">
                                <strong>성과:</strong> {study.result}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="cta-box">
                    <h2>지금 바로 시작하세요</h2>
                    <p>5분이면 우리 회사의 AI 최적화 방안을 확인할 수 있습니다</p>
                    <div className="cta-buttons">
                        <button className="btn-primary-large" onClick={() => navigate('/enterprise/report')}>
                            무료 진단 시작
                        </button>
                        <button className="btn-secondary-large" onClick={() => navigate('/')}>
                            더 알아보기
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default EnterpriseProcess;
