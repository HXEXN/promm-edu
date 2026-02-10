import { useNavigate } from 'react-router-dom';
import './SitemapPage.css';

function SitemapPage() {
    const navigate = useNavigate();

    const siteStructure = [
        {
            category: '📚 학습',
            description: 'AI 프롬프트 엔지니어링 학습',
            color: '#4facfe',
            pages: [
                { path: '/why-learn', title: '학습 가이드', desc: '왜 프롬프트 엔지니어링을 배워야 하는가' },
                { path: '/student/assessment', title: '실력 테스트', desc: '현재 프롬프트 작성 능력 진단' },
                { path: '/student/recommendation', title: 'AI 학습 추천', desc: '맞춤형 학습 경로 추천' }
            ]
        },
        {
            category: '🛠️ 도구',
            description: 'AI 프롬프트 최적화 도구',
            color: '#00f2fe',
            pages: [
                { path: '/prompt-generator', title: '프롬프트 생성기', desc: '효과적인 프롬프트 자동 생성' },
                { path: '/advanced', title: '고급 최적화', desc: '토큰 압축 및 비용 최적화' },
                { path: '/ai-engines', title: 'AI 엔진 데모', desc: '9개 AI 엔진 실시간 테스트' },
                { path: '/dashboard', title: '대시보드', desc: '학습 현황 및 통계' }
            ]
        },
        {
            category: '💼 비즈니스',
            description: '기업용 솔루션 및 ROI',
            color: '#a855f7',
            pages: [
                { path: '/enterprise/process', title: '도입 프로세스', desc: '기업 도입 4단계 프로세스' },
                { path: '/enterprise/education', title: '기업 교육', desc: '맞춤형 기업 교육 프로그램' },
                { path: '/enterprise/report', title: '분석 리포트', desc: 'AI 비용 분석 및 최적화 보고서' },
                { path: '/roi-calculator', title: 'ROI 계산기', desc: '투자 대비 절감액 시뮬레이션' }
            ]
        },
        {
            category: '📊 정보',
            description: '플랫폼 정보 및 비교',
            color: '#f97316',
            pages: [
                { path: '/case-studies', title: '고객 사례', desc: '실제 도입 기업 성공 스토리' },
                { path: '/compare', title: '경쟁사 비교', desc: 'PROMM vs 시냅스AI vs 경쟁사' },
                { path: '/technology', title: '기술 정보', desc: '2026 최신 AI 기술 스택' },
                { path: '/sitemap', title: '사이트맵', desc: '전체 페이지 구조' }
            ]
        },
        {
            category: '🎁 시작하기',
            description: '무료 체험 및 가입',
            color: '#22c55e',
            pages: [
                { path: '/free-trial', title: '무료 체험', desc: '10 크레딧 무료 체험 시작' }
            ]
        }
    ];

    const totalPages = siteStructure.reduce((sum, cat) => sum + cat.pages.length, 0);

    return (
        <div className="sitemap-page">
            <header className="sitemap-header">
                <h1>🗺️ 사이트맵</h1>
                <p className="header-subtitle">
                    PROMM EDU의 모든 페이지를 한눈에 확인하세요
                </p>
                <div className="stats-bar">
                    <span className="stat">{siteStructure.length}개 카테고리</span>
                    <span className="divider">•</span>
                    <span className="stat">{totalPages}개 페이지</span>
                </div>
            </header>

            <div className="sitemap-container">
                {/* Visual Tree */}
                <div className="sitemap-tree">
                    <div className="tree-root">
                        <span className="root-icon">🏠</span>
                        <span className="root-label">PROMM EDU</span>
                    </div>

                    <div className="tree-branches">
                        {siteStructure.map((category, catIdx) => (
                            <div key={catIdx} className="tree-branch">
                                <div
                                    className="branch-header"
                                    style={{ borderLeftColor: category.color }}
                                >
                                    <h2>{category.category}</h2>
                                    <p>{category.description}</p>
                                </div>

                                <div className="branch-pages">
                                    {category.pages.map((page, pageIdx) => (
                                        <div
                                            key={pageIdx}
                                            className="page-card"
                                            onClick={() => navigate(page.path)}
                                            style={{ '--accent-color': category.color }}
                                        >
                                            <div className="page-info">
                                                <h3>{page.title}</h3>
                                                <p>{page.desc}</p>
                                                <span className="page-path">{page.path}</span>
                                            </div>
                                            <span className="page-arrow">→</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Links */}
                <div className="quick-links">
                    <h2>⚡ 빠른 링크</h2>
                    <div className="quick-grid">
                        <button onClick={() => navigate('/free-trial')} className="quick-btn primary">
                            🎁 무료 체험 시작
                        </button>
                        <button onClick={() => navigate('/roi-calculator')} className="quick-btn">
                            💰 ROI 계산하기
                        </button>
                        <button onClick={() => navigate('/ai-engines')} className="quick-btn">
                            🤖 AI 엔진 테스트
                        </button>
                        <button onClick={() => navigate('/compare')} className="quick-btn">
                            🏆 경쟁사 비교
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SitemapPage;
