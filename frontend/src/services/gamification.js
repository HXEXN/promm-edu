// Gamification Service
// Manages XP, Levels, and Badges

const LEVELS = [
    { level: 1, xp: 0, title: '🌱 새싹 프롬프터' },
    { level: 2, xp: 100, title: '🌿 초보 농부' },
    { level: 3, xp: 300, title: '🚜 숙련된 농부' },
    { level: 4, xp: 600, title: '🏭 스마트팜 매니저' },
    { level: 5, xp: 1000, title: '🤖 AI 농업 전문가' }
];

const BADGES = [
    { id: 'first_prompt', name: '첫 걸음', icon: '🦶', description: '첫 번째 프롬프트를 전송하세요' },
    { id: 'token_saver', name: '토큰 절약왕', icon: '💰', description: '효율 점수 90점 이상 달성' },
    { id: 'master_farmer', name: '마스터', icon: '👑', description: '모든 레슨 완료' }
];

export const getLevelInfo = (currentXp) => {
    // Find highest reached level
    let currentLevel = LEVELS[0];
    let nextLevel = LEVELS[1];

    for (let i = 0; i < LEVELS.length; i++) {
        if (currentXp >= LEVELS[i].xp) {
            currentLevel = LEVELS[i];
            nextLevel = LEVELS[i + 1] || null;
        } else {
            break;
        }
    }

    // Calculate progress to next level
    let progress = 100;
    if (nextLevel) {
        const xpNeeded = nextLevel.xp - currentLevel.xp;
        const xpEarned = currentXp - currentLevel.xp;
        progress = Math.min(100, Math.floor((xpEarned / xpNeeded) * 100));
    }

    return {
        level: currentLevel.level,
        title: currentLevel.title,
        currentXp,
        nextLevelXp: nextLevel ? nextLevel.xp : 'MAX',
        progress,
        badges: [] // In a real app, calculate unlocked badges here
    };
};

export const addXp = (currentXp, actionType) => {
    let earnedXp = 0;
    switch (actionType) {
        case 'COMPLETE_LESSON': earnedXp = 50; break;
        case 'GOOD_PROMPT': earnedXp = 10; break;
        case 'PERFECT_SCORE': earnedXp = 20; break;
        case 'TRY_PROMPT': earnedXp = 2; break;
        default: earnedXp = 0;
    }
    return currentXp + earnedXp;
};
