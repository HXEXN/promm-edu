import { useState, useEffect } from 'react';
import './EUAIActPage.css';

// ── EU AI Act 위험 등급 데이터 ──
const RISK_DATA = {
    unacceptable: {
        level: 'unacceptable',
        label: '🚫 수용 불가 (Unacceptable Risk)',
        shortLabel: '수용 불가',
        color: '#EF4444',
        description: 'EU AI Act에 의해 전면 금지된 AI 시스템입니다. 사회적 점수제, 잠재의식 조작, 취약 계층 악용, 공공장소 실시간 생체 인식 등이 해당됩니다.',
        obligations: [
            { icon: '🚫', text: '해당 AI 시스템의 즉시 사용 중단' },
            { icon: '⚖️', text: '위반 시 최대 €35M 또는 매출 7% 과징금' },
            { icon: '📋', text: '2025년 2월부터 이미 시행 중' }
        ],
        deadline: { text: '이미 시행 중 — 즉시 중단 필요', type: 'active-now' }
    },
    high: {
        level: 'high',
        label: '⚠️ 고위험 (High Risk)',
        shortLabel: '고위험',
        color: '#F97316',
        description: '건강, 안전, 기본권에 중대한 영향을 미칠 수 있는 AI 시스템입니다. 채용, 교육, 의료, 법 집행, 금융, 인프라 등의 분야에서 사용되는 AI가 해당됩니다.',
        obligations: [
            { icon: '📊', text: '위험 관리 시스템 (Risk Management System) 구축' },
            { icon: '🗄️', text: '데이터 거버넌스 — 학습 데이터 품질·편향 관리' },
            { icon: '📝', text: '기술 문서화 (Technical Documentation)' },
            { icon: '📋', text: '자동 로깅 및 기록 유지' },
            { icon: '🔍', text: '투명성 — 사용자에게 AI 시스템임을 고지' },
            { icon: '👤', text: '인적 감독 (Human Oversight) 체계 마련' },
            { icon: '🛡️', text: '정확성, 견고성, 사이버 보안 보장' },
            { icon: '✅', text: '적합성 평가 (Conformity Assessment) 수행' },
            { icon: '🏷️', text: 'CE 마킹 부착 및 EU 데이터베이스 등록' },
            { icon: '📡', text: '사후 시장 모니터링 시스템 운영' }
        ],
        deadline: { text: '2026년 8월 2일 전면 시행 — 준비 필요', type: 'urgent' }
    },
    limited: {
        level: 'limited',
        label: '⚡ 제한적 위험 (Limited Risk)',
        shortLabel: '제한적',
        color: '#EAB308',
        description: '주로 투명성 의무가 부과되는 AI 시스템입니다. 챗봇, 감정 인식, 딥페이크 생성 등 사용자가 AI와 상호작용하고 있음을 인지해야 하는 시스템이 해당됩니다.',
        obligations: [
            { icon: '💬', text: 'AI 시스템과 상호작용 중임을 사용자에게 고지' },
            { icon: '🏷️', text: 'AI 생성 콘텐츠에 라벨링(워터마크)' },
            { icon: '🎭', text: '딥페이크 콘텐츠 AI 생성 여부 명시' }
        ],
        deadline: { text: '2026년 8월 시행 예정 — 대비 권장', type: 'urgent' }
    },
    minimal: {
        level: 'minimal',
        label: '✅ 최소 위험 (Minimal Risk)',
        shortLabel: '최소',
        color: '#22C55E',
        description: '대부분의 AI 애플리케이션이 이 등급에 해당됩니다. 스팸 필터, AI 게임, 검색 최적화 등 별도 규제 없이 자유롭게 사용할 수 있습니다.',
        obligations: [
            { icon: '📜', text: '자발적 행동 강령(Code of Conduct) 채택 권장' },
            { icon: '🎓', text: 'AI 리터러시 교육 의무 (2025년 2월 시행 중)' }
        ],
        deadline: { text: '특별한 규제 의무 없음 — AI 리터러시만 준수', type: 'safe' }
    }
};

// ── 고위험 체크리스트 데이터 ──
const HIGH_RISK_CHECKLIST = [
    {
        id: 'risk-mgmt',
        title: '위험 관리 시스템 (Risk Management System)',
        article: 'Article 9',
        detail: 'AI 시스템의 전체 수명주기 동안 지속적으로 운영되는 위험 관리 시스템을 구축해야 합니다. 알려진 위험과 예측 가능한 위험을 식별·분석하고, 적절한 위험 완화 조치를 실행해야 합니다. 잔여 위험이 수용 가능한 수준인지 평가하고 문서화해야 합니다.'
    },
    {
        id: 'data-gov',
        title: '데이터 거버넌스 (Data Governance)',
        article: 'Article 10',
        detail: '학습, 검증, 테스트 데이터세트에 대한 적절한 데이터 거버넌스 관행을 수립해야 합니다. 데이터 수집 절차, 데이터 준비 프로세스(주석, 라벨링 등), 관련성·대표성·정확성·완전성 확인, 편향(bias) 검출 및 완화 조치를 포함해야 합니다.'
    },
    {
        id: 'tech-doc',
        title: '기술 문서화 (Technical Documentation)',
        article: 'Article 11',
        detail: 'AI 시스템의 설계, 개발 과정, 기능을 상세히 기술한 문서를 작성해야 합니다. 시스템의 일반 설명, 설계 사양, 개발 방법론, 학습 데이터 정보, 테스트 결과, 품질관리 시스템 등이 포함되어야 합니다.'
    },
    {
        id: 'logging',
        title: '자동 기록 유지 (Record-keeping & Logging)',
        article: 'Article 12',
        detail: 'AI 시스템이 자동으로 이벤트를 기록(로깅)할 수 있도록 설계해야 합니다. 운영 기간 동안의 로그를 보관하고, 시스템의 의사결정 과정을 추적할 수 있어야 합니다. 로그는 관련 규정에 따라 적절한 기간 보관해야 합니다.'
    },
    {
        id: 'transparency',
        title: '투명성 및 사용자 고지 (Transparency)',
        article: 'Article 13',
        detail: '사용자가 AI 시스템의 출력을 올바르게 해석하고 적절하게 사용할 수 있도록 충분히 투명하게 설계해야 합니다. 시스템의 기능, 한계, 정확도 수준, 오류 가능성 등을 명확히 전달해야 합니다.'
    },
    {
        id: 'human-oversight',
        title: '인적 감독 (Human Oversight)',
        article: 'Article 14',
        detail: '자연인(human)이 AI 시스템을 효과적으로 감독할 수 있는 조치를 마련해야 합니다. 시스템의 기능과 한계를 이해하고, 이상 징후를 모니터링하며, 필요 시 시스템을 중단하거나 개입할 수 있어야 합니다. "인간이 루프에 있는(human-in-the-loop)" 방식을 구현해야 합니다.'
    },
    {
        id: 'accuracy',
        title: '정확성, 견고성, 사이버 보안',
        article: 'Article 15',
        detail: 'AI 시스템은 작동 환경에서 적절한 수준의 정확성, 견고성, 사이버 보안을 유지해야 합니다. 적대적 공격(adversarial attack)에 대한 복원력, 하드웨어/소프트웨어 오류에 대한 내성, 무단 접근이나 데이터 조작에 대한 보호 조치를 포함해야 합니다.'
    },
    {
        id: 'conformity',
        title: '적합성 평가 (Conformity Assessment)',
        article: 'Article 43',
        detail: 'AI 시스템이 EU AI Act의 요구사항을 충족하는지 평가하는 절차를 수행해야 합니다. 자체 평가 또는 공인 기관에 의한 제3자 평가가 필요합니다. 평가 결과를 EU 적합성 선언(Declaration of Conformity)에 기록하고, CE 마킹을 부착해야 합니다.'
    },
    {
        id: 'registration',
        title: 'EU 데이터베이스 등록',
        article: 'Article 49',
        detail: '고위험 AI 시스템의 제공자(provider)와 일부 배포자(deployer)는 시스템 정보를 EU 데이터베이스에 등록해야 합니다. 등록 정보에는 시스템의 이름, 목적, 적합성 평가 결과, 연락처 등이 포함됩니다.'
    },
    {
        id: 'post-market',
        title: '사후 시장 모니터링 (Post-Market Monitoring)',
        article: 'Article 72',
        detail: '시스템이 시장에 출시된 후에도 지속적으로 성능, 안전성, 규정 준수를 모니터링해야 합니다. 사고나 심각한 문제 발생 시 관할 당국에 보고하고, 필요한 시정 조치를 취해야 합니다. 2026년 2월 2일부터 시행 중입니다.'
    }
];

const LIMITED_RISK_CHECKLIST = [
    {
        id: 'notify-user',
        title: 'AI 시스템 사용 고지',
        article: 'Article 50(1)',
        detail: '사용자가 AI 시스템과 상호작용하고 있음을 명확하고 이해하기 쉬운 방식으로 고지해야 합니다. 챗봇, 가상 비서 등 자연인과 직접 상호작용하는 AI 시스템에 적용됩니다.'
    },
    {
        id: 'label-content',
        title: 'AI 생성 콘텐츠 라벨링',
        article: 'Article 50(2)',
        detail: 'AI로 생성된 오디오, 이미지, 비디오, 텍스트 콘텐츠에 적절한 라벨이나 워터마크를 부착하여 AI 생성물임을 표시해야 합니다. 기계 판독이 가능한 형식이어야 합니다.'
    },
    {
        id: 'deepfake-label',
        title: '딥페이크 콘텐츠 표시',
        article: 'Article 50(4)',
        detail: '딥페이크로 생성되거나 조작된 콘텐츠(이미지, 오디오, 비디오)에 대해 해당 콘텐츠가 인위적으로 생성 또는 조작되었음을 공개해야 합니다.'
    }
];

// ── 타임라인 데이터 ──
const TIMELINE_EVENTS = [
    {
        date: '2024년 8월 1일',
        title: 'EU AI Act 공식 발효',
        desc: '유럽연합 인공지능법이 EU 관보에 게재, 공식 발효',
        status: 'completed'
    },
    {
        date: '2025년 2월 2일',
        title: '금지 AI 관행 시행 & AI 리터러시',
        desc: '수용 불가능한 위험 AI 시스템 금지, 모든 조직 대상 AI 리터러시 교육 의무화',
        status: 'completed'
    },
    {
        date: '2025년 8월 2일',
        title: '범용 AI(GPAI) 규정 발효',
        desc: 'ChatGPT 등 범용 AI 모델 투명성·저작권 준수 의무, 회원국 관할 당국 지정',
        status: 'completed'
    },
    {
        date: '2026년 2월 2일',
        title: '사후 시장 모니터링 시행',
        desc: 'AI 시스템 출시 후 지속적 성능·안전 모니터링 의무 발효',
        status: 'current'
    },
    {
        date: '2026년 8월 2일',
        title: '고위험 AI 전면 시행 ⭐',
        desc: '고위험 AI 시스템(Annex III) 전면 규제 시행. 위험 관리, 데이터 거버넌스, 기술 문서, 인적 감독, 적합성 평가 등 모든 의무 적용',
        status: 'upcoming',
        targetDate: new Date('2026-08-02')
    },
    {
        date: '2027년 8월 2일',
        title: '제품 내장 AI 규정 시행',
        desc: '기존 EU 제품 안전 법규 대상 제품에 내장된 AI 시스템(Annex I)에 대한 규정 적용',
        status: 'upcoming',
        targetDate: new Date('2027-08-02')
    }
];

function EUAIActPage() {
    const [activeTab, setActiveTab] = useState('classifier');

    // ── Risk Classifier state ──
    const [formData, setFormData] = useState({
        purpose: '',
        personalData: false,
        autoDecision: false,
        euService: false,
        biometric: false
    });
    const [riskResult, setRiskResult] = useState(null);

    // ── Checklist state ──
    const [checklistLevel, setChecklistLevel] = useState('high');
    const [checkedItems, setCheckedItems] = useState(() => {
        try {
            const saved = localStorage.getItem('eu-ai-act-checklist');
            return saved ? JSON.parse(saved) : {};
        } catch { return {}; }
    });
    const [expandedItems, setExpandedItems] = useState({});

    // Save checklist to localStorage
    useEffect(() => {
        localStorage.setItem('eu-ai-act-checklist', JSON.stringify(checkedItems));
    }, [checkedItems]);

    // ── Risk Classification Logic ──
    const classifyRisk = () => {
        const { purpose, personalData, autoDecision, biometric } = formData;

        // Unacceptable risk checks
        if (biometric && purpose === 'law-enforcement') {
            setRiskResult(RISK_DATA.unacceptable);
            return;
        }
        if (purpose === 'social-scoring') {
            setRiskResult(RISK_DATA.unacceptable);
            return;
        }
        if (purpose === 'subliminal') {
            setRiskResult(RISK_DATA.unacceptable);
            return;
        }

        // High risk checks
        const highRiskPurposes = ['recruitment', 'education', 'healthcare', 'law-enforcement', 'finance', 'infrastructure', 'migration', 'justice'];
        if (highRiskPurposes.includes(purpose)) {
            setRiskResult(RISK_DATA.high);
            return;
        }
        if (biometric) {
            setRiskResult(RISK_DATA.high);
            return;
        }
        if (autoDecision && personalData) {
            setRiskResult(RISK_DATA.high);
            return;
        }

        // Limited risk checks
        const limitedPurposes = ['chatbot', 'content-generation', 'emotion-recognition', 'deepfake'];
        if (limitedPurposes.includes(purpose)) {
            setRiskResult(RISK_DATA.limited);
            return;
        }

        // Default: minimal risk
        setRiskResult(RISK_DATA.minimal);
    };

    // ── Checklist helpers ──
    const currentChecklist = checklistLevel === 'high' ? HIGH_RISK_CHECKLIST : LIMITED_RISK_CHECKLIST;
    const completedCount = currentChecklist.filter(item => checkedItems[`${checklistLevel}-${item.id}`]).length;
    const complianceRate = currentChecklist.length > 0 ? Math.round((completedCount / currentChecklist.length) * 100) : 0;

    const getProgressClass = (pct) => {
        if (pct < 25) return 'low';
        if (pct < 50) return 'mid';
        if (pct < 75) return 'good';
        return 'great';
    };

    const toggleCheck = (id) => {
        const key = `${checklistLevel}-${id}`;
        setCheckedItems(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const toggleExpand = (id) => {
        setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
    };

    // ── D-Day calculation ──
    const today = new Date();
    const highRiskDate = new Date('2026-08-02');
    const dDayDiff = Math.ceil((highRiskDate - today) / (1000 * 60 * 60 * 24));

    return (
        <div className="eu-ai-act-page">
            {/* Hero */}
            <section className="eu-hero">
                <span className="eu-flag">🇪🇺</span>
                <h1>EU AI Act 컴플라이언스 시스템</h1>
                <p className="subtitle">
                    유럽연합 인공지능법(AI Act) 대비를 위한 위험 등급 진단, 
                    의무사항 체크리스트, 시행 일정을 한눈에 관리하세요.
                </p>
                <span className="status-badge">
                    <span className="pulse"></span>
                    2026년 2월 — 사후 시장 모니터링 시행 중
                </span>
            </section>

            {/* Tab Navigation */}
            <div className="eu-tabs">
                <button 
                    className={`eu-tab-btn ${activeTab === 'classifier' ? 'active' : ''}`}
                    onClick={() => setActiveTab('classifier')}
                >
                    <span className="tab-icon">🔍</span>
                    위험 등급 진단
                </button>
                <button 
                    className={`eu-tab-btn ${activeTab === 'checklist' ? 'active' : ''}`}
                    onClick={() => setActiveTab('checklist')}
                >
                    <span className="tab-icon">✅</span>
                    컴플라이언스 체크리스트
                </button>
                <button 
                    className={`eu-tab-btn ${activeTab === 'timeline' ? 'active' : ''}`}
                    onClick={() => setActiveTab('timeline')}
                >
                    <span className="tab-icon">📅</span>
                    타임라인 & 과징금
                </button>
            </div>

            {/* Content */}
            <div className="eu-content">

                {/* ═══ Tab 1: Risk Classifier ═══ */}
                {activeTab === 'classifier' && (
                    <div className="risk-classifier">
                        <div className="classifier-layout">
                            {/* Form */}
                            <div className="classifier-form">
                                <h3>🔬 AI 시스템 정보 입력</h3>

                                <div className="form-group">
                                    <label>AI 시스템 용도</label>
                                    <select value={formData.purpose} onChange={e => setFormData({...formData, purpose: e.target.value})}>
                                        <option value="">— 선택하세요 —</option>
                                        <optgroup label="⛔ 수용 불가능 위험">
                                            <option value="social-scoring">사회적 점수 시스템 (Social Scoring)</option>
                                            <option value="subliminal">잠재의식 조작 / 취약 계층 악용</option>
                                        </optgroup>
                                        <optgroup label="⚠️ 고위험 분야">
                                            <option value="recruitment">채용 / 인사 관리</option>
                                            <option value="education">교육 / 학습 평가</option>
                                            <option value="healthcare">의료 / 건강 관리</option>
                                            <option value="law-enforcement">법 집행 / 치안</option>
                                            <option value="finance">금융 / 신용 평가</option>
                                            <option value="infrastructure">핵심 인프라 (에너지, 교통 등)</option>
                                            <option value="migration">이민 / 출입국 관리</option>
                                            <option value="justice">사법 / 법원 지원</option>
                                        </optgroup>
                                        <optgroup label="⚡ 제한적 위험">
                                            <option value="chatbot">챗봇 / 가상 비서</option>
                                            <option value="content-generation">콘텐츠 생성 (텍스트, 이미지, 음성)</option>
                                            <option value="emotion-recognition">감정 인식 시스템</option>
                                            <option value="deepfake">딥페이크 생성</option>
                                        </optgroup>
                                        <optgroup label="✅ 일반">
                                            <option value="search">검색 / 추천</option>
                                            <option value="spam-filter">스팸 필터</option>
                                            <option value="game">AI 게임</option>
                                            <option value="analytics">데이터 분석 / 시각화</option>
                                            <option value="automation">업무 자동화</option>
                                            <option value="other">기타</option>
                                        </optgroup>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>추가 정보</label>
                                    <div className="toggle-group" onClick={() => setFormData({...formData, personalData: !formData.personalData})}>
                                        <span className="toggle-label">개인 데이터 처리 여부</span>
                                        <div className={`toggle-switch ${formData.personalData ? 'active' : ''}`}></div>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <div className="toggle-group" onClick={() => setFormData({...formData, autoDecision: !formData.autoDecision})}>
                                        <span className="toggle-label">자동 의사결정 여부</span>
                                        <div className={`toggle-switch ${formData.autoDecision ? 'active' : ''}`}></div>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <div className="toggle-group" onClick={() => setFormData({...formData, euService: !formData.euService})}>
                                        <span className="toggle-label">EU 내 서비스 대상 여부</span>
                                        <div className={`toggle-switch ${formData.euService ? 'active' : ''}`}></div>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <div className="toggle-group" onClick={() => setFormData({...formData, biometric: !formData.biometric})}>
                                        <span className="toggle-label">생체 인식 데이터 사용 여부</span>
                                        <div className={`toggle-switch ${formData.biometric ? 'active' : ''}`}></div>
                                    </div>
                                </div>

                                <button className="classify-btn" onClick={classifyRisk} disabled={!formData.purpose}>
                                    🔍 위험 등급 진단하기
                                </button>
                            </div>

                            {/* Result */}
                            <div className={`risk-result ${!riskResult ? 'empty-state' : ''}`}>
                                {!riskResult ? (
                                    <>
                                        <span className="empty-icon">🇪🇺</span>
                                        <p>AI 시스템 정보를 입력하고<br/>위험 등급을 진단하세요</p>
                                    </>
                                ) : (
                                    <div className="risk-level-display">
                                        <div className="risk-gauge">
                                            <div className={`risk-badge ${riskResult.level}`}>
                                                {riskResult.label}
                                            </div>
                                        </div>
                                        <p className="risk-description">{riskResult.description}</p>
                                        <div className="risk-obligations">
                                            <h4>📋 주요 의무사항</h4>
                                            {riskResult.obligations.map((ob, i) => (
                                                <div key={i} className="obligation-item">
                                                    <span className="ob-icon">{ob.icon}</span>
                                                    <span>{ob.text}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className={`risk-deadline ${riskResult.deadline.type}`}>
                                            ⏰ {riskResult.deadline.text}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* ═══ Tab 2: Compliance Checklist ═══ */}
                {activeTab === 'checklist' && (
                    <div className="compliance-checker">
                        <div className="checklist-header">
                            <h3>✅ 컴플라이언스 체크리스트</h3>
                            <div className="risk-level-selector">
                                <button 
                                    className={checklistLevel === 'high' ? 'active' : ''}
                                    onClick={() => setChecklistLevel('high')}
                                >
                                    ⚠️ 고위험
                                </button>
                                <button 
                                    className={checklistLevel === 'limited' ? 'active' : ''}
                                    onClick={() => setChecklistLevel('limited')}
                                >
                                    ⚡ 제한적
                                </button>
                            </div>
                        </div>

                        {/* Progress */}
                        <div className="compliance-progress">
                            <div className="progress-header">
                                <span className="progress-label">
                                    {checklistLevel === 'high' ? '고위험' : '제한적 위험'} AI 준수율
                                </span>
                                <span className={`progress-pct ${getProgressClass(complianceRate)}`}>
                                    {complianceRate}%
                                </span>
                            </div>
                            <div className="progress-bar-container">
                                <div 
                                    className={`progress-bar-fill ${getProgressClass(complianceRate)}`}
                                    style={{ width: `${complianceRate}%` }}
                                />
                            </div>
                        </div>

                        {/* Checklist Items */}
                        <div className="checklist-items">
                            {currentChecklist.map((item) => {
                                const key = `${checklistLevel}-${item.id}`;
                                const isChecked = !!checkedItems[key];
                                const isExpanded = !!expandedItems[item.id];
                                return (
                                    <div key={item.id} className={`checklist-item ${isChecked ? 'completed' : ''}`}>
                                        <div className="checklist-item-header">
                                            <div 
                                                className={`checklist-checkbox ${isChecked ? 'checked' : ''}`}
                                                onClick={() => toggleCheck(item.id)}
                                            >
                                                {isChecked && '✓'}
                                            </div>
                                            <div className="checklist-item-info" onClick={() => toggleExpand(item.id)}>
                                                <div className="item-title">{item.title}</div>
                                                <div className="item-article">{item.article}</div>
                                            </div>
                                            <button 
                                                className={`checklist-expand-btn ${isExpanded ? 'expanded' : ''}`}
                                                onClick={() => toggleExpand(item.id)}
                                            >
                                                ▼
                                            </button>
                                        </div>
                                        {isExpanded && (
                                            <div className="checklist-detail">
                                                <div className="detail-section">
                                                    <strong>요구사항 상세:</strong>
                                                    <p>{item.detail}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* ═══ Tab 3: Timeline & Penalties ═══ */}
                {activeTab === 'timeline' && (
                    <div className="timeline-panel">
                        {/* D-Day Counter */}
                        <div className="dday-counter">
                            <div className="dday-label">고위험 AI 시스템 전면 시행까지</div>
                            <div className="dday-number">D-{dDayDiff > 0 ? dDayDiff : 0}</div>
                            <div className="dday-target">2026년 8월 2일 (Annex III 고위험 AI)</div>
                        </div>

                        {/* Timeline */}
                        <div className="timeline-section">
                            <h3>📅 EU AI Act 시행 타임라인</h3>
                            <div className="timeline-track">
                                {TIMELINE_EVENTS.map((event, i) => (
                                    <div key={i} className={`timeline-item ${event.status}`}>
                                        <div className="tl-date">{event.date}</div>
                                        <div className="tl-title">{event.title}</div>
                                        <div className="tl-desc">{event.desc}</div>
                                        <span className={`tl-badge ${
                                            event.status === 'completed' ? 'done' : 
                                            event.status === 'current' ? 'now' : 
                                            event.targetDate && (event.targetDate - today) / (1000*60*60*24) < 365 ? 'pending' : 'far'
                                        }`}>
                                            {event.status === 'completed' ? '✅ 시행 완료' : 
                                             event.status === 'current' ? '🔴 현재 시행 중' : 
                                             event.targetDate ? `⏳ D-${Math.ceil((event.targetDate - today) / (1000*60*60*24))}일` : '예정'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Penalties */}
                        <div className="penalty-section">
                            <h3>💰 위반 시 과징금</h3>
                            <div className="penalty-cards">
                                <div className="penalty-card">
                                    <div className="penalty-type">금지 AI 관행 위반</div>
                                    <div className="penalty-amount">€35M</div>
                                    <div className="penalty-or">또는</div>
                                    <div className="penalty-revenue">전 세계 연매출 7%</div>
                                    <div className="penalty-desc">
                                        수용 불가능한 위험의 AI 시스템을 개발·배포한 경우
                                    </div>
                                </div>
                                <div className="penalty-card">
                                    <div className="penalty-type">고위험 AI 미준수</div>
                                    <div className="penalty-amount">€15M</div>
                                    <div className="penalty-or">또는</div>
                                    <div className="penalty-revenue">전 세계 연매출 3%</div>
                                    <div className="penalty-desc">
                                        고위험 AI 시스템의 의무사항을 준수하지 않은 경우
                                    </div>
                                </div>
                                <div className="penalty-card">
                                    <div className="penalty-type">허위 정보 제공</div>
                                    <div className="penalty-amount">€7.5M</div>
                                    <div className="penalty-or">또는</div>
                                    <div className="penalty-revenue">전 세계 연매출 1.5%</div>
                                    <div className="penalty-desc">
                                        관할 당국에 부정확하거나 허위 정보를 제공한 경우
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Disclaimer */}
                <div className="eu-disclaimer">
                    <strong>⚠️ 면책 조항:</strong> 이 도구는 교육 및 참고 목적으로만 제공됩니다. 
                    실제 EU AI Act 준수를 위해서는 전문 법률 자문을 받으시기 바랍니다. 
                    이 도구의 진단 결과는 법적 효력이 없으며, 최종 판단은 관할 당국에 있습니다.
                </div>
            </div>
        </div>
    );
}

export default EUAIActPage;
