import { useNavigate } from 'react-router-dom';
import './ComparisonSection.css';

export default function ComparisonSection() {
    const navigate = useNavigate();

    return (
        <section id="comparison" className="section comparison-section">
            <div className="container">
                <div className="section-header fade-in">
                    <h2 className="section-title">
                        <span className="text-white">Why PROMM?</span>
                    </h2>
                    <p className="section-desc">
                        단순한 도구가 아닙니다. 교육과 기술이 결합된 완벽한 플랫폼입니다.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto" style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <div className="glass-panel-pro table-glass fade-in delay-1">
                        <div className="compare-header">
                            <div style={{ paddingLeft: '1rem' }}>Features</div>
                            <div className="col-promm">PROMM</div>
                            <div className="col-other">Others</div>
                        </div>

                        <div className="compare-rows">
                            {[
                                { name: 'AI Engine', promm: 'Real-time Multi-LLM', other: 'Static API Wrapper' },
                                { name: 'Education', promm: 'Interactive & Adaptive', other: 'Video Lectures' },
                                { name: 'Cost Optimization', promm: 'Patent-Pending STC', other: 'None' },
                                { name: 'ROI Analytics', promm: 'Real-time Dashboard', other: 'Estimates Only' },
                                { name: 'Support', promm: '24/7 AI Tutor Agent', other: 'Ticket Support' },
                            ].map((row, idx) => (
                                <div key={idx} className="compare-row">
                                    <div className="feature-name">{row.name}</div>
                                    <div className="feature-promm">
                                        {row.promm === 'Real-time Multi-LLM' || row.promm === 'Patent-Pending STC' ? (
                                            <span>✅ {row.promm}</span>
                                        ) : (
                                            row.promm
                                        )}
                                    </div>
                                    <div className="feature-other">{row.other}</div>
                                </div>
                            ))}
                        </div>

                        <div className="compare-footer">
                            <button
                                onClick={() => navigate('/competitor-comparison')}
                                className="compare-link"
                            >
                                상세 비교표 보기
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
