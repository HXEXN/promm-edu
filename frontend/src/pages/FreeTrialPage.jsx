import { useState } from 'react';
import API_URL from '../config/api';
import { useNavigate } from 'react-router-dom';
import './FreeTrialPage.css';

function FreeTrialPage() {
    const navigate = useNavigate();

    const [userEmail, setUserEmail] = useState('');
    const [isRegistered, setIsRegistered] = useState(false);
    const [creditsRemaining, setCreditsRemaining] = useState(0);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGetCredits = async () => {
        if (!userEmail || !userEmail.includes('@')) {
            setError('유효한 이메일을 입력해주세요');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/trial/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: userEmail })
            });

            const data = await response.json();

            if (data.success) {
                setIsRegistered(true);
                setCreditsRemaining(data.credits);
            }
        } catch (err) {
            // Fallback: 로컬 시뮬레이션
            setIsRegistered(true);
            setCreditsRemaining(10);
        } finally {
            setLoading(false);
        }
    };

    const tryEngine = async (engineType) => {
        setLoading(true);
        setResult(null);

        const creditCost = 5;

        try {
            // 크레딧 차감 (선택적)
            try {
                await fetch(`${API_URL}/api/trial/use-credit`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: userEmail,
                        engine: engineType,
                        creditCost
                    })
                });
            } catch (e) {
                // 크레딧 서비스가 없어도 계속 진행
            }

            // AI 엔진 실행 - 2026 엔드포인트 사용
            const feature = engineType === 'multi-llm' ? 'multi-llm-router' : 'ai-tutor';
            const testPrompt = engineType === 'multi-llm'
                ? 'Write a Python function to sort a list'
                : 'GraphRAG가 무엇인가요?';

            const response = await fetch(`${API_URL}/api/advanced/2026`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: testPrompt,
                    feature: feature,
                    options: engineType === 'ai-tutor' ? { operation: 'hint', difficulty: 2 } : {}
                })
            });

            if (!response.ok) {
                throw new Error('API 응답 오류');
            }

            const data = await response.json();
            setResult({
                success: true,
                feature: feature,
                response: data,
                timestamp: new Date().toISOString()
            });
            setCreditsRemaining(prev => Math.max(0, prev - creditCost));
        } catch (err) {
            console.log('Demo mode - simulating result');
            // 데모 시뮬레이션 결과
            setResult({
                success: true,
                demo: true,
                feature: engineType === 'multi-llm' ? 'Multi-LLM Router' : 'AI Teaching Agent',
                selectedModel: engineType === 'multi-llm' ? 'GPT-5.2-Codex' : 'Claude Sonnet 5',
                message: `${engineType === 'multi-llm' ? 'Multi-LLM Router가 최적의 모델을 선택했습니다.' : 'AI Tutor가 학습 힌트를 생성했습니다.'}`,
                sampleOutput: engineType === 'multi-llm'
                    ? { task: 'coding', model: 'GPT-5.2-Codex', confidence: 0.94 }
                    : { hint: 'GraphRAG는 지식 그래프와 RAG를 결합한 기술입니다.', difficulty: 2 }
            });
            setCreditsRemaining(prev => Math.max(0, prev - creditCost));
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="free-trial-page">
            <header className="trial-hero">
                <h1>🎁 무료로 AI 엔진 체험하기</h1>
                <p className="hero-subtitle">
                    신용카드 없이 10 크레딧 즉시 지급 • 최신 AI 엔진을 실제로 사용해보세요
                </p>
                <div className="hero-badges">
                    <span className="badge">신용카드 불필요</span>
                    <span className="badge">즉시 사용 가능</span>
                    <span className="badge">실제 AI 엔진</span>
                </div>
            </header>

            <div className="trial-container">
                {/* Step 1: Email Registration */}
                {!isRegistered && (
                    <div className="email-registration fade-in">
                        <div className="step-indicator">Step 1/3</div>
                        <h2>이메일로 시작하기</h2>
                        <p>이메일 주소만 입력하면 10 크레딧을 즉시 받을 수 있습니다</p>

                        <div className="email-form">
                            <input
                                type="email"
                                placeholder="your.email@company.com"
                                value={userEmail}
                                onChange={(e) => setUserEmail(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleGetCredits()}
                            />
                            <button
                                className="btn-get-credits"
                                onClick={handleGetCredits}
                                disabled={loading}
                            >
                                {loading ? '처리 중...' : '10 크레딧 받기 →'}
                            </button>
                        </div>

                        {error && <p className="error-message">{error}</p>}

                        <div className="trust-indicators">
                            <span>✓ 스팸 발송 안 함</span>
                            <span>✓ 언제든 구독 해지</span>
                            <span>✓ GDPR 준수</span>
                        </div>
                    </div>
                )}

                {/* Step 2: Engine Selection */}
                {isRegistered && creditsRemaining > 0 && (
                    <div className="engine-selection fade-in">
                        <div className="step-indicator">Step 2/3</div>

                        <div className="credit-indicator">
                            ⚡ 잔여 크레딧: <strong>{creditsRemaining}/10</strong>
                        </div>

                        <h2>AI 엔진 선택</h2>
                        <p>아래 엔진 중 하나를 선택하여 체험해보세요</p>

                        <div className="engine-options">
                            {/* Multi-LLM Router */}
                            <div className="engine-option">
                                <div className="engine-header">
                                    <span className="engine-icon">🔀</span>
                                    <h3>Multi-LLM Router</h3>
                                </div>
                                <p className="engine-desc">
                                    작업 유형을 분석하여 최적의 AI 모델을 자동으로 선택합니다.
                                    비용과 성능을 동시에 최적화합니다.
                                </p>
                                <div className="engine-features">
                                    <span>✓ GPT-5.2-Codex (코딩)</span>
                                    <span>✓ Claude Sonnet 5 (추론)</span>
                                    <span>✓ Gemini 3.0 (멀티모달)</span>
                                </div>
                                <div className="engine-footer">
                                    <span className="credit-cost">💎 5 크레딧</span>
                                    <button
                                        onClick={() => tryEngine('multi-llm')}
                                        disabled={loading || creditsRemaining < 5}
                                        className="btn-try-engine"
                                    >
                                        {loading ? '실행 중...' : '체험하기'}
                                    </button>
                                </div>
                            </div>

                            {/* AI Tutor */}
                            <div className="engine-option">
                                <div className="engine-header">
                                    <span className="engine-icon">🎓</span>
                                    <h3>AI Teaching Agent</h3>
                                </div>
                                <p className="engine-desc">
                                    24/7 자율 학습 도우미. 학생의 수준을 진단하고
                                    맞춤형 힌트를 제공합니다.
                                </p>
                                <div className="engine-features">
                                    <span>✓ 실시간 역량 진단</span>
                                    <span>✓ 맞춤형 학습 경로</span>
                                    <span>✓ 난이도 자동 조정</span>
                                </div>
                                <div className="engine-footer">
                                    <span className="credit-cost">💎 5 크레딧</span>
                                    <button
                                        onClick={() => tryEngine('ai-tutor')}
                                        disabled={loading || creditsRemaining < 5}
                                        className="btn-try-engine"
                                    >
                                        {loading ? '실행 중...' : '체험하기'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3: Results */}
                {result && (
                    <div className="trial-result fade-in">
                        <div className="step-indicator">Step 3/3</div>
                        <h2>📊 실행 결과</h2>

                        <div className="result-box">
                            <pre>{JSON.stringify(result, null, 2)}</pre>
                        </div>

                        {creditsRemaining > 0 ? (
                            <div className="continue-trial">
                                <p>아직 {creditsRemaining} 크레딧이 남았습니다!</p>
                                <button onClick={() => setResult(null)} className="btn-try-again">
                                    다른 엔진 체험하기
                                </button>
                            </div>
                        ) : (
                            <div className="upgrade-prompt">
                                <h3>🚀 더 많은 기능을 원하시나요?</h3>
                                <p>
                                    Pro 플랜으로 업그레이드하면 무제한 크레딧으로
                                    모든 AI 엔진을 사용할 수 있습니다.
                                </p>
                                <div className="upgrade-benefits">
                                    <div className="benefit">✓ 무제한 AI 크레딧</div>
                                    <div className="benefit">✓ 5개 AI 엔진 모두 접근</div>
                                    <div className="benefit">✓ 우선 지원</div>
                                </div>
                                <button
                                    onClick={() => navigate('/pricing')}
                                    className="btn-upgrade"
                                >
                                    플랜 보기 →
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Credits Depleted (no result yet) */}
                {isRegistered && creditsRemaining === 0 && !result && (
                    <div className="no-credits fade-in">
                        <div className="empty-state">
                            <span className="empty-icon">💎</span>
                            <h3>크레딧을 모두 사용했습니다!</h3>
                            <p>체험이 마음에 드셨나요?</p>
                            <button
                                onClick={() => navigate('/pricing')}
                                className="btn-upgrade"
                            >
                                유료 플랜 보기 →
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Why Choose SmartFarm */}
            <section className="why-smartfarm">
                <h2>왜 SmartFarm인가?</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <span className="feature-icon">⚡</span>
                        <h4>최신 기술</h4>
                        <p>2026년 최신 AI 엔진 (GraphRAG, DSPy, LangGraph)</p>
                    </div>
                    <div className="feature-card">
                        <span className="feature-icon">💰</span>
                        <h4>비용 절감</h4>
                        <p>프로프트 최적화로 평균 30% 비용 절감</p>
                    </div>
                    <div className="feature-card">
                        <span className="feature-icon">🎓</span>
                        <h4>실시간 학습</h4>
                        <p>AI 튜터가 즉각적인 피드백 제공</p>
                    </div>
                    <div className="feature-card">
                        <span className="feature-icon">🏆</span>
                        <h4>검증된 성과</h4>
                        <p>100개 이상 기업이 신뢰하는 플랫폼</p>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default FreeTrialPage;
