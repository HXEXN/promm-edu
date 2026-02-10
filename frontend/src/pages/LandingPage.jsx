import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
    const navigate = useNavigate();

    const features = [
        { value: '9+', label: '지원 AI 엔진' },
        { value: '24/7', label: 'AI 튜터' },
        { value: '실시간', label: '비용 분석' }
    ];

    return (
        <div className="landing-page">
            {/* Hero Section */}
            <div className="landing-hero">
                <div className="hero-badge">🚀 AI 프롬프트 교육 플랫폼</div>
                <h1 className="landing-title">
                    <span className="gradient-text">AI 프롬프트 엔지니어링</span>
                    <br />
                    <span className="title-sub">교육의 새로운 표준</span>
                </h1>
                <p className="landing-subtitle">
                    GPT-5.2, Claude Opus 4.6, Gemini 3 Pro 등 최신 AI 모델 지원<br />
                    기업의 AI 생산성을 혁신하고 비용을 절감하세요
                </p>
                <div className="hero-cta">
                    <button className="btn-hero-primary" onClick={() => navigate('/free-trial')}>
                        🎁 무료 체험 시작
                    </button>
                    <button className="btn-hero-secondary" onClick={() => navigate('/roi-calculator')}>
                        💰 ROI 계산하기
                    </button>
                </div>
            </div>


            {/* Features Section */}
            <div className="landing-stats">
                {features.map((feature, idx) => (
                    <div key={idx} className="stat-item">
                        <span className="stat-value">{feature.value}</span>
                        <span className="stat-label">{feature.label}</span>
                    </div>
                ))}
            </div>

            {/* Mode Selection */}
            <div className="mode-selection">
                <h2 className="section-title">시작하기</h2>

                <div className="mode-card student-card" onClick={() => navigate('/student/assessment')}>
                    <div className="card-icon">👨‍🎓</div>
                    <h3>학생용 실습실</h3>
                    <p>AI 기초부터 고급 프롬프트 최적화까지<br />단계별 미션으로 실력 향상</p>
                    <ul className="card-features">
                        <li>✅ 실력 진단 테스트</li>
                        <li>✅ AI 맞춤 학습 경로</li>
                        <li>✅ 24/7 AI 튜터</li>
                    </ul>
                    <button className="btn-card">학습 시작하기 →</button>
                </div>

                <div className="mode-card enterprise-card" onClick={() => navigate('/enterprise/process')}>
                    <div className="card-icon">💼</div>
                    <h3>기업용 솔루션</h3>
                    <p>직원 교육 성과 관리와 ROI 비용 분석<br />부서별 최적화 리포트</p>
                    <ul className="card-features">
                        <li>✅ 맞춤형 교육 설계</li>
                        <li>✅ 실시간 대시보드</li>
                        <li>✅ ROI 분석 리포트</li>
                    </ul>
                    <button className="btn-card">도입 프로세스 보기 →</button>
                </div>
            </div>

            {/* Promo Section */}
            <div className="landing-promo">
                <h2 className="promo-title">🚀 지금 바로 시작하세요</h2>
                <p className="promo-subtitle">PROMM의 강력한 기능을 체험해보세요</p>
                <div className="promo-cards">
                    <div className="promo-card" onClick={() => navigate('/ai-engines')}>
                        <div className="promo-icon">🤖</div>
                        <h3>AI 엔진 데모</h3>
                        <p>9개 AI 모델 실시간 테스트</p>
                    </div>
                    <div className="promo-card" onClick={() => navigate('/compare')}>
                        <div className="promo-icon">🏆</div>
                        <h3>경쟁사 비교</h3>
                        <p>PROMM의 차별점</p>
                    </div>
                    <div className="promo-card" onClick={() => navigate('/case-studies')}>
                        <div className="promo-icon">📊</div>
                        <h3>활용 사례</h3>
                        <p>다양한 활용 시나리오</p>
                    </div>
                    <div className="promo-card" onClick={() => navigate('/technology')}>
                        <div className="promo-icon">⚡</div>
                        <h3>기술 정보</h3>
                        <p>최신 AI 기술 스택</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LandingPage;
