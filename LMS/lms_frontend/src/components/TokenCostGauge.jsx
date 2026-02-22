import { useEffect, useState } from 'react';
import './TokenCostGauge.css';

function TokenCostGauge({ tokenCount, efficiencyScore, status }) {
    const [animatedCount, setAnimatedCount] = useState(0);
    const [animatedScore, setAnimatedScore] = useState(0);

    // Animate numbers
    useEffect(() => {
        const countInterval = setInterval(() => {
            setAnimatedCount(prev => {
                if (prev < tokenCount) return Math.min(prev + 1, tokenCount);
                return tokenCount;
            });
        }, 20);

        const scoreInterval = setInterval(() => {
            setAnimatedScore(prev => {
                if (prev < efficiencyScore) return Math.min(prev + 2, efficiencyScore);
                return efficiencyScore;
            });
        }, 15);

        return () => {
            clearInterval(countInterval);
            clearInterval(scoreInterval);
        };
    }, [tokenCount, efficiencyScore]);

    // Calculate gauge progress (0-100%)
    const maxTokens = 100;
    const progress = Math.min((tokenCount / maxTokens) * 100, 100);
    const gaugeRotation = (progress / 100) * 180; // 180deg for semi-circle

    // Status colors
    const getGaugeColor = () => {
        if (status === 'efficient') return 'url(#gradient-efficient)';
        if (status === 'normal') return 'url(#gradient-normal)';
        return 'url(#gradient-inefficient)';
    };

    const getStatusIcon = () => {
        if (status === 'efficient') return '✓';
        if (status === 'normal') return '!';
        return '✗';
    };

    const getStatusText = () => {
        if (status === 'efficient') return '효율적';
        if (status === 'normal') return '보통';
        return '비효율적';
    };

    return (
        <div className="card token-gauge-card">
            <h3 className="gauge-title">💰 토큰 효율성</h3>

            <div className="gauge-container">
                <svg width="240" height="140" viewBox="0 0 240 140" className="gauge-svg">
                    {/* Gradient Definitions */}
                    <defs>
                        <linearGradient id="gradient-efficient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="var(--accent-cyan)" />
                            <stop offset="100%" stopColor="var(--accent-green-light)" />
                        </linearGradient>
                        <linearGradient id="gradient-normal" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="var(--warning-yellow)" />
                            <stop offset="100%" stopColor="var(--accent-pink)" />
                        </linearGradient>
                        <linearGradient id="gradient-inefficient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="var(--danger-red)" />
                            <stop offset="100%" stopColor="hsl(0, 90%, 70%)" />
                        </linearGradient>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Background Track */}
                    <path
                        d="M 40 120 A 80 80 0 0 1 200 120"
                        fill="none"
                        stroke="hsla(220, 20%, 88%, 0.3)"
                        strokeWidth="20"
                        strokeLinecap="round"
                    />

                    {/* Progress Arc */}
                    <path
                        d="M 40 120 A 80 80 0 0 1 200 120"
                        fill="none"
                        stroke={getGaugeColor()}
                        strokeWidth="20"
                        strokeLinecap="round"
                        strokeDasharray={`${(gaugeRotation / 180) * 251.2} 251.2`}
                        className="gauge-progress"
                        filter="url(#glow)"
                    />

                    {/* Center Text */}
                    <text x="120" y="95" textAnchor="middle" className="gauge-value">
                        {animatedCount}
                    </text>
                    <text x="120" y="115" textAnchor="middle" className="gauge-label">
                        토큰
                    </text>
                </svg>

                <div className="gauge-stats">
                    <div className={`efficiency-badge ${status}`}>
                        <span className="badge-icon">{getStatusIcon()}</span>
                        <span className="badge-text">{getStatusText()}</span>
                    </div>
                    <div className="efficiency-score">
                        효율 점수: <strong>{animatedScore}/100</strong>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TokenCostGauge;
