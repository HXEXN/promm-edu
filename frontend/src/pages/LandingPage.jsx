import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import TechShowcase from '../components/sections/TechShowcase';
import ROITeaser from '../components/sections/ROITeaser';
import SuccessStories from '../components/sections/SuccessStories';
import ComparisonSection from '../components/sections/ComparisonSection';
import './LandingPage.css';

function LandingPage() {
    const navigate = useNavigate();
    const observerRef = useRef(null);

    useEffect(() => {
        observerRef.current = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.reveal-on-scroll, .fade-in').forEach((el) => {
            observerRef.current.observe(el);
        });

        return () => observerRef.current.disconnect();
    }, []);

    const features = [
        {
            icon: '⚡',
            title: '2026 최신 기술',
            desc: 'GraphRAG, Agentic AI, Context Engineering 등 최첨단 2026 AI 기술 엔진을 탑재했습니다.'
        },
        {
            icon: '💎',
            title: '비용 30% 절감',
            desc: '스마트 토큰 최적화와 모델 라우팅으로 기업의 AI 운영 비용을 획기적으로 줄여드립니다.'
        },
        {
            icon: '🎓',
            title: '실전 기업 교육',
            desc: '이론이 아닌 실무 중심. EU AI Act를 준수하는 기업 맞춤형 AI 리터러시 교육을 제공합니다.'
        }
    ];

    const stats = [
        { value: '9+', label: '지원 AI 엔진' },
        { value: '30%', label: '평균 비용 절감' },
        { value: '24/7', label: 'AI 튜터' },
        { value: '100%', label: '한국어 지원' }
    ];

    return (
        <div className="landing-page aurora-bg">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <div className="hero-badge fade-in">🚀 2026 AI Tech Stack</div>
                    <h1 className="hero-title fade-in">
                        AI 프롬프트 엔지니어링<br />
                        <span className="text-gradient-pro">교육의 새로운 차원</span>
                    </h1>
                    <p className="hero-subtitle fade-in">
                        GPT-5.2, Claude Opus 4.6, Gemini 3 Pro를 포함한<br />
                        최신 AI 모델을 실시간으로 체험하고 기업의 경쟁력을 높이세요.
                    </p>
                    <div className="hero-actions fade-in">
                        <button className="btn-glow-primary" onClick={() => navigate('/free-trial')}>
                            <span>지금 무료로 시작하기</span>
                            <div className="glow-effect"></div>
                        </button>
                        <button className="btn-glass" onClick={() => navigate('/roi-calculator')}>
                            💰 ROI 계산하기
                        </button>
                    </div>
                </div>

                {/* 3D Visual or Abstract Graphic Placeholder */}
                <div className="hero-visual fade-in">
                    <div className="glass-card-float">
                        <div className="float-icon">🤖</div>
                        <div className="float-content">
                            <div className="float-line line-1"></div>
                            <div className="float-line line-2"></div>
                        </div>
                    </div>
                    <div className="glass-card-float delay-1">
                        <div className="float-icon">📊</div>
                        <div className="float-content">
                            <div className="float-line line-1"></div>
                            <div className="float-line line-3"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Social Proof Infinite Scroll */}
            <div className="brand-scroll">
                <div className="scroll-track">
                    <span>SAMSUNG</span>
                    <span>LG</span>
                    <span>SK Telecom</span>
                    <span>NAVER</span>
                    <span>KAKAO</span>
                    <span>HYUNDAI</span>
                    <span>POSCO</span>
                    {/* Duplicate for seamless scroll */}
                    <span>SAMSUNG</span>
                    <span>LG</span>
                    <span>SK Telecom</span>
                    <span>NAVER</span>
                    <span>KAKAO</span>
                    <span>HYUNDAI</span>
                    <span>POSCO</span>
                </div>
            </div>

            {/* Tech Showcase Section [NEW] */}
            <TechShowcase />

            {/* ROI Teaser Section [NEW] */}
            <ROITeaser />

            {/* Comparison Section [NEW] */}
            <ComparisonSection />

            {/* Success Stories Section [NEW] */}
            <SuccessStories />

            {/* Features (Why PROMM EDU?) - Kept as a summary */}
            <section className="features-section">
                <div className="section-header reveal-on-scroll">
                    <h2 className="section-title">Verified Excellence</h2>
                    <p className="section-desc">기술과 교육의 완벽한 결합을 경험하세요.</p>
                </div>

                <div className="features-grid">
                    {features.map((feature, idx) => (
                        <div key={idx} className="feature-card glass-panel-pro hover-glow-border reveal-on-scroll" style={{ transitionDelay: `${idx * 100}ms` }}>
                            <div className="feature-icon">{feature.icon}</div>
                            <h3>{feature.title}</h3>
                            <p>{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Stats Grid */}
            <section className="stats-section reveal-on-scroll">
                <div className="stats-container glass-panel-pro">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="stat-item">
                            <span className="stat-value text-gradient-pro">{stat.value}</span>
                            <span className="stat-label">{stat.label}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Problem & Solution (Dual Track) */}
            <section className="tracks-section">
                <div className="track-container reveal-on-scroll">
                    {/* Student Track */}
                    <div className="track-card glass-panel-pro" onClick={() => navigate('/student/assessment')}>
                        <div className="track-badge student">For Students</div>
                        <div className="track-icon">👨‍🎓</div>
                        <h3>실무 역량 강화</h3>
                        <p>AI 기초부터 고급 프롬프트 최적화까지,<br /> 단계별 미션으로 실력을 증명하세요.</p>
                        <ul className="track-list">
                            <li>✅ 실력 진단 테스트</li>
                            <li>✅ AI 맞춤 학습 경로</li>
                            <li>✅ 24/7 AI 튜터 피드백</li>
                        </ul>
                        <button className="btn-link">학습 시작하기 →</button>
                    </div>

                    {/* Enterprise Track */}
                    <div className="track-card glass-panel-pro" onClick={() => navigate('/enterprise/process')}>
                        <div className="track-badge enterprise">For Enterprise</div>
                        <div className="track-icon">🏢</div>
                        <h3>기업 AI 혁신</h3>
                        <p>직원 교육 성과 관리와 ROI 비용 분석,<br /> 그리고 우리 기업만의 맞춤형 커리큘럼.</p>
                        <ul className="track-list">
                            <li>✅ 기업 맞춤형 교육 설계</li>
                            <li>✅ 실시간 성과 대시보드</li>
                            <li>✅ 비용 절감 ROI 분석</li>
                        </ul>
                        <button className="btn-link">도입 문의하기 →</button>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section reveal-on-scroll">
                <div className="cta-content glass-panel-pro">
                    <h2>지금 바로 AI 혁신을 시작하세요</h2>
                    <p>신용카드 없이 10 크레딧으로 모든 기능을 체험해보세요.</p>
                    <div className="cta-buttons">
                        <button className="btn-glow-primary large" onClick={() => navigate('/free-trial')}>
                            무료 체험 시작하기
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default LandingPage;
