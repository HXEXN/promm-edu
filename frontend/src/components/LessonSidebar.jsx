import { useState, useEffect } from 'react';
import { useLesson } from '../contexts/LessonContext';
import { getLevelInfo } from '../services/gamification';
import './LessonSidebar.css';

function LessonSidebar() {
    const [lessons, setLessons] = useState([]);
    const { currentLesson, setCurrentLesson, userProgress } = useLesson();
    const [userLevel, setUserLevel] = useState(getLevelInfo(0));

    useEffect(() => {
        // Fetch lessons from API
        fetch('http://localhost:3000/api/lessons')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setLessons(data.lessons);
                }
            })
            .catch(err => console.error('Failed to fetch lessons:', err));
    }, []);

    useEffect(() => {
        // Calculate Level based on completed lessons (simulate XP)
        // In a real app, fetch total XP from backend
        // For demo: 1 completed lesson = 100 XP
        const simulatedXp = userProgress.completed * 100;
        setUserLevel(getLevelInfo(simulatedXp));
    }, [userProgress.completed]);

    const difficultyColors = {
        beginner: 'hsl(142, 71%, 45%)',
        intermediate: 'hsl(45, 100%, 51%)',
        advanced: 'hsl(0, 84%, 60%)'
    };

    const difficultyLabels = {
        beginner: '초급',
        intermediate: '중급',
        advanced: '고급'
    };

    const isLessonUnlocked = (lessonId) => {
        // First lesson is always unlocked
        if (lessonId === 1) return true;
        // Other lessons unlock when previous lesson is completed
        return userProgress.completed >= lessonId - 1;
    };

    const isLessonCompleted = (lessonId) => {
        return userProgress.completed >= lessonId;
    };

    const handleLessonClick = (lesson) => {
        if (isLessonUnlocked(lesson.id)) {
            setCurrentLesson(lesson.id);
        }
    };

    return (
        <div className="lesson-sidebar card">
            {/* Gamification Profile Header */}
            <div className="user-profile-section">
                <div className="level-badge">Lv.{userLevel.level}</div>
                <div className="user-info">
                    <div className="user-title">{userLevel.title}</div>
                    <div className="xp-bar-container">
                        <div className="xp-fill" style={{ width: `${userLevel.progress}%` }}></div>
                    </div>
                    <div className="xp-text">Next Level: {userLevel.nextLevelXp === 'MAX' ? 'MAX' : `${userLevel.currentXp}/${userLevel.nextLevelXp} XP`}</div>
                </div>
            </div>

            <div className="sidebar-header">
                <div className="header-top-row">
                    <h2>📚 학습 과정</h2>
                    <a href="/why-learn" className="link-why-learn" title="왜 배워야 할까요?">🤔</a>
                </div>
                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{ width: `${(userProgress.completed / userProgress.total) * 100}%` }}
                    ></div>
                </div>
                <p className="progress-text">
                    {userProgress.completed} / {userProgress.total} 완료
                </p>
            </div>

            <div className="lessons-list">
                {lessons.map((lesson) => {
                    const unlocked = isLessonUnlocked(lesson.id);
                    const completed = isLessonCompleted(lesson.id);

                    return (
                        <div
                            key={lesson.id}
                            className={`lesson-item ${currentLesson === lesson.id ? 'active' : ''} ${!unlocked ? 'locked' : ''} ${completed ? 'completed' : ''}`}
                            onClick={() => handleLessonClick(lesson)}
                            style={{ cursor: unlocked ? 'pointer' : 'not-allowed' }}
                        >
                            <div className="lesson-number">{lesson.order_index}</div>
                            <div className="lesson-content">
                                <h3>
                                    {lesson.title}
                                    {completed && <span className="status-icon">✅</span>}
                                    {!unlocked && <span className="status-icon">🔒</span>}
                                </h3>
                                <p>{lesson.content}</p>
                                <span
                                    className="difficulty-badge"
                                    style={{ backgroundColor: difficultyColors[lesson.difficulty] }}
                                >
                                    {difficultyLabels[lesson.difficulty]}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default LessonSidebar;
