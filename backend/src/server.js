import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import http from 'http';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import apiRouter from './routes/api.js';
import advancedRouter from './routes/advanced.js';
import healthRouter from './routes/health.js';
import { createWebSocketServer } from './websocket/websocketServer.js';
import db from './models/database.js';

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

// Security Middleware
app.use(helmet()); // Set secure HTTP headers
app.use(compression()); // Compress response bodies

// Rate Limiting (Prevent DDoS/Abuse)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: { success: false, error: 'Too many requests from this IP, please try again later.' }
});
app.use('/api/', limiter);

// Logging
app.use(morgan('combined')); // Structured logging

// CORS Configuration
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin) return callback(null, true);

        const allowedOrigins = [
            process.env.FRONTEND_URL,
            /\.onrender\.com$/,
            /localhost/
        ].filter(Boolean);

        const isAllowed = allowedOrigins.some(allowed => {
            if (allowed instanceof RegExp) return allowed.test(origin);
            return allowed === origin;
        });

        if (isAllowed) {
            callback(null, true);
        } else {
            callback(null, true); // Allow all origins for now (MVP phase)
        }
    },
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Serve static files (audio, etc.)
import { fileURLToPath } from 'url';
import pathModule from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = pathModule.dirname(__filename);
app.use('/audio', express.static(pathModule.resolve(__dirname, '../public/audio')));

// Routes
app.use('/api', healthRouter);
app.use('/api', apiRouter);
app.use('/api/advanced', advancedRouter);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message
    });
});

app.get('/', (req, res) => {
    res.json({
        message: 'Smart Farm Prompt Engineering Education Platform API',
        status: 'running',
        endpoints: {
            lessons: '/api/lessons',
            analyze: '/api/prompt/analyze',
            execute: '/api/prompt/execute',
            websocket: 'ws://localhost:3000/ws'
        }
    });
});

// Initialize WebSocket
const { wss, broadcast } = createWebSocketServer(server);

// Start server
server.listen(PORT, () => {
    console.log('🚀 Smart Farm Backend Server Started (Production Ready)');
    console.log(`📡 HTTP API: http://localhost:${PORT}`);
    console.log(`🔌 WebSocket: ws://localhost:${PORT}/ws`);
    console.log('✅ Database initialized');
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server...');
    db.close();
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});
