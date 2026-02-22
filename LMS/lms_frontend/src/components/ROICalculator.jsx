import { useState, useEffect } from 'react';
import './ROICalculator.css';

function ROICalculator() {
    const [employees, setEmployees] = useState(50);
    const [promptsPerDay, setPromptsPerDay] = useState(20);
    const [hourlyWage, setHourlyWage] = useState(30); // USD

    // Constants
    const AVG_TIME_PER_PROMPT_MINS = 5;
    const OPTIMIZED_TIME_MINS = 2;
    const WORKING_DAYS = 22;

    const [savings, setSavings] = useState({
        monthly: 0,
        yearly: 0,
        productivity: 0
    });

    useEffect(() => {
        // Calculation Logic
        const totalPrompts = employees * promptsPerDay * WORKING_DAYS;

        // Time savings (minutes)
        const timeSavedMins = totalPrompts * (AVG_TIME_PER_PROMPT_MINS - OPTIMIZED_TIME_MINS);
        const timeSavedHours = timeSavedMins / 60;

        // Cost savings (USD)
        const costSaved = timeSavedHours * hourlyWage;

        setSavings({
            monthly: Math.round(costSaved),
            yearly: Math.round(costSaved * 12),
            productivity: Math.round((timeSavedMins / (employees * 8 * 60 * WORKING_DAYS)) * 100)
        });
    }, [employees, promptsPerDay, hourlyWage]);

    return (
        <div className="card roi-calculator">
            <h3 className="card-title">💰 ROI 시뮬레이터</h3>

            <div className="roi-inputs">
                <div className="input-group">
                    <label>
                        직원 수: <strong>{employees}명</strong>
                    </label>
                    <input
                        type="range" min="5" max="500" step="5"
                        value={employees}
                        onChange={(e) => setEmployees(Number(e.target.value))}
                        className="slider"
                    />
                </div>

                <div className="input-group">
                    <label>
                        일일 프롬프트 사용량 (인당): <strong>{promptsPerDay}회</strong>
                    </label>
                    <input
                        type="range" min="1" max="100" step="1"
                        value={promptsPerDay}
                        onChange={(e) => setPromptsPerDay(Number(e.target.value))}
                        className="slider"
                    />
                </div>

                <div className="input-group">
                    <label>
                        평균 시급 (USD): <strong>${hourlyWage}</strong>
                    </label>
                    <input
                        type="range" min="10" max="200" step="5"
                        value={hourlyWage}
                        onChange={(e) => setHourlyWage(Number(e.target.value))}
                        className="slider"
                    />
                </div>
            </div>

            <div className="roi-results">
                <div className="result-item">
                    <span className="label">월간 예상 절감액</span>
                    <span className="value highlight">${savings.monthly.toLocaleString()}</span>
                </div>
                <div className="result-item">
                    <span className="label">연간 예상 절감액</span>
                    <span className="value success">${savings.yearly.toLocaleString()}</span>
                </div>
                <div className="result-item">
                    <span className="label">생산성 향상</span>
                    <span className="value productivity">+{savings.productivity}%</span>
                </div>
            </div>
        </div>
    );
}

export default ROICalculator;
