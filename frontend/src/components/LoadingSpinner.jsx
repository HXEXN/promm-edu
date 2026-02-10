import './LoadingSpinner.css';

function LoadingSpinner({ size = 'medium', text = '' }) {
    return (
        <div className="loading-container">
            <div className={`spinner spinner-${size}`}></div>
            {text && <p className="loading-text">{text}</p>}
        </div>
    );
}

export default LoadingSpinner;
