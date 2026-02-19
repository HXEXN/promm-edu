import './CostEngineInfo.css';

function CostEngineInfo() {
    return (
        <div className="card cost-engine-info">
            <h3 className="engine-title">⚙️ 최적 비용 엔진</h3>

            <div className="engine-description">
                <p className="intro-text">
                    PROMM의 AI 비용 최적화 엔진은 프롬프트를 분석하여 최소 비용으로 최대 효과를 내는 방법을 제시합니다.
                </p>

                <div className="how-it-works">
                    <h4>🔍 작동 원리</h4>

                    <div className="step-grid">
                        <div className="step-card">
                            <div className="step-number">1</div>
                            <h5>토큰 분석</h5>
                            <p>입력된 프롬프트의 토큰 수를 실시간으로 계산하고 불필요한 단어를 식별합니다.</p>
                        </div>

                        <div className="step-card">
                            <div className="step-number">2</div>
                            <h5>모델 비교</h5>
                            <p>GPT-5, Claude 4, Gemini 2.5 등 주요 AI 모델의 실제 가격을 비교하여 최적의 모델을 추천합니다.</p>
                        </div>

                        <div className="step-card">
                            <div className="step-number">3</div>
                            <h5>비용 예측</h5>
                            <p>월간 사용량을 기반으로 실제 발생할 비용을 정확하게 예측합니다.</p>
                        </div>

                        <div className="step-card">
                            <div className="step-number">4</div>
                            <h5>최적화 제안</h5>
                            <p>동일한 결과를 더 적은 비용으로 얻을 수 있는 개선 방안을 제시합니다.</p>
                        </div>
                    </div>
                </div>

                <div className="pricing-info">
                    <h4>💰 실제 가격 정보 (2026년 2월 기준)</h4>
                    <table className="pricing-table">
                        <thead>
                            <tr>
                                <th>모델</th>
                                <th>입력 (1M 토큰)</th>
                                <th>출력 (1M 토큰)</th>
                                <th>특징</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>GPT-5.2</strong></td>
                                <td>$0.875</td>
                                <td>$7.00</td>
                                <td>최고 성능, 복잡한 추론 작업</td>
                            </tr>
                            <tr>
                                <td><strong>GPT-5 Mini</strong></td>
                                <td>$0.25</td>
                                <td>$2.00</td>
                                <td>가성비 최고, 일반 작업</td>
                            </tr>
                            <tr>
                                <td><strong>Claude Sonnet 4.6</strong></td>
                                <td>$3.00</td>
                                <td>$15.00</td>
                                <td>창의적 글쓰기, 코드 생성</td>
                            </tr>
                            <tr>
                                <td><strong>Claude Haiku 4.5</strong></td>
                                <td>$1.00</td>
                                <td>$5.00</td>
                                <td>초고속 응답, 분류 작업</td>
                            </tr>
                            <tr>
                                <td><strong>Gemini 2.5 Pro</strong></td>
                                <td>$1.25</td>
                                <td>$10.00</td>
                                <td>긴 컨텍스트, 멀티모달</td>
                            </tr>
                            <tr>
                                <td><strong>Gemini 2.5 Flash</strong></td>
                                <td>$0.30</td>
                                <td>$2.50</td>
                                <td>초저비용, 대량 처리</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="savings-example">
                    <h4>📊 절감 효과 예시</h4>
                    <div className="example-comparison">
                        <div className="before-after">
                            <div className="comparison-card inefficient">
                                <span className="label">최적화 전</span>
                                <div className="prompt-example">
                                    "안녕하세요. 저는 스마트팜을 운영하고 있는 농부입니다.
                                    현재 토양이 매우 건조한 상태인데, 물을 공급해주시면 감사하겠습니다."
                                </div>
                                <div className="stats">
                                    <span className="token-count">35 토큰</span>
                                    <span className="cost">$0.00175 / 요청</span>
                                </div>
                            </div>

                            <div className="arrow">→</div>

                            <div className="comparison-card efficient">
                                <span className="label">최적화 후</span>
                                <div className="prompt-example">
                                    "관리자: 토양 건조, 물 공급"
                                </div>
                                <div className="stats">
                                    <span className="token-count">8 토큰</span>
                                    <span className="cost">$0.00040 / 요청</span>
                                </div>
                            </div>
                        </div>

                        <div className="savings-summary">
                            <div className="saving-item">
                                <span className="metric">토큰 절감:</span>
                                <span className="value success">77% ↓</span>
                            </div>
                            <div className="saving-item">
                                <span className="metric">비용 절감:</span>
                                <span className="value success">$0.00135 / 요청</span>
                            </div>
                            <div className="saving-item highlight">
                                <span className="metric">월 10만 요청 시:</span>
                                <span className="value big">$135 절감</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="key-features">
                    <h4>✨ 핵심 기능</h4>
                    <ul className="feature-list">
                        <li>
                            <span className="icon">🎯</span>
                            <div className="feature-content">
                                <strong>실시간 토큰 계산</strong>
                                <p>입력하는 즉시 토큰 수와 예상 비용이 자동으로 계산됩니다</p>
                            </div>
                        </li>
                        <li>
                            <span className="icon">💡</span>
                            <div className="feature-content">
                                <strong>스마트 제안</strong>
                                <p>AI가 더 효율적인 표현 방법을 제안하여 비용을 줄입니다</p>
                            </div>
                        </li>
                        <li>
                            <span className="icon">📈</span>
                            <div className="feature-content">
                                <strong>모델 추천</strong>
                                <p>작업 유형과 예산에 맞는 최적의 AI 모델을 추천합니다</p>
                            </div>
                        </li>
                        <li>
                            <span className="icon">💰</span>
                            <div className="feature-content">
                                <strong>ROI 분석</strong>
                                <p>프롬프트 최적화를 통한 투자 대비 효과를 정확하게 계산합니다</p>
                            </div>
                        </li>
                    </ul>
                </div>

                <div className="tech-2026-section">
                    <h4>🚀 2026 최신 AI 기술</h4>
                    <p className="tech-intro">최신 연구 논문과 오픈소스 프레임워크 기반의 고도화 기술</p>

                    <div className="tech-grid-2026">
                        <div className="tech-card-2026">
                            <span className="tech-icon-2026">🕸️</span>
                            <div className="tech-info-2026">
                                <strong>GraphRAG</strong>
                                <p>지식 그래프 기반 멀티홉 추론</p>
                                <span className="tech-source">Microsoft Research 2025</span>
                            </div>
                        </div>

                        <div className="tech-card-2026">
                            <span className="tech-icon-2026">🔄</span>
                            <div className="tech-info-2026">
                                <strong>Corrective RAG</strong>
                                <p>자기 수정 검색 증강 생성</p>
                                <span className="tech-source">Yan et al. 2024</span>
                            </div>
                        </div>

                        <div className="tech-card-2026">
                            <span className="tech-icon-2026">⚡</span>
                            <div className="tech-info-2026">
                                <strong>DSPy 3.0</strong>
                                <p>선언적 프롬프트 자동 최적화</p>
                                <span className="tech-source">Stanford NLP 2025</span>
                            </div>
                        </div>

                        <div className="tech-card-2026">
                            <span className="tech-icon-2026">🌳</span>
                            <div className="tech-info-2026">
                                <strong>Tree of Thoughts</strong>
                                <p>다중 추론 경로 탐색</p>
                                <span className="tech-source">Yao et al. 2024</span>
                            </div>
                        </div>

                        <div className="tech-card-2026">
                            <span className="tech-icon-2026">🔗</span>
                            <div className="tech-info-2026">
                                <strong>LangGraph</strong>
                                <p>상태 기반 에이전트 워크플로우</p>
                                <span className="tech-source">LangChain 2025</span>
                            </div>
                        </div>
                    </div>

                    <div className="tech-improvement-note">
                        <span className="badge">NEW</span>
                        버전 3.0.0에서 5가지 최신 기술이 추가되었습니다
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CostEngineInfo;
