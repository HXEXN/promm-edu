import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { promptTemplates, fillTemplate } from '../data/promptTemplates';
import './PromptGenerator.css';

function PromptGenerator() {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState('coding');
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [variables, setVariables] = useState({});
    const [generatedPrompt, setGeneratedPrompt] = useState('');
    const [mode, setMode] = useState('template'); // 'template' or 'custom'
    const [customInput, setCustomInput] = useState('');

    const categories = Object.keys(promptTemplates).map(key => ({
        id: key,
        ...promptTemplates[key]
    }));

    const handleTemplateSelect = (template) => {
        setSelectedTemplate(template);
        // Extract variables from template
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
            // Smart expansion for custom input
            const expanded = expandSimplePrompt(customInput);
            setGeneratedPrompt(expanded);
        }
    };

    const expandSimplePrompt = (input) => {
        // Simple heuristic-based expansion
        const hasRole = /you are|act as|as a/i.test(input);
        const hasContext = /context|background|given/i.test(input);
        const hasAction = /write|create|generate|analyze|explain/i.test(input);

        let expanded = '';

        if (!hasRole) {
            expanded += 'You are an expert assistant with deep knowledge in this domain.\n\n';
        }

        if (!hasContext) {
            expanded += 'Context: The user needs a comprehensive and well-structured response.\n\n';
        }

        expanded += `Task: ${input}\n\n`;

        if (!hasAction) {
            expanded += 'Please provide:\n';
            expanded += '1. Clear and detailed explanation\n';
            expanded += '2. Practical examples where applicable\n';
            expanded += '3. Step-by-step guidance if relevant\n';
            expanded += '4. Best practices and recommendations\n\n';
        }

        expanded += 'Format your response clearly with sections and examples.';

        return expanded;
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedPrompt);
        alert('프롬프트가 클립보드에 복사되었습니다!');
    };

    const handleSendToDashboard = () => {
        // Store in localStorage and navigate
        localStorage.setItem('generatedPrompt', generatedPrompt);
        navigate('/dashboard');
    };

    return (
        <div className="prompt-generator-page">
            <div className="generator-header">
                <h1>✨ 자동 프롬프트 생성기</h1>
                <p className="header-subtitle">
                    간단한 입력을 전문가 수준의 최적화된 프롬프트로 변환하세요
                </p>
            </div>

            <div className="generator-container">
                {/* Mode Selector */}
                <div className="mode-selector">
                    <button
                        className={`mode-btn ${mode === 'template' ? 'active' : ''}`}
                        onClick={() => setMode('template')}
                    >
                        📚 템플릿 사용
                    </button>
                    <button
                        className={`mode-btn ${mode === 'custom' ? 'active' : ''}`}
                        onClick={() => setMode('custom')}
                    >
                        ✍️ 직접 입력
                    </button>
                </div>

                {mode === 'template' ? (
                    <div className="template-mode">
                        {/* Category Selection */}
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

                        {/* Template Selection */}
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

                        {/* Variable Input */}
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
                                <button className="btn-generate" onClick={handleGenerate}>
                                    🚀 프롬프트 생성하기
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
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
                        <button className="btn-generate" onClick={handleGenerate}>
                            ✨ 자동 확장하기
                        </button>
                    </div>
                )}

                {/* Generated Prompt Display */}
                {generatedPrompt && (
                    <div className="generated-section">
                        <div className="generated-header">
                            <h2>생성된 프롬프트</h2>
                            <div className="action-buttons">
                                <button className="btn-copy" onClick={handleCopy}>
                                    📋 복사
                                </button>
                                <button className="btn-send" onClick={handleSendToDashboard}>
                                    🎯 대시보드로 전송
                                </button>
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
