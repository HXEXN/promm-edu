import { useNavigate } from 'react-router-dom';
import './SuccessStories.css';

export default function SuccessStories() {
    const navigate = useNavigate();

    const cases = [
        {
            company: 'A Manufacturing',
            logo: '🏭',
            result: '₩12M/mo Saved',
            desc: 'AI cost reduced by 35% with optimization engine.',
            tags: ['Manufacturing', 'Cost Saving']
        },
        {
            company: 'B Finance',
            logo: '🏦',
            result: 'Productivity +60%',
            desc: '100 employees mastered prompt engineering in 3 weeks.',
            tags: ['Finance', 'Education']
        },
        {
            company: 'C Startup',
            logo: '🚀',
            result: 'Series A Secured',
            desc: 'Built enterprise-grade AI system with limited budget.',
            tags: ['Startup', 'Development']
        }
    ];

    return (
        <section id="cases" className="section success-stories-section">
            <div className="container">
                <div className="success-header">
                    <div className="fade-in">
                        <h2 className="section-title">
                            <span className="text-highlight">Success Stories</span>
                        </h2>
                        <p className="section-desc">
                            이미 50+ 기업이 PROMM과 함께 AI 혁신을 경험하고 있습니다.
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/case-studies')}
                        className="btn-outline fade-in"
                        style={{ marginTop: '1rem' }}
                    >
                        모든 사례 보기 →
                    </button>
                </div>

                <div className="stories-grid">
                    {cases.map((item, index) => (
                        <div key={index} className="glass-panel-pro story-card fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                            <div className="story-header">
                                <span className="story-logo">{item.logo}</span>
                                <div className="story-metric">
                                    <span className="metric-value">{item.result}</span>
                                    <span className="metric-label">Key Metric</span>
                                </div>
                            </div>

                            <h3>{item.company}</h3>
                            <p className="story-desc">
                                {item.desc}
                            </p>

                            <div className="story-tags">
                                {item.tags.map(tag => (
                                    <span key={tag} className="story-tag">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
