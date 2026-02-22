import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh',
                    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                    fontFamily: 'system-ui, sans-serif',
                    textAlign: 'center',
                    padding: '20px'
                }}>
                    <div style={{
                        background: 'white',
                        padding: '40px',
                        borderRadius: '16px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                    }}>
                        <h1 style={{ color: '#e74c3c', margin: '0 0 10px 0' }}>⚠️ 오류가 발생했습니다</h1>
                        <p style={{ color: '#7f8c8d', marginBottom: '20px' }}>
                            죄송합니다. 예상치 못한 문제가 발생하여 페이지를 로드할 수 없습니다.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            style={{
                                padding: '12px 24px',
                                background: '#3498db',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                fontSize: '16px',
                                transition: 'background 0.3s'
                            }}
                        >
                            페이지 새로고침
                        </button>
                        {process.env.NODE_ENV === 'development' && (
                            <details style={{ marginTop: '20px', textAlign: 'left', color: '#e74c3c' }}>
                                <summary>Error Details</summary>
                                <pre style={{ fontSize: '12px', marginTop: '10px' }}>
                                    {this.state.error && this.state.error.toString()}
                                </pre>
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
