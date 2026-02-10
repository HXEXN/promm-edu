import { useState } from 'react';
import './PromptEditor.css';

function PromptEditor({ initialPrompt = '', onExecute }) {
    const [prompt, setPrompt] = useState(initialPrompt);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [tokenCount, setTokenCount] = useState(0);

    // Simple token estimation
    const estimateTokens = (text) => {
        const koreanChars = (text.match(/[가-힣]/g) || []).length;
        const englishWords = (text.match(/[a-zA-Z]+/g) || []).length;
        return Math.ceil(koreanChars * 2.5 + englishWords * 1.3);
    };

    const handlePromptChange = (e) => {
        const newPrompt = e.target.value;
        setPrompt(newPrompt);
        setTokenCount(estimateTokens(newPrompt));
    };

    const handleExecute = async () => {
        if (!prompt.trim()) return;

        setLoading(true);
        try {
            // Simulate API call (실제로는 backend API 호출)
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Mock response
            const mockResponse = {
                output: `[AI 응답 시뮬레이션]\n\n입력하신 프롬프트에 대한 답변입니다.\n\n실제 환경에서는 여기에 LLM의 실제 응답이 표시됩니다.\n\n입력 토큰: ${tokenCount}\n예상 비용: $${(tokenCount / 1000000 * 3).toFixed(6)}`,
                tokens: { input: tokenCount, output: 50 },
                cost: (tokenCount + 50) / 1000000 * 3
            };

            setResult(mockResponse);
            if (onExecute) onExecute(mockResponse);
        } catch (error) {
            setResult({ error: '실행 중 오류가 발생했습니다.' });
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setPrompt('');
        setResult(null);
        setTokenCount(0);
    };

    return (
        <div className="prompt-editor">
            <div className="editor-header">
                <h3>💻 프롬프트 실습 에디터</h3>
                <div className="token-display">
                    <span className="token-label">예상 토큰:</span>
                    <span className="token-count">{tokenCount}</span>
                </div>
            </div>

            <div className="editor-main">
                <textarea
                    className="prompt-input"
                    value={prompt}
                    onChange={handlePromptChange}
                    placeholder="여기에 프롬프트를 작성하세요..."
                    rows={8}
                />

                <div className="editor-actions">
                    <button
                        className="btn-execute"
                        onClick={handleExecute}
                        disabled={loading || !prompt.trim()}
                    >
                        {loading ? '실행 중...' : '▶ 실행하기'}
                    </button>
                    <button className="btn-clear" onClick={handleClear}>
                        🗑️ 초기화
                    </button>
                </div>

                {result && (
                    <div className="result-panel">
                        <div className="result-header">
                            <span>📄 실행 결과</span>
                            {result.cost && (
                                <span className="cost-badge">
                                    예상 비용: ${result.cost.toFixed(6)}
                                </span>
                            )}
                        </div>
                        <div className="result-content">
                            {result.error ? (
                                <div className="error-message">{result.error}</div>
                            ) : (
                                <pre>{result.output}</pre>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PromptEditor;
