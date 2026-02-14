import { MODEL_PRICING, calculateModelCost, compareAllModels } from './costAnalysisService.js';

// Enterprise requirements analysis
export function analyzeEnterpriseRequirements(requirements) {
    const {
        monthlyApiCalls,
        averageInputTokens,
        averageOutputTokens,
        currentModel,
        useCase,
        priorityFactor // 'cost', 'performance', 'balance', 'context'
    } = requirements;

    // Calculate current costs (with fallback for unknown models)
    const fallbackModel = 'gpt-5';
    let currentCost = calculateModelCost(
        averageInputTokens,
        averageOutputTokens,
        currentModel || fallbackModel
    );
    // If model not found in pricing, fallback to default
    if (!currentCost) {
        currentCost = calculateModelCost(averageInputTokens, averageOutputTokens, fallbackModel);
    }

    const monthlyTotalCost = currentCost.totalCost * monthlyApiCalls;
    const annualTotalCost = monthlyTotalCost * 12;

    // Compare all models
    const comparison = compareAllModels(averageInputTokens, averageOutputTokens);

    // Calculate potential savings with each model
    const modelsWithSavings = comparison.models.map(model => {
        const monthlyCost = model.totalCost * monthlyApiCalls;
        const annualCost = monthlyCost * 12;
        const monthlySavings = monthlyTotalCost - monthlyCost;
        const annualSavings = annualTotalCost - annualCost;

        return {
            ...model,
            monthlyCost,
            annualCost,
            monthlySavings,
            annualSavings,
            savingsPercentage: ((monthlySavings / monthlyTotalCost) * 100)
        };
    });

    // Recommend best model based on priority
    let recommendedModel;
    switch (priorityFactor) {
        case 'cost':
            recommendedModel = modelsWithSavings[0]; // Cheapest
            break;
        case 'performance':
            recommendedModel = modelsWithSavings.find(m => m.modelId === 'gpt-5.2') || modelsWithSavings[0];
            break;
        case 'balance':
            recommendedModel = modelsWithSavings.find(m => m.modelId === 'claude-sonnet-5') || modelsWithSavings[0];
            break;
        case 'context':
            recommendedModel = modelsWithSavings.find(m => m.modelId === 'gemini-3-pro') || modelsWithSavings[0];
            break;
        default:
            recommendedModel = modelsWithSavings[0];
    }

    return {
        currentAnalysis: {
            model: currentModel || 'gpt-4o',
            monthlyApiCalls,
            averageInputTokens,
            averageOutputTokens,
            costPerRequest: currentCost.totalCost,
            monthlyCost: monthlyTotalCost,
            annualCost: annualTotalCost
        },
        recommendation: recommendedModel,
        allOptions: modelsWithSavings,
        potentialSavings: {
            bestCase: modelsWithSavings[0],
            monthlySavings: modelsWithSavings[0].monthlySavings,
            annualSavings: modelsWithSavings[0].annualSavings,
            savingsPercentage: modelsWithSavings[0].savingsPercentage
        }
    };
}

// Generate employee training curriculum based on company needs
export function generateTrainingCurriculum(requirements, teamSize) {
    const {
        currentSkillLevel, // 'beginner', 'intermediate', 'advanced'
        focusAreas, // ['cost-optimization', 'prompt-engineering', 'model-selection', 'safety']
        timeframe // weeks
    } = requirements;

    const baseModules = [
        {
            id: 'intro',
            title: '프롬프트 엔지니어링 기초',
            duration: '2시간',
            difficulty: 'beginner',
            topics: [
                'AI 언어 모델의 이해',
                '효과적인 프롬프트 작성 원칙',
                'Role-Context-Action 구조',
                '실습: 첫 프롬프트 작성'
            ]
        },
        {
            id: 'cost',
            title: '토큰 최적화 및 비용 절감',
            duration: '3시간',
            difficulty: 'intermediate',
            topics: [
                '토큰 카운팅 메커니즘 이해',
                '불필요한 토큰 제거 기법',
                '모델별 가격 비교',
                '실습: 비용 50% 절감 챌린지'
            ]
        },
        {
            id: 'models',
            title: 'AI 모델 선택 전략',
            duration: '2.5시간',
            difficulty: 'intermediate',
            topics: [
                'GPT vs Claude vs Gemini 비교',
                '사용 사례별 최적 모델',
                '성능-비용 트레이드오프',
                '실습: 프로젝트별 모델 선택'
            ]
        },
        {
            id: 'advanced',
            title: '고급 프롬프트 엔지니어링',
            duration: '4시간',
            difficulty: 'advanced',
            topics: [
                'Few-shot 및 Chain-of-Thought',
                '프롬프트 체이닝 및 분해',
                '컨텍스트 윈도우 최적화',
                '실습: 복잡한 워크플로우 구축'
            ]
        },
        {
            id: 'safety',
            title: 'AI 안전성 및 윤리',
            duration: '2시간',
            difficulty: 'intermediate',
            topics: [
                'Prompt Injection 방어',
                '편향 및 유해 콘텐츠 방지',
                '데이터 프라이버시',
                '기업 정책 준수'
            ]
        }
    ];

    // Filter modules based on skill level and focus areas
    const selectedModules = baseModules.filter(module => {
        if (currentSkillLevel === 'beginner' && module.difficulty === 'advanced') {
            return false;
        }
        if (focusAreas && focusAreas.length > 0) {
            return focusAreas.some(area => module.id.includes(area.split('-')[0]));
        }
        return true;
    });

    const totalHours = selectedModules.reduce((sum, module) => {
        return sum + parseFloat(module.duration);
    }, 0);

    const costPerEmployee = totalHours * 150; // $150/hour training cost
    const totalTrainingCost = costPerEmployee * teamSize;

    return {
        curriculum: selectedModules,
        summary: {
            totalModules: selectedModules.length,
            totalHours,
            recommendedWeeks: Math.ceil(totalHours / (timeframe || 4)),
            costPerEmployee,
            totalCost: totalTrainingCost,
            teamSize
        },
        schedule: generateTrainingSchedule(selectedModules, timeframe || 4)
    };
}

function generateTrainingSchedule(modules, weeks) {
    const schedule = [];
    const modulesPerWeek = Math.ceil(modules.length / weeks);

    for (let week = 0; week < weeks; week++) {
        const weekModules = modules.slice(week * modulesPerWeek, (week + 1) * modulesPerWeek);
        schedule.push({
            week: week + 1,
            modules: weekModules.map(m => m.title),
            totalHours: weekModules.reduce((sum, m) => sum + parseFloat(m.duration), 0)
        });
    }

    return schedule;
}

// Calculate ROI for enterprise implementation
export function calculateEnterpriseROI(requirements, recommendation, training) {
    const {
        implementationCost = 5000, // One-time setup cost
        monthlyMaintenanceCost = 500
    } = requirements;

    const monthlySavings = recommendation.potentialSavings.monthlySavings;
    const annualSavings = recommendation.potentialSavings.annualSavings;
    const trainingCost = training.summary.totalCost;

    const totalInitialInvestment = implementationCost + trainingCost;
    const firstYearSavings = annualSavings - (monthlyMaintenanceCost * 12);
    const firstYearROI = ((firstYearSavings - totalInitialInvestment) / totalInitialInvestment) * 100;
    const breakEvenMonths = totalInitialInvestment / (monthlySavings - monthlyMaintenanceCost);

    const projections = [];
    for (let year = 1; year <= 5; year++) {
        const yearSavings = annualSavings - (monthlyMaintenanceCost * 12);
        const cumulativeSavings = (yearSavings * year) - totalInitialInvestment;
        const roi = (cumulativeSavings / totalInitialInvestment) * 100;

        projections.push({
            year,
            savings: yearSavings,
            cumulativeSavings,
            roi: roi.toFixed(1)
        });
    }

    return {
        initialInvestment: totalInitialInvestment,
        breakdown: {
            implementation: implementationCost,
            training: trainingCost,
            monthlyMaintenance: monthlyMaintenanceCost
        },
        savings: {
            monthly: monthlySavings,
            annual: annualSavings,
            firstYear: firstYearSavings
        },
        roi: {
            firstYear: firstYearROI.toFixed(1),
            breakEvenMonths: breakEvenMonths.toFixed(1)
        },
        projections
    };
}

// Generate comprehensive enterprise report
export function generateEnterpriseReport(requirements) {
    const analysis = analyzeEnterpriseRequirements(requirements);
    const training = generateTrainingCurriculum({
        currentSkillLevel: requirements.teamSkillLevel || 'intermediate',
        focusAreas: requirements.trainingFocus || ['cost-optimization', 'prompt-engineering'],
        timeframe: requirements.trainingWeeks || 4
    }, requirements.teamSize || 10);

    const roi = calculateEnterpriseROI(requirements, analysis, training);

    return {
        companyProfile: {
            monthlyApiCalls: requirements.monthlyApiCalls,
            currentModel: requirements.currentModel,
            teamSize: requirements.teamSize
        },
        costAnalysis: analysis,
        trainingPlan: training,
        roiAnalysis: roi,
        recommendations: generateRecommendations(analysis, training, roi),
        implementationTimeline: generateImplementationTimeline()
    };
}

function generateRecommendations(analysis, training, roi) {
    const recommendations = [];

    // Model recommendation
    recommendations.push({
        category: '모델 최적화',
        priority: 'high',
        title: `${analysis.recommendation.modelName}로 전환`,
        impact: `연간 $${analysis.potentialSavings.annualSavings.toFixed(0)} 절감 (${analysis.potentialSavings.savingsPercentage.toFixed(1)}%)`,
        action: '즉시 파일럿 프로그램 시작'
    });

    // Training recommendation
    if (training.summary.totalHours > 8) {
        recommendations.push({
            category: '직원 교육',
            priority: 'high',
            title: `${training.summary.totalModules}개 모듈 교육 프로그램`,
            impact: `${training.summary.teamSize}명 직원 역량 강화`,
            action: `${training.summary.recommendedWeeks}주 과정으로 진행`
        });
    }

    // ROI recommendation
    if (parseFloat(roi.roi.breakEvenMonths) < 6) {
        recommendations.push({
            category: 'ROI',
            priority: 'high',
            title: '빠른 투자 회수',
            impact: `${roi.roi.breakEvenMonths}개월 내 손익분기점 도달`,
            action: '경영진 승인 후 즉시 실행'
        });
    }

    return recommendations;
}

function generateImplementationTimeline() {
    return [
        { phase: '1단계: 분석 및 계획', duration: '1-2주', tasks: ['현재 상태 분석', '목표 설정', '예산 승인'] },
        { phase: '2단계: 파일럿', duration: '2-3주', tasks: ['소규모 팀 테스트', '모델 성능 검증', '비용 추적'] },
        { phase: '3단계: 교육', duration: '4주', tasks: ['직원 교육 진행', '베스트 프랙티스 수립', '가이드라인 문서화'] },
        { phase: '4단계: 전사 확대', duration: '4-6주', tasks: ['전체 조직 롤아웃', '모니터링 시스템 구축', '지속적 최적화'] }
    ];
}
