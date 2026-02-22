/**
 * Generates mock data for Enterprise Dashboard visualization
 */

export const generateEnterpriseData = () => {
    return {
        overview: {
            totalEmployees: 142,
            activeLearners: 118,
            completionRate: 78,
            totalSavings: 15420, // USD
            avgEfficiencyScore: 84
        },
        departments: [
            { name: 'R&D', employees: 45, completion: 92, efficiency: 88, savings: 5200 },
            { name: 'Marketing', employees: 30, completion: 85, efficiency: 82, savings: 3100 },
            { name: 'Operations', employees: 55, completion: 65, efficiency: 75, savings: 4800 },
            { name: 'HR', employees: 12, completion: 95, efficiency: 90, savings: 2320 }
        ],
        monthlyUsage: [
            { month: '1월', tokens: 1200000, cost: 240, optimizedCost: 45 },
            { month: '2월', tokens: 1500000, cost: 300, optimizedCost: 55 },
            { month: '3월', tokens: 2100000, cost: 420, optimizedCost: 70 },
            { month: '4월', tokens: 2800000, cost: 560, optimizedCost: 95 },
            { month: '5월', tokens: 3500000, cost: 700, optimizedCost: 115 },
            { month: '6월', tokens: 4200000, cost: 840, optimizedCost: 140 }
        ]
    };
};
