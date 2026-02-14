import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import detailedCurriculum from '../data/curriculumContent';
import MarkdownRenderer from '../components/MarkdownRenderer';
import PromptEditor from '../components/PromptEditor';
import Quiz from '../components/Quiz';
import AudioPlayer from '../components/AudioPlayer';
import './CorporateEducationPage.css';

const STORAGE_KEY = 'promm-edu-lms-progress';

function CorporateEducationPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [activeModule, setActiveModule] = useState(0);
    const [activeLesson, setActiveLesson] = useState(0);
    const [viewMode, setViewMode] = useState('content');
    const [completedLessons, setCompletedLessons] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? new Set(JSON.parse(saved)) : new Set();
        } catch { return new Set(); }
    });
    const [quizScores, setQuizScores] = useState({});
    const [showCertificate, setShowCertificate] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isAICurriculum, setIsAICurriculum] = useState(false);

    // Load curriculum: AI-generated from localStorage or static fallback
    const [curriculum, setCurriculum] = useState(() => {
        try {
            const aiData = localStorage.getItem('promm-edu-ai-curriculum');
            if (aiData) {
                const parsed = JSON.parse(aiData);
                if (parsed.curriculum && parsed.curriculum.length > 0) {
                    return parsed.curriculum;
                }
            }
        } catch { /* ignore */ }
        return detailedCurriculum;
    });

    useEffect(() => {
        try {
            const aiData = localStorage.getItem('promm-edu-ai-curriculum');
            if (aiData) {
                const parsed = JSON.parse(aiData);
                if (parsed.curriculum && parsed.curriculum.length > 0) {
                    setIsAICurriculum(true);
                }
            }
        } catch { /* ignore */ }
    }, []);

    const handleResetCurriculum = () => {
        if (window.confirm('AI 맞춤 커리큘럼을 초기화하고 기본 커리큘럼으로 돌아갑니까?')) {
            localStorage.removeItem('promm-edu-ai-curriculum');
            localStorage.removeItem(STORAGE_KEY);
            setCurriculum(detailedCurriculum);
            setIsAICurriculum(false);
            setActiveModule(0);
            setActiveLesson(0);
            setCompletedLessons(new Set());
        }
    };

    const currentModule = curriculum[activeModule];
    const currentLesson = currentModule?.lessons?.[activeLesson];

    // Save progress to localStorage
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify([...completedLessons]));
        } catch { /* ignore */ }
    }, [completedLessons]);

    // ESC key to close modal
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && showCertificate) {
                setShowCertificate(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [showCertificate]);

    // Calculate overall progress
    const totalLessons = curriculum.reduce((acc, m) => acc + m.lessons.length, 0);
    const progress = Math.round((completedLessons.size / totalLessons) * 100);

    const handleLessonComplete = () => {
        const lessonId = currentLesson.id;
        if (!completedLessons.has(lessonId)) {
            const newCompleted = new Set(completedLessons);
            newCompleted.add(lessonId);
            setCompletedLessons(newCompleted);

            if (newCompleted.size === totalLessons) {
                setTimeout(() => setShowCertificate(true), 1000);
            }
        }
    };

    const handleCompleteAll = () => {
        const allLessonIds = new Set();
        curriculum.forEach(module => {
            module.lessons.forEach(lesson => {
                allLessonIds.add(lesson.id);
            });
        });
        setCompletedLessons(allLessonIds);
        setTimeout(() => setShowCertificate(true), 500);
    };

    const handleQuizComplete = (result) => {
        setQuizScores({
            ...quizScores,
            [currentLesson.id]: result
        });

        if (result.passed !== false) {
            handleLessonComplete();
            setTimeout(() => {
                if (activeLesson < currentModule.lessons.length - 1) {
                    setActiveLesson(activeLesson + 1);
                    setViewMode('content');
                } else if (activeModule < curriculum.length - 1) {
                    setActiveModule(activeModule + 1);
                    setActiveLesson(0);
                    setViewMode('content');
                }
            }, 2000);
        }
    };

    const handleModuleClick = (moduleIndex) => {
        setActiveModule(moduleIndex);
        setActiveLesson(0);
        setViewMode('content');
        setSidebarOpen(false);
    };

    const handleLessonClick = (lessonIndex) => {
        setActiveLesson(lessonIndex);
        setViewMode('content');
        setSidebarOpen(false);
    };

    // Navigate to next/previous lesson
    const goToNextLesson = useCallback(() => {
        if (activeLesson < currentModule.lessons.length - 1) {
            setActiveLesson(activeLesson + 1);
        } else if (activeModule < curriculum.length - 1) {
            setActiveModule(activeModule + 1);
            setActiveLesson(0);
        }
        setViewMode('content');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [activeLesson, activeModule, currentModule, curriculum]);

    const goToPrevLesson = useCallback(() => {
        if (activeLesson > 0) {
            setActiveLesson(activeLesson - 1);
        } else if (activeModule > 0) {
            const prevModule = curriculum[activeModule - 1];
            setActiveModule(activeModule - 1);
            setActiveLesson(prevModule.lessons.length - 1);
        }
        setViewMode('content');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [activeLesson, activeModule, curriculum]);

    const isFirstLesson = activeModule === 0 && activeLesson === 0;
    const isLastLesson = activeModule === curriculum.length - 1 &&
        activeLesson === currentModule.lessons.length - 1;

    // Get flat lesson index for display
    const getFlatLessonIndex = () => {
        let idx = 0;
        for (let m = 0; m < activeModule; m++) {
            idx += curriculum[m].lessons.length;
        }
        return idx + activeLesson + 1;
    };

    return (
        <div className="corp-edu-page">
            <header className="edu-header">
                <div className="header-content">
                    <button
                        className="mobile-menu-btn"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        aria-label="메뉴 열기"
                    >
                        ☰
                    </button>
                    <div className="header-text">
                        <h1>🎓 기업 맞춤형 AI 교육 센터</h1>
                        <p>Enterprise AI Training Program</p>
                        {isAICurriculum && (
                            <div className="ai-badge-row">
                                <span className="ai-badge">🤖 AI 맞춤 커리큘럼</span>
                                <button className="btn-reset-curriculum" onClick={handleResetCurriculum}>↺ 초기화</button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="header-meta">
                    <span className="lesson-counter">{getFlatLessonIndex()} / {totalLessons}</span>
                    <button className="btn-outline" onClick={() => navigate('/')}>로그아웃</button>
                </div>
            </header>

            <div className="edu-container">
                {/* Mobile overlay */}
                {sidebarOpen && (
                    <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
                )}

                <aside className={`edu-sidebar ${sidebarOpen ? 'open' : ''}`}>
                    <div className="progress-card">
                        <h3>학습 진도율</h3>
                        <div className="progress-circle" style={{
                            background: `conic-gradient(#4facfe ${progress * 3.6}deg, #e2e8f0 0)`
                        }}>
                            <div className="inner-circle">
                                <span className="percent">{progress}%</span>
                            </div>
                        </div>
                        <p className="completion-text">
                            {completedLessons.size} / {totalLessons} 레슨 완료
                        </p>
                        {progress === 100 && (
                            <button className="btn-certificate" onClick={() => setShowCertificate(true)}>
                                🏅 수료증 보기
                            </button>
                        )}
                        {progress < 100 && (
                            <button className="btn-complete-all" onClick={handleCompleteAll}>
                                ✅ 전체 완료
                            </button>
                        )}
                    </div>

                    <nav className="module-nav">
                        <h3>커리큘럼</h3>
                        {curriculum.map((module, mIdx) => {
                            const moduleLessons = module.lessons || [];
                            const completedInModule = moduleLessons.filter(l =>
                                completedLessons.has(l.id)
                            ).length;
                            const isDone = completedInModule === moduleLessons.length;

                            return (
                                <div key={module.id} className="module-section">
                                    <div
                                        className={`nav-item module ${mIdx === activeModule ? 'active' : ''} ${isDone ? 'done' : ''}`}
                                        onClick={() => handleModuleClick(mIdx)}
                                    >
                                        <span className="nav-num">
                                            {isDone ? '✅' : String(mIdx + 1).padStart(2, '0')}
                                        </span>
                                        <div className="nav-text">
                                            <span className="nav-title">{module.title}</span>
                                            <span className="lesson-count">
                                                {completedInModule}/{moduleLessons.length} 완료
                                            </span>
                                        </div>
                                    </div>

                                    {mIdx === activeModule && moduleLessons.map((lesson, lIdx) => (
                                        <div
                                            key={lesson.id}
                                            className={`nav-item lesson ${lIdx === activeLesson ? 'active' : ''} ${completedLessons.has(lesson.id) ? 'done' : ''}`}
                                            onClick={() => handleLessonClick(lIdx)}
                                        >
                                            <span className="lesson-icon">
                                                {completedLessons.has(lesson.id) ? '✓' : '○'}
                                            </span>
                                            <span className="lesson-title">{lesson.title}</span>
                                        </div>
                                    ))}
                                </div>
                            );
                        })}
                    </nav>
                </aside>

                <main className="edu-content">
                    <div className="content-header">
                        <div className="breadcrumb">
                            <span>Module {activeModule + 1}</span>
                            <span className="separator">›</span>
                            <span>Lesson {activeLesson + 1}</span>
                            {completedLessons.has(currentLesson.id) && (
                                <span className="breadcrumb-badge done">✓ 완료</span>
                            )}
                        </div>
                        <h2>{currentLesson.title}</h2>

                        <div className="view-tabs">
                            <button
                                className={`tab ${viewMode === 'content' ? 'active' : ''}`}
                                onClick={() => setViewMode('content')}
                            >
                                📖 이론
                            </button>
                            {currentLesson.quiz && (
                                <button
                                    className={`tab ${viewMode === 'quiz' ? 'active' : ''}`}
                                    onClick={() => setViewMode('quiz')}
                                >
                                    ✏️ 퀴즈
                                    {quizScores[currentLesson.id] && (
                                        <span className="tab-badge">
                                            {quizScores[currentLesson.id].score}/{quizScores[currentLesson.id].total}
                                        </span>
                                    )}
                                </button>
                            )}
                            {currentLesson.practice && (
                                <button
                                    className={`tab ${viewMode === 'practice' ? 'active' : ''}`}
                                    onClick={() => setViewMode('practice')}
                                >
                                    💻 실습
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="lesson-body">
                        {viewMode === 'content' && (
                            <div className="theory-content">
                                <AudioPlayer
                                    lessonId={currentLesson.id}
                                    lessonTitle={currentLesson.title}
                                    theoryText={currentLesson.content.theory}
                                />
                                <MarkdownRenderer content={currentLesson.content.theory} />

                                {currentLesson.content.example && (
                                    <div className="example-box">
                                        <h4>💡 실전 예시</h4>
                                        <div className="example-prompt">
                                            <strong>Prompt:</strong>
                                            <pre>{currentLesson.content.example.prompt}</pre>
                                        </div>
                                        <div className="example-explanation">
                                            <strong>설명:</strong>
                                            <p>{currentLesson.content.example.explanation}</p>
                                        </div>
                                        {currentLesson.content.example.expectedOutput && (
                                            <div className="example-output">
                                                <strong>예상 결과:</strong>
                                                <pre>{currentLesson.content.example.expectedOutput}</pre>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* References Section */}
                                {currentLesson.references && currentLesson.references.length > 0 && (
                                    <div className="references-section">
                                        <h4>📚 참조 논문 및 자료</h4>
                                        <div className="references-list">
                                            {currentLesson.references.map((ref, idx) => (
                                                <div key={idx} className="reference-card">
                                                    <div className="ref-title">{ref.title}</div>
                                                    <div className="ref-meta">
                                                        {ref.authors} ({ref.year}) — {ref.venue}
                                                    </div>
                                                    <div className="ref-finding">
                                                        💡 {ref.keyFinding}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="lesson-actions">
                                    {currentLesson.quiz && (
                                        <button className="btn-primary" onClick={() => setViewMode('quiz')}>
                                            퀴즈 풀기 →
                                        </button>
                                    )}
                                    {currentLesson.practice && (
                                        <button className="btn-secondary" onClick={() => setViewMode('practice')}>
                                            실습하기
                                        </button>
                                    )}
                                    {!completedLessons.has(currentLesson.id) && (
                                        <button className="btn-complete" onClick={handleLessonComplete}>
                                            ✓ 완료 표시
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        {viewMode === 'quiz' && currentLesson.quiz && (
                            <Quiz
                                questions={currentLesson.quiz}
                                onComplete={handleQuizComplete}
                            />
                        )}

                        {viewMode === 'practice' && currentLesson.practice && (
                            <div className="practice-content">
                                <div className="practice-instruction">
                                    <h4>📝 실습 과제</h4>
                                    <p>{currentLesson.practice.instruction}</p>
                                </div>

                                {currentLesson.practice.hints && (
                                    <div className="hints-box">
                                        <h5>💡 힌트</h5>
                                        <ul>
                                            {currentLesson.practice.hints.map((hint, idx) => (
                                                <li key={idx}>{hint}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <PromptEditor
                                    initialPrompt={currentLesson.practice.initialPrompt}
                                    onExecute={(result) => {
                                        console.log('Practice result:', result);
                                        handleLessonComplete();
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    {/* Lesson Navigation */}
                    <div className="lesson-nav-bar">
                        <button
                            className="lesson-nav-btn prev"
                            onClick={goToPrevLesson}
                            disabled={isFirstLesson}
                        >
                            <span className="nav-arrow">←</span>
                            <span className="nav-label">이전 레슨</span>
                        </button>
                        <button
                            className="lesson-nav-btn next"
                            onClick={goToNextLesson}
                            disabled={isLastLesson}
                        >
                            <span className="nav-label">다음 레슨</span>
                            <span className="nav-arrow">→</span>
                        </button>
                    </div>
                </main>
            </div>

            {/* Certificate Modal */}
            {showCertificate && (
                <div className="modal-overlay" onClick={() => setShowCertificate(false)}>
                    <div className="certificate-paper" onClick={e => e.stopPropagation()}>
                        <button
                            className="modal-close-btn"
                            onClick={() => setShowCertificate(false)}
                            aria-label="닫기"
                        >
                            ✕
                        </button>
                        <div className="cert-border">
                            <h1>CERTIFICATE OF COMPLETION</h1>
                            <p className="cert-text">이 수료증은 귀하가 아래 교육 과정을 성실히 이수하였음을 증명합니다.</p>

                            <h2 className="cert-course">Enterprise AI Training Program</h2>

                            <div className="cert-recipient">
                                <p>성명: <strong>홍길동 (연구개발팀)</strong></p>
                                <p>날짜: {new Date().toLocaleDateString()}</p>
                                <p>전체 진도율: <strong>{progress}%</strong></p>
                            </div>

                            <div className="cert-seal">
                                <img src="/assets/promm-logo.png" alt="Seal" />
                                <span>PROMM EDU</span>
                            </div>

                            <button className="btn-print" onClick={() => window.print()}>🖨 인쇄하기</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CorporateEducationPage;
