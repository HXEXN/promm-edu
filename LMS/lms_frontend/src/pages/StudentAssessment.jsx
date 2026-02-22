import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './StudentAssessment.css';

function StudentAssessment() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        grade: '',
        experience: '',
        interests: [],
        learningStyle: '',
        goals: ''
    });

    const handleInputChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleInterestToggle = (interest) => {
        const current = formData.interests;
        if (current.includes(interest)) {
            setFormData({ ...formData, interests: current.filter(i => i !== interest) });
        } else {
            setFormData({ ...formData, interests: [...current, interest] });
        }
    };

    const handleSubmit = () => {
        // Navigate to recommendation page with results
        navigate('/student/recommendation', { state: { assessment: formData } });
    };

    const canProceed = () => {
        switch (step) {
            case 1: return formData.grade !== '';
            case 2: return formData.experience !== '';
            case 3: return formData.interests.length > 0;
            case 4: return formData.learningStyle !== '';
            case 5: return formData.goals !== '';
            default: return false;
        }
    };

    return (
        <div className="student-assessment-page">
            <div className="assessment-container">
                <div className="assessment-header">
                    <h1>🎯 나에게 딱 맞는 AI 교육 찾기</h1>
                    <p>몇 가지 질문으로 맞춤형 학습 경로를 추천해드려요!</p>
                    <div className="progress-dots">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className={`dot ${i <= step ? 'active' : ''} ${i < step ? 'done' : ''}`} />
                        ))}
                    </div>
                </div>

                <div className="assessment-body">
                    {step === 1 && (
                        <div className="question-card fade-in">
                            <div className="question-icon">📚</div>
                            <h2>지금 몇 학년이에요?</h2>
                            <p className="question-subtitle">학년에 맞는 난이도로 준비할게요</p>
                            <div className="options-grid">
                                {[
                                    { value: 'preschool', label: '유치원생', emoji: '🧸' },
                                    { value: 'elementary', label: '초등학생', emoji: '🎒' },
                                    { value: 'middle', label: '중학생', emoji: '📖' },
                                    { value: 'high', label: '고등학생', emoji: '🎓' },
                                    { value: 'college', label: '대학생/성인', emoji: '💼' }
                                ].map(option => (
                                    <div
                                        key={option.value}
                                        className={`option-card ${formData.grade === option.value ? 'selected' : ''}`}
                                        onClick={() => handleInputChange('grade', option.value)}
                                    >
                                        <div className="option-emoji">{option.emoji}</div>
                                        <div className="option-label">{option.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="question-card fade-in">
                            <div className="question-icon">💻</div>
                            <h2>AI를 사용해본 적이 있나요?</h2>
                            <p className="question-subtitle">경험 수준에 맞춰 시작할게요</p>
                            <div className="options-list">
                                {[
                                    { value: 'none', label: '처음이에요', desc: 'AI가 뭔지 잘 모르겠어요' },
                                    { value: 'beginner', label: '조금 써봤어요', desc: 'ChatGPT 같은 걸 가끔 써봤어요' },
                                    { value: 'intermediate', label: '자주 사용해요', desc: '학교 과제나 공부할 때 써요' },
                                    { value: 'advanced', label: '능숙하게 사용해요', desc: '프롬프트를 잘 작성할 수 있어요' }
                                ].map(option => (
                                    <div
                                        key={option.value}
                                        className={`option-row ${formData.experience === option.value ? 'selected' : ''}`}
                                        onClick={() => handleInputChange('experience', option.value)}
                                    >
                                        <div className="radio-dot">
                                            {formData.experience === option.value && <div className="dot-fill" />}
                                        </div>
                                        <div className="option-content">
                                            <div className="option-title">{option.label}</div>
                                            <div className="option-desc">{option.desc}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="question-card fade-in">
                            <div className="question-icon">🎨</div>
                            <h2>어떤 분야에 관심이 있나요?</h2>
                            <p className="question-subtitle">여러 개 선택해도 좋아요!</p>
                            <div className="interests-grid">
                                {[
                                    { value: 'coding', label: '코딩/프로그래밍', emoji: '💻' },
                                    { value: 'art', label: '그림/디자인', emoji: '🎨' },
                                    { value: 'writing', label: '글쓰기', emoji: '✍️' },
                                    { value: 'science', label: '과학/실험', emoji: '🔬' },
                                    { value: 'language', label: '외국어', emoji: '🌍' },
                                    { value: 'game', label: '게임 만들기', emoji: '🎮' },
                                    { value: 'robot', label: '로봇/하드웨어', emoji: '🤖' },
                                    { value: 'other', label: '기타', emoji: '✨' }
                                ].map(interest => (
                                    <div
                                        key={interest.value}
                                        className={`interest-chip ${formData.interests.includes(interest.value) ? 'selected' : ''}`}
                                        onClick={() => handleInterestToggle(interest.value)}
                                    >
                                        <span className="chip-emoji">{interest.emoji}</span>
                                        <span className="chip-label">{interest.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="question-card fade-in">
                            <div className="question-icon">🎯</div>
                            <h2>어떤 방식으로 배우는 게 좋아요?</h2>
                            <p className="question-subtitle">나에게 맞는 학습 스타일을 찾아봐요</p>
                            <div className="options-list">
                                {[
                                    { value: 'visual', label: '눈으로 보면서', emoji: '👀', desc: '그림, 영상, 다이어그램이 좋아요' },
                                    { value: 'hands-on', label: '직접 해보면서', emoji: '✋', desc: '실습하고 만들면서 배우고 싶어요' },
                                    { value: 'reading', label: '읽으면서', emoji: '📖', desc: '자세한 설명을 읽고 이해하고 싶어요' },
                                    { value: 'game', label: '게임하듯이', emoji: '🎮', desc: '재미있게 미션을 풀면서 배우고 싶어요' }
                                ].map(option => (
                                    <div
                                        key={option.value}
                                        className={`learning-style-card ${formData.learningStyle === option.value ? 'selected' : ''}`}
                                        onClick={() => handleInputChange('learningStyle', option.value)}
                                    >
                                        <div className="style-emoji">{option.emoji}</div>
                                        <div className="style-content">
                                            <div className="style-title">{option.label}</div>
                                            <div className="style-desc">{option.desc}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 5 && (
                        <div className="question-card fade-in">
                            <div className="question-icon">🚀</div>
                            <h2>AI로 무엇을 하고 싶나요?</h2>
                            <p className="question-subtitle">목표를 정하면 더 빠르게 배울 수 있어요</p>
                            <div className="options-list">
                                {[
                                    { value: 'homework', label: '숙제 잘하기', desc: '과제나 공부에 도움받고 싶어요' },
                                    { value: 'creative', label: '창작하기', desc: '그림, 이야기, 게임 등을 만들고 싶어요' },
                                    { value: 'career', label: '진로 준비', desc: 'AI 관련 진로를 준비하고 싶어요' },
                                    { value: 'fun', label: '재미있게 놀기', desc: '그냥 신기하고 재미있어서요!' }
                                ].map(option => (
                                    <div
                                        key={option.value}
                                        className={`option-row ${formData.goals === option.value ? 'selected' : ''}`}
                                        onClick={() => handleInputChange('goals', option.value)}
                                    >
                                        <div className="radio-dot">
                                            {formData.goals === option.value && <div className="dot-fill" />}
                                        </div>
                                        <div className="option-content">
                                            <div className="option-title">{option.label}</div>
                                            <div className="option-desc">{option.desc}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="assessment-footer">
                    {step > 1 && (
                        <button className="btn-back" onClick={() => setStep(step - 1)}>
                            ← 이전
                        </button>
                    )}
                    {step < 5 ? (
                        <button
                            className="btn-next"
                            onClick={() => setStep(step + 1)}
                            disabled={!canProceed()}
                        >
                            다음 →
                        </button>
                    ) : (
                        <button
                            className="btn-submit"
                            onClick={handleSubmit}
                            disabled={!canProceed()}
                        >
                            ✨ 내 맞춤 커리큘럼 받기
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default StudentAssessment;
