import express from 'express';
import db from '../models/database.js';
import { analyzePrompt, executePrompt } from '../services/promptService.js';
import { generateEnterpriseReport } from '../services/enterpriseService.js';
import { analyzePromptWithAI } from '../services/aiService.js';
import * as advanced2026 from '../services/advanced2026.js';

// In-memory storage for trial users (replace with DB in production)
const trialUsers = {};

const router = express.Router();

// Get all lessons
router.get('/lessons', (req, res) => {
    try {
        const lessons = db.prepare('SELECT * FROM lessons ORDER BY order_index').all();
        res.json({ success: true, lessons });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Analyze prompt for token cost
router.post('/prompt/analyze', (req, res) => {
    try {
        const { role, context, action } = req.body;
        const analysis = analyzePrompt(role, context, action);
        res.json({ success: true, data: analysis });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// AI-powered prompt quality analysis
router.post('/prompt/ai-analyze', async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt || prompt.trim().length === 0) {
            return res.status(400).json({ success: false, error: '프롬프트를 입력해주세요' });
        }
        const result = await analyzePromptWithAI(prompt);
        res.json(result);
    } catch (error) {
        console.error('❌ AI Analyze error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Execute prompt and get hardware command
router.post('/prompt/execute', async (req, res) => {
    try {
        const { role, context, action, model } = req.body;
        const result = await executePrompt(role, context, action, model);

        // Save to database
        db.prepare(`
            INSERT INTO prompts (role_text, context_text, action_text, model_used, 
                                token_count, efficiency_score, hardware_command)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(
            role, context, action, model,
            result.analysis.tokenCount,
            result.analysis.efficiencyScore,
            JSON.stringify(result.command)
        );

        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Enterprise analysis
router.post('/enterprise/analyze', (req, res) => {
    try {
        const requirements = req.body;
        const report = generateEnterpriseReport(requirements);
        res.json({ success: true, data: report });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Advanced 2026 Features
router.post('/advanced', async (req, res) => {
    try {
        const result = await advanced2026.handleAdvanced2026(req.body);
        res.json(result);
    } catch (error) {
        console.error('❌ Advanced feature error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Trial Credit Management
router.post('/trial/register', (req, res) => {
    try {
        const { email } = req.body;

        if (!email || !email.includes('@')) {
            return res.status(400).json({
                success: false,
                error: '유효한 이메일을 입력해주세요'
            });
        }

        // Initialize trial user if not exists
        if (!trialUsers[email]) {
            trialUsers[email] = {
                credits: 10,
                registeredAt: new Date(),
                usageHistory: []
            };
        }

        res.json({
            success: true,
            credits: trialUsers[email].credits,
            message: '10 크레딧이 발급되었습니다!'
        });
    } catch (error) {
        console.error('❌ Trial registration error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/trial/use-credit', (req, res) => {
    try {
        const { email, engine, creditCost } = req.body;

        if (!trialUsers[email]) {
            return res.status(404).json({
                success: false,
                error: '등록되지 않은 이메일입니다'
            });
        }

        if (trialUsers[email].credits < creditCost) {
            return res.status(403).json({
                success: false,
                error: '크레딧이 부족합니다'
            });
        }

        // Deduct credits
        trialUsers[email].credits -= creditCost;
        trialUsers[email].usageHistory.push({
            engine,
            cost: creditCost,
            timestamp: new Date()
        });

        res.json({
            success: true,
            remainingCredits: trialUsers[email].credits
        });
    } catch (error) {
        console.error('❌ Trial credit usage error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

router.get('/trial/history', (req, res) => {
    try {
        const { email } = req.query;

        if (!trialUsers[email]) {
            return res.status(404).json({
                success: false,
                error: '등록되지 않은 이메일입니다'
            });
        }

        res.json({
            success: true,
            credits: trialUsers[email].credits,
            history: trialUsers[email].usageHistory
        });
    } catch (error) {
        console.error('❌ Trial history error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get prompt history
router.get('/prompts/history', (req, res) => {
    try {
        const prompts = db.prepare('SELECT * FROM prompts ORDER BY created_at DESC LIMIT 10').all();
        res.json({ success: true, prompts });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get lesson by ID
router.get('/lessons/:id', (req, res) => {
    try {
        const lesson = db.prepare('SELECT * FROM lessons WHERE id = ?').get(req.params.id);
        if (!lesson) {
            return res.status(404).json({ success: false, error: 'Lesson not found' });
        }

        // Parse JSON fields
        lesson.hints = JSON.parse(lesson.hints || '[]');
        lesson.validation_rules = JSON.parse(lesson.validation_rules || '{}');

        res.json({ success: true, lesson });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Validate lesson answer
router.post('/lessons/:id/validate', (req, res) => {
    try {
        const { tokenCount, command } = req.body;
        const lesson = db.prepare('SELECT validation_rules FROM lessons WHERE id = ?').get(req.params.id);

        if (!lesson) {
            return res.status(404).json({ success: false, error: 'Lesson not found' });
        }

        const rules = JSON.parse(lesson.validation_rules || '{}');
        let passed = true;
        let feedback = '';

        // Check token count
        if (rules.maxTokens && tokenCount > rules.maxTokens) {
            passed = false;
            feedback = `토큰 수가 너무 많습니다. (${tokenCount}/${rules.maxTokens}) 더 간결하게 작성해보세요.`;
        }

        // Check required device
        if (rules.requiredDevice && command?.device !== rules.requiredDevice) {
            passed = false;
            feedback = `장치가 올바르지 않습니다. "${rules.requiredDevice}"를 제어해야 합니다.`;
        }

        // Check required devices (any of)
        if (rules.requiredDevices && !rules.requiredDevices.includes(command?.device)) {
            passed = false;
            feedback = `장치가 올바르지 않습니다. ${rules.requiredDevices.join(' 또는 ')}를 제어해야 합니다.`;
        }

        // Check command exists
        if (rules.requiresCommand && (!command || command.device === 'none')) {
            passed = false;
            feedback = '유효한 제어 명령을 생성해야 합니다.';
        }

        if (passed) {
            feedback = '🎉 축하합니다! 레슨을 완료했습니다!';
        }

        res.json({ success: true, passed, feedback });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get user progress
router.get('/user/:userId/progress', (req, res) => {
    try {
        const user = db.prepare('SELECT progress FROM users WHERE id = ?').get(req.params.userId);

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Complete lesson and update progress
router.post('/user/:userId/complete-lesson', (req, res) => {
    try {
        const { lessonId } = req.body;
        const user = db.prepare('SELECT progress FROM users WHERE id = ?').get(req.params.userId);

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        const progress = JSON.parse(user.progress || '{"completed": 0, "total": 5}');

        // Mark lesson as completed if not already
        if (progress.completed < lessonId) {
            progress.completed = lessonId;
        }

        db.prepare('UPDATE users SET progress = ? WHERE id = ?').run(
            JSON.stringify(progress),
            req.params.userId
        );

        res.json({ success: true, progress });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
