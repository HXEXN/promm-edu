import { createContext, useContext, useState, useEffect } from 'react';

const LessonContext = createContext({
    currentLesson: 1,
    lessonContent: null,
    userProgress: { completed: 0, total: 5 },
    setCurrentLesson: () => { },
    submitAnswer: async () => { },
    loadLesson: async () => { }
});

export const useLesson = () => useContext(LessonContext);

export function LessonProvider({ children }) {
    const [currentLesson, setCurrentLesson] = useState(1);
    const [lessonContent, setLessonContent] = useState(null);
    const [userProgress, setUserProgress] = useState({ completed: 0, total: 5 });
    const [loading, setLoading] = useState(false);

    // Load user progress on mount
    useEffect(() => {
        loadProgress();
    }, []);

    // Load lesson content when current lesson changes
    useEffect(() => {
        if (currentLesson) {
            loadLesson(currentLesson);
        }
    }, [currentLesson]);

    const loadProgress = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/user/1/progress');
            const data = await response.json();
            if (data.success) {
                const progress = JSON.parse(data.user.progress);
                setUserProgress(progress);
            }
        } catch (error) {
            console.error('Failed to load progress:', error);
        }
    };

    const loadLesson = async (lessonId) => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:3000/api/lessons/${lessonId}`);
            const data = await response.json();
            if (data.success) {
                setLessonContent(data.lesson);
            }
        } catch (error) {
            console.error('Failed to load lesson:', error);
        } finally {
            setLoading(false);
        }
    };

    const submitAnswer = async (role, context, action, tokenCount, command) => {
        try {
            const response = await fetch(`http://localhost:3000/api/lessons/${currentLesson}/validate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role, context, action, tokenCount, command })
            });

            const data = await response.json();

            if (data.success && data.passed) {
                // Update progress
                await fetch(`http://localhost:3000/api/user/1/complete-lesson`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ lessonId: currentLesson })
                });

                // Reload progress
                await loadProgress();
            }

            return data;
        } catch (error) {
            console.error('Failed to submit answer:', error);
            return { success: false, passed: false, feedback: '오류가 발생했습니다.' };
        }
    };

    const value = {
        currentLesson,
        lessonContent,
        userProgress,
        loading,
        setCurrentLesson,
        submitAnswer,
        loadLesson
    };

    return (
        <LessonContext.Provider value={value}>
            {children}
        </LessonContext.Provider>
    );
}

export default LessonContext;
