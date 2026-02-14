import { useState } from 'react';
import './EnterpriseForm.css';

function EnterpriseForm({ onAnalyze }) {
    const [formData, setFormData] = useState({
        monthlyApiCalls: 100000,
        averageInputTokens: 50,
        averageOutputTokens: 100,
        currentModel: 'gpt-5',
        useCase: 'general',
        priorityFactor: 'cost',
        teamSize: 10,
        teamSkillLevel: 'intermediate',
        trainingFocus: ['cost-optimization', 'prompt-engineering'],
        trainingWeeks: 4
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseInt(value) : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await onAnalyze(formData);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="enterprise-form">
            <div className="form-header">
                <h2>🏢 기업 요구사항 분석</h2>
                <p>귀사의 AI 사용 현황을 입력하시면 최적화된 솔루션을 제안해드립니다</p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="form-section">
                    <h3>📊 현재 사용 현황</h3>

                    <div className="form-row">
                        <div className="form-group">
                            <label>월간 API 호출 수</label>
                            <input
                                type="number"
                                name="monthlyApiCalls"
                                value={formData.monthlyApiCalls}
                                onChange={handleChange}
                                min="1000"
                                required
                            />
                            <span className="form-hint">예: 100,000</span>
                        </div>

                        <div className="form-group">
                            <label>평균 입력 토큰 수</label>
                            <input
                                type="number"
                                name="averageInputTokens"
                                value={formData.averageInputTokens}
                                onChange={handleChange}
                                min="1"
                                required
                            />
                            <span className="form-hint">프롬프트 평균 길이</span>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>평균 출력 토큰 수</label>
                            <input
                                type="number"
                                name="averageOutputTokens"
                                value={formData.averageOutputTokens}
                                onChange={handleChange}
                                min="1"
                                required
                            />
                            <span className="form-hint">응답 평균 길이</span>
                        </div>

                        <div className="form-group">
                            <label>현재 사용 모델</label>
                            <select
                                name="currentModel"
                                value={formData.currentModel}
                                onChange={handleChange}
                                required
                            >
                                <option value="gpt-5.2">GPT-5.2 (Garlic)</option>
                                <option value="gpt-5">GPT-5</option>
                                <option value="claude-opus-4.6">Claude Opus 4.6</option>
                                <option value="claude-sonnet-5">Claude Sonnet 5</option>
                                <option value="gemini-3-pro">Gemini 3 Pro</option>
                                <option value="gemini-3-flash">Gemini 3 Flash</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <h3>🎯 요구사항</h3>

                    <div className="form-row">
                        <div className="form-group">
                            <label>우선순위</label>
                            <select
                                name="priorityFactor"
                                value={formData.priorityFactor}
                                onChange={handleChange}
                                required
                            >
                                <option value="cost">비용 최소화</option>
                                <option value="performance">성능 최대화</option>
                                <option value="balance">균형 (비용-성능)</option>
                                <option value="context">긴 컨텍스트 지원</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>사용 사례</label>
                            <select
                                name="useCase"
                                value={formData.useCase}
                                onChange={handleChange}
                            >
                                <option value="general">일반 업무</option>
                                <option value="customer-service">고객 서비스</option>
                                <option value="content-generation">콘텐츠 생성</option>
                                <option value="data-analysis">데이터 분석</option>
                                <option value="code-generation">코드 생성</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <h3>👥 팀 정보</h3>

                    <div className="form-row">
                        <div className="form-group">
                            <label>팀 규모</label>
                            <input
                                type="number"
                                name="teamSize"
                                value={formData.teamSize}
                                onChange={handleChange}
                                min="1"
                                required
                            />
                            <span className="form-hint">교육 대상 인원</span>
                        </div>

                        <div className="form-group">
                            <label>현재 기술 수준</label>
                            <select
                                name="teamSkillLevel"
                                value={formData.teamSkillLevel}
                                onChange={handleChange}
                                required
                            >
                                <option value="beginner">초급 (AI 처음)</option>
                                <option value="intermediate">중급 (기본 경험)</option>
                                <option value="advanced">고급 (전문가)</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>교육 기간 (주)</label>
                        <input
                            type="number"
                            name="trainingWeeks"
                            value={formData.trainingWeeks}
                            onChange={handleChange}
                            min="1"
                            max="12"
                            required
                        />
                        <span className="form-hint">권장: 4주</span>
                    </div>
                </div>

                <button
                    type="submit"
                    className="submit-btn"
                    disabled={loading}
                >
                    {loading ? '⏳ 분석 중...' : '🚀 분석 시작'}
                </button>
            </form>
        </div>
    );
}

export default EnterpriseForm;
