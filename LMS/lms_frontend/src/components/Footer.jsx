import { useNavigate, useLocation } from 'react-router-dom';
import './Footer.css';

function Footer() {
    const navigate = useNavigate();
    const location = useLocation();

    // Hide footer on landing page
    if (location.pathname === '/') return null;

    const footerLinks = [
        {
            title: '학습',
            links: [
                { path: '/why-learn', label: '학습 가이드' },
                { path: '/student/assessment', label: '실력 테스트' },
                { path: '/student/recommendation', label: 'AI 추천' }
            ]
        },
        {
            title: '도구',
            links: [
                { path: '/prompt-generator', label: '프롬프트 생성기' },
                { path: '/advanced', label: '고급 최적화' },
                { path: '/ai-engines', label: 'AI 엔진 데모' },
                { path: '/dashboard', label: '대시보드' }
            ]
        },
        {
            title: '비즈니스',
            links: [
                { path: '/enterprise/process', label: '도입 프로세스' },
                { path: '/enterprise/education', label: '기업 교육' },
                { path: '/roi-calculator', label: 'ROI 계산기' }
            ]
        },
        {
            title: '정보',
            links: [
                { path: '/case-studies', label: '고객 사례' },
                { path: '/compare', label: '경쟁사 비교' },
                { path: '/technology', label: '기술 정보' },
                { path: '/sitemap', label: '사이트맵' }
            ]
        }
    ];

    return (
        <footer className="site-footer">
            <div className="footer-container">
                {/* Logo & Description */}
                <div className="footer-brand">
                    <div className="footer-logo" onClick={() => navigate('/')}>
                        <span className="logo-icon">🌱</span>
                        <span className="logo-text">PROMM EDU</span>
                    </div>
                    <p className="brand-desc">
                        AI 프롬프트 엔지니어링 교육 플랫폼<br />
                        기업의 AI 생산성을 혁신합니다
                    </p>
                    <div className="footer-cta">
                        <button onClick={() => navigate('/free-trial')} className="btn-footer-primary">
                            🎁 무료 체험
                        </button>
                    </div>
                </div>



                {/* Link Columns */}
                <div className="footer-links">
                    {footerLinks.map((column, idx) => (
                        <div key={idx} className="link-column">
                            <h4>{column.title}</h4>
                            <ul>
                                {column.links.map((link, linkIdx) => (
                                    <li key={linkIdx}>
                                        <a onClick={() => navigate(link.path)}>
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="footer-bottom">
                <div className="bottom-container">
                    <p className="copyright">
                        © 2026 PROMM EDU. All rights reserved.
                    </p>
                    <div className="bottom-links">
                        <a href="#">개인정보처리방침</a>
                        <a href="#">이용약관</a>
                        <a href="#">문의하기</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
