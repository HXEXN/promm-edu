import { WebSocketServer } from 'ws';
import { analyzePrompt } from '../services/promptService.js';

export function createWebSocketServer(server) {
    const wss = new WebSocketServer({ server, path: '/ws' });

    const clients = new Set();

    wss.on('connection', (ws) => {
        console.log('✅ WebSocket client connected');
        clients.add(ws);

        ws.on('message', (data) => {
            try {
                const message = JSON.parse(data.toString());

                switch (message.type) {
                    case 'analyze':
                        // 실시간 토큰 분석
                        const { role, context, action } = message.payload;
                        const analysis = analyzePrompt(role, context, action);

                        ws.send(JSON.stringify({
                            type: 'analysis',
                            payload: {
                                tokenCount: analysis.inputTokens,
                                efficiencyScore: analysis.efficiencyScore,
                                status: analysis.status,
                                costAnalysis: analysis.modelComparison
                            }
                        }));
                        break;

                    case 'hardware_command':
                        // 하드웨어 명령 브로드캐스트
                        broadcast({
                            type: 'hardware_update',
                            payload: message.payload
                        });
                        break;

                    default:
                        console.log('Unknown message type:', message.type);
                }
            } catch (error) {
                console.error('WebSocket message error:', error);
            }
        });

        ws.on('close', () => {
            console.log('❌ WebSocket client disconnected');
            clients.delete(ws);
        });

        ws.on('error', (error) => {
            console.error('WebSocket error:', error);
        });
    });

    function broadcast(message) {
        const data = JSON.stringify(message);
        clients.forEach(client => {
            if (client.readyState === 1) { // OPEN
                client.send(data);
            }
        });
    }

    return { wss, broadcast };
}
