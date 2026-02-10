import { Link } from 'react-router-dom';
import { useState } from 'react';
import './WhyLearnPage.css';

function WhyLearnPage() {
    const [activeTab, setActiveTab] = useState('revolution');

    return (
        <div className="why-learn-page">
            <header className="page-header">
                <Link to="/" className="back-link">← 홈으로</Link>
                <h1>왜 프롬프트 엔지니어링을 배워야 할까요?</h1>
                <p className="header-subtitle">
                    데이터로 증명된 프롬프트 최적화의 가치
                </p>
            </header>

            <section className="impact-section">
                <div className="tabs">
                    <button
                        className={`tab ${activeTab === 'revolution' ? 'active' : ''}`}
                        onClick={() => setActiveTab('revolution')}
                    >
                        🎓 교육의 변화
                    </button>
                    <button
                        className={`tab ${activeTab === 'cost' ? 'active' : ''}`}
                        onClick={() => setActiveTab('cost')}
                    >
                        💰 비용 절감
                    </button>
                    <button
                        className={`tab ${activeTab === 'efficiency' ? 'active' : ''}`}
                        onClick={() => setActiveTab('efficiency')}
                    >
                        ⚡ 효율성 향상
                    </button>
                    <button
                        className={`tab ${activeTab === 'career' ? 'active' : ''}`}
                        onClick={() => setActiveTab('career')}
                    >
                        🚀 커리어 성장
                    </button>
                </div>

                <div className="tab-content">
                    {activeTab === 'revolution' && (
                        <div className="content-panel fade-in">
                            <h2>세계 최고 대학과 AI 리더들의 선언</h2>

                            <div className="revolution-highlight">
                                <div className="quote-card featured">
                                    <div className="quote-avatar">🧠</div>
                                    <div className="quote-content">
                                        <blockquote>
                                            "가장 좋은 프로그래밍 언어는 <strong>인간의 언어</strong>입니다.
                                            누구나 '인간어'를 알고 있습니다. AI에게 정중하게 부탁하면
                                            프로그램, 이미지, 시를 만들어줍니다."
                                        </blockquote>
                                        <div className="quote-author">
                                            <strong>Jensen Huang</strong>
                                            <span>NVIDIA CEO, 2024</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="stanford-section">
                                <div className="stanford-header">
                                    <span className="stanford-logo">🎓</span>
                                    <div>
                                        <h3>Stanford University 교육 혁신 (2025)</h3>
                                        <span className="badge-new">NEW COURSE</span>
                                    </div>
                                </div>

                                <div className="course-card">
                                    <div className="course-title">
                                        <span className="course-code">CS146S</span>
                                        <span className="course-name">"The Modern Software Developer"</span>
                                    </div>
                                    <p className="course-desc">
                                        2025년 가을학기부터 개설된 이 과목에서 학생들은
                                        <strong>"한 줄의 코드도 작성하지 않고"</strong> AI 도구를 활용해
                                        과제를 완료할 수 있습니다.
                                    </p>
                                    <div className="course-highlight">
                                        <span className="highlight-icon">💡</span>
                                        <span>코딩 방법이 아닌 <strong>AI와 협업하는 방법</strong>을 가르칩니다</span>
                                    </div>
                                </div>

                                <div className="stanford-initiatives">
                                    <div className="initiative">
                                        <strong>AIMES 프로그램</strong>
                                        <p>AI Meets Education at Stanford - 교수진의 생성 AI 교육 통합 지원</p>
                                    </div>
                                    <div className="initiative">
                                        <strong>AI+Education Summit</strong>
                                        <p>2025년 2월 개최, AI가 교육을 어떻게 변화시키는지 연구</p>
                                    </div>
                                </div>

                                <div className="stanford-study">
                                    <h4>📊 Stanford 연구 결과 (2025년 8월)</h4>
                                    <p>
                                        ChatGPT 등장 이후 <strong>초급 프로그래밍 일자리가 크게 감소</strong>했으며,
                                        AI 자동화가 핵심 요인으로 분석되었습니다.
                                    </p>
                                    <div className="study-implication">
                                        → AI를 활용하는 <strong>고급 스킬</strong>의 중요성이 더욱 부각되고 있습니다
                                    </div>
                                </div>
                            </div>

                            <div className="ai-leaders-section">
                                <h3>🌟 AI 리더들의 공통된 메시지</h3>

                                <div className="leaders-grid">
                                    <div className="leader-card">
                                        <div className="leader-name">Jensen Huang</div>
                                        <div className="leader-role">NVIDIA CEO</div>
                                        <p>
                                            "C++나 Python 같은 전문 언어와 달리,
                                            <strong>모든 사람이 자연어를 알고 있습니다.</strong>"
                                        </p>
                                    </div>

                                    <div className="leader-card">
                                        <div className="leader-name">Andrew Ng</div>
                                        <div className="leader-role">Stanford / DeepLearning.AI</div>
                                        <p>
                                            "모든 분야의 학생들이 코딩과 생성 AI 사용법을
                                            배워야 합니다. <strong>소프트웨어 엔지니어링뿐 아니라</strong>."
                                        </p>
                                    </div>

                                    <div className="leader-card">
                                        <div className="leader-name">Satya Nadella</div>
                                        <div className="leader-role">Microsoft CEO</div>
                                        <p>
                                            "자연어가 <strong>궁극적인 추상화</strong>입니다.
                                            인간의 의도를 AI가 소프트웨어 실행으로 변환합니다."
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="paradigm-shift">
                                <h3>💫 패러다임의 전환</h3>
                                <div className="shift-comparison">
                                    <div className="old-way">
                                        <h4>과거: 코딩 중심</h4>
                                        <ul>
                                            <li>문법, 알고리즘, 자료구조 학습</li>
                                            <li>수년간의 프로그래밍 언어 숙련</li>
                                            <li>개발자만 소프트웨어 제작 가능</li>
                                        </ul>
                                    </div>
                                    <div className="shift-arrow">→</div>
                                    <div className="new-way">
                                        <h4>현재: 프롬프트 중심</h4>
                                        <ul>
                                            <li>의도 전달, 맥락 설정, 결과 검증</li>
                                            <li>자연어로 AI와 협업</li>
                                            <li><strong>누구나</strong> AI로 솔루션 구축 가능</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="why-now">
                                <h3>⏰ 왜 지금 배워야 할까요?</h3>
                                <div className="why-reasons">
                                    <div className="reason">
                                        <span className="reason-icon">🏫</span>
                                        <div>
                                            <strong>교육이 변하고 있습니다</strong>
                                            <p>세계 최고 대학들이 커리큘럼을 AI 중심으로 재편하고 있습니다</p>
                                        </div>
                                    </div>
                                    <div className="reason">
                                        <span className="reason-icon">💼</span>
                                        <div>
                                            <strong>일자리가 변하고 있습니다</strong>
                                            <p>단순 코딩보다 AI 활용 능력이 더 중요해지고 있습니다</p>
                                        </div>
                                    </div>
                                    <div className="reason">
                                        <span className="reason-icon">🚀</span>
                                        <div>
                                            <strong>기회가 열리고 있습니다</strong>
                                            <p>프로그래밍 경험 없이도 AI로 가치를 창출할 수 있습니다</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'cost' && (
                        <div className="content-panel fade-in">
                            <h2>API 비용, 최대 60% 절감 가능</h2>

                            <div className="comparison-box">
                                <div className="before">
                                    <h3>❌ 최적화 전</h3>
                                    <div className="example-prompt">
                                        <p className="prompt-text">
                                            "Hello AI assistant, I hope you're having a great day!
                                            I would really appreciate it if you could help me with
                                            something. I have a plant in my smart farm, and I've
                                            noticed that the soil seems quite dry. The humidity
                                            sensor is showing 25%, which I believe is quite low.
                                            Could you please analyze this situation and provide
                                            me with some recommendations on what I should do?
                                            Thank you so much in advance!"
                                        </p>
                                        <div className="token-cost">
                                            <span className="cost-label">토큰 수:</span>
                                            <span className="cost-value bad">95 tokens</span>
                                        </div>
                                        <div className="money-cost">
                                            약 $0.00104 (Claude 3.5 Sonnet 기준)
                                        </div>
                                    </div>
                                </div>

                                <div className="arrow-separator">→</div>

                                <div className="after">
                                    <h3>✅ 최적화 후</h3>
                                    <div className="example-prompt">
                                        <p className="prompt-text">
                                            "Role: Smart farm manager<br />
                                            Context: Soil humidity at 25% (low)<br />
                                            Action: Recommend watering strategy"
                                        </p>
                                        <div className="token-cost">
                                            <span className="cost-label">토큰 수:</span>
                                            <span className="cost-value good">22 tokens</span>
                                        </div>
                                        <div className="money-cost">
                                            약 $0.00024 (77% Input 비용 절감)
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="savings-highlight">
                                <div className="savings-stat">
                                    <div className="stat-big">77%</div>
                                    <div>토큰 절감</div>
                                </div>
                                <div className="savings-stat">
                                    <div className="stat-big">$1.46</div>
                                    <div>연간 1000건 기준 절감액</div>
                                </div>
                            </div>

                            <div className="real-case">
                                <h3>📊 실제 사례</h3>
                                <ul>
                                    <li>
                                        <strong>미디어 기업:</strong> 콘텐츠 생성 워크플로우 최적화로
                                        <span className="highlight">45% 토큰 사용량 감소</span>
                                    </li>
                                    <li>
                                        <strong>고객 서비스 챗봇:</strong> 프롬프트 엔지니어링으로
                                        <span className="highlight">30% 이상 비용 절감</span>
                                    </li>
                                    <li>
                                        <strong>모니터링 대시보드 활용:</strong> 실시간 최적화로
                                        <span className="highlight">25% 비용 감소</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {activeTab === 'efficiency' && (
                        <div className="content-panel fade-in">
                            <h2>작업 속도 25% 향상, 품질 40% 개선</h2>

                            <div className="efficiency-stats">
                                <div className="stat-box">
                                    <div className="stat-icon">⚡</div>
                                    <div className="stat-number">25%</div>
                                    <div className="stat-desc">더 빠른 작업 완료</div>
                                    <p className="stat-detail">
                                        효과적인 프롬프트를 사용한 컨설턴트들은
                                        동일한 작업을 25% 더 빠르게 완료했습니다
                                    </p>
                                </div>

                                <div className="stat-box">
                                    <div className="stat-icon">⭐</div>
                                    <div className="stat-number">40%</div>
                                    <div className="stat-desc">더 높은 결과 품질</div>
                                    <p className="stat-detail">
                                        체계적인 프롬프트 엔지니어링으로
                                        출력물의 품질이 40% 향상되었습니다
                                    </p>
                                </div>

                                <div className="stat-box">
                                    <div className="stat-icon">🎯</div>
                                    <div className="stat-number">20-30%</div>
                                    <div className="stat-desc">성능 개선</div>
                                    <p className="stat-detail">
                                        임기응변식 접근 대비 체계적인 프롬프트
                                        엔지니어링으로 더 나은 성능 달성
                                    </p>
                                </div>
                            </div>

                            <div className="roi-section">
                                <h3>💎 투자 수익률 (ROI)</h3>
                                <div className="roi-box">
                                    <div className="roi-number">340%</div>
                                    <p>
                                        프롬프트 설계를 공식적으로 통합한 기업들은
                                        임기응변식 접근 방식을 사용하는 기업들보다
                                        <strong>최대 340% 높은 ROI</strong>를 달성했습니다
                                    </p>
                                </div>

                                <div className="example-roi">
                                    <h4>실제 사례: 소매 체인</h4>
                                    <p>
                                        고객 서비스 봇의 프롬프트를 조정하여
                                        잘못된 무료 증정을 90% 감소시켰으며,
                                        이는 <strong>시스템 구축 비용을 상쇄하고도 남는 비용 절감</strong>을
                                        달성했습니다
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'career' && (
                        <div className="content-panel fade-in">
                            <h2>급성장하는 프롬프트 엔지니어 수요</h2>

                            <div className="career-growth">
                                <div className="growth-stat">
                                    <div className="growth-number">3,500%</div>
                                    <div className="growth-label">채용 공고 증가</div>
                                    <p>
                                        Stanford의 AI Index 2024에 따르면,
                                        "프롬프트 엔지니어링" 언급 채용 공고가
                                        전년 대비 <strong>3,500% 이상 급증</strong>했습니다
                                    </p>
                                </div>

                                <div className="linkedin-box">
                                    <h3>🏆 LinkedIn 신흥 직무 Top 5</h3>
                                    <p>
                                        LinkedIn의 2025년 Q1 신흥 직무 보고서에서
                                        "프롬프트 엔지니어"가 <strong>글로벌 Top 5 역할</strong> 중
                                        하나로 선정되었습니다
                                    </p>
                                </div>
                            </div>

                            <div className="salary-info">
                                <h3>💼 연봉 정보 (2025)</h3>
                                <div className="salary-range">
                                    <div className="salary-min">$95,000</div>
                                    <div className="salary-separator">~</div>
                                    <div className="salary-max">$270,000</div>
                                </div>
                                <p className="salary-note">
                                    경력과 회사 규모에 따라 달라질 수 있습니다
                                </p>
                            </div>

                            <div className="market-growth">
                                <h3>📈 시장 규모 전망</h3>
                                <div className="market-stats">
                                    <div className="market-stat">
                                        <div className="year">2024</div>
                                        <div className="value">$380B</div>
                                    </div>
                                    <div className="growth-arrow">→</div>
                                    <div className="market-stat">
                                        <div className="year">2025</div>
                                        <div className="value">$505B</div>
                                    </div>
                                    <div className="growth-rate">
                                        연평균 성장률: <strong>32.9%</strong>
                                    </div>
                                </div>
                                <p className="market-note">
                                    글로벌 프롬프트 엔지니어링 시장은 향후 10년간
                                    지속적인 고성장이 예상됩니다
                                </p>
                            </div>

                            <div className="adoption-stat">
                                <h3>🏢 기업 AI 도입 현황</h3>
                                <div className="adoption-number">78%</div>
                                <p>
                                    Fortune 500 기업의 78%가 이미
                                    <strong>핵심 비즈니스 프로세스에 AI를 활용</strong>하고 있으며,
                                    효과적인 프롬프트 엔지니어링은 경쟁 우위의 핵심 요소입니다
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            <section className="cta-section">
                <h2>지금 바로 시작하세요</h2>
                <p>실습을 통해 프롬프트 최적화를 직접 경험하고 측정 가능한 결과를 만들어보세요</p>
                <div className="cta-buttons">
                    <Link to="/dashboard?mode=student" className="btn btn-primary btn-large">
                        🎓 학습 시작하기
                    </Link>
                    <Link to="/dashboard?mode=enterprise" className="btn btn-outline btn-large">
                        🏢 기업 솔루션 보기
                    </Link>
                </div>
            </section>
        </div>
    );
}

export default WhyLearnPage;
