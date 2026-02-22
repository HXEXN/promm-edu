import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './MarkdownRenderer.css';

function MarkdownRenderer({ content }) {
    if (!content) return null;

    return (
        <div className="md-render">
            <ReactMarkdown
                components={{
                    code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        const codeString = String(children).replace(/\n$/, '');

                        if (!inline && (match || codeString.includes('\n'))) {
                            return (
                                <div className="code-block-wrapper">
                                    {match && (
                                        <div className="code-lang-badge">{match[1]}</div>
                                    )}
                                    <SyntaxHighlighter
                                        style={oneDark}
                                        language={match ? match[1] : 'text'}
                                        PreTag="div"
                                        customStyle={{
                                            margin: 0,
                                            borderRadius: match ? '0 0 10px 10px' : '10px',
                                            fontSize: '0.88rem',
                                            lineHeight: '1.6',
                                        }}
                                        {...props}
                                    >
                                        {codeString}
                                    </SyntaxHighlighter>
                                </div>
                            );
                        }

                        return (
                            <code className="inline-code" {...props}>
                                {children}
                            </code>
                        );
                    },
                    blockquote({ children }) {
                        return <blockquote className="md-blockquote">{children}</blockquote>;
                    },
                    table({ children }) {
                        return (
                            <div className="md-table-wrap">
                                <table className="md-table">{children}</table>
                            </div>
                        );
                    },
                    h2({ children }) {
                        return <h2 className="md-h2">{children}</h2>;
                    },
                    h3({ children }) {
                        return <h3 className="md-h3">{children}</h3>;
                    },
                    h4({ children }) {
                        return <h4 className="md-h4">{children}</h4>;
                    },
                    ul({ children }) {
                        return <ul className="md-ul">{children}</ul>;
                    },
                    ol({ children }) {
                        return <ol className="md-ol">{children}</ol>;
                    },
                    li({ children }) {
                        return <li className="md-li">{children}</li>;
                    },
                    strong({ children }) {
                        return <strong className="md-strong">{children}</strong>;
                    },
                    p({ children }) {
                        return <p className="md-p">{children}</p>;
                    },
                    hr() {
                        return <hr className="md-hr" />;
                    }
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}

export default MarkdownRenderer;
