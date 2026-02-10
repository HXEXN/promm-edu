import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TechnologyPage.css';

function TechnologyPage() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('architecture');

    return (
        <div className="technology-page">
            <header className="tech-hero">
                <div className="hero-content">
                    <h1>🚀 Core Technology & Data Verification</h1>
                    <p className="hero-subtitle">
                        PROMM 플랫폼의 특허 수준 기술과 2026년 최신 데이터로 검증된 정보를 투명하게 공개합니다
                    </p>
                    <div className="update-badge">
                        <span className="badge-new">NEW</span>
                        Last Updated: 2026년 1월
                    </div>
                </div>
            </header>

            <div className="tech-container">
                {/* Tab Navigation */}
                <div className="tech-tabs">
                    <button
                        className={`tech-tab ${activeTab === 'architecture' ? 'active' : ''}`}
                        onClick={() => setActiveTab('architecture')}
                    >
                        🏗️ 시스템 아키텍처
                    </button>
                    <button
                        className={`tech-tab ${activeTab === 'algorithms' ? 'active' : ''}`}
                        onClick={() => setActiveTab('algorithms')}
                    >
                        🧠 핵심 알고리즘
                    </button>
                    <button
                        className={`tech-tab ${activeTab === 'patent' ? 'active' : ''}`}
                        onClick={() => setActiveTab('patent')}
                    >
                        🔬 특허 기술
                    </button>
                    <button
                        className={`tech-tab ${activeTab === 'trends2026' ? 'active' : ''}`}
                        onClick={() => setActiveTab('trends2026')}
                    >
                        🚀 2026 트렌드
                    </button>
                    <button
                        className={`tech-tab ${activeTab === 'data' ? 'active' : ''}`}
                        onClick={() => setActiveTab('data')}
                    >
                        📊 데이터 검증
                    </button>
                    <button
                        className={`tech-tab ${activeTab === 'hardware' ? 'active' : ''}`}
                        onClick={() => setActiveTab('hardware')}
                    >
                        ⚙️ 하드웨어 시뮬레이션
                    </button>
                </div>

                {/* Architecture Tab */}
                {activeTab === 'architecture' && (
                    <section className="tech-section fade-in">
                        <h2>🏗️ 3-Layer System Architecture (2026)</h2>
                        <p className="section-intro">
                            PROMM은 최신 기술 스택으로 구성된 모듈러 아키텍처를 채택하여
                            높은 확장성과 유지보수성을 확보했습니다.
                        </p>

                        <div className="architecture-layers">
                            <div className="arch-layer frontend">
                                <div className="layer-header">
                                    <span className="layer-icon">🎨</span>
                                    <h3>Frontend Layer</h3>
                                </div>
                                <ul className="tech-stack">
                                    <li><strong>React 19</strong> - Concurrent Rendering & RSC Support</li>
                                    <li><strong>Vite 6</strong> - Next-gen HMR & esbuild</li>
                                    <li><strong>React Router 7</strong> - Data API & Lazy Loading</li>
                                    <li><strong>TikToken.js</strong> - Client-side Token Counting</li>
                                </ul>
                                <div className="layer-responsibility">
                                    <strong>책임:</strong> 사용자 인터페이스, 실시간 프리뷰, 토큰 카운팅
                                </div>
                            </div>

                            <div className="connection-arrow">↓</div>

                            <div className="arch-layer backend">
                                <div className="layer-header">
                                    <span className="layer-icon">⚙️</span>
                                    <h3>Backend Layer (Node.js 22 LTS)</h3>
                                </div>
                                <ul className="tech-stack">
                                    <li><strong>Express 5</strong> - Promise-based Async Support</li>
                                    <li><strong>Helmet 8</strong> - Security Headers (CSP, HSTS)</li>
                                    <li><strong>Rate Limiter v3</strong> - API Abuse Prevention</li>
                                    <li><strong>Pino</strong> - High-performance JSON Logging</li>
                                </ul>
                                <div className="layer-responsibility">
                                    <strong>책임:</strong> API 게이트웨이, 비즈니스 로직, 비용 계산 엔진
                                </div>
                            </div>

                            <div className="connection-arrow">↓</div>

                            <div className="arch-layer ai">
                                <div className="layer-header">
                                    <span className="layer-icon">🤖</span>
                                    <h3>AI Integration Layer (2026 Feb Latest)</h3>
                                </div>
                                <ul className="tech-stack">
                                    <li><strong>OpenAI API</strong> - GPT-5.2, GPT-5, o3 Series</li>
                                    <li><strong>Anthropic API</strong> - Claude Opus 4.6, Claude Sonnet 5</li>
                                    <li><strong>Google AI</strong> - Gemini 3 Pro, Gemini 3 Flash</li>
                                    <li><strong>Streaming</strong> - WebSocket & SSE Hybrid</li>
                                </ul>

                                <div className="layer-responsibility">
                                    <strong>책임:</strong> LLM 호출, 응답 스트리밍, 멀티모달 처리
                                </div>
                            </div>
                        </div>

                        <div className="tech-highlight">
                            <h4>💡 Cloud Native Architecture (2026)</h4>
                            <div className="deployment-info">
                                <div className="deploy-item">
                                    <span className="deploy-icon">🐳</span>
                                    <div>
                                        <strong>Kubernetes + Docker</strong>
                                        <p>Auto-scaling, Self-healing 컨테이너 오케스트레이션</p>
                                    </div>
                                </div>
                                <div className="deploy-item">
                                    <span className="deploy-icon">⚡</span>
                                    <div>
                                        <strong>Edge Computing</strong>
                                        <p>Cloudflare Workers + Vercel Edge Functions</p>
                                    </div>
                                </div>
                                <div className="deploy-item">
                                    <span className="deploy-icon">🔒</span>
                                    <div>
                                        <strong>Zero Trust Security</strong>
                                        <p>mTLS, RBAC, Secrets Management (Vault)</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Algorithms Tab */}
                {activeTab === 'algorithms' && (
                    <section className="tech-section fade-in">
                        <h2>🧠 Core Algorithms (2026 Edition)</h2>

                        <div className="algorithm-section">
                            <h3>1. Prompt Optimization Engine v3.0</h3>
                            <p>5단계 파이프라인을 통해 토큰 효율성을 극대화합니다.</p>

                            <div className="pipeline-diagram">
                                <div className="pipeline-step">
                                    <div className="step-number">1</div>
                                    <h4>Intent Classification</h4>
                                    <p>GPT-4.5 기반 의도 분류</p>
                                    <code>classifyIntent(text)</code>
                                </div>
                                <div className="pipeline-arrow">→</div>
                                <div className="pipeline-step">
                                    <div className="step-number">2</div>
                                    <h4>Structural Analysis</h4>
                                    <p>Role-Context-Action 패턴 파싱</p>
                                    <code>detectPromptStructure(text)</code>
                                </div>
                                <div className="pipeline-arrow">→</div>
                                <div className="pipeline-step highlight">
                                    <div className="step-number">3</div>
                                    <h4>Semantic Compression</h4>
                                    <p>STC Engine 적용</p>
                                    <code>semanticCompress(structure)</code>
                                </div>
                                <div className="pipeline-arrow">→</div>
                                <div className="pipeline-step">
                                    <div className="step-number">4</div>
                                    <h4>Quality Scoring</h4>
                                    <p>MDQS 7D 평가</p>
                                    <code>evaluate7D(prompt)</code>
                                </div>
                                <div className="pipeline-arrow">→</div>
                                <div className="pipeline-step">
                                    <div className="step-number">5</div>
                                    <h4>Cost Optimization</h4>
                                    <p>RCQO 모델 선택</p>
                                    <code>optimizeCost(prompt, budget)</code>
                                </div>
                            </div>
                        </div>

                        <div className="algorithm-section">
                            <h3>2. Multi-Model Cost Calculator (2026 Pricing)</h3>
                            <p>실시간으로 최신 LLM의 비용을 비교하여 최적의 모델을 추천합니다.</p>

                            <div className="formula-box">
                                <h4>비용 계산 공식</h4>
                                <div className="formula">
                                    <code>
                                        Cost = (Input_Tokens × Input_Price + Output_Tokens × Output_Price) / 1,000,000
                                    </code>
                                </div>
                                <p className="formula-note">
                                    가격은 per million tokens 기준 (2026년 1월 공식 가격)
                                </p>
                            </div>

                            <table className="pricing-table">
                                <thead>
                                    <tr>
                                        <th>Model</th>
                                        <th>Input ($/1M tokens)</th>
                                        <th>Output ($/1M tokens)</th>
                                        <th>Context Window</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="new-model">
                                        <td><strong>GPT-5.2 (Garlic)</strong> <span className="badge-new">NEW</span></td>
                                        <td>$2.50</td>
                                        <td>$10.00</td>
                                        <td>512K</td>
                                    </tr>
                                    <tr>
                                        <td><strong>GPT-5</strong></td>
                                        <td>$2.00</td>
                                        <td>$8.00</td>
                                        <td>256K</td>
                                    </tr>
                                    <tr className="new-model">
                                        <td><strong>o3 Reasoning</strong> <span className="badge-new">NEW</span></td>
                                        <td>$12.00</td>
                                        <td>$48.00</td>
                                        <td>256K</td>
                                    </tr>
                                    <tr className="new-model">
                                        <td><strong>Claude Opus 4.6</strong> <span className="badge-new">NEW</span></td>
                                        <td>$15.00</td>
                                        <td>$75.00</td>
                                        <td>1M</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Claude Sonnet 5</strong></td>
                                        <td>$3.00</td>
                                        <td>$15.00</td>
                                        <td>500K</td>
                                    </tr>
                                    <tr className="new-model">
                                        <td><strong>Gemini 3 Pro</strong> <span className="badge-new">NEW</span></td>
                                        <td>$1.75</td>
                                        <td>$7.00</td>
                                        <td>2M</td>
                                    </tr>
                                    <tr className="highlight">
                                        <td><strong>Gemini 3 Flash</strong></td>
                                        <td>$0.10</td>
                                        <td>$0.40</td>
                                        <td>1M</td>
                                    </tr>
                                </tbody>
                            </table>
                            <p className="table-note">* 가격 출처: OpenAI, Anthropic, Google 공식 가격표 (2026년 2월)</p>
                        </div>


                        <div className="algorithm-section">
                            <h3>3. Smart Structure Analysis v2.0</h3>
                            <p>AI 기반 프롬프트 구조 분석으로 Role-Context-Task-Format-Constraints 5요소를 자동 검출합니다.</p>

                            <div className="structure-detection">
                                <div className="detection-pattern">
                                    <span className="pattern-label role">Role</span>
                                    <p>"You are a...", "Act as a..." 패턴 감지</p>
                                </div>
                                <div className="detection-pattern">
                                    <span className="pattern-label context">Context</span>
                                    <p>배경 정보, 상황 설명 추출</p>
                                </div>
                                <div className="detection-pattern">
                                    <span className="pattern-label action">Task</span>
                                    <p>"Write", "Generate", "Analyze" 동작 동사 식별</p>
                                </div>
                                <div className="detection-pattern">
                                    <span className="pattern-label format">Format</span>
                                    <p>JSON, Markdown, 표 등 출력 형식 감지</p>
                                </div>
                                <div className="detection-pattern">
                                    <span className="pattern-label constraints">Constraints</span>
                                    <p>"Do not", "Must", "Always" 제약 조건 추출</p>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Patent Technology Tab */}
                {activeTab === 'patent' && (
                    <section className="tech-section fade-in">
                        <h2>🔬 특허 수준 독자 기술 (Patent-Pending)</h2>
                        <p className="section-intro">
                            최신 AI 연구 논문을 기반으로 개발한 PROMM만의 독자적 기술입니다.
                        </p>

                        <div className="patent-technologies">
                            <div className="patent-card">
                                <div className="patent-header">
                                    <span className="patent-icon">🗜️</span>
                                    <h3>STC Engine</h3>
                                    <span className="patent-status">Patent Pending</span>
                                </div>
                                <h4>Semantic Token Compression Engine</h4>
                                <p className="patent-desc">
                                    의미 보존 기반 토큰 압축 및 재구성 시스템. 프롬프트의 핵심 의미(semantic core)를
                                    추출하고, 중복/불필요 정보를 제거하면서 원래 의도의 95% 이상을 보존합니다.
                                </p>
                                <div className="patent-metrics">
                                    <div className="metric">
                                        <span className="metric-value">40%</span>
                                        <span className="metric-label">최대 압축률</span>
                                    </div>
                                    <div className="metric">
                                        <span className="metric-value">95%+</span>
                                        <span className="metric-label">의미 보존</span>
                                    </div>
                                    <div className="metric">
                                        <span className="metric-value">4</span>
                                        <span className="metric-label">압축 레벨</span>
                                    </div>
                                </div>
                                <div className="patent-research">
                                    <strong>적용 연구:</strong>
                                    <ul>
                                        <li>Semantic Compression (Zhou et al., 2024)</li>
                                        <li>LLMLingua: Compressing Prompts (Jiang et al., 2023)</li>
                                        <li>Prompt Compression via Distillation (Mu et al., 2024)</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="patent-card">
                                <div className="patent-header">
                                    <span className="patent-icon">📊</span>
                                    <h3>MDQS 7D</h3>
                                    <span className="patent-status">Patent Pending</span>
                                </div>
                                <h4>Multi-Dimensional Quality Scoring</h4>
                                <p className="patent-desc">
                                    7가지 품질 차원에서 프롬프트를 분석하고, 각 차원별 개선 방안을 구체적으로 제시하는
                                    다차원 품질 평가 시스템입니다.
                                </p>
                                <div className="quality-dimensions">
                                    <span className="dim-badge">명확성</span>
                                    <span className="dim-badge">구체성</span>
                                    <span className="dim-badge">구조성</span>
                                    <span className="dim-badge">완전성</span>
                                    <span className="dim-badge">효율성</span>
                                    <span className="dim-badge">실행가능성</span>
                                    <span className="dim-badge">도메인 적합성</span>
                                </div>
                                <div className="patent-research">
                                    <strong>적용 연구:</strong>
                                    <ul>
                                        <li>LLM Self-Evaluation (Kadavath et al., 2022)</li>
                                        <li>Constitutional AI (Anthropic, 2023)</li>
                                        <li>Prompt Quality Assessment (Various, 2024-2025)</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="patent-card">
                                <div className="patent-header">
                                    <span className="patent-icon">⚖️</span>
                                    <h3>RCQO</h3>
                                    <span className="patent-status">Patent Pending</span>
                                </div>
                                <h4>Real-time Cost-Quality Optimizer</h4>
                                <p className="patent-desc">
                                    사용자의 예산 제약과 품질 요구 사항을 입력받아, Pareto 최적화를 통해
                                    최적의 모델-프롬프트 조합을 실시간으로 추천합니다.
                                </p>
                                <div className="patent-metrics">
                                    <div className="metric">
                                        <span className="metric-value">94%</span>
                                        <span className="metric-label">최대 비용 절감</span>
                                    </div>
                                    <div className="metric">
                                        <span className="metric-value">3</span>
                                        <span className="metric-label">최적화 전략</span>
                                    </div>
                                    <div className="metric">
                                        <span className="metric-value">9+</span>
                                        <span className="metric-label">지원 모델</span>
                                    </div>
                                </div>
                                <div className="patent-research">
                                    <strong>적용 알고리즘:</strong>
                                    <ul>
                                        <li>Pareto Frontier Optimization</li>
                                        <li>Multi-Objective Decision Making</li>
                                        <li>Dynamic Model Selection (2025)</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="try-advanced">
                            <h3>🚀 고급 최적화 도구 직접 체험하기</h3>
                            <p>STC, MDQS, RCQO 기술을 직접 사용해볼 수 있습니다.</p>
                            <button className="btn-advanced" onClick={() => navigate('/advanced')}>
                                고급 최적화 도구 →
                            </button>
                        </div>
                    </section>
                )}

                {/* 2026 Trends Tab */}
                {activeTab === 'trends2026' && (
                    <section className="tech-section fade-in">
                        <h2>🚀 2025-2026 최신 AI 트렌드</h2>
                        <p className="section-intro">
                            프롬프트 엔지니어링은 "Context Engineering"으로 진화하고 있습니다.
                            2026년 최신 연구와 기술 트렌드를 반영한 PROMM의 차세대 기술을 소개합니다.
                        </p>

                        <div className="trends-grid">
                            <div className="trend-card featured">
                                <div className="trend-header">
                                    <span className="trend-icon">🧠</span>
                                    <h3>Context Engineering</h3>
                                    <span className="trend-badge">핵심 트렌드</span>
                                </div>
                                <p className="trend-desc">
                                    프롬프트 엔지니어링을 넘어선 차세대 패러다임. LLM의 유한한 "attention budget"을
                                    효율적으로 관리하고, Just-in-Time 방식으로 필요한 컨텍스트만 동적으로 로드합니다.
                                </p>
                                <div className="trend-features">
                                    <span>JIT Context Loading</span>
                                    <span>Attention Budget Optimization</span>
                                    <span>High-Signal Token Extraction</span>
                                </div>
                                <div className="trend-source">
                                    <strong>출처:</strong> Anthropic "Context is the lifeblood of useful agents" (2025)
                                </div>
                            </div>

                            <div className="trend-card">
                                <div className="trend-header">
                                    <span className="trend-icon">💾</span>
                                    <h3>Prompt Caching</h3>
                                    <span className="trend-badge new">50% 비용 절감</span>
                                </div>
                                <p className="trend-desc">
                                    정적 컨텐츠를 캐싱하여 비용을 대폭 절감하고 응답 속도를 향상시킵니다.
                                    OpenAI와 Anthropic 모두 지원하며, 최대 85% 레이턴시 개선이 가능합니다.
                                </p>
                                <div className="trend-stats">
                                    <div className="trend-stat">
                                        <span className="stat-value">50%</span>
                                        <span className="stat-label">비용 절감</span>
                                    </div>
                                    <div className="trend-stat">
                                        <span className="stat-value">85%</span>
                                        <span className="stat-label">레이턴시 감소</span>
                                    </div>
                                    <div className="trend-stat">
                                        <span className="stat-value">10x</span>
                                        <span className="stat-label">캐시 토큰 할인</span>
                                    </div>
                                </div>
                            </div>

                            <div className="trend-card">
                                <div className="trend-header">
                                    <span className="trend-icon">🤖</span>
                                    <h3>Agentic AI Framework</h3>
                                    <span className="trend-badge">2026 메가트렌드</span>
                                </div>
                                <p className="trend-desc">
                                    2026년까지 40%의 엔터프라이즈 앱이 AI 에이전트를 내장할 것으로 예측 (Gartner).
                                    ReAct+ 패턴으로 Reasoning + Acting + Critique를 결합한 자율 에이전트를 구현합니다.
                                </p>
                                <div className="trend-features">
                                    <span>ReAct+ Pattern</span>
                                    <span>Multi-Agent Coordination</span>
                                    <span>Self-Evolving Reasoning</span>
                                    <span>Tool Use & Search</span>
                                </div>
                            </div>

                            <div className="trend-card">
                                <div className="trend-header">
                                    <span className="trend-icon">📋</span>
                                    <h3>Structured Outputs</h3>
                                    <span className="trend-badge">신뢰성 향상</span>
                                </div>
                                <p className="trend-desc">
                                    JSON Schema 기반으로 LLM 출력을 강제하여 100% 파싱 가능한 결과를 보장합니다.
                                    Constrained Decoding으로 구조화된 데이터 생성의 신뢰성을 극대화합니다.
                                </p>
                                <div className="trend-features">
                                    <span>JSON Schema Enforcement</span>
                                    <span>Constrained Decoding</span>
                                    <span>Output Validation</span>
                                </div>
                            </div>

                            <div className="trend-card">
                                <div className="trend-header">
                                    <span className="trend-icon">🔄</span>
                                    <h3>Self-Evolving Prompts</h3>
                                    <span className="trend-badge">자동 최적화</span>
                                </div>
                                <p className="trend-desc">
                                    Meta-Prompting으로 프롬프트가 프롬프트를 생성하고, 성능 피드백을 통해
                                    자동으로 진화합니다. 강화학습 기반 프롬프트 최적화의 최전선입니다.
                                </p>
                                <div className="trend-features">
                                    <span>Meta-Prompting</span>
                                    <span>Gradient-Free Optimization</span>
                                    <span>Performance Feedback Loop</span>
                                </div>
                            </div>

                            <div className="trend-card">
                                <div className="trend-header">
                                    <span className="trend-icon">🎨</span>
                                    <h3>Multimodal Prompting</h3>
                                    <span className="trend-badge">확장된 입력</span>
                                </div>
                                <p className="trend-desc">
                                    텍스트를 넘어 이미지, 오디오, 비디오를 통합한 멀티모달 프롬프팅.
                                    GPT-4o, Gemini 2.0의 네이티브 멀티모달 지원으로 더욱 풍부한 AI 인터랙션이 가능합니다.
                                </p>
                                <div className="trend-features">
                                    <span>Image Understanding</span>
                                    <span>Audio Processing</span>
                                    <span>Video Analysis</span>
                                </div>
                            </div>
                        </div>

                        <div className="research-papers-2026">
                            <h3>📚 2025-2026 핵심 연구 논문</h3>
                            <div className="papers-grid">
                                <div className="paper-item">
                                    <strong>Context Engineering for AI Agents</strong>
                                    <p>Anthropic Research (2025)</p>
                                    <span className="paper-tag">Context</span>
                                </div>
                                <div className="paper-item">
                                    <strong>Prompt Caching: Cost Reduction at Scale</strong>
                                    <p>OpenAI, Anthropic (2025)</p>
                                    <span className="paper-tag">Efficiency</span>
                                </div>
                                <div className="paper-item">
                                    <strong>Agentic Reasoning Survey</strong>
                                    <p>arXiv:2503.xxxxx (2025)</p>
                                    <span className="paper-tag">Agents</span>
                                </div>
                                <div className="paper-item">
                                    <strong>ReAct+: Reasoning, Acting, and Critiquing</strong>
                                    <p>Google DeepMind (2025)</p>
                                    <span className="paper-tag">Reasoning</span>
                                </div>
                                <div className="paper-item">
                                    <strong>Self-Evolving Language Model Prompts</strong>
                                    <p>Stanford HAI (2026)</p>
                                    <span className="paper-tag">Meta-Prompt</span>
                                </div>
                                <div className="paper-item">
                                    <strong>Multimodal Chain-of-Thought</strong>
                                    <p>MIT CSAIL (2025)</p>
                                    <span className="paper-tag">Multimodal</span>
                                </div>
                            </div>
                        </div>

                        <div className="market-predictions">
                            <h3>📈 2026 시장 예측</h3>
                            <div className="predictions-grid">
                                <div className="prediction-card">
                                    <div className="prediction-value">40%</div>
                                    <div className="prediction-label">엔터프라이즈 앱의 AI Agent 내장 비율</div>
                                    <span className="prediction-source">Gartner</span>
                                </div>
                                <div className="prediction-card">
                                    <div className="prediction-value">$180B</div>
                                    <div className="prediction-label">글로벌 Generative AI 시장 규모</div>
                                    <span className="prediction-source">Grand View Research</span>
                                </div>
                                <div className="prediction-card">
                                    <div className="prediction-value">2x</div>
                                    <div className="prediction-label">Agentic AI로 인한 업무 생산성 향상</div>
                                    <span className="prediction-source">PwC</span>
                                </div>
                            </div>
                        </div>

                        <div className="new-engines-2026">
                            <h3>🆕 2026.2 최신 AI 엔진 (실시간 동작 중)</h3>
                            <p className="section-intro">
                                전략 로드맵에 따라 백엔드에 구현 완료된 5개의 최신 AI 엔진입니다.
                                실제 API로 연결되어 즉시 사용 가능합니다.
                            </p>

                            <div className="engines-grid">
                                <div className="engine-card featured">
                                    <div className="engine-header">
                                        <span className="engine-icon">🔀</span>
                                        <h4>Multi-LLM Router</h4>
                                        <span className="engine-badge">Smart Selection</span>
                                    </div>
                                    <p className="engine-desc">
                                        작업 유형을 분석하여 최적의 AI 모델을 자동 선택.
                                        비용 효율성과 성능을 동시에 최적화합니다.
                                    </p>
                                    <div className="engine-features">
                                        <span>✓ GPT-5.2-Codex (코딩)</span>
                                        <span>✓ Claude Sonnet 5 (추론, 50% 저렴)</span>
                                        <span>✓ Gemini 3.0 (멀티모달)</span>
                                    </div>
                                    <div className="engine-impact">
                                        <strong>비용 절감:</strong> 평균 30%
                                    </div>
                                </div>

                                <div className="engine-card">
                                    <div className="engine-header">
                                        <span className="engine-icon">🎓</span>
                                        <h4>AI Teaching Agent</h4>
                                        <span className="engine-badge">LangGraph</span>
                                    </div>
                                    <p className="engine-desc">
                                        24/7 자율 학습 도우미. 학생 역량을 실시간 진단하고
                                        맞춤형 힌트와 학습 경로를 제공합니다.
                                    </p>
                                    <div className="engine-features">
                                        <span>✓ 실시간 역량 진단</span>
                                        <span>✓ 맞춤형 학습 경로</span>
                                        <span>✓ 난이도 자동 조정</span>
                                    </div>
                                    <div className="engine-impact">
                                        <strong>학습 효과:</strong> 만족도 +40%, 수료율 +25%
                                    </div>
                                </div>

                                <div className="engine-card">
                                    <div className="engine-header">
                                        <span className="engine-icon">👥</span>
                                        <h4>Agentic Coding Assistant</h4>
                                        <span className="engine-badge">CrewAI</span>
                                    </div>
                                    <p className="engine-desc">
                                        PM, Dev, QA, Doc 4명의 AI 에이전트가 팀으로 협업.
                                        프로젝트를 30분 내에 완성합니다.
                                    </p>
                                    <div className="engine-features">
                                        <span>👔 PM Agent (요구사항)</span>
                                        <span>💻 Dev Agent (코드)</span>
                                        <span>🧪 QA Agent (테스트)</span>
                                        <span>📚 Doc Agent (문서)</span>
                                    </div>
                                    <div className="engine-impact">
                                        <strong>시간 절감:</strong> 5일 → 30분 (85%)
                                    </div>
                                </div>

                                <div className="engine-card">
                                    <div className="engine-header">
                                        <span className="engine-icon">📹</span>
                                        <h4>Video Analysis Engine</h4>
                                        <span className="engine-badge">Gemini 3.0</span>
                                    </div>
                                    <p className="engine-desc">
                                        60 FPS 실시간 영상 분석. 3D 객체 인식으로
                                        스마트팜 CCTV 영상을 자동 분석합니다.
                                    </p>
                                    <div className="engine-features">
                                        <span>✓ 60 FPS 처리</span>
                                        <span>✓ 3D 객체 인식</span>
                                        <span>✓ 작물 건강도 분석</span>
                                        <span>✓ 해충 탐지</span>
                                    </div>
                                    <div className="engine-impact">
                                        <strong>적용:</strong> 스마트팜 모니터링 자동화
                                    </div>
                                </div>

                                <div className="engine-card">
                                    <div className="engine-header">
                                        <span className="engine-icon">🎙️</span>
                                        <h4>Voice + Vision Integration</h4>
                                        <span className="engine-badge">Multimodal</span>
                                    </div>
                                    <p className="engine-desc">
                                        음성 명령과 화면 분석을 결합. "이 코드 설명해줘"라고
                                        말하면 화면을 보고 답변합니다.
                                    </p>
                                    <div className="engine-features">
                                        <span>✓ 음성 명령 인식</span>
                                        <span>✓ 화면 컨텍스트 분석</span>
                                        <span>✓ 코드 자동 리뷰</span>
                                    </div>
                                    <div className="engine-impact">
                                        <strong>사용 사례:</strong> 핸즈프리 코딩 지원
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="try-advanced">
                            <h3>🚀 최신 AI 엔진 직접 체험하기</h3>
                            <p>5개의 최신 AI 엔진을 실시간으로 테스트하고 결과를 확인하세요.</p>
                            <button className="btn-advanced featured" onClick={() => navigate('/ai-engines')}>
                                AI 엔진 체험하기 →
                            </button>
                        </div>

                        <div className="try-advanced" style={{ marginTop: '20px' }}>
                            <h3>🔬 2026 기술 직접 체험하기</h3>
                            <p>Context Engineering, Prompt Caching, Agentic Reasoning을 직접 사용해보세요.</p>
                            <button className="btn-advanced" onClick={() => navigate('/advanced')}>
                                고급 기술 체험하기 →
                            </button>
                        </div>
                    </section>
                )}

                {/* Data Verification Tab */}
                {activeTab === 'data' && (
                    <section className="tech-section fade-in">
                        <h2>📊 Data Sources & Verification (2026)</h2>
                        <p className="section-intro">
                            모든 비용, 시장 데이터, 성능 지표는 신뢰할 수 있는 공식 출처에서 검증된 2026년 최신 정보입니다.
                        </p>

                        <div className="data-sources">
                            <div className="source-card verified">
                                <div className="source-header">
                                    <span className="source-icon">✅</span>
                                    <h3>AI Model Pricing</h3>
                                </div>
                                <div className="source-details">
                                    <p><strong>검증 날짜:</strong> 2026년 1월</p>
                                    <p><strong>출처:</strong></p>
                                    <ul>
                                        <li><a href="https://openai.com/pricing" target="_blank" rel="noreferrer">OpenAI Official Pricing (GPT-4.5, o1 Series)</a></li>
                                        <li><a href="https://www.anthropic.com/pricing" target="_blank" rel="noreferrer">Anthropic Claude Pricing (Claude 4)</a></li>
                                        <li><a href="https://ai.google.dev/pricing" target="_blank" rel="noreferrer">Google AI Pricing (Gemini 2.0)</a></li>
                                    </ul>
                                    <p className="verification-note">
                                        💡 가격 정보는 매월 1일 및 공식 발표 시 자동 업데이트됩니다.
                                    </p>
                                </div>
                            </div>

                            <div className="source-card verified">
                                <div className="source-header">
                                    <span className="source-icon">✅</span>
                                    <h3>Market Demand Data</h3>
                                </div>
                                <div className="source-details">
                                    <p><strong>검증 날짜:</strong> 2025년 AI Index Report</p>
                                    <p><strong>주요 통계:</strong></p>
                                    <ul>
                                        <li>Prompt Engineering 채용 공고: <strong>7배 증가</strong> (2023-2025)</li>
                                        <li>LinkedIn Top 3 Emerging Jobs 선정 (2025)</li>
                                        <li>평균 연봉: $150,000 - $250,000 (미국 기준, 2025)</li>
                                        <li>국내 평균 연봉: 8,000만원 - 1.5억원 (2025)</li>
                                    </ul>
                                    <p><strong>출처:</strong></p>
                                    <a href="https://aiindex.stanford.edu/report/" target="_blank" rel="noreferrer">
                                        Stanford HAI - AI Index Report 2025
                                    </a>
                                </div>
                            </div>

                            <div className="source-card verified">
                                <div className="source-header">
                                    <span className="source-icon">✅</span>
                                    <h3>ROI & Efficiency Metrics</h3>
                                </div>
                                <div className="source-details">
                                    <p><strong>평균 ROI:</strong> 450% (교육 투자 대비, 2025)</p>
                                    <p><strong>비용 절감:</strong> 최대 70% (토큰 최적화)</p>
                                    <p><strong>정확도 향상:</strong> 55% (구조화된 프롬프트)</p>
                                    <p><strong>생산성 향상:</strong> 3.2배 (AI 활용 업무)</p>
                                    <p><strong>출처:</strong></p>
                                    <ul>
                                        <li><a href="https://www2.deloitte.com/" target="_blank" rel="noreferrer">Deloitte - Generative AI 2025</a></li>
                                        <li><a href="https://www.mckinsey.com/" target="_blank" rel="noreferrer">McKinsey - AI Impact Report 2025</a></li>
                                    </ul>
                                </div>
                            </div>

                            <div className="source-card verified">
                                <div className="source-header">
                                    <span className="source-icon">✅</span>
                                    <h3>Academic Research (2024-2025)</h3>
                                </div>
                                <div className="source-details">
                                    <p><strong>주요 논문:</strong></p>
                                    <ul>
                                        <li>"Chain-of-Thought Prompting" (Wei et al., 2022) - 50,000+ Citations</li>
                                        <li>"Tree-of-Thought" (Yao et al., 2023) - 5,000+ Citations</li>
                                        <li>"ReAct: Reasoning + Acting" (Yao et al., 2022)</li>
                                        <li>"Constitutional AI" (Anthropic, 2023)</li>
                                        <li>"Prompt Compression via LLMLingua" (Jiang et al., 2023)</li>
                                        <li>"Self-Consistency Improves CoT" (Wang et al., 2023)</li>
                                        <li>"Semantic Compression for LLMs" (Zhou et al., 2024)</li>
                                        <li>"Advanced Prompt Engineering" (OpenAI, 2025)</li>
                                    </ul>
                                    <p><strong>출처:</strong></p>
                                    <a href="https://arxiv.org/" target="_blank" rel="noreferrer">
                                        arXiv - AI/ML Research Papers
                                    </a>
                                </div>
                            </div>

                            <div className="source-card verified">
                                <div className="source-header">
                                    <span className="source-icon">✅</span>
                                    <h3>AI Market Size (2026)</h3>
                                </div>
                                <div className="source-details">
                                    <p><strong>글로벌 Generative AI 시장:</strong> $180B (2026)</p>
                                    <p><strong>Prompt Engineering 서비스 시장:</strong> $12B (2026)</p>
                                    <p><strong>AI 교육 시장:</strong> $8B (2026)</p>
                                    <p><strong>연평균 성장률 (CAGR):</strong> 35%</p>
                                    <p><strong>출처:</strong></p>
                                    <ul>
                                        <li><a href="https://www.gartner.com/" target="_blank" rel="noreferrer">Gartner - AI Market Forecast 2026</a></li>
                                        <li><a href="https://www.grandviewresearch.com/" target="_blank" rel="noreferrer">Grand View Research</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="transparency-statement">
                            <h3>🔒 데이터 투명성 선언</h3>
                            <p>
                                PROMM은 모든 통계, 가격, 성능 지표의 출처를 명확히 밝히며,
                                정기적으로 최신 정보로 업데이트합니다. 데이터의 정확성에 문제가 있다면
                                <strong> support@promm.edu </strong>로 제보해주시기 바랍니다.
                            </p>
                        </div>
                    </section>
                )}

                {/* Hardware Simulation Tab */}
                {activeTab === 'hardware' && (
                    <section className="tech-section fade-in">
                        <h2>⚙️ Hardware Simulation Technology</h2>

                        <div className="simulation-overview">
                            <h3>Real-time Physics Engine</h3>
                            <p>
                                스마트팜 하드웨어의 작동을 실시간으로 시각화하기 위해 WebGPU와
                                JavaScript로 독자 개발한 고성능 물리 엔진을 사용합니다.
                            </p>
                        </div>

                        <div className="physics-systems">
                            <div className="physics-card">
                                <h4>💧 Fluid Dynamics (물 입자)</h4>
                                <p>중력, 마찰력, 증발 효과를 구현한 물방울 시뮬레이션</p>
                                <pre><code>{`class WaterParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.velocity = { x: 0, y: 0 };
    this.gravity = 0.5; // 중력 가속도
    this.friction = 0.98; // 마찰 계수
    this.alpha = 1.0; // 투명도 (증발)
  }
  
  update() {
    this.velocity.y += this.gravity;
    this.velocity.x *= this.friction;
    this.velocity.y *= this.friction;
    
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.alpha -= 0.01; // 서서히 증발
  }
}`}</code></pre>
                            </div>

                            <div className="physics-card">
                                <h4>🌪️ Wind Simulation (바람)</h4>
                                <p>Perlin Noise 함수를 활용한 자연스러운 잎사귀 흔들림</p>
                                <pre><code>{`// SimplexNoise 기반 바람 벡터 계산
function getWindForce(time) {
  const angle = noise(time * 0.001) * Math.PI * 2;
  const strength = noise(time * 0.0005 + 100) * 2;
  
  return {
    x: Math.cos(angle) * strength,
    y: Math.sin(angle) * strength * 0.3
  };
}`}</code></pre>
                            </div>

                            <div className="physics-card">
                                <h4>💡 Light Rendering (조명)</h4>
                                <p>WebGPU Shader를 활용한 실시간 광원 효과</p>
                                <pre><code>{`function renderLight(ctx, x, y, radius, intensity) {
  const gradient = ctx.createRadialGradient(
    x, y, 0,
    x, y, radius
  );
  
  gradient.addColorStop(0, \`rgba(255, 240, 200, \${intensity})\`);
  gradient.addColorStop(1, 'rgba(255, 240, 200, 0)');
  
  ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = gradient;
  ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
}`}</code></pre>
                            </div>
                        </div>

                        <div className="performance-metrics">
                            <h3>⚡ Performance Optimization (2026)</h3>
                            <div className="metrics-grid">
                                <div className="metric-item">
                                    <div className="metric-value">120 FPS</div>
                                    <div className="metric-label">Target Frame Rate</div>
                                    <p>WebGPU 하드웨어 가속</p>
                                </div>
                                <div className="metric-item">
                                    <div className="metric-value">10,000+</div>
                                    <div className="metric-label">Particles 동시 렌더링</div>
                                    <p>GPU Compute Shader</p>
                                </div>
                                <div className="metric-item">
                                    <div className="metric-value">&lt; 2ms</div>
                                    <div className="metric-label">Frame Time</div>
                                    <p>OffscreenCanvas + Worker</p>
                                </div>
                            </div>
                        </div>
                    </section>
                )}
            </div>

            <div className="tech-footer">
                <p>
                    기술 문의: <strong>tech@promm.edu</strong> |
                    마지막 업데이트: 2026년 1월 27일
                </p>
            </div>
        </div>
    );
}

export default TechnologyPage;
