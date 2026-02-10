import { useState } from 'react';
import './AIEnginesDemo.css';

function AIEnginesDemo() {
    const [activeEngine, setActiveEngine] = useState('multi-llm');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    // Multi-LLM Router State
    const [llmTask, setLlmTask] = useState('');
    const [budget, setBudget] = useState('medium');

    // AI Tutor State
    const [tutorQuestion, setTutorQuestion] = useState('');
    const [difficulty, setDifficulty] = useState(1);

    // Agentic Coding State
    const [projectRequest, setProjectRequest] = useState('');

    // Video Analysis State
    const [analysisType, setAnalysisType] = useState('crop-health');

    // Voice+Vision State
    const [voiceCommand, setVoiceCommand] = useState('');

    const handleMultiLLMTest = async () => {
        if (!llmTask.trim()) return;
        setLoading(true);
        setResult(null);

        try {
            const response = await fetch('http://localhost:3000/api/advanced', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: llmTask,
                    feature: 'multi-llm-router',
                    options: { constraints: { budget } }
                })
            });
            const data = await response.json();
            setResult(data);
        } catch (error) {
            setResult({ error: '연결 실패: ' + error.message });
        } finally {
            setLoading(false);
        }
    };

    const handleAITutorTest = async () => {
        if (!tutorQuestion.trim()) return;
        setLoading(true);
        setResult(null);

        try {
            const response = await fetch('http://localhost:3000/api/advanced', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: tutorQuestion,
                    feature: 'ai-tutor',
                    options: {
                        operation: 'hint',
                        studentId: 'demo_student',
                        difficulty: difficulty
                    }
                })
            });
            const data = await response.json();
            setResult(data);
        } catch (error) {
            setResult({ error: '연결 실패: ' + error.message });
        } finally {
            setLoading(false);
        }
    };

    const handleAgenticCodingTest = async () => {
        if (!projectRequest.trim()) return;
        setLoading(true);
        setResult(null);

        try {
            const response = await fetch('http://localhost:3000/api/advanced', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: projectRequest,
                    feature: 'agentic-coding'
                })
            });
            const data = await response.json();
            setResult(data);
        } catch (error) {
            setResult({ error: '연결 실패: ' + error.message });
        } finally {
            setLoading(false);
        }
    };

    const handleVideoAnalysisTest = async () => {
        setLoading(true);
        setResult(null);

        try {
            const response = await fetch('http://localhost:3000/api/advanced', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: 'Analyze video',
                    feature: 'video-analysis',
                    options: {
                        frames: [{}, {}, {}], // Simulated frames
                        analysisType: analysisType
                    }
                })
            });
            const data = await response.json();
            setResult(data);
        } catch (error) {
            setResult({ error: '연결 실패: ' + error.message });
        } finally {
            setLoading(false);
        }
    };

    const handleVoiceVisionTest = async () => {
        if (!voiceCommand.trim()) return;
        setLoading(true);
        setResult(null);

        try {
            const response = await fetch('http://localhost:3000/api/advanced', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: voiceCommand,
                    feature: 'voice-vision',
                    options: {
                        operation: 'multimodal-query',
                        screenCapture: { type: 'simulated' }
                    }
                })
            });
            const data = await response.json();
            setResult(data);
        } catch (error) {
            setResult({ error: '연결 실패: ' + error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ai-engines-demo-page">
            <header className="demo-header">
                <h1>🤖 최신 AI 엔진 체험 (2026.2)</h1>
                <p className="header-subtitle">
                    5개의 최신 AI 엔진을 실시간으로 테스트하고 결과를 확인하세요
                </p>
                <div className="tech-badges">
                    <span className="badge">Multi-LLM Router</span>
                    <span className="badge">AI Tutor</span>
                    <span className="badge">Agentic Coding</span>
                    <span className="badge">Video Analysis</span>
                    <span className="badge">Voice+Vision</span>
                </div>
            </header>

            <div className="demo-container">
                {/* Engine Tabs */}
                <div className="engine-tabs">
                    <button
                        className={`engine-tab ${activeEngine === 'multi-llm' ? 'active' : ''}`}
                        onClick={() => { setActiveEngine('multi-llm'); setResult(null); }}
                    >
                        🔀 Multi-LLM Router
                    </button>
                    <button
                        className={`engine-tab ${activeEngine === 'ai-tutor' ? 'active' : ''}`}
                        onClick={() => { setActiveEngine('ai-tutor'); setResult(null); }}
                    >
                        🎓 AI Tutor
                    </button>
                    <button
                        className={`engine-tab ${activeEngine === 'agentic-coding' ? 'active' : ''}`}
                        onClick={() => { setActiveEngine('agentic-coding'); setResult(null); }}
                    >
                        👥 Agentic Coding
                    </button>
                    <button
                        className={`engine-tab ${activeEngine === 'video-analysis' ? 'active' : ''}`}
                        onClick={() => { setActiveEngine('video-analysis'); setResult(null); }}
                    >
                        📹 Video Analysis
                    </button>
                    <button
                        className={`engine-tab ${activeEngine === 'voice-vision' ? 'active' : ''}`}
                        onClick={() => { setActiveEngine('voice-vision'); setResult(null); }}
                    >
                        🎙️ Voice+Vision
                    </button>
                </div>

                {/* Engine Content */}
                <div className="engine-content">
                    {/* Multi-LLM Router */}
                    {activeEngine === 'multi-llm' && (
                        <div className="engine-panel fade-in">
                            <h2>🔀 Multi-LLM Router</h2>
                            <p className="panel-desc">
                                작업 유형을 분석하여 최적의 AI 모델을 자동 선택합니다.
                                비용 효율성과 성능을 동시에 최적화합니다.
                            </p>

                            <div className="input-section">
                                <label>작업 설명</label>
                                <textarea
                                    value={llmTask}
                                    onChange={(e) => setLlmTask(e.target.value)}
                                    placeholder="예: Implement a sorting algorithm&#10;예: Solve this math equation: x^2 + 5x + 6 = 0&#10;예: Analyze this video for crop health"
                                    rows={4}
                                />

                                <label>예산 제약</label>
                                <select value={budget} onChange={(e) => setBudget(e.target.value)}>
                                    <option value="low">Low (최저 비용 우선)</option>
                                    <option value="medium">Medium (균형)</option>
                                    <option value="high">High (품질 우선)</option>
                                </select>

                                <button
                                    className="btn-test"
                                    onClick={handleMultiLLMTest}
                                    disabled={loading || !llmTask.trim()}
                                >
                                    {loading ? '분석 중...' : '🚀 최적 모델 찾기'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* AI Tutor */}
                    {activeEngine === 'ai-tutor' && (
                        <div className="engine-panel fade-in">
                            <h2>🎓 AI Teaching Agent</h2>
                            <p className="panel-desc">
                                24/7 자율 학습 도우미. 학생의 수준에 맞춰 힌트를 제공하고
                                학습 경로를 추천합니다.
                            </p>

                            <div className="input-section">
                                <label>질문</label>
                                <textarea
                                    value={tutorQuestion}
                                    onChange={(e) => setTutorQuestion(e.target.value)}
                                    placeholder="예: GraphRAG가 무엇인가요?&#10;예: 프롬프트 캐싱은 어떻게 작동하나요?"
                                    rows={3}
                                />

                                <label>힌트 난이도 (1-3)</label>
                                <div className="difficulty-slider">
                                    <input
                                        type="range"
                                        min="1"
                                        max="3"
                                        value={difficulty}
                                        onChange={(e) => setDifficulty(parseInt(e.target.value))}
                                    />
                                    <span className="difficulty-label">
                                        {difficulty === 1 ? '암시적' : difficulty === 2 ? '중간' : '구체적'}
                                    </span>
                                </div>

                                <button
                                    className="btn-test"
                                    onClick={handleAITutorTest}
                                    disabled={loading || !tutorQuestion.trim()}
                                >
                                    {loading ? '생성 중...' : '💡 힌트 받기'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Agentic Coding */}
                    {activeEngine === 'agentic-coding' && (
                        <div className="engine-panel fade-in">
                            <h2>👥 Agentic Coding Assistant</h2>
                            <p className="panel-desc">
                                PM, Dev, QA, Doc 4명의 AI 에이전트가 협업하여
                                프로젝트를 완성합니다. 30분 내 완성!
                            </p>

                            <div className="input-section">
                                <label>프로젝트 요청</label>
                                <textarea
                                    value={projectRequest}
                                    onChange={(e) => setProjectRequest(e.target.value)}
                                    placeholder="예: 스마트팜 온도 모니터링 시스템 만들어줘&#10;예: REST API for sensor data collection&#10;예: 작물 성장 추적 대시보드"
                                    rows={4}
                                />

                                <div className="agent-info">
                                    <div className="agent-badge">👔 PM Agent</div>
                                    <div className="agent-badge">💻 Dev Agent</div>
                                    <div className="agent-badge">🧪 QA Agent</div>
                                    <div className="agent-badge">📚 Doc Agent</div>
                                </div>

                                <button
                                    className="btn-test"
                                    onClick={handleAgenticCodingTest}
                                    disabled={loading || !projectRequest.trim()}
                                >
                                    {loading ? '팀이 작업 중...' : '🚀 프로젝트 생성'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Video Analysis */}
                    {activeEngine === 'video-analysis' && (
                        <div className="engine-panel fade-in">
                            <h2>📹 Video Analysis Engine (Gemini 3.0)</h2>
                            <p className="panel-desc">
                                60 FPS 실시간 영상 분석. 3D 객체 인식, 작물 건강도 측정,
                                해충 탐지를 수행합니다.
                            </p>

                            <div className="input-section">
                                <label>분석 유형</label>
                                <select value={analysisType} onChange={(e) => setAnalysisType(e.target.value)}>
                                    <option value="crop-health">🌱 작물 건강도 분석</option>
                                    <option value="pest-detection">🐛 해충 탐지</option>
                                    <option value="3d-counting">📊 3D 객체 카운팅</option>
                                </select>

                                <div className="video-features">
                                    <span className="feature-badge">60 FPS</span>
                                    <span className="feature-badge">3D Object Detection</span>
                                    <span className="feature-badge">Real-time</span>
                                </div>

                                <button
                                    className="btn-test"
                                    onClick={handleVideoAnalysisTest}
                                    disabled={loading}
                                >
                                    {loading ? '분석 중...' : '📹 영상 분석 시작'}
                                </button>

                                <p className="note">* 시뮬레이션 모드: 실제 영상 대신 샘플 데이터를 사용합니다</p>
                            </div>
                        </div>
                    )}

                    {/* Voice+Vision */}
                    {activeEngine === 'voice-vision' && (
                        <div className="engine-panel fade-in">
                            <h2>🎙️ Voice + Vision Integration</h2>
                            <p className="panel-desc">
                                음성 명령과 화면 분석을 결합한 멀티모달 AI.
                                "이 코드 설명해줘"라고 말하면 화면을 보고 답변합니다.
                            </p>

                            <div className="input-section">
                                <label>음성 명령</label>
                                <textarea
                                    value={voiceCommand}
                                    onChange={(e) => setVoiceCommand(e.target.value)}
                                    placeholder="예: What's on my screen?&#10;예: Explain this code&#10;예: Find bugs in the current file"
                                    rows={3}
                                />

                                <div className="voice-features">
                                    <span className="feature-badge">🎤 Voice Input</span>
                                    <span className="feature-badge">👁️ Screen Analysis</span>
                                    <span className="feature-badge">💬 Contextual Response</span>
                                </div>

                                <button
                                    className="btn-test"
                                    onClick={handleVoiceVisionTest}
                                    disabled={loading || !voiceCommand.trim()}
                                >
                                    {loading ? '분석 중...' : '🎙️ 실행'}
                                </button>

                                <p className="note">* 시뮬레이션 모드: 실제 화면 대신 샘플 컨텍스트를 사용합니다</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Results Panel */}
                {result && (
                    <div className="results-panel fade-in">
                        <h3>📊 결과</h3>
                        {result.error ? (
                            <div className="error-message">
                                ❌ {result.error}
                            </div>
                        ) : (
                            <pre className="result-content">
                                {JSON.stringify(result, null, 2)}
                            </pre>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default AIEnginesDemo;
