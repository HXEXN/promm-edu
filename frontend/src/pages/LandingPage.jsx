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

    // Bento Grid Items
    // No longer using a simple map, but specific layout slots

    return (
        <div className="landing-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <div className="hero-badge fade-in">
                        <span>✨</span> 2026 AI Innovation Stack
                    </div>
                    <h1 className="hero-title fade-in">
                        AI 프롬프트 엔지니어링<br />
                        <span className="text-gradient-pro">완벽한 실무 가이드</span>
                    </h1>
                    <p className="hero-subtitle fade-in">
                        GPT-5.2, Claude 4.5 Sonnet, Gemini 2.0 Pro를 위한
                        엔터프라이즈급 프롬프트 최적화 및 비용 절감 솔루션.
                    </p>
                    <div className="hero-actions fade-in" style={{ transitionDelay: '0.2s' }}>
                        <button className="btn-glow-primary" onClick={() => navigate('/free-trial')}>
                            시작하기
                        </button>
                        <button className="btn-glass" onClick={() => navigate('/roi-calculator')}>
                            ROI 분석
                        </button>
                    </div>
                </div>

                {/* 3D Visual Mockup */}
                <div className="hero-visual fade-in" style={{ transitionDelay: '0.4s' }}>
                    <div className="hero-3d-card">
                        <div className="mockup-header">
                            <div className="mockup-dot" style={{ background: '#ff5f56' }}></div>
                            <div className="mockup-dot" style={{ background: '#ffbd2e' }}></div>
                            <div className="mockup-dot" style={{ background: '#27c93f' }}></div>
                            <div className="mockup-bar short" style={{ marginLeft: '12px', opacity: 0.3 }}></div>
                        </div>
                        <div className="mockup-body">
                            <div className="mockup-sidebar"></div>
                            <div className="mockup-content">
                                <div className="mockup-bar" style={{ height: '24px', width: '40%' }}></div>
                                <div className="mockup-chart">
                                    <div className="chart-line"></div>
                                </div>
                                <div className="mockup-bar" style={{ width: '80%' }}></div>
                                <div className="mockup-bar" style={{ width: '60%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Social Proof Infinite Scroll */}
            <div className="brand-scroll">
                <div className="scroll-track">
                    <span className="brand-logo">SAMSUNG</span>
                    <span className="brand-logo">LG Electronics</span>
                    <span className="brand-logo">SK Telecom</span>
                    <span className="brand-logo">NAVER</span>
                    <span className="brand-logo">KAKAO</span>
                    <span className="brand-logo">HYUNDAI</span>
                    <span className="brand-logo">POSCO</span>
                    {/* Duplicate */}
                    <span className="brand-logo">SAMSUNG</span>
                    <span className="brand-logo">LG Electronics</span>
                    <span className="brand-logo">SK Telecom</span>
                    <span className="brand-logo">NAVER</span>
                    <span className="brand-logo">KAKAO</span>
                    <span className="brand-logo">HYUNDAI</span>
                    <span className="brand-logo">POSCO</span>
                </div>
            </div>

            {/* Features (Bento Grid) */}
            <section className="features-section">
                <div className="section-header reveal-on-scroll">
                    <h2 className="section-title">Verified Excellence</h2>
                    <p className="section-desc">기술과 교육의 완벽한 결합을 경험하세요.</p>
                </div>

                <div className="bento-grid">
                    {/* Card 1: Large (Span 2) */}
                    <div className="bento-card large reveal-on-scroll">
                        <div className="bento-icon">⚡</div>
                        <h3>Pro-Grade AI Engine</h3>
                        <p>GraphRAG, Agentic AI, Context Engineering 등 최첨단 2026 AI 기술 엔진을 탑재했습니다.</p>
                    </div>

                    {/* Card 2: Tall (Row Span 2) */}
                    <div className="bento-card tall reveal-on-scroll" style={{ transitionDelay: '0.1s' }}>
                        <div className="bento-icon">🎓</div>
                        <h3>실전 기업 교육</h3>
                        <p>이론이 아닌 실무 중심. EU AI Act를 준수하는 기업 맞춤형 AI 리터러시 교육을 제공합니다. 직원들의 실시간 성과를 추적하세요.</p>
                    </div>

                    {/* Card 3: Standard */}
                    <div className="bento-card reveal-on-scroll" style={{ transitionDelay: '0.2s' }}>
                        <div className="bento-icon">💎</div>
                        <h3>비용 30% 절감</h3>
                        <p>스마트 토큰 최적화와 모델 라우팅으로 AI 운영 비용 최소화.</p>
                    </div>

                    {/* Card 4: Standard */}
                    <div className="bento-card reveal-on-scroll" style={{ transitionDelay: '0.3s' }}>
                        <div className="bento-icon">🛡️</div>
                        <h3>Enterprise Security</h3>
                        <p>데이터 유출 방지를 위한 PII 마스킹 및 보안 게이트웨이.</p>
                    </div>
                </div>
            </section>

            {/* Tech Showcase Section */}
            <TechShowcase />

            {/* Other Sections */}
            <ROITeaser />
            <ComparisonSection />
            <SuccessStories />

            {/* Problem & Solution (Dual Track) */}
            <section className="tracks-section">
                <div className="track-container reveal-on-scroll">
                    {/* Student Track */}
                    <div className="track-card" onClick={() => navigate('/student/assessment')}>
                        <div className="track-icon">👨‍🎓</div>
                        <h3>For Students</h3>
                        <p>AI 기초부터 고급 프롬프트 최적화까지, 단계별 미션으로 실력을 증명하세요.</p>
                        <button className="btn-link">학습 시작하기 →</button>
                    </div>

                    {/* Enterprise Track */}
                    <div className="track-card" onClick={() => navigate('/enterprise/process')}>
                        <div className="track-icon">🏢</div>
                        <h3>For Enterprise</h3>
                        <p>직원 교육 성과 관리와 ROI 비용 분석, 그리고 우리 기업만의 맞춤형 커리큘럼.</p>
                        <button className="btn-link">도입 문의하기 →</button>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            {/* ... Using existing CTA style or reuse components ... */}
        </div>
    );
}

export default LandingPage;
