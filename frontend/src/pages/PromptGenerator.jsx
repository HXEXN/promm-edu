import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { promptTemplates, fillTemplate } from '../data/promptTemplates';
import './PromptGenerator.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function PromptGenerator() {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState('coding');
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [variables, setVariables] = useState({});
    const [generatedPrompt, setGeneratedPrompt] = useState('');
    const [mode, setMode] = useState('ai'); // 'ai', 'template', or 'custom'
    const [customInput, setCustomInput] = useState('');

    // AI Analysis state
    const [aiPromptInput, setAiPromptInput] = useState('');
    const [aiResult, setAiResult] = useState(null);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiError, setAiError] = useState('');

    const categories = Object.keys(promptTemplates).map(key => ({
        id: key,
        ...promptTemplates[key]
    }));

    // AI Analysis handler
    const handleAiAnalyze = async () => {
        const promptText = aiPromptInput.trim();
        if (!promptText) {
            setAiError('프롬프트를 입력해주세요');
            return;
        }
        setAiLoading(true);
        setAiError('');
        setAiResult(null);
        try {
            const response = await fetch(`${API_URL}/api/prompt/ai-analyze`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: promptText })
            });
            const data = await response.json();
            if (data.success) {
                setAiResult(data);
            } else {
                setAiError(data.error || '분석에 실패했습니다');
            }
        } catch (err) {
            setAiError('서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.');
        } finally {
            setAiLoading(false);
        }
    };

    const handleTemplateSelect = (template) => {
        setSelectedTemplate(template);
        const vars = {};
        const regex = /\{(\w+)\}/g;
        let match;
        while ((match = regex.exec(template.template)) !== null) {
            vars[match[1]] = '';
        }
        setVariables(vars);
        setGeneratedPrompt('');
    };

    const handleGenerate = () => {
        if (mode === 'template' && selectedTemplate) {
            const filled = fillTemplate(selectedTemplate.template, variables);
            setGeneratedPrompt(filled);
        } else if (mode === 'custom' && customInput.trim()) {
            const expanded = expandSimplePrompt(customInput);
            setGeneratedPrompt(expanded);
        }
    };

    const expandSimplePrompt = (input) => {
        const hasRole = /you are|act as|as a/i.test(input);
        const hasContext = /context|background|given/i.test(input);
        const hasAction = /write|create|generate|analyze|explain/i.test(input);
        let expanded = '';
        if (!hasRole) expanded += 'You are an expert assistant with deep knowledge in this domain.\n\n';
        if (!hasContext) expanded += 'Context: The user needs a comprehensive and well-structured response.\n\n';
        expanded += `Task: ${input}\n\n`;
        if (!hasAction) {
            expanded += 'Please provide:\n1. Clear and detailed explanation\n2. Practical examples where applicable\n3. Step-by-step guidance if relevant\n4. Best practices and recommendations\n\n';
        }
        expanded += 'Format your response clearly with sections and examples.';
        return expanded;
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text || generatedPrompt);
        alert('클립보드에 복사되었습니다!');
    };

    const handleSendToDashboard = () => {
        localStorage.setItem('generatedPrompt', generatedPrompt);
        navigate('/dashboard');
    };

    // Score color helper
    const getScoreColor = (score) => {
        if (score >= 80) return '#10b981';
        if (score >= 60) return '#f59e0b';
        if (score >= 40) return '#f97316';
        return '#ef4444';
    };

    const getGradeEmoji = (grade) => {
        const map = { S: '🏆', A: '🌟', B: '👍', C: '⚡', D: '📝' };
        return map[grade] || '📝';
    };

    return (
        <div className="prompt-generator-page">
            <div className="generator-header">
                <h1>✨ AI 프롬프트 분석 & 생성기</h1>
                <p className="header-subtitle">
                    AI가 프롬프트 품질을 분석하고 최적화된 버전을 제안합니다
                </p>
            </div>

            <div className="generator-container">
                {/* Mode Selector */}
                <div className="mode-selector">
                    <button
                        className={`mode-btn ${mode === 'ai' ? 'active' : ''}`}
                        onClick={() => setMode('ai')}
                    >
                        🤖 AI 분석
                    </button>
                    <button
                        className={`mode-btn ${mode === 'template' ? 'active' : ''}`}
                        onClick={() => setMode('template')}
                    >
                        📚 템플릿
                    </button>
                    <button
                        className={`mode-btn ${mode === 'custom' ? 'active' : ''}`}
                        onClick={() => setMode('custom')}
                    >
                        ✍️ 직접 입력
                    </button>
                </div>

                {/* AI Analysis Mode */}
                {mode === 'ai' && (
                    <div className="ai-mode">
                        <h2>🤖 프롬프트 품질 분석</h2>
                        <p className="ai-hint">
                            프롬프트를 입력하면 AI가 품질 점수, 구조 분석, 개선 제안, 최적화된 프롬프트를 제공합니다.
                        </p>
                        <textarea
                            className="ai-input"
                            value={aiPromptInput}
                            onChange={(e) => setAiPromptInput(e.target.value)}
                            placeholder="분석할 프롬프트를 입력하세요...&#10;&#10;예: Write a Python function that takes a list of numbers and returns the top 3 largest values"
                            rows={6}
                        />
                        <div className="ai-actions">
                            <button
                                className="btn-ai-analyze"
                                onClick={handleAiAnalyze}
                                disabled={aiLoading || !aiPromptInput.trim()}
                            >
                                {aiLoading ? (
                                    <><span className="spinner"></span> 분석 중...</>
                                ) : (
                                    '🔍 AI 분석 시작'
                                )}
                            </button>
                            <span className="ai-badge">
                                {aiLoading ? '⏳ GPT 분석 중...' : 'Powered by GPT-5 Mini'}
                            </span>
                        </div>

                        {aiError && <div className="ai-error">❌ {aiError}</div>}

                        {/* AI Analysis Results */}
                        {aiResult && aiResult.analysis && (
                            <div className="ai-results">
                                <div className="ai-results-header">
                                    <h3>📊 분석 결과</h3>
                                    <span className={`ai-mode-badge ${aiResult.mode}`}>
                                        {aiResult.mode === 'ai' ? '🤖 AI 분석' : '📐 규칙 기반 분석'}
                                    </span>
                                </div>

                                {/* Score Section */}
                                <div className="score-section">
                                    <div className="score-circle">
                                        <svg viewBox="0 0 120 120">
                                            <circle cx="60" cy="60" r="50" fill="none" stroke="#1e293b" strokeWidth="10" />
                                            <circle
                                                cx="60" cy="60" r="50" fill="none"
                                                stroke={getScoreColor(aiResult.analysis.qualityScore)}
                                                strokeWidth="10"
                                                strokeDasharray={`${(aiResult.analysis.qualityScore / 100) * 314} 314`}
                                                strokeLinecap="round"
                                                transform="rotate(-90 60 60)"
                                                style={{ transition: 'stroke-dasharray 1s ease' }}
                                            />
                                        </svg>
                                        <div className="score-text">
                                            <span className="score-number">{aiResult.analysis.qualityScore}</span>
                                            <span className="score-label">/ 100</span>
                                        </div>
                                    </div>
                                    <div className="score-grade">
                                        <span className="grade-emoji">{getGradeEmoji(aiResult.analysis.grade)}</span>
                                        <span className="grade-letter">{aiResult.analysis.grade}</span>
                                        <span className="grade-desc">
                                            {aiResult.analysis.grade === 'S' && '완벽한 프롬프트'}
                                            {aiResult.analysis.grade === 'A' && '우수한 프롬프트'}
                                            {aiResult.analysis.grade === 'B' && '양호한 프롬프트'}
                                            {aiResult.analysis.grade === 'C' && '개선 필요'}
                                            {aiResult.analysis.grade === 'D' && '기본 구조 부족'}
                                        </span>
                                    </div>
                                </div>

                                {/* Structure Checklist */}
                                <div className="structure-section">
                                    <h4>🏗️ 구조 분석</h4>
                                    <div className="structure-grid">
                                        {Object.entries(aiResult.analysis.structureAnalysis || {}).map(([key, value]) => (
                                            <div key={key} className={`structure-item ${value ? 'has' : 'missing'}`}>
                                                <span className="check-icon">{value ? '✅' : '❌'}</span>
                                                <span className="check-label">
                                                    {key === 'hasRole' && '역할 (Role)'}
                                                    {key === 'hasContext' && '맥락 (Context)'}
                                                    {key === 'hasTask' && '작업 (Task)'}
                                                    {key === 'hasFormat' && '형식 (Format)'}
                                                    {key === 'hasConstraints' && '제약조건 (Constraints)'}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Strengths & Weaknesses */}
                                <div className="feedback-grid">
                                    <div className="feedback-card strengths">
                                        <h4>💪 강점</h4>
                                        <ul>
                                            {(aiResult.analysis.strengths || []).map((s, i) => (
                                                <li key={i}>{s}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="feedback-card weaknesses">
                                        <h4>⚠️ 약점</h4>
                                        <ul>
                                            {(aiResult.analysis.weaknesses || []).map((w, i) => (
                                                <li key={i}>{w}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* Improvements */}
                                {aiResult.analysis.improvements && aiResult.analysis.improvements.length > 0 && (
                                    <div className="improvements-section">
                                        <h4>💡 개선 제안</h4>
                                        <div className="improvements-list">
                                            {aiResult.analysis.improvements.map((imp, i) => (
                                                <div key={i} className="improvement-item">
                                                    <span className="imp-number">{i + 1}</span>
                                                    <span className="imp-text">{imp}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Optimized Prompt */}
                                {aiResult.analysis.optimizedPrompt && (
                                    <div className="optimized-section">
                                        <div className="optimized-header">
                                            <h4>🚀 최적화된 프롬프트</h4>
                                            <button
                                                className="btn-copy-small"
                                                onClick={() => handleCopy(aiResult.analysis.optimizedPrompt)}
                                            >
                                                📋 복사
                                            </button>
                                        </div>
                                        <pre className="optimized-prompt">{aiResult.analysis.optimizedPrompt}</pre>
                                    </div>
                                )}

                                {/* Cost Analysis */}
                                {aiResult.analysis.costComparison && (
                                    <div className="cost-section">
                                        <h4>💰 모델별 비용 비교 (예상 토큰: {aiResult.analysis.tokenCount})</h4>
                                        <div className="cost-table">
                                            <div className="cost-header-row">
                                                <span>모델</span>
                                                <span>입력 비용</span>
                                                <span>총 비용</span>
                                            </div>
                                            {aiResult.analysis.costComparison.map((model, i) => (
                                                <div key={i} className={`cost-row ${i === 0 ? 'cheapest' : ''}`}>
                                                    <span className="model-name">
                                                        {i === 0 && '👑 '}{model.modelName}
                                                    </span>
                                                    <span>${model.inputCost.toFixed(6)}</span>
                                                    <span className="cost-total">${model.totalCost.toFixed(6)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* API Usage Info */}
                                {aiResult.usage && (
                                    <div className="usage-info">
                                        분석에 사용된 토큰: {aiResult.usage.totalTokens} | 분석 비용: {aiResult.usage.analysisCost}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Template Mode */}
                {mode === 'template' && (
                    <div className="template-mode">
                        <div className="category-section">
                            <h2>카테고리 선택</h2>
                            <div className="category-grid">
                                {categories.map(cat => (
                                    <div
                                        key={cat.id}
                                        className={`category-card ${selectedCategory === cat.id ? 'selected' : ''}`}
                                        onClick={() => {
                                            setSelectedCategory(cat.id);
                                            setSelectedTemplate(null);
                                            setGeneratedPrompt('');
                                        }}
                                    >
                                        <span className="category-icon">{cat.icon}</span>
                                        <span className="category-name">{cat.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {selectedCategory && (
                            <div className="template-section">
                                <h2>템플릿 선택</h2>
                                <div className="template-list">
                                    {promptTemplates[selectedCategory].templates.map(template => (
                                        <div
                                            key={template.id}
                                            className={`template-item ${selectedTemplate?.id === template.id ? 'selected' : ''}`}
                                            onClick={() => handleTemplateSelect(template)}
                                        >
                                            <h3>{template.title}</h3>
                                            <p>{template.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {selectedTemplate && (
                            <div className="variables-section">
                                <h2>변수 입력</h2>
                                <div className="variables-grid">
                                    {Object.keys(variables).map(varName => (
                                        <div key={varName} className="variable-input">
                                            <label>{varName}</label>
                                            <input
                                                type="text"
                                                value={variables[varName]}
                                                onChange={(e) => setVariables({
                                                    ...variables,
                                                    [varName]: e.target.value
                                                })}
                                                placeholder={`Enter ${varName}...`}
                                            />
                                        </div>
                                    ))}
                                </div>
                                <button className="btn-generate" onClick={handleGenerate}>🚀 프롬프트 생성하기</button>
                            </div>
                        )}
                    </div>
                )}

                {/* Custom Mode */}
                {mode === 'custom' && (
                    <div className="custom-mode">
                        <h2>간단한 요청 입력</h2>
                        <p className="custom-hint">
                            간단한 문장을 입력하면 자동으로 상세하고 구조화된 프롬프트로 확장됩니다.
                        </p>
                        <textarea
                            className="custom-input"
                            value={customInput}
                            onChange={(e) => setCustomInput(e.target.value)}
                            placeholder="예: 파이썬으로 웹 스크래핑 코드 작성해줘"
                            rows={5}
                        />
                        <button className="btn-generate" onClick={handleGenerate}>✨ 자동 확장하기</button>
                    </div>
                )}

                {/* Generated Prompt Display (template & custom modes) */}
                {generatedPrompt && mode !== 'ai' && (
                    <div className="generated-section">
                        <div className="generated-header">
                            <h2>생성된 프롬프트</h2>
                            <div className="action-buttons">
                                <button className="btn-copy" onClick={() => handleCopy()}>📋 복사</button>
                                <button className="btn-send" onClick={handleSendToDashboard}>🎯 대시보드로 전송</button>
                                <button className="btn-ai-analyze-small" onClick={() => {
                                    setAiPromptInput(generatedPrompt);
                                    setMode('ai');
                                    setTimeout(() => handleAiAnalyze(), 100);
                                }}>🤖 AI로 분석</button>
                            </div>
                        </div>
                        <pre className="generated-prompt">{generatedPrompt}</pre>
                        <div className="prompt-stats">
                            <div className="stat-item">
                                <span className="stat-label">문자 수:</span>
                                <span className="stat-value">{generatedPrompt.length}</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">예상 토큰:</span>
                                <span className="stat-value">~{Math.ceil(generatedPrompt.length / 4)}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Tips Section */}
            <div className="tips-section">
                <h3>💡 프롬프트 작성 팁</h3>
                <div className="tips-grid">
                    <div className="tip-card">
                        <h4>명확한 역할 지정</h4>
                        <p>"You are an expert..."로 시작하여 AI의 전문성을 정의하세요</p>
                    </div>
                    <div className="tip-card">
                        <h4>구체적인 컨텍스트</h4>
                        <p>배경 정보와 제약 조건을 명확히 제시하세요</p>
                    </div>
                    <div className="tip-card">
                        <h4>원하는 형식 명시</h4>
                        <p>응답의 구조와 형식을 구체적으로 요청하세요</p>
                    </div>
                    <div className="tip-card">
                        <h4>예시 제공</h4>
                        <p>Few-shot learning을 위해 예시를 포함하세요</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PromptGenerator;
