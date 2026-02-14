import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isActive = (path) => location.pathname === path;
    const isInCategory = (paths) => paths.some(p => location.pathname.startsWith(p));

    const navItems = [
        { type: 'link', path: '/', label: '홈', icon: '🏠' },
        {
            type: 'dropdown',
            label: '📚 학습',
            id: 'learn',
            paths: ['/why-learn', '/student'],
            items: [
                { path: '/why-learn', label: '학습 가이드', desc: '왜 배워야 하는가' },
                { path: '/student/assessment', label: '실력 테스트', desc: '현재 수준 진단' },
                { path: '/student/recommendation', label: 'AI 추천', desc: '맞춤형 학습 경로' }
            ]
        },
        {
            type: 'dropdown',
            label: '🛠️ 도구',
            id: 'tools',
            paths: ['/prompt-generator', '/advanced', '/token-lab', '/ai-engines', '/dashboard'],
            items: [
                { path: '/prompt-generator', label: '프롬프트 생성기', desc: '효과적인 프롬프트 작성' },
                { path: '/advanced', label: '고급 최적화', desc: '토큰 압축 & 비용 절감' },
                { path: '/token-lab', label: '🧪 토큰 최적화 Lab', desc: '토큰 비용 분석 도구' },
                { path: '/ai-engines', label: 'AI 엔진 데모', desc: '9개 AI 모델 테스트' },
                { path: '/dashboard', label: '대시보드', desc: '학습 현황 확인' }
            ]
        },
        {
            type: 'dropdown',
            label: '💼 비즈니스',
            id: 'business',
            paths: ['/enterprise', '/roi-calculator'],
            items: [
                { path: '/enterprise/process', label: '도입 프로세스', desc: '기업 도입 4단계' },
                { path: '/enterprise/education', label: '기업 교육', desc: '맞춤형 교육 프로그램' },
                { path: '/roi-calculator', label: 'ROI 계산기', desc: '비용 절감 시뮬레이션' }
            ]
        },
        {
            type: 'dropdown',
            label: '📊 정보',
            id: 'info',
            paths: ['/case-studies', '/compare', '/technology', '/sitemap'],
            items: [
                { path: '/case-studies', label: '고객 사례', desc: '성공 스토리' },
                { path: '/compare', label: '경쟁사 비교', desc: 'PROMM vs 경쟁사' },
                { path: '/technology', label: '기술 정보', desc: '2026 최신 AI 스택' },
                { path: '/sitemap', label: '사이트맵', desc: '전체 페이지 구조' }
            ]
        }
    ];

    const handleDropdownEnter = (id) => setActiveDropdown(id);
    const handleDropdownLeave = () => setActiveDropdown(null);

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="navbar-container">
                <div className="navbar-logo" onClick={() => navigate('/')}>
                    <span className="logo-icon">🌱</span>
                    <span className="logo-text">PROMM EDU</span>
                </div>

                <div className={`navbar-menu ${mobileMenuOpen ? 'open' : ''}`}>
                    {navItems.map((item, idx) => (
                        item.type === 'link' ? (
                            <a
                                key={idx}
                                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                                onClick={() => {
                                    navigate(item.path);
                                    setMobileMenuOpen(false);
                                }}
                            >
                                <span className="link-icon">{item.icon}</span>
                                <span className="link-text">{item.label}</span>
                            </a>
                        ) : (
                            <div
                                key={idx}
                                className={`nav-dropdown ${isInCategory(item.paths) ? 'active' : ''}`}
                                onMouseEnter={() => handleDropdownEnter(item.id)}
                                onMouseLeave={handleDropdownLeave}
                            >
                                <span className="dropdown-trigger">
                                    {item.label}
                                    <span className="dropdown-arrow">▾</span>
                                </span>
                                {activeDropdown === item.id && (
                                    <div className="dropdown-menu">
                                        {item.items.map((subItem, subIdx) => (
                                            <a
                                                key={subIdx}
                                                className={`dropdown-item ${isActive(subItem.path) ? 'active' : ''}`}
                                                onClick={() => {
                                                    navigate(subItem.path);
                                                    setActiveDropdown(null);
                                                    setMobileMenuOpen(false);
                                                }}
                                            >
                                                <span className="item-label">{subItem.label}</span>
                                                <span className="item-desc">{subItem.desc}</span>
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )
                    ))}
                </div>

                <div className="navbar-actions">
                    <button className="btn-nav-secondary" onClick={() => navigate('/roi-calculator')}>
                        💰 ROI 계산
                    </button>
                    <button className="btn-nav-primary" onClick={() => navigate('/free-trial')}>
                        🎁 무료 체험
                    </button>
                </div>

                <button
                    className={`mobile-menu-toggle ${mobileMenuOpen ? 'open' : ''}`}
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
        </nav>
    );
}

export default Navbar;
