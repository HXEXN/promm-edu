import { useNavigate } from 'react-router-dom';
import './TechShowcase.css';

export default function TechShowcase() {
    const navigate = useNavigate();

    return (
        <section id="technology" className="section tech-showcase-section">
            <div className="container">
                <div className="section-header fade-in">
                    <h2 className="section-title">
                        <span className="text-gradient">Core Technology</span>
                    </h2>
                    <p className="section-desc">
                        2026년 최신 기술로 검증된 PROMM 플랫폼의 강력한 AI 엔진을 소개합니다.
                    </p>
                </div>

                {/* 3-Layer System */}
                <div className="tech-grid fade-in delay-1">
                    <div className="glass-panel-pro tech-card">
                        <div className="tech-icon-wrapper" style={{ color: '#60a5fa', background: 'rgba(59, 130, 246, 0.1)' }}>
                            🎨
                        </div>
                        <h3>Frontend Layer</h3>
                        <p>React 19 + Vite 6</p>
                        <ul className="tech-list">
                            <li>• Concurrent Rendering</li>
                            <li>• Client-side Token Counting</li>
                            <li>• Real-time Preview</li>
                        </ul>
                    </div>

                    <div className="glass-panel-pro tech-card">
                        <div className="connection-arrow-desktop">→</div>
                        <div className="connection-arrow-mobile">↓</div>

                        <div className="tech-icon-wrapper" style={{ color: '#4ade80', background: 'rgba(74, 222, 128, 0.1)' }}>
                            ⚙️
                        </div>
                        <h3>Backend Layer</h3>
                        <p>Node.js 22 + Express 5</p>
                        <ul className="tech-list">
                            <li>• Gateway API</li>
                            <li>• Cost Calculation Engine</li>
                            <li>• Rate Limiting v3</li>
                        </ul>
                    </div>

                    <div className="glass-panel-pro tech-card">
                        <div className="tech-icon-wrapper" style={{ color: '#c084fc', background: 'rgba(192, 132, 252, 0.1)' }}>
                            🧠
                        </div>
                        <h3>AI Integration</h3>
                        <p>GPT-5.2 + Claude Sonnet 5</p>
                        <ul className="tech-list">
                            <li>• Multi-Model Router</li>
                            <li>• Hybrid Streaming</li>
                            <li>• Semantic Compression</li>
                        </ul>
                    </div>
                </div>

                {/* Patent Tech Highlight */}
                <div className="glass-panel-pro patent-highlight fade-in delay-2">
                    <div className="patent-container">
                        <div className="patent-content">
                            <div className="patent-badge">
                                🔬 Patent Pending
                            </div>
                            <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: 'white' }}>STC Engine (Semantic Token Compression)</h3>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                                프롬프트의 핵심 의미를 보존하면서 토큰 비용을 최대 40% 절감하는 독자 기술입니다.
                                중복된 컨텍스트를 제거하고 고밀도 정보를 재구성하여 LLM의 Attention 효율을 극대화합니다.
                            </p>
                            <div className="patent-stats">
                                <div className="stat-box">
                                    <span className="stat-number text-blue">40%</span>
                                    <span className="stat-label">비용 절감</span>
                                </div>
                                <div className="stat-box">
                                    <span className="stat-number text-green">95%+</span>
                                    <span className="stat-label">의미 보존</span>
                                </div>
                            </div>
                        </div>
                        <div className="patent-demo">
                            <div className="demo-header">
                                <span style={{ color: 'var(--text-tertiary)' }}>Compression Level 3</span>
                                <span className="text-green">Active</span>
                            </div>
                            <div className="demo-code">
                                <div className="line-through">You are a helpful assistant...</div>
                                <div className="text-blue">Role: Assistant</div>
                                <div className="line-through">Please summarize the following...</div>
                                <div className="text-blue">Task: Summarize</div>
                                <div className="text-slate-500">...</div>
                                <div className="text-green mt-2">Token Usage: 154 → 92</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="action-center">
                    <button
                        onClick={() => navigate('/technology')}
                        className="btn-outline"
                    >
                        기술 아키텍처 자세히 보기
                    </button>
                </div>
            </div>
        </section>
    );
}
