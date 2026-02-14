import { useState, useCallback } from 'react';
import API_URL from '../config/api';
import './PromptEditor.css';

function PromptEditor({ initialPrompt = '', onExecute }) {
    const [prompt, setPrompt] = useState(initialPrompt);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [optimizing, setOptimizing] = useState(false);
    const [optimizeResult, setOptimizeResult] = useState(null);
    const [tokenCount, setTokenCount] = useState(0);

    // Simple token estimation
    const estimateTokens = useCallback((text) => {
        const koreanChars = (text.match(/[가-힣]/g) || []).length;
        const englishWords = (text.match(/[a-zA-Z]+/g) || []).length;
        return Math.ceil(koreanChars * 2.5 + englishWords * 1.3);
    }, []);

    const handlePromptChange = (e) => {
        const newPrompt = e.target.value;
        setPrompt(newPrompt);
        setTokenCount(estimateTokens(newPrompt));
        setOptimizeResult(null);
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

    const handleOptimize = async () => {
        if (!prompt.trim()) return;
        setOptimizing(true);
        try {
            const response = await fetch(`${API_URL}/api/prompt/optimize`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt, domain: 'general' })
            });
            const data = await response.json();
            if (data.success) {
                setOptimizeResult(data.data);
            }
        } catch (error) {
            // Client-side fallback
            let optimized = prompt
                .replace(/제발\s*/g, '').replace(/부탁드립니다\.?\s*/g, '')
                .replace(/감사합니다\.?\s*/g, '').replace(/please\s*/gi, '')
                .replace(/could you (please\s*)?/gi, '').replace(/I would like you to\s*/gi, '')
                .replace(/\n{3,}/g, '\n\n').replace(/\s{2,}/g, ' ').trim();
            const optimizedTokens = estimateTokens(optimized);
            setOptimizeResult({
                original: { tokens: tokenCount },
                optimized: { text: optimized, tokens: optimizedTokens },
                compression: {
                    tokensSaved: tokenCount - optimizedTokens,
                    compressionRatio: tokenCount > 0 ? Math.round(((tokenCount - optimizedTokens) / tokenCount) * 1000) / 10 : 0,
                    qualityPreserved: true,
                    techniques: []
                }
            });
        } finally {
            setOptimizing(false);
        }
    };

    const handleApplyOptimized = () => {
        if (optimizeResult?.optimized?.text) {
            setPrompt(optimizeResult.optimized.text);
            setTokenCount(estimateTokens(optimizeResult.optimized.text));
            setOptimizeResult(null);
        }
    };

    const handleClear = () => {
        setPrompt('');
        setResult(null);
        setOptimizeResult(null);
        setTokenCount(0);
    };

    return (
        <div className="prompt-editor">
            <div className="editor-header">
                <h3>💻 프롬프트 실습 에디터</h3>
                <div className="token-display">
                    <span className="token-label">예상 토큰:</span>
                    <span className={`token-count ${tokenCount > 100 ? 'warn' : tokenCount > 50 ? 'medium' : ''}`}>
                        {tokenCount}
                    </span>
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
                    <button
                        className="btn-optimize-prompt"
                        onClick={handleOptimize}
                        disabled={optimizing || !prompt.trim()}
                    >
                        {optimizing ? '분석 중...' : '🔬 토큰 최적화'}
                    </button>
                    <button className="btn-clear" onClick={handleClear}>
                        🗑️ 초기화
                    </button>
                </div>

                {/* Optimization Result Panel */}
                {optimizeResult && (
                    <div className="optimize-result-panel">
                        <div className="optimize-header">
                            <span>🔬 토큰 최적화 결과</span>
                            <div className="optimize-stats">
                                <span className="opt-stat">
                                    {optimizeResult.original.tokens} → {optimizeResult.optimized.tokens} 토큰
                                </span>
                                <span className="opt-saved">
                                    -{optimizeResult.compression.tokensSaved} ({optimizeResult.compression.compressionRatio}%)
                                </span>
                            </div>
                        </div>
                        <div className="optimize-body">
                            <pre className="optimized-preview">{optimizeResult.optimized.text}</pre>
                            <div className="optimize-actions">
                                <button className="btn-apply" onClick={handleApplyOptimized}>
                                    ✅ 적용하기
                                </button>
                                <button className="btn-dismiss" onClick={() => setOptimizeResult(null)}>
                                    닫기
                                </button>
                            </div>
                        </div>
                    </div>
                )}

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
