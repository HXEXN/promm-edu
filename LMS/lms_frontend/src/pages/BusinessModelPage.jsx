import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './BusinessModelPage.css';

// ── Track A: AI 리터러시 교육 요금제 ──
const TRACK_A_PLANS = [
    {
        id: 'a-basic',
        icon: '📖',
        name: 'Basic',
        desc: '팀 단위 AI 규제 기초 교육',
        monthlyPrice: 290000,
        annualPrice: 2900000,
        features: [
            { text: '교육 인원 최대 10명', included: true },
            { text: 'EU AI Act 기초 과정', included: true },
            { text: '국내 AI 기본법 기초 과정', included: true },
            { text: '온라인 자기주도 학습', included: true },
            { text: '분기별 규제 업데이트 브리핑', included: true },
            { text: '개인 수료증 발급', included: true },
            { text: 'AI 윤리 가이드라인 과정', included: false },
            { text: '실무 워크숍 / 사례 실습', included: false },
            { text: '전문가 1:1 Q&A', included: false },
            { text: '기업 인증 / 감사 대응', included: false }
        ],
        ctaText: '교육 시작하기',
        ctaStyle: 'outline'
    },
    {
        id: 'a-pro',
        icon: '🎓',
        name: 'Professional',
        desc: '부서 단위 심화 교육 + 실습',
        monthlyPrice: 790000,
        annualPrice: 7900000,
        features: [
            { text: '교육 인원 최대 50명', included: true },
            { text: 'EU AI Act 심화 + 실습 과정', included: true },
            { text: '국내 AI 기본법 심화 + 실습', included: true },
            { text: '라이브 강의 + 온라인 병행', included: true },
            { text: '월간 규제 업데이트 브리핑', included: true },
            { text: '부서별 수료증 발급', included: true },
            { text: 'AI 윤리 가이드라인 과정', included: true },
            { text: '실무 워크숍 / 사례 실습', included: true },
            { text: '전문가 1:1 Q&A (월 2회)', included: true },
            { text: '기업 인증 / 감사 대응', included: false }
        ],
        ctaText: '14일 무료 체험',
        ctaStyle: 'primary',
        featured: true,
        badge: '추천'
    },
    {
        id: 'a-enterprise',
        icon: '🏛️',
        name: 'Enterprise',
        desc: '전사 맞춤형 규제 대응 교육',
        monthlyPrice: -1,
        annualPrice: -1,
        priceLabel: '별도 견적',
        features: [
            { text: '교육 인원 무제한', included: true },
            { text: 'EU AI Act 맞춤 컨설팅 + 교육', included: true },
            { text: '국내 AI 기본법 맞춤 컨설팅', included: true },
            { text: '현장 출강 + 온/오프라인 병행', included: true },
            { text: '실시간 규제 변경 알림', included: true },
            { text: '기업 공식 인증서 발급', included: true },
            { text: 'AI 윤리 가이드라인 + 워크숍', included: true },
            { text: '산업별 맞춤 사례 실습', included: true },
            { text: '전문가 상시 자문 (전담)', included: true },
            { text: '감사 대응 + 규정 준수 리포트', included: true }
        ],
        ctaText: '도입 상담 신청',
        ctaStyle: 'enterprise'
    }
];

// ── Track B: 검증 & 교정 요금제 ──
const TRACK_B_PLANS = [
    {
        id: 'b-standard',
        icon: '🔍',
        name: 'Standard',
        desc: 'AI 시스템 기본 진단 & 검증',
        monthlyPrice: 490000,
        annualPrice: 4900000,
        features: [
            { text: 'AI 시스템 진단 월 5건', included: true },
            { text: '위험 등급 자동 분류', included: true },
            { text: '기본 편향성 검증 리포트', included: true },
            { text: '프롬프트 자동 교정', included: true },
            { text: '기본 정확도 리포트', included: true },
            { text: '월간 컴플라이언스 대시보드', included: true },
            { text: '심층 편향성 분석', included: false },
            { text: 'EU 규정 준수 인증서', included: false },
            { text: '국내법 적합성 검증', included: false },
            { text: '전문가 교정 + 감사 대응', included: false }
        ],
        ctaText: '진단 시작하기',
        ctaStyle: 'outline'
    },
    {
        id: 'b-advanced',
        icon: '⚡',
        name: 'Advanced',
        desc: '심층 검증 + 인증 리포트',
        monthlyPrice: 1290000,
        annualPrice: 12900000,
        features: [
            { text: 'AI 시스템 진단 월 20건', included: true },
            { text: '위험 등급 자동 분류 + 상세 분석', included: true },
            { text: '심층 편향성 분석 (다차원)', included: true },
            { text: '프롬프트 자동 교정 + 전문가 리뷰', included: true },
            { text: '상세 정확도 & 신뢰도 리포트', included: true },
            { text: '실시간 컴플라이언스 대시보드', included: true },
            { text: 'EU AI Act 규정 준수 인증서', included: true },
            { text: '국내 AI법 적합성 검증', included: true },
            { text: '분기별 재검증 서비스', included: true },
            { text: '전문가 교정 + 감사 대응', included: false }
        ],
        ctaText: '14일 무료 체험',
        ctaStyle: 'primary',
        featured: true,
        badge: '인기'
    },
    {
        id: 'b-premium',
        icon: '🛡️',
        name: 'Premium',
        desc: '전사 AI 거버넌스 + 감사 대응',
        monthlyPrice: -1,
        annualPrice: -1,
        priceLabel: '별도 견적',
        features: [
            { text: 'AI 시스템 진단 무제한', included: true },
            { text: '실시간 위험 모니터링', included: true },
            { text: '실시간 편향성 모니터링', included: true },
            { text: '전담팀 프롬프트 교정', included: true },
            { text: '인증 리포트 (법적 효력)', included: true },
            { text: '전사 AI 거버넌스 대시보드', included: true },
            { text: 'EU 감사 대응 풀 패키지', included: true },
            { text: '국내법 적합성 + 법률 자문', included: true },
            { text: '상시 재검증 + 모니터링', included: true },
            { text: '전담 컨설턴트 배정', included: true }
        ],
        ctaText: '도입 상담 신청',
        ctaStyle: 'enterprise'
    }
];

// ── FAQ ──
const FAQ_DATA = [
    {
        q: 'EU AI Act와 국내 AI 기본법의 차이점은 무엇인가요?',
        a: 'EU AI Act는 유럽연합의 포괄적 AI 규제법으로, 위험 등급별 의무사항과 최대 €35M의 과징금을 규정합니다. 국내 AI 기본법(인공지능 산업 육성 및 신뢰 기반 조성 등에 관한 법률)은 고위험 AI 영향평가 의무화, 이용자 보호, AI 윤리 원칙을 포함하며, 2026년 시행을 목표로 합니다. 두 법 모두 고위험 AI에 대한 투명성과 안전성을 요구합니다.'
    },
    {
        q: 'AI 리터러시 교육과 검증 프로그램을 함께 도입해야 하나요?',
        a: '함께 도입하시면 최대 효과를 볼 수 있습니다. 교육은 조직의 AI 규제 인식 수준을 높이고, 검증은 실제 AI 시스템이 규정을 준수하는지 확인합니다. 번들 도입 시 20% 할인이 적용됩니다.'
    },
    {
        q: '검증 리포트는 법적 효력이 있나요?',
        a: 'Premium 플랜의 인증 리포트는 국내외 AI 규제 감사 시 증빙 자료로 활용할 수 있습니다. EU AI Act의 적합성 평가(Conformity Assessment) 기준에 부합하는 형식으로 발급됩니다.'
    },
    {
        q: '편향성 검증은 어떤 방식으로 진행되나요?',
        a: '성별, 연령, 인종, 지역 등 다차원 공정성 지표를 기반으로 AI 출력의 편향을 분석합니다. Standard는 기본 통계 분석, Advanced는 SHAP/LIME 기반 설명 가능한 AI 분석, Premium은 실시간 모니터링을 제공합니다.'
    },
    {
        q: '교육 수료증은 어떤 가치가 있나요?',
        a: 'PROMM EDU 수료증은 AI 리터러시 역량을 증명하는 자격으로, 기업의 AI 거버넌스 체계 수립 시 인력 역량 증빙으로 활용됩니다. Enterprise 플랜은 기업 공식 인증서로 발급되어 규제 감사에 대응할 수 있습니다.'
    },
    {
        q: '국내 AI 기본법 시행 전에 준비해야 할 사항은?',
        a: '2026년 시행 전까지 ① 자사 AI 시스템 고위험 여부 판단, ② AI 영향평가 수행 체계 구축, ③ 전 직원 AI 리터러시 교육, ④ AI 윤리 가이드라인 내재화를 권장합니다. PROMM EDU의 2-Track 프로그램으로 모두 대비할 수 있습니다.'
    },
    {
        q: '프롬프트 교정은 어떻게 이루어지나요?',
        a: 'AI 프롬프트의 편향성, 부정확성, 규정 위반 가능성을 자동 분석하고, 수정된 프롬프트를 제안합니다. Advanced 이상 플랜에서는 전문가가 직접 리뷰하여 교정합니다.'
    },
    {
        q: '무료 체험 기간에 카드를 등록해야 하나요?',
        a: '아니요, 14일 무료 체험은 카드 등록 없이 바로 시작할 수 있습니다. 체험 기간 중 교육 3개 모듈과 AI 진단 2건을 무료로 이용할 수 있습니다.'
    }
];

function BusinessModelPage() {
    const navigate = useNavigate();
    const [activeTrack, setActiveTrack] = useState('a');
    const [isAnnual, setIsAnnual] = useState(true);
    const [openFaqIdx, setOpenFaqIdx] = useState(null);

    const currentPlans = activeTrack === 'a' ? TRACK_A_PLANS : TRACK_B_PLANS;

    const formatPrice = (plan) => {
        if (plan.priceLabel) return plan.priceLabel;
        const price = isAnnual ? Math.round(plan.annualPrice / 12) : plan.monthlyPrice;
        return `₩${price.toLocaleString()}`;
    };

    return (
        <div className="business-model-page">
            {/* ═══ Hero ═══ */}
            <section className="biz-hero">
                <div className="hero-badge-row">
                    <span className="hero-badge">EU AI Act</span>
                    <span className="hero-badge domestic">국내 AI 기본법</span>
                </div>
                <h1>AI 규제 시대,<br />교육과 검증으로 대비하세요</h1>
                <p className="hero-sub">
                    EU AI Act와 국내 AI 기본법, 두 가지 규제에 동시 대응.<br />
                    리터러시 교육부터 시스템 검증·교정까지 원스톱 솔루션.
                </p>
                <div className="hero-stats">
                    <div className="hero-stat">
                        <div className="stat-num">2026</div>
                        <div className="stat-label">국내 AI법 시행 예정</div>
                    </div>
                    <div className="hero-stat">
                        <div className="stat-num">€35M</div>
                        <div className="stat-label">EU 최대 과징금</div>
                    </div>
                    <div className="hero-stat">
                        <div className="stat-num">2-Track</div>
                        <div className="stat-label">교육 + 검증 프로그램</div>
                    </div>
                </div>
            </section>

            {/* ═══ Track Selector ═══ */}
            <section className="track-section">
                <div className="track-tabs">
                    <button
                        className={`track-tab ${activeTrack === 'a' ? 'active track-a' : ''}`}
                        onClick={() => setActiveTrack('a')}
                    >
                        <span className="track-icon">📚</span>
                        <div className="track-info">
                            <strong>Track A</strong>
                            <span>AI 리터러시 교육</span>
                        </div>
                    </button>
                    <button
                        className={`track-tab ${activeTrack === 'b' ? 'active track-b' : ''}`}
                        onClick={() => setActiveTrack('b')}
                    >
                        <span className="track-icon">🔍</span>
                        <div className="track-info">
                            <strong>Track B</strong>
                            <span>검증 & 교정 프로그램</span>
                        </div>
                    </button>
                </div>

                <div className={`track-desc-bar ${activeTrack === 'b' ? 'track-b' : ''}`}>
                    {activeTrack === 'a' ? (
                        <p>EU AI Act · 국내 AI 기본법 · AI 윤리 가이드라인 교육을 통해 조직의 <strong>AI 리터러시 역량</strong>을 강화합니다</p>
                    ) : (
                        <p>AI 시스템의 위험 등급 진단 · 편향성 검증 · 프롬프트 교정으로 <strong>규정 준수를 입증</strong>합니다</p>
                    )}
                </div>
            </section>

            {/* ═══ Pricing Plans ═══ */}
            <section className="pricing-section">
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
                    {currentPlans.map((plan) => (
                        <div key={plan.id} className={`pricing-card ${plan.featured ? 'featured' : ''} ${activeTrack === 'b' ? 'track-b-card' : ''}`}>
                            {plan.badge && <span className={`card-badge ${activeTrack === 'b' ? 'badge-b' : ''}`}>{plan.badge}</span>}

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
                                    if (plan.ctaStyle === 'enterprise') navigate('/enterprise/process');
                                    else navigate('/free-trial');
                                }}
                            >
                                {plan.ctaText}
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══ Bundle Offer ═══ */}
            <section className="bundle-section">
                <div className="bundle-card">
                    <div className="bundle-left">
                        <span className="bundle-badge">🔥 BUNDLE</span>
                        <h2>Track A + B 통합 도입</h2>
                        <p>교육과 검증을 함께 도입하면 <strong>20% 할인</strong>이 적용됩니다.<br />
                            규제 교육으로 인식을 높이고, 검증으로 실제 준수를 입증하세요.</p>
                    </div>
                    <div className="bundle-right">
                        <div className="bundle-items">
                            <div className="bundle-item">
                                <span>📚</span>
                                <span>AI 리터러시 교육</span>
                            </div>
                            <div className="bundle-plus">+</div>
                            <div className="bundle-item">
                                <span>🔍</span>
                                <span>검증 & 교정</span>
                            </div>
                            <div className="bundle-equals">=</div>
                            <div className="bundle-discount">20% OFF</div>
                        </div>
                        <button className="cta-btn primary" onClick={() => navigate('/enterprise/process')}>
                            통합 상담 신청
                        </button>
                    </div>
                </div>
            </section>

            {/* ═══ Regulation Timeline ═══ */}
            <section className="reg-timeline-section">
                <h2>📅 주요 규제 일정</h2>
                <div className="reg-timeline">
                    <div className="reg-event completed">
                        <div className="reg-date">2024.08</div>
                        <div className="reg-dot" />
                        <div className="reg-content">
                            <strong>EU AI Act 발효</strong>
                            <p>유럽연합 AI법 공식 발효</p>
                        </div>
                    </div>
                    <div className="reg-event completed">
                        <div className="reg-date">2025.02</div>
                        <div className="reg-dot" />
                        <div className="reg-content">
                            <strong>금지 AI 시행</strong>
                            <p>수용 불가 AI 시스템 전면 금지</p>
                        </div>
                    </div>
                    <div className="reg-event current">
                        <div className="reg-date">2025.08</div>
                        <div className="reg-dot" />
                        <div className="reg-content">
                            <strong>AI 리터러시 의무화</strong>
                            <p>EU AI Act Article 4 — AI 사용 인력 교육 의무</p>
                        </div>
                    </div>
                    <div className="reg-event upcoming">
                        <div className="reg-date">2026.02</div>
                        <div className="reg-dot" />
                        <div className="reg-content">
                            <strong>국내 AI 기본법 시행 (예정)</strong>
                            <p>고위험 AI 영향평가 의무화</p>
                        </div>
                    </div>
                    <div className="reg-event upcoming">
                        <div className="reg-date">2026.08</div>
                        <div className="reg-dot" />
                        <div className="reg-content">
                            <strong>고위험 AI 전면 시행</strong>
                            <p>EU AI Act Annex III 전면 규제</p>
                        </div>
                    </div>
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
                <h2>🚀 규제 대비, 지금 시작하세요</h2>
                <p>
                    14일 무료 체험으로 AI 리터러시 교육 3개 모듈과
                    AI 시스템 진단 2건을 무료로 이용하세요.
                </p>
                <div className="cta-buttons">
                    <button className="cta-btn primary" onClick={() => navigate('/free-trial')}>
                        무료 체험 시작하기
                    </button>
                    <button className="cta-btn secondary" onClick={() => navigate('/enterprise/process')}>
                        기업 도입 상담
                    </button>
                    <button className="cta-btn secondary" onClick={() => navigate('/eu-ai-act')}>
                        EU AI Act 진단하기
                    </button>
                </div>
            </section>
        </div>
    );
}

export default BusinessModelPage;
