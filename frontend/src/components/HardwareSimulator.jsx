import { useState, useEffect } from 'react';
import './HardwareSimulator.css';
import './SimulatorEffects.css';

function HardwareSimulator() {
    const [deviceStates, setDeviceStates] = useState({
        pump: false,
        fan: false,
        led: false
    });

    const [ws, setWs] = useState(null);

    useEffect(() => {
        const websocket = new WebSocket('ws://localhost:3000/ws');

        websocket.onopen = () => {
            console.log('Hardware simulator WebSocket connected');
        };

        websocket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'hardware_update') {
                const command = data.payload;
                if (command.device && command.action === 'ON') {
                    activateDevice(command.device, command.duration);
                }
            }
        };

        setWs(websocket);

        return () => {
            websocket.close();
        };
    }, []);

    const activateDevice = (device, duration) => {
        setDeviceStates(prev => ({ ...prev, [device]: true }));

        setTimeout(() => {
            setDeviceStates(prev => ({ ...prev, [device]: false }));
        }, duration * 1000);
    };

    return (
        <div className={`hardware-simulator card ${deviceStates.fan ? 'fan-active' : ''} ${deviceStates.led ? 'led-active' : ''}`}>
            <h2>🌱 스마트팜 시뮬레이터</h2>
            <p className="simulator-subtitle">하드웨어 상태를 실시간으로 모니터링합니다</p>

            <div className="plant-container">
                <div className="pot">
                    <div className="soil"></div>
                    <div className="plant">
                        <div className="stem"></div>
                        <div className="leaf leaf-left"></div>
                        <div className="leaf leaf-right"></div>
                    </div>

                    {/* Advanced Water Particles */}
                    {deviceStates.pump && (
                        <div className="water-system">
                            {[...Array(15)].map((_, i) => (
                                <div key={i} className="particle"></div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Wind Effect Layer */}
                {deviceStates.fan && <div className="wind-effect"></div>}

                {/* LED light effect */}
                {deviceStates.led && (
                    <div className="led-light">
                        <div className="light-beam"></div>
                    </div>
                )}

                {/* Fan effect */}
                {deviceStates.fan && (
                    <div className="fan-indicator">
                        <div className="fan-blade"></div>
                    </div>
                )}
            </div>

            <div className="device-controls">
                <div className={`device-indicator ${deviceStates.pump ? 'active' : ''}`}>
                    <div className="indicator-icon">💧</div>
                    <span className="indicator-label">펌프</span>
                    <div className="indicator-status"></div>
                </div>

                <div className={`device-indicator ${deviceStates.fan ? 'active' : ''}`}>
                    <div className="indicator-icon">🌀</div>
                    <span className="indicator-label">환풍기</span>
                    <div className="indicator-status"></div>
                </div>

                <div className={`device-indicator ${deviceStates.led ? 'active' : ''}`}>
                    <div className="indicator-icon">💡</div>
                    <span className="indicator-label">LED</span>
                    <div className="indicator-status"></div>
                </div>
            </div>

            <div className="simulator-info">
                <p className="info-text">
                    {Object.values(deviceStates).some(s => s)
                        ? '⚡ 장치 작동 중...'
                        : '💤 대기 중'}
                </p>
            </div>
        </div>
    );
}

export default HardwareSimulator;
