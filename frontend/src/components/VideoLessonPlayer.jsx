import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import './VideoLessonPlayer.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Parse markdown theory text into presentation slides
 */
function parseTheoryToSlides(theory, lessonTitle) {
    const slides = [];
    // Title slide
    slides.push({
        type: 'title',
        title: lessonTitle,
        subtitle: 'AI 학습 영상',
        icon: '🎓'
    });

    // Split by ## headings
    const sections = theory.split(/(?=^## )/m).filter(s => s.trim());

    sections.forEach(section => {
        const lines = section.split('\n').filter(l => l.trim());
        const heading = lines[0]?.replace(/^#+\s*/, '').replace(/[🎭📋🎯💡🔑💰⚠️✅]/g, '').trim();
        if (!heading) return;

        const bullets = [];
        const codeBlocks = [];
        let inCode = false;
        let currentCode = '';

        lines.slice(1).forEach(line => {
            if (line.startsWith('```')) {
                if (inCode) {
                    codeBlocks.push(currentCode.trim());
                    currentCode = '';
                }
                inCode = !inCode;
                return;
            }
            if (inCode) {
                currentCode += line + '\n';
                return;
            }
            // Bullet points
            if (line.match(/^[-*]\s/)) {
                const text = line.replace(/^[-*]\s+/, '').replace(/\*\*/g, '').replace(/`/g, '');
                if (text.length > 5) bullets.push(text);
            }
            // ### sub-headings as bullets
            if (line.startsWith('### ')) {
                const text = line.replace(/^###\s*/, '').replace(/[🎭📋🎯💡🔑💰⚠️✅]/g, '').trim();
                if (text) bullets.push(text);
            }
        });

        // Content slide
        slides.push({
            type: 'content',
            title: heading,
            bullets: bullets.slice(0, 5),
            code: codeBlocks[0] || null,
            icon: getSlideIcon(heading)
        });
    });

    // Summary slide
    slides.push({
        type: 'summary',
        title: '핵심 정리',
        bullets: slides
            .filter(s => s.type === 'content')
            .map(s => s.title)
            .slice(0, 5),
        icon: '📝'
    });

    return slides.length > 2 ? slides : generateFallbackSlides(lessonTitle, theory);
}

function generateFallbackSlides(title, theory) {
    const lines = theory.split('\n').filter(l => l.trim() && !l.startsWith('#') && !l.startsWith('```'));
    const chunks = [];
    for (let i = 0; i < lines.length; i += 4) {
        chunks.push(lines.slice(i, i + 4).map(l => l.replace(/^[-*]\s+/, '').replace(/\*\*/g, '')));
    }
    return [
        { type: 'title', title, subtitle: 'AI 학습 영상', icon: '🎓' },
        ...chunks.slice(0, 4).map((c, i) => ({
            type: 'content',
            title: `주요 포인트 ${i + 1}`,
            bullets: c,
            icon: ['💡', '🔧', '📊', '🎯'][i]
        })),
        { type: 'summary', title: '학습 완료', bullets: ['핵심 내용을 복습하세요'], icon: '✅' }
    ];
}

function getSlideIcon(title) {
    if (title.includes('원리') || title.includes('이해')) return '🧠';
    if (title.includes('비용') || title.includes('절감') || title.includes('토큰')) return '💰';
    if (title.includes('전략') || title.includes('선택')) return '🎯';
    if (title.includes('보안') || title.includes('방어')) return '🛡️';
    if (title.includes('고급') || title.includes('테크닉')) return '⚡';
    if (title.includes('모델')) return '🤖';
    if (title.includes('예시') || title.includes('실전')) return '💡';
    return '📌';
}

export default function VideoLessonPlayer({ lessonId, lessonTitle, theoryText }) {
    const [status, setStatus] = useState('idle');
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioUrl, setAudioUrl] = useState(null);
    const [script, setScript] = useState(null);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [speed, setSpeed] = useState(1);
    const [genStep, setGenStep] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [animKey, setAnimKey] = useState(0);

    const audioRef = useRef(null);
    const containerRef = useRef(null);
    const slideTimerRef = useRef(null);
    const speechRef = useRef(null);

    const slides = useMemo(() => parseTheoryToSlides(theoryText, lessonTitle), [theoryText, lessonTitle]);
    const slideInterval = useMemo(() => {
        // Base interval per slide, adjusted by content
        const base = 8000; // 8 seconds per slide
        return base;
    }, []);

    // Reset state when lesson changes
    useEffect(() => {
        setStatus('idle');
        setCurrentSlide(0);
        setIsPlaying(false);
        setAudioUrl(null);
        setScript(null);
        setProgress(0);
        setDuration(0);
        setCurrentTime(0);
        setGenStep(0);
        clearInterval(slideTimerRef.current);

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

        return () => clearInterval(slideTimerRef.current);
    }, [lessonId]);

    // Generate audio + slides
    const handleGenerate = async () => {
        setStatus('generating');
        setGenStep(1);
        try {
            await new Promise(r => setTimeout(r, 600));
            setGenStep(2);

            const res = await fetch(`${API_URL}/api/audio/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ lessonId, lessonTitle, theoryText })
            });
            const data = await res.json();

            setGenStep(3);
            await new Promise(r => setTimeout(r, 500));

            if (data.audioUrl) {
                setAudioUrl(`${API_URL}${data.audioUrl}`);
                setScript(data.script);
                setStatus('ready');
            } else if (data.script) {
                setScript(data.script);
                setStatus('ready');
            } else {
                setStatus('ready'); // slides only
            }
        } catch (err) {
            console.error('Generation error:', err);
            setStatus('ready'); // fallback to slides only
        }
    };

    // Slide auto-advance logic
    const startSlideshow = useCallback(() => {
        clearInterval(slideTimerRef.current);
        slideTimerRef.current = setInterval(() => {
            setCurrentSlide(prev => {
                if (prev >= slides.length - 1) {
                    clearInterval(slideTimerRef.current);
                    setIsPlaying(false);
                    return prev;
                }
                setAnimKey(k => k + 1);
                return prev + 1;
            });
        }, slideInterval / speed);
    }, [slides.length, slideInterval, speed]);

    // Play/Pause toggle
    const togglePlay = () => {
        if (isPlaying) {
            // Pause
            clearInterval(slideTimerRef.current);
            if (audioRef.current) audioRef.current.pause();
            if (speechRef.current) {
                window.speechSynthesis?.pause();
            }
            setIsPlaying(false);
        } else {
            // Play
            if (currentSlide >= slides.length - 1) {
                setCurrentSlide(0);
                setAnimKey(k => k + 1);
            }
            startSlideshow();
            if (audioRef.current && audioUrl) {
                audioRef.current.play().catch(() => { });
            } else if (script) {
                playSpeech();
            }
            setIsPlaying(true);
        }
    };

    // Web Speech API playback
    const playSpeech = () => {
        if (!('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel();

        const lines = script.split('\n').filter(l => l.trim());
        let idx = 0;
        const speakNext = () => {
            if (idx >= lines.length || !isPlaying) return;
            const text = lines[idx].replace(/^(진행자|전문가):\s*/, '');
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'ko-KR';
            utterance.rate = speed;
            utterance.pitch = lines[idx].startsWith('진행자:') ? 1.1 : 0.9;
            utterance.onend = () => { idx++; speakNext(); };
            window.speechSynthesis.speak(utterance);
        };
        speakNext();
        speechRef.current = true;
    };

    // Audio events
    const onTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
            const d = audioRef.current.duration;
            if (d) setProgress((audioRef.current.currentTime / d) * 100);
        }
    };

    const onLoadedMetadata = () => {
        if (audioRef.current) setDuration(audioRef.current.duration);
    };

    const onAudioEnded = () => {
        setIsPlaying(false);
        clearInterval(slideTimerRef.current);
    };

    // Manual slide navigation
    const goToSlide = (idx) => {
        setCurrentSlide(idx);
        setAnimKey(k => k + 1);
        if (audioRef.current && duration) {
            audioRef.current.currentTime = (idx / slides.length) * duration;
        }
    };

    const handleSeek = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const pct = (e.clientX - rect.left) / rect.width;
        const slideIdx = Math.floor(pct * slides.length);
        goToSlide(Math.min(slideIdx, slides.length - 1));
        if (audioRef.current && duration) {
            audioRef.current.currentTime = pct * duration;
        }
    };

    const changeSpeed = () => {
        const speeds = [0.75, 1, 1.25, 1.5, 2];
        const idx = speeds.indexOf(speed);
        const next = speeds[(idx + 1) % speeds.length];
        setSpeed(next);
        if (audioRef.current) audioRef.current.playbackRate = next;
        if (isPlaying) startSlideshow(); // restart with new speed
    };

    const toggleFullscreen = () => {
        if (!containerRef.current) return;
        if (!isFullscreen) {
            containerRef.current.requestFullscreen?.() ||
                containerRef.current.webkitRequestFullscreen?.();
        } else {
            document.exitFullscreen?.() || document.webkitExitFullscreen?.();
        }
        setIsFullscreen(!isFullscreen);
    };

    const formatTime = (s) => {
        if (!s || isNaN(s)) return '0:00';
        const m = Math.floor(s / 60);
        const sec = Math.floor(s % 60);
        return `${m}:${sec.toString().padStart(2, '0')}`;
    };

    // Auto-progress based on slide position
    const slideProgress = slides.length > 0 ? ((currentSlide + 1) / slides.length) * 100 : 0;

    // Cleanup
    useEffect(() => {
        return () => {
            clearInterval(slideTimerRef.current);
            window.speechSynthesis?.cancel();
        };
    }, []);

    // Current slide data
    const slide = slides[currentSlide] || slides[0];

    return (
        <div className={`video-player ${isFullscreen ? 'fullscreen' : ''}`} ref={containerRef}>
            {/* Idle: Generate button */}
            {status === 'idle' && (
                <div className="video-idle">
                    <div className="video-idle-preview">
                        <div className="idle-icon">🎬</div>
                        <h4>{lessonTitle}</h4>
                        <p>AI가 학습 내용을 영상으로 만들어 드립니다</p>
                    </div>
                    <button className="video-generate-btn" onClick={handleGenerate}>
                        <span>▶</span> AI 학습 영상 생성하기
                    </button>
                </div>
            )}

            {/* Generating */}
            {status === 'generating' && (
                <div className="video-generating">
                    <div className="gen-spinner" />
                    <div className="gen-steps">
                        <span className={genStep >= 1 ? 'active' : ''}>📝 슬라이드 구성</span>
                        <span className={genStep >= 2 ? 'active' : ''}>🎙️ 나레이션 생성</span>
                        <span className={genStep >= 3 ? 'active' : ''}>🎬 영상 준비</span>
                    </div>
                    <div className="gen-bar-wrap">
                        <div className="gen-bar-fill" style={{ width: `${(genStep / 3) * 100}%` }} />
                    </div>
                </div>
            )}

            {/* Ready / Playing */}
            {(status === 'ready') && (
                <>
                    {/* Slide Display Area */}
                    <div className="slide-viewport" onClick={togglePlay}>
                        <div className={`slide slide-${slide.type}`} key={`${currentSlide}-${animKey}`}>
                            <div className="slide-icon">{slide.icon}</div>
                            <h3 className="slide-title">{slide.title}</h3>
                            {slide.subtitle && <p className="slide-subtitle">{slide.subtitle}</p>}
                            {slide.bullets && slide.bullets.length > 0 && (
                                <ul className="slide-bullets">
                                    {slide.bullets.map((b, i) => (
                                        <li key={i} style={{ animationDelay: `${0.2 + i * 0.15}s` }}>{b}</li>
                                    ))}
                                </ul>
                            )}
                            {slide.code && (
                                <pre className="slide-code">{slide.code}</pre>
                            )}
                        </div>

                        {/* Play overlay when paused */}
                        {!isPlaying && (
                            <div className="play-overlay">
                                <div className="play-circle">▶</div>
                            </div>
                        )}

                        {/* Slide counter */}
                        <div className="slide-counter">{currentSlide + 1} / {slides.length}</div>
                    </div>

                    {/* Controls Bar */}
                    <div className="video-controls">
                        <button className="ctrl-btn" onClick={togglePlay}>
                            {isPlaying ? '⏸' : '▶'}
                        </button>

                        <button className="ctrl-btn" onClick={() => goToSlide(Math.max(0, currentSlide - 1))} disabled={currentSlide === 0}>
                            ⏮
                        </button>
                        <button className="ctrl-btn" onClick={() => goToSlide(Math.min(slides.length - 1, currentSlide + 1))} disabled={currentSlide >= slides.length - 1}>
                            ⏭
                        </button>

                        <div className="video-progress" onClick={handleSeek}>
                            <div className="video-progress-fill" style={{ width: `${audioUrl && duration ? progress : slideProgress}%` }} />
                            {/* Slide markers */}
                            {slides.map((_, i) => (
                                <div
                                    key={i}
                                    className={`slide-marker ${i <= currentSlide ? 'passed' : ''}`}
                                    style={{ left: `${(i / slides.length) * 100}%` }}
                                />
                            ))}
                        </div>

                        <span className="time-label">
                            {audioUrl && duration ? `${formatTime(currentTime)} / ${formatTime(duration)}` : `${currentSlide + 1}/${slides.length}`}
                        </span>

                        <button className="ctrl-btn speed" onClick={changeSpeed}>{speed}x</button>
                        <button className="ctrl-btn" onClick={toggleFullscreen}>
                            {isFullscreen ? '⊡' : '⛶'}
                        </button>
                    </div>

                    {audioUrl && (
                        <audio
                            ref={audioRef}
                            src={audioUrl}
                            onTimeUpdate={onTimeUpdate}
                            onLoadedMetadata={onLoadedMetadata}
                            onEnded={onAudioEnded}
                            preload="metadata"
                        />
                    )}
                </>
            )}
        </div>
    );
}
