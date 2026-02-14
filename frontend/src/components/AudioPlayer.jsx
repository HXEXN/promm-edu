import { useState, useRef, useEffect, useCallback } from 'react';
import './AudioPlayer.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function AudioPlayer({ lessonId, lessonTitle, theoryText }) {
    const [status, setStatus] = useState('idle'); // idle | generating | ready | playing | paused | error | speech
    const [audioUrl, setAudioUrl] = useState(null);
    const [script, setScript] = useState(null);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [speed, setSpeed] = useState(1);
    const [genStep, setGenStep] = useState(0);

    const audioRef = useRef(null);
    const speechRef = useRef(null);
    const intervalRef = useRef(null);

    // Check if audio already exists when lesson changes
    useEffect(() => {
        setStatus('idle');
        setAudioUrl(null);
        setScript(null);
        setProgress(0);
        setDuration(0);
        setCurrentTime(0);
        setGenStep(0);

        // Check for existing audio
        fetch(`${API_URL}/api/audio/status`)
            .then(r => r.json())
            .then(data => {
                if (data.audioFiles && data.audioFiles[lessonId]) {
                    setAudioUrl(`${API_URL}${data.audioFiles[lessonId]}`);
                    setStatus('ready');
                }
            })
            .catch(() => { });
    }, [lessonId]);

    // Handle audio generation request
    const handleGenerate = async () => {
        setStatus('generating');
        setGenStep(1);

        try {
            await new Promise(r => setTimeout(r, 500));
            setGenStep(2);

            const res = await fetch(`${API_URL}/api/audio/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ lessonId, lessonTitle, theoryText })
            });

            const data = await res.json();
            setGenStep(3);
            await new Promise(r => setTimeout(r, 400));

            if (data.audioUrl) {
                setAudioUrl(`${API_URL}${data.audioUrl}`);
                setStatus('ready');
            } else if (data.script) {
                setScript(data.script);
                setStatus('idle');
                // Use Web Speech API fallback
                handleSpeechPlayback(data.script);
            }
        } catch (err) {
            console.error('Audio generation error:', err);
            setStatus('error');
        }
    };

    // Web Speech API fallback
    const handleSpeechPlayback = useCallback((scriptText) => {
        if (!('speechSynthesis' in window)) {
            setStatus('error');
            return;
        }

        window.speechSynthesis.cancel();
        const lines = (scriptText || script || '').split('\n').filter(l => l.trim());
        let lineIdx = 0;

        const speakNext = () => {
            if (lineIdx >= lines.length) {
                setStatus('idle');
                return;
            }
            const line = lines[lineIdx].replace(/^(진행자|전문가):\s*/, '');
            const utterance = new SpeechSynthesisUtterance(line);
            utterance.lang = 'ko-KR';
            utterance.rate = speed;

            // Different pitch for host vs expert
            if (lines[lineIdx].startsWith('진행자:')) {
                utterance.pitch = 1.1;
            } else {
                utterance.pitch = 0.9;
            }

            utterance.onend = () => {
                lineIdx++;
                setProgress(Math.round((lineIdx / lines.length) * 100));
                speakNext();
            };

            window.speechSynthesis.speak(utterance);
        };

        setStatus('speech');
        setProgress(0);
        speakNext();
        speechRef.current = { cancel: () => window.speechSynthesis.cancel() };
    }, [script, speed]);

    // Audio element event handlers
    const onTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
            if (audioRef.current.duration) {
                setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
            }
        }
    };

    const onLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const onEnded = () => {
        setStatus('ready');
        setProgress(0);
        setCurrentTime(0);
    };

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (status === 'playing') {
            audioRef.current.pause();
            setStatus('paused');
        } else {
            audioRef.current.play();
            setStatus('playing');
        }
    };

    const handleSeek = (e) => {
        if (!audioRef.current) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const pct = (e.clientX - rect.left) / rect.width;
        audioRef.current.currentTime = pct * audioRef.current.duration;
    };

    const changeSpeed = () => {
        const speeds = [0.75, 1, 1.25, 1.5, 2];
        const idx = speeds.indexOf(speed);
        const next = speeds[(idx + 1) % speeds.length];
        setSpeed(next);
        if (audioRef.current) audioRef.current.playbackRate = next;
    };

    const stopSpeech = () => {
        window.speechSynthesis.cancel();
        setStatus('idle');
        setProgress(0);
    };

    const formatTime = (s) => {
        if (!s || isNaN(s)) return '0:00';
        const m = Math.floor(s / 60);
        const sec = Math.floor(s % 60);
        return `${m}:${sec.toString().padStart(2, '0')}`;
    };

    // Cleanup
    useEffect(() => {
        return () => {
            window.speechSynthesis?.cancel();
            clearInterval(intervalRef.current);
        };
    }, []);

    return (
        <div className="audio-player-card">
            <div className="audio-player-header">
                <div className="audio-icon">🎧</div>
                <div className="audio-title-area">
                    <h4>학습 오디오</h4>
                    <span className="audio-subtitle">NotebookLM 스타일 팟캐스트</span>
                </div>
                {status !== 'idle' && status !== 'generating' && status !== 'error' && (
                    <button className="speed-btn" onClick={changeSpeed}>
                        {speed}x
                    </button>
                )}
            </div>

            {/* Generating State */}
            {status === 'generating' && (
                <div className="audio-gen-progress">
                    <div className="audio-gen-steps">
                        <span className={genStep >= 1 ? 'active' : ''}>📝 스크립트 생성</span>
                        <span className={genStep >= 2 ? 'active' : ''}>🎙️ 음성 변환</span>
                        <span className={genStep >= 3 ? 'active' : ''}>✅ 완료</span>
                    </div>
                    <div className="audio-gen-bar">
                        <div className="audio-gen-fill" style={{ width: `${(genStep / 3) * 100}%` }} />
                    </div>
                </div>
            )}

            {/* Idle State - Generate Button */}
            {status === 'idle' && (
                <button className="audio-generate-btn" onClick={handleGenerate}>
                    <span className="gen-icon">🎙️</span>
                    <span>AI 학습 오디오 생성하기</span>
                </button>
            )}

            {/* Error State */}
            {status === 'error' && (
                <div className="audio-error">
                    <span>⚠️ 오디오 생성에 실패했습니다</span>
                    <button onClick={handleGenerate}>다시 시도</button>
                </div>
            )}

            {/* Ready / Playing / Paused - Audio Player */}
            {(status === 'ready' || status === 'playing' || status === 'paused') && audioUrl && (
                <div className="audio-controls">
                    <audio
                        ref={audioRef}
                        src={audioUrl}
                        onTimeUpdate={onTimeUpdate}
                        onLoadedMetadata={onLoadedMetadata}
                        onEnded={onEnded}
                        preload="metadata"
                    />
                    <button className="play-btn" onClick={togglePlay}>
                        {status === 'playing' ? '⏸' : '▶'}
                    </button>
                    <div className="progress-area">
                        <div className="progress-bar" onClick={handleSeek}>
                            <div className="progress-fill" style={{ width: `${progress}%` }} />
                            <div className="progress-knob" style={{ left: `${progress}%` }} />
                        </div>
                        <div className="time-display">
                            <span>{formatTime(currentTime)}</span>
                            <span>{formatTime(duration)}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Web Speech API Playback */}
            {status === 'speech' && (
                <div className="audio-controls speech-mode">
                    <button className="play-btn" onClick={stopSpeech}>⏹</button>
                    <div className="progress-area">
                        <div className="progress-bar">
                            <div className="progress-fill speech-fill" style={{ width: `${progress}%` }} />
                        </div>
                        <div className="time-display">
                            <span>🔊 브라우저 TTS 재생 중...</span>
                            <span>{progress}%</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
