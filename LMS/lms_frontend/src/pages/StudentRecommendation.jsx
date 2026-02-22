import { useLocation, useNavigate } from 'react-router-dom';
import './StudentRecommendation.css';

function StudentRecommendation() {
    const location = useLocation();
    const navigate = useNavigate();
    const assessment = location.state?.assessment || {};

    // Generate personalized curriculum based on assessment
    const getCurriculum = () => {
        const { grade, experience, interests, learningStyle, goals } = assessment;

        // Base curriculum structure
        const curriculums = {
            preschool: [
                { id: 1, title: 'AI 친구 만나기', difficulty: '⭐', duration: '1주', topics: ['AI가 뭐예요?', '목소리로 말하기', '재미있는 그림 보기'] },
                { id: 2, title: '색깔과 모양 놀이', difficulty: '⭐', duration: '1주', topics: ['색깔 찾기', '동물 알아보기', '간단한 질문하기'] },
                { id: 3, title: '우리 집 스마트 기기', difficulty: '⭐', duration: '1주', topics: ['불 켜기/끄기', '음악 틀기', '날씨 물어보기'] }
            ],
            elementary: [
                { id: 1, title: 'AI와 친해지기', difficulty: '🌟', duration: '1주', topics: ['AI가 뭔가요?', '일상 속 AI 찾기', '간단한 질문해보기'] },
                { id: 2, title: '스마트팜 탐험', difficulty: '🌟🌟', duration: '2주', topics: ['식물 키우기', '센서 이해하기', 'AI로 식물 돌보기'] },
                { id: 3, title: '나만의 AI 친구 만들기', difficulty: '🌟🌟🌟', duration: '2주', topics: ['대화 만들기', '그림 그리기', '이야기 짓기'] }
            ],
            middle: [
                { id: 1, title: 'AI 작동 원리', difficulty: '⭐⭐', duration: '2주', topics: ['머신러닝 기초', '프롬프트 구조', '실전 활용법'] },
                { id: 2, title: '창작 프로젝트', difficulty: '⭐⭐⭐', duration: '3주', topics: ['이미지 생성', '코드 작성', '게임 기획'] },
                { id: 3, title: '진로 탐색', difficulty: '⭐⭐⭐', duration: '2주', topics: ['AI 직업', '포트폴리오', '프로젝트 완성'] }
            ],
            high: [
                { id: 1, title: '프롬프트 엔지니어링', difficulty: '★★★', duration: '3주', topics: ['고급 패턴', 'API 활용', '자동화 시스템'] },
                { id: 2, title: '실전 프로젝트', difficulty: '★★★★', duration: '4주', topics: ['웹앱 개발', '데이터 분석', '비즈니스 모델'] },
                { id: 3, title: '포트폴리오 제작', difficulty: '★★★★', duration: '2주', topics: ['깃허브 관리', '프로젝트 문서화', '발표 준비'] }
            ],
            college: [
                { id: 1, title: 'Advanced Prompting', difficulty: '★★★★', duration: '3주', topics: ['Chain of Thought', 'Few-shot Learning', 'Fine-tuning'] },
                { id: 2, title: '산업 응용', difficulty: '★★★★★', duration: '4주', topics: ['업무 자동화', 'ROI 분석', '실무 프로젝트'] },
                { id: 3, title: '커리어 준비', difficulty: '★★★★', duration: '2주', topics: ['이력서 작성', '포트폴리오', '면접 준비'] }
            ]
        };

        return curriculums[grade] || curriculums.middle;
    };

    const curriculum = getCurriculum();

    const getRecommendedTools = () => {
        const { interests } = assessment;
        const toolMap = {
            coding: ['GitHub Copilot', 'ChatGPT Code Interpreter'],
            art: ['Midjourney', 'DALL-E 3', 'Stable Diffusion'],
            writing: ['ChatGPT', 'Claude', 'Jasper'],
            science: ['Claude', 'Perplexity'],
            language: ['ChatGPT', 'DeepL', 'Duolingo AI'],
            game: ['Unity ML', 'ChatGPT'],
            robot: ['Arduino IDE', 'ROS'],
            other: ['ChatGPT', 'Claude']
        };

        const tools = new Set();
        interests?.forEach(interest => {
            toolMap[interest]?.forEach(tool => tools.add(tool));
        });

        return Array.from(tools).slice(0, 4);
    };

    const handleStartLearning = () => {
        navigate('/dashboard', { state: { curriculum, assessment } });
    };

    return (
        <div className="student-recommendation-page">
            <div className="recommendation-container">
                <div className="result-header">
                    <div className="trophy-icon">🏆</div>
                    <h1>맞춤형 학습 계획이 준비되었어요!</h1>
                    <p>여러분의 수준과 흥미에 꼭 맞는 커리큘럼이에요</p>
                </div>

                {/* Profile Summary */}
                <div className="profile-summary">
                    <h2>나의 프로필</h2>
                    <div className="profile-tags">
                        <span className="tag grade">
                            {assessment.grade === 'preschool' && '유치원생'}
                            {assessment.grade === 'elementary' && '초등학생'}
                            {assessment.grade === 'middle' && '중학생'}
                            {assessment.grade === 'high' && '고등학생'}
                            {assessment.grade === 'college' && '대학생/성인'}
                        </span>
                        <span className="tag experience">
                            {assessment.experience === 'none' && 'AI 입문'}
                            {assessment.experience === 'beginner' && 'AI 초급'}
                            {assessment.experience === 'intermediate' && 'AI 중급'}
                            {assessment.experience === 'advanced' && 'AI 고급'}
                        </span>
                        <span className="tag style">
                            {assessment.learningStyle === 'visual' && '👀 시각형'}
                            {assessment.learningStyle === 'hands-on' && '✋ 실습형'}
                            {assessment.learningStyle === 'reading' && '📖 독서형'}
                            {assessment.learningStyle === 'game' && '🎮 게임형'}
                        </span>
                    </div>
                </div>

                {/* Recommended Curriculum */}
                <div className="curriculum-section">
                    <h2>추천 커리큘럼</h2>
                    <div className="curriculum-cards">
                        {curriculum.map((module, idx) => (
                            <div key={module.id} className="curriculum-card">
                                <div className="card-badge">Module {idx + 1}</div>
                                <h3>{module.title}</h3>
                                <div className="card-meta">
                                    <span className="difficulty">{module.difficulty}</span>
                                    <span className="duration">⏱ {module.duration}</span>
                                </div>
                                <ul className="topic-list">
                                    {module.topics.map((topic, i) => (
                                        <li key={i}>· {topic}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recommended Tools */}
                <div className="tools-section">
                    <h2>추천 AI 도구</h2>
                    <div className="tools-grid">
                        {getRecommendedTools().map((tool, idx) => (
                            <div key={idx} className="tool-chip">
                                <span className="tool-icon">🤖</span>
                                <span className="tool-name">{tool}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Learning Path */}
                <div className="path-section">
                    <h2>학습 로드맵</h2>
                    <div className="roadmap">
                        <div className="roadmap-step">
                            <div className="step-circle">1</div>
                            <div className="step-content">
                                <h4>기초 다지기</h4>
                                <p>{curriculum[0]?.title}</p>
                            </div>
                        </div>
                        <div className="roadmap-arrow">↓</div>
                        <div className="roadmap-step">
                            <div className="step-circle">2</div>
                            <div className="step-content">
                                <h4>실력 키우기</h4>
                                <p>{curriculum[1]?.title}</p>
                            </div>
                        </div>
                        <div className="roadmap-arrow">↓</div>
                        <div className="roadmap-step">
                            <div className="step-circle">3</div>
                            <div className="step-content">
                                <h4>프로젝트 완성</h4>
                                <p>{curriculum[2]?.title}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="cta-section">
                    <button className="btn-start-learning" onClick={handleStartLearning}>
                        🚀 학습 시작하기
                    </button>
                    <button className="btn-retake" onClick={() => navigate('/student/assessment')}>
                        다시 진단하기
                    </button>
                </div>
            </div>
        </div>
    );
}

export default StudentRecommendation;
