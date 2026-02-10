import LessonSidebar from '../components/LessonSidebar';
import PromptEditor from '../components/PromptEditor';
import HardwareSimulator from '../components/HardwareSimulator';
import CostEngineInfo from '../components/CostEngineInfo';
import EnterpriseDashboard from './EnterpriseDashboard';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { LessonProvider } from '../contexts/LessonContext';
import './Dashboard.css';

function Dashboard() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const mode = searchParams.get('mode') || 'student';
    const [lastCommand, setLastCommand] = useState(null);
    const [showEngineInfo, setShowEngineInfo] = useState(false);

    const toggleMode = () => {
        const newMode = mode === 'enterprise' ? 'student' : 'enterprise';
        navigate(`/dashboard?mode=${newMode}`);
    };

    return (
        <div className="dashboard-page">
            <div className="dashboard-header">
                <div className="header-content">
                    <div className="logo-section">
                        <div className="header-text">
                            <h1>🌱 스마트팜 프롬프트 실습</h1>
                            <span className={`mode-badge ${mode}`}>
                                {mode === 'enterprise' ? '💼 Enterprise' : '👨‍🎓 Student'}
                            </span>
                        </div>
                        <div className="header-actions">
                            <button className="btn-action" onClick={() => navigate('/ai-engines')}>
                                🤖 AI 엔진
                            </button>
                            <button className="btn-action" onClick={() => navigate('/advanced')}>
                                ⚡ 고급 최적화
                            </button>
                            <button className="btn-mode-switch" onClick={toggleMode}>
                                {mode === 'enterprise' ? '👨‍🎓 학생 모드' : '💼 기업 모드'}
                            </button>
                            <button className="btn-info-toggle" onClick={() => setShowEngineInfo(!showEngineInfo)}>
                                {showEngineInfo ? '✕' : '📖 엔진 설명'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {showEngineInfo && <CostEngineInfo />}

            {mode === 'enterprise' ? (
                <EnterpriseDashboard />
            ) : (
                <LessonProvider>
                    <div className="app-container">
                        <LessonSidebar />
                        <PromptEditor onCommandGenerated={setLastCommand} />
                        <HardwareSimulator />
                    </div>
                </LessonProvider>
            )}
        </div>
    );
}

export default Dashboard;
