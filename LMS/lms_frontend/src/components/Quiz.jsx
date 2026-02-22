import { useState } from 'react';
import './Quiz.css';

function Quiz({ questions, onComplete }) {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(0);

    const handleAnswer = (optionIndex) => {
        setSelectedAnswers({
            ...selectedAnswers,
            [currentQuestion]: optionIndex
        });
    };

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            // Calculate score
            let correct = 0;
            questions.forEach((q, idx) => {
                if (selectedAnswers[idx] === q.correct) {
                    correct++;
                }
            });
            setScore(correct);
            setShowResults(true);
            if (onComplete) {
                onComplete({ score: correct, total: questions.length });
            }
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const handleRetry = () => {
        setCurrentQuestion(0);
        setSelectedAnswers({});
        setShowResults(false);
        setScore(0);
    };

    if (showResults) {
        const percentage = Math.round((score / questions.length) * 100);
        const passed = percentage >= 70;

        return (
            <div className="quiz-results">
                <div className={`result-banner ${passed ? 'passed' : 'failed'}`}>
                    <div className="result-icon">
                        {passed ? '🎉' : '📚'}
                    </div>
                    <h2>{passed ? '합격!' : '재도전!'}</h2>
                    <div className="score-display">
                        <span className="score">{score}</span>
                        <span className="divider">/</span>
                        <span className="total">{questions.length}</span>
                    </div>
                    <div className="percentage">{percentage}%</div>
                </div>

                <div className="result-details">
                    {questions.map((q, idx) => {
                        const userAnswer = selectedAnswers[idx];
                        const isCorrect = userAnswer === q.correct;
                        return (
                            <div key={idx} className={`review-item ${isCorrect ? 'correct' : 'incorrect'}`}>
                                <div className="review-header">
                                    <span className="review-icon">{isCorrect ? '✓' : '✗'}</span>
                                    <span className="review-question">Q{idx + 1}. {q.question}</span>
                                </div>
                                {!isCorrect && (
                                    <div className="review-answer">
                                        <span className="label">정답:</span>
                                        <span className="answer">{q.options[q.correct]}</span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="result-actions">
                    <button className="btn-retry" onClick={handleRetry}>
                        🔄 다시 도전하기
                    </button>
                    {passed && (
                        <button className="btn-continue" onClick={() => onComplete?.({ passed: true })}>
                            ✅ 다음 단계로
                        </button>
                    )}
                </div>
            </div>
        );
    }

    const question = questions[currentQuestion];
    const selectedAnswer = selectedAnswers[currentQuestion];

    return (
        <div className="quiz-container">
            <div className="quiz-header">
                <div className="progress-info">
                    <span className="question-number">문제 {currentQuestion + 1} / {questions.length}</span>
                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                        />
                    </div>
                </div>
            </div>

            <div className="quiz-body">
                <h3 className="question-text">{question.question}</h3>

                <div className="options-list">
                    {question.options.map((option, idx) => (
                        <div
                            key={idx}
                            className={`option-item ${selectedAnswer === idx ? 'selected' : ''}`}
                            onClick={() => handleAnswer(idx)}
                        >
                            <div className="option-radio">
                                {selectedAnswer === idx && <div className="radio-dot" />}
                            </div>
                            <span className="option-text">{option}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="quiz-footer">
                <button
                    className="btn-nav"
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                >
                    ← 이전
                </button>
                <button
                    className="btn-nav primary"
                    onClick={handleNext}
                    disabled={selectedAnswer === undefined}
                >
                    {currentQuestion === questions.length - 1 ? '제출하기' : '다음 →'}
                </button>
            </div>
        </div>
    );
}

export default Quiz;
