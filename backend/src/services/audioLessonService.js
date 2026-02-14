import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const AUDIO_DIR = path.resolve(__dirname, '../../public/audio');

// Ensure audio directory exists
if (!fs.existsSync(AUDIO_DIR)) {
    fs.mkdirSync(AUDIO_DIR, { recursive: true });
}

let openai = null;
if (process.env.OPENAI_API_KEY) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

const SCRIPT_SYSTEM_PROMPT = `You are a podcast script writer for an AI education platform.
Convert the given lesson content into an engaging 2-person podcast discussion script in Korean.

Format rules:
- Use "진행자:" and "전문가:" as speaker labels
- Keep it concise: 8-12 exchanges total
- Make it conversational, educational, and engaging
- Include practical examples from the lesson
- End with a key takeaway summary
- Output ONLY the dialogue, no stage directions or meta text

Example format:
진행자: 안녕하세요! 오늘은 프롬프트 엔지니어링의 기초에 대해 알아보겠습니다.
전문가: 네, 반갑습니다. 프롬프트 엔지니어링은 AI를 효과적으로 활용하는 핵심 기술이에요.
진행자: 구체적으로 어떤 건가요?
전문가: 쉽게 말하면, AI에게 질문하는 방법을 최적화하는 거예요.`;

/**
 * Generate a podcast-style script from lesson theory text
 */
async function generateScript(theoryText, lessonTitle) {
    if (openai) {
        try {
            const response = await openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: SCRIPT_SYSTEM_PROMPT },
                    { role: 'user', content: `레슨 제목: ${lessonTitle}\n\n내용:\n${theoryText}` }
                ],
                temperature: 0.8,
                max_tokens: 2000
            });
            return response.choices[0].message.content;
        } catch (error) {
            console.error('스크립트 생성 실패, fallback:', error.message);
        }
    }

    // Fallback: simple script from theory
    return generateFallbackScript(theoryText, lessonTitle);
}

function generateFallbackScript(theory, title) {
    // Extract key points from markdown
    const lines = theory.split('\n').filter(l => l.trim());
    const headings = lines.filter(l => l.startsWith('##')).map(l => l.replace(/^#+\s*/, ''));
    const bullets = lines.filter(l => l.startsWith('- ')).map(l => l.replace(/^-\s*\*?\*?/, '').replace(/\*?\*?$/, '')).slice(0, 6);

    let script = `진행자: 안녕하세요! 오늘의 학습 주제는 "${title}"입니다. 전문가님, 이 주제에 대해 설명 부탁드립니다.\n`;
    script += `전문가: 네, 반갑습니다. ${title}은 AI 활용에서 매우 중요한 주제입니다. 핵심 내용을 알기 쉽게 설명해 드릴게요.\n`;

    if (headings.length > 0) {
        script += `진행자: 오늘 다룰 핵심 포인트는 무엇인가요?\n`;
        script += `전문가: 크게 ${headings.slice(0, 3).join(', ')} 이렇게 나눠서 설명하겠습니다.\n`;
    }

    bullets.forEach((point, i) => {
        if (i % 2 === 0) {
            script += `진행자: ${point}에 대해 더 자세히 알려주세요.\n`;
        } else {
            script += `전문가: ${point}. 이것은 실무에서 바로 적용할 수 있는 핵심 포인트입니다.\n`;
        }
    });

    script += `진행자: 정리하자면, ${title}의 핵심은 무엇인가요?\n`;
    script += `전문가: 가장 중요한 것은 이론을 이해하고 실제로 적용해보는 것입니다. 오늘 배운 내용을 실습에서 직접 연습해 보시길 권합니다.\n`;
    script += `진행자: 좋은 설명 감사합니다! 다음 레슨에서 뵙겠습니다.\n`;

    return script;
}

/**
 * Generate TTS audio from script using OpenAI API
 */
async function generateAudio(script, lessonId) {
    const filePath = path.join(AUDIO_DIR, `lesson-${lessonId}.mp3`);

    // Check if already generated
    if (fs.existsSync(filePath)) {
        return { exists: true, filePath, url: `/audio/lesson-${lessonId}.mp3` };
    }

    if (!openai) {
        return { exists: false, script, mode: 'no-api', message: 'OpenAI API 키가 없어 브라우저 TTS를 사용합니다.' };
    }

    try {
        // Split script into host and expert parts for different voices
        const lines = script.split('\n').filter(l => l.trim());
        const fullText = lines.map(line => {
            return line.replace(/^(진행자|전문가):\s*/, '');
        }).join('\n');

        // Generate single audio (two voices would require multiple calls)
        const mp3Response = await openai.audio.speech.create({
            model: 'gpt-4o-mini-tts',
            voice: 'nova',
            input: fullText,
            response_format: 'mp3',
            instructions: 'Speak in Korean. Use a warm, educational podcast tone. Pace should be moderate and clear, suitable for learning. Add natural pauses between speaker turns.'
        });

        const buffer = Buffer.from(await mp3Response.arrayBuffer());
        fs.writeFileSync(filePath, buffer);

        return { exists: true, filePath, url: `/audio/lesson-${lessonId}.mp3`, mode: 'tts' };
    } catch (error) {
        console.error('TTS 생성 실패:', error.message);
        return { exists: false, script, mode: 'fallback', message: error.message };
    }
}

/**
 * Main function: generate lesson audio
 */
export async function generateLessonAudio(lessonId, lessonTitle, theoryText) {
    // 1. Check if audio already exists
    const existingPath = path.join(AUDIO_DIR, `lesson-${lessonId}.mp3`);
    if (fs.existsSync(existingPath)) {
        return {
            success: true,
            lessonId,
            audioUrl: `/audio/lesson-${lessonId}.mp3`,
            mode: 'cached'
        };
    }

    // 2. Generate podcast script
    const script = await generateScript(theoryText, lessonTitle);

    // 3. Generate TTS audio
    const audioResult = await generateAudio(script, lessonId);

    return {
        success: true,
        lessonId,
        script,
        audioUrl: audioResult.exists ? audioResult.url : null,
        mode: audioResult.mode || 'tts'
    };
}

/**
 * Check which lessons have audio
 */
export function getAudioStatus() {
    const files = fs.readdirSync(AUDIO_DIR).filter(f => f.endsWith('.mp3'));
    const status = {};
    files.forEach(f => {
        const id = f.replace('lesson-', '').replace('.mp3', '');
        status[id] = `/audio/${f}`;
    });
    return status;
}

export default { generateLessonAudio, getAudioStatus };
