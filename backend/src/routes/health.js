import express from 'express';

const router = express.Router();

// Health check endpoint for Render
router.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'PROMM EDU Backend',
        version: '1.0.0'
    });
});

export default router;
