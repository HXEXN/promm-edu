import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './BusinessModelPage.css';

// ── Pricing Plans ──
const PLANS = [
    {
        id: 'starter',
        icon: '🚀',
        name: 'Starter',
        desc: '소규모 팀의 AI 프롬프트 교육 시작에 적합',
        monthlyPrice: 0,
        annualPrice: 0,
        priceLabel: '무료',
        features: [
            { text: '사용자 최대 5명', included: true },
            { text: 'AI 분석 월 100회', included: true },
            { text: '기본 교육 모듈 3개', included: true },
            { text: '프롬프트 생성기', included: true },
            { text: '기본 토큰 비용 분석', included: true },
            { text: 'ROI 분석 리포트', included: false },
            { text: 'EU AI Act 대비 도구', included: false },
            { text: '고급 토큰 최적화 (STC)', included: false },
            { text: 'API 접근', included: false },
            { text: '전담 매니저', included: false }
        ],
        ctaText: '무료로 시작하기',
        ctaStyle: 'outline',
        featured: false
    },
    {
        id: 'professional',
        icon: '⚡',
        name: 'Professional',
        desc: '성장하는 기업을 위한 프리미엄 AI 교육',
        monthlyPrice: 490000,
        annualPrice: 4700000,
        features: [
            { text: '사용자 최대 50명', included: true },
            { text: 'AI 분석 월 5,000회', included: true },
            { text: '전체 교육 모듈 12개', included: true },
            { text: '프롬프트 생성기', included: true },
            { text: '고급 토큰 최적화 (STC 엔진)', included: true },
            { text: 'ROI 분석 리포트', included: true },
            { text: 'EU AI Act 컴플라이언스 도구', included: true },
            { text: '비용 절감 상세 분석', included: true },
            { text: 'API 접근', included: true },
            { text: '전담 매니저', included: false }
        ],
        ctaText: '14일 무료 체험',
        ctaStyle: 'primary',
        featured: true,
        badge: '인기'
    },
    {
        id: 'enterprise',
        icon: '🏢',
        name: 'Enterprise',
        desc: '대규모 조직을 위한 완전 맞춤형 솔루션',
        monthlyPrice: -1,
        annualPrice: -1,
        priceLabel: '별도 견적',
        features: [
            { text: '사용자 무제한', included: true },
            { text: 'AI 분석 무제한', included: true },
            { text: 'AI 맞춤 커리큘럼 생성', included: true },
            { text: '프롬프트 생성기', included: true },
            { text: '엔터프라이즈급 토큰 최적화', included: true },
            { text: 'ROI 분석 + 전사 리포트', included: true },
            { text: 'EU AI Act 대비 + 컨설팅', included: true },
            { text: '전사 비용 최적화 분석', included: true },
            { text: 'API + 커스텀 인테그레이션', included: true },
            { text: '전담 매니저 (SLA 99.9%)', included: true }
        ],
        ctaText: '도입 상담 신청',
        ctaStyle: 'enterprise',
        featured: false
    }
];

// ── Revenue Streams ──
const REVENUE_STREAMS = [
    { icon: '💳', title: 'SaaS 구독료', desc: '월/연 정기 구독 기반 안정적 매출', pct: '55%' },
    { icon: '🔗', title: 'API 토큰 과금', desc: '사용량 기반 종량제 API 호출 수익', pct: '20%' },
    { icon: '🎓', title: '컨설팅 서비스', desc: 'EU AI Act 대응 및 프롬프트 전략 자문', pct: '15%' },
    { icon: '📋', title: '커스텀 개발', desc: '기업 맞춤형 모듈 및 API 통합 개발', pct: '10%' }
];

// ── FAQ Data ──
const FAQ_DATA = [
    {
        q: '무료 플랜에서 유료 플랜으로 언제든 전환할 수 있나요?',
        a: '네, 언제든지 Professional 또는 Enterprise 플랜으로 업그레이드할 수 있습니다. 기존 데이터와 학습 진도는 그대로 유지됩니다.'
    },
    {
        q: '결제 방식은 어떻게 되나요?',
        a: '신용카드, 법인카드, 계좌이체(세금계산서 발행)를 지원합니다. 연간 결제 시 2개월 무료 혜택이 적용됩니다.'
    },
    {
        q: '데이터 보안은 어떻게 관리되나요?',
        a: 'AWS 기반 인프라에서 운영되며, 모든 데이터는 AES-256 암호화됩니다. SOC 2 Type II 인증을 보유하고 있으며, Enterprise 플랜은 전용 VPC 배포도 가능합니다.'
    },
    {
        q: 'AI 맞춤 커리큘럼은 어떻게 생성되나요?',
        a: 'GPT-5.2 기반 AI가 귀사의 업종, AI 사용 현황, 직원 수준을 분석하여 최적화된 교육 과정을 자동으로 생성합니다. Enterprise 플랜에서 이용 가능합니다.'
    },
    {
        q: 'API 토큰 과금은 어떻게 계산되나요?',
        a: 'Professional 플랜의 월 5,000회 기본 제공량을 초과하면, 추가 분석 건당 ₩50의 종량제 요금이 적용됩니다. Enterprise는 별도 협의합니다.'
    },
    {
        q: 'EU AI Act 컴플라이언스 기능은 무엇을 포함하나요?',
        a: '위험 등급 자동 진단, 10항목 체크리스트, 시행 타임라인 추적을 포함합니다. Enterprise 플랜은 전문가 컨설팅과 맞춤 규정 준수 리포트가 추가됩니다.'
    },
    {
        q: '해지는 어떻게 하나요?',
        a: '언제든 해지 가능하며, 해지 시 남은 기간까지 서비스를 이용할 수 있습니다. 위약금은 없습니다. 데이터는 해지 후 30일간 보관됩니다.'
    },
    {
        q: '무료 체험 기간에 신용카드를 등록해야 하나요?',
        a: '아니요, 14일 무료 체험은 카드 등록 없이 바로 시작할 수 있습니다. 체험 종료 후 유료 전환을 원하실 때만 결제 정보를 등록하시면 됩니다.'
    }
];

function BusinessModelPage() {
    const navigate = useNavigate();
    const [isAnnual, setIsAnnual] = useState(true);
    const [openFaqIdx, setOpenFaqIdx] = useState(null);

    // Simulator state
    const [simEmployees, setSimEmployees] = useState(30);
    const [simUsage, setSimUsage] = useState(3000);

    const formatKRW = (amount) => {
        if (amount >= 10000) {
            return `₩${(amount / 10000).toFixed(0)}만`;
        }
        return `₩${amount.toLocaleString()}`;
    };

    // Simulator calculations
    const getRecommendedPlan = () => {
        if (simEmployees <= 5 && simUsage <= 100) return 'starter';
        if (simEmployees <= 50 && simUsage <= 5000) return 'professional';
        return 'enterprise';
    };

    const getSimCost = () => {
        const plan = getRecommendedPlan();
        if (plan === 'starter') return 0;
        if (plan === 'professional') {
            const base = isAnnual ? Math.round(4700000 / 12) : 490000;
            const extraCalls = Math.max(0, simUsage - 5000);
            const extraCost = extraCalls * 50;
            return base + extraCost;
        }
        // Enterprise estimate
        return Math.round(simEmployees * 15000 + simUsage * 30);
    };

    const getSimSavings = () => {
        // Average AI cost saving of 40% through prompt optimization
        const avgTokenCostPerCall = 150; // ₩150 per API call average
        const monthlyCostWithout = simUsage * avgTokenCostPerCall * simEmployees * 0.3;
        const savingsRate = 0.4;
        return Math.round(monthlyCostWithout * savingsRate);
    };

    const getSimROI = () => {
        const cost = getSimCost();
        if (cost === 0) return '∞';
        const savings = getSimSavings();
        return `${Math.round((savings / Math.max(cost, 1)) * 100)}%`;
    };

    return (
        <div className="business-model-page">
            {/* ═══ Hero ═══ */}
            <section className="biz-hero">
                <h1>비즈니스 모델 & 요금제</h1>
                <p className="hero-sub">
                    AI 프롬프트 교육으로 비용 40% 절감, 생산성 3배 향상.<br />
                    기업 규모에 맞는 플랜을 선택하세요.
                </p>
                <div className="hero-stats">
                    <div className="hero-stat">
                        <div className="stat-num">40%</div>
                        <div className="stat-label">평균 비용 절감</div>
                    </div>
                    <div className="hero-stat">
                        <div className="stat-num">3배</div>
                        <div className="stat-label">생산성 향상</div>
                    </div>
                    <div className="hero-stat">
                        <div className="stat-num">2.4개월</div>
                        <div className="stat-label">평균 손익분기점</div>
                    </div>
                </div>
            </section>

            {/* ═══ Pricing Plans ═══ */}
            <section className="pricing-section">
                <h2>💰 요금제</h2>
                <p>성장 단계에 맞는 플랜을 선택하세요</p>

                <div className="pricing-toggle">
                    <span>월간 결제</span>
                    <div
                        className={`toggle-pill ${isAnnual ? 'annual' : ''}`}
                        onClick={() => setIsAnnual(!isAnnual)}
                    />
                    <span>연간 결제</span>
                    {isAnnual && <span className="save-badge">2개월 무료</span>}
                </div>

                <div className="pricing-cards">
                    {PLANS.map((plan) => (
                        <div key={plan.id} className={`pricing-card ${plan.featured ? 'featured' : ''}`}>
                            {plan.badge && <span className="card-badge">{plan.badge}</span>}

                            <div className="card-header">
                                <span className="card-icon">{plan.icon}</span>
                                <h3>{plan.name}</h3>
                                <p className="card-desc">{plan.desc}</p>
                            </div>

                            <div className="card-price">
                                {plan.priceLabel ? (
                                    <div className="price-amount">{plan.priceLabel}</div>
                                ) : (
                                    <>
                                        <div className="price-amount">
                                            <span className="currency">₩</span>
                                            {isAnnual
                                                ? Math.round(plan.annualPrice / 12).toLocaleString()
                                                : plan.monthlyPrice.toLocaleString()
                                            }
                                            <span className="price-period">/월</span>
                                        </div>
                                        {isAnnual && plan.monthlyPrice > 0 && (
                                            <div className="price-original">
                                                월 ₩{plan.monthlyPrice.toLocaleString()}
                                            </div>
                                        )}
                                        {isAnnual && plan.annualPrice > 0 && (
                                            <div className="price-sub">
                                                연 ₩{plan.annualPrice.toLocaleString()} 결제
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            <div className="card-features">
                                {plan.features.map((feat, i) => (
                                    <div key={i} className={`feature-item ${!feat.included ? 'disabled' : ''}`}>
                                        <span className={`feat-icon ${feat.included ? 'yes' : 'no'}`}>
                                            {feat.included ? '✓' : '—'}
                                        </span>
                                        <span>{feat.text}</span>
                                    </div>
                                ))}
                            </div>

                            <button
                                className={`card-cta ${plan.ctaStyle}`}
                                onClick={() => {
                                    if (plan.id === 'enterprise') navigate('/enterprise/process');
                                    else if (plan.id === 'starter') navigate('/free-trial');
                                    else navigate('/free-trial');
                                }}
                            >
                                {plan.ctaText}
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══ Revenue Simulator ═══ */}
            <section className="simulator-section">
                <h2>📊 도입 효과 시뮬레이터</h2>
                <p>직원 수와 AI 사용량을 입력하면 최적 플랜과 절감 효과를 확인할 수 있습니다</p>

                <div className="simulator-card">
                    <div className="sim-inputs">
                        <div className="sim-group">
                            <label>👥 AI 활용 직원 수</label>
                            <input
                                type="range"
                                className="sim-slider"
                                min="1" max="500"
                                value={simEmployees}
                                onChange={e => setSimEmployees(Number(e.target.value))}
                            />
                            <div className="sim-value">{simEmployees}명</div>
                        </div>
                        <div className="sim-group">
                            <label>🔄 월간 AI 분석 요청 수</label>
                            <input
                                type="range"
                                className="sim-slider"
                                min="50" max="50000" step="50"
                                value={simUsage}
                                onChange={e => setSimUsage(Number(e.target.value))}
                            />
                            <div className="sim-value">{simUsage.toLocaleString()}회/월</div>
                        </div>
                    </div>

                    <div className="sim-results">
                        <div className="sim-result-card">
                            <div className="result-label">추천 플랜</div>
                            <div className="result-value plan">
                                {getRecommendedPlan() === 'starter' ? 'Starter' :
                                    getRecommendedPlan() === 'professional' ? 'Professional' : 'Enterprise'}
                            </div>
                            <div className="result-sub">월 {formatKRW(getSimCost())}</div>
                        </div>
                        <div className="sim-result-card">
                            <div className="result-label">예상 월 절감액</div>
                            <div className="result-value savings">
                                {formatKRW(getSimSavings())}
                            </div>
                            <div className="result-sub">토큰 최적화 기준</div>
                        </div>
                        <div className="sim-result-card">
                            <div className="result-label">예상 ROI</div>
                            <div className="result-value roi">
                                {getSimROI()}
                            </div>
                            <div className="result-sub">월 투자 대비 절감</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ Revenue Streams ═══ */}
            <section className="streams-section">
                <h2>📈 수익 구조</h2>
                <div className="streams-grid">
                    {REVENUE_STREAMS.map((stream, i) => (
                        <div key={i} className="stream-card">
                            <span className="stream-icon">{stream.icon}</span>
                            <div className="stream-title">{stream.title}</div>
                            <div className="stream-desc">{stream.desc}</div>
                            <span className="stream-pct">매출 비중 {stream.pct}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══ FAQ ═══ */}
            <section className="faq-section">
                <h2>❓ 자주 묻는 질문</h2>
                {FAQ_DATA.map((item, idx) => (
                    <div key={idx} className="faq-item">
                        <div
                            className="faq-question"
                            onClick={() => setOpenFaqIdx(openFaqIdx === idx ? null : idx)}
                        >
                            <span className="q-text">{item.q}</span>
                            <span className={`q-arrow ${openFaqIdx === idx ? 'open' : ''}`}>▼</span>
                        </div>
                        {openFaqIdx === idx && (
                            <div className="faq-answer">{item.a}</div>
                        )}
                    </div>
                ))}
            </section>

            {/* ═══ CTA ═══ */}
            <section className="cta-section">
                <h2>🚀 지금 시작하세요</h2>
                <p>
                    14일 무료 체험으로 PROMM EDU의 강력한 AI 프롬프트 교육을
                    직접 경험해보세요. 카드 등록 불필요.
                </p>
                <div className="cta-buttons">
                    <button className="cta-btn primary" onClick={() => navigate('/free-trial')}>
                        무료 체험 시작하기
                    </button>
                    <button className="cta-btn secondary" onClick={() => navigate('/enterprise/process')}>
                        기업 도입 상담
                    </button>
                </div>
            </section>
        </div>
    );
}

export default BusinessModelPage;
