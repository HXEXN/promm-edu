import asyncio
from .cost_analysis import analyze_prompt_cost

def build_prompt(role: str, context: str, action: str):
    parts = []
    if role: parts.append(f"역할: {role}")
    if context: parts.append(f"상황: {context}")
    if action: parts.append(f"행동: {action}")
    return '\n'.join(parts)

def analyze_structure(role: str, context: str, action: str):
    score = 100
    feedback = []

    if not role or len(role) < 5:
        score -= 20
        feedback.append('⚠️ 역할(Role) 정의가 불명확합니다. 구체적인 페르소나를 지정하세요.')
    else:
        feedback.append('✅ 역할 정의가 훌륭합니다.')

    if not context or len(context) < 10:
        score -= 30
        feedback.append('⚠️ 상황(Context) 설명이 부족합니다. 현재 상태를 더 자세히 묘사하세요.')
    else:
        feedback.append('✅ 상황 설명이 명확합니다.')

    if not action or len(action) < 5:
        score -= 20
        feedback.append('⚠️ 행동(Action) 지시가 모호합니다. 원하는 결과를 명확히 요청하세요.')
    else:
        feedback.append('✅ 행동 지시가 구체적입니다.')

    if score < 60:
        feedback.append('💡 전체적으로 프롬프트의 완성도가 낮습니다. 3요소를 모두 갖춰보세요.')
    elif score >= 90:
        feedback.append('🏆 완벽한 프롬프트 구조입니다!')

    return {'score': score, 'feedback': feedback}

def generate_response_message(command: dict):
    msgs = {
        'pump': f"펌프를 {command.get('duration', 0)}초간 작동하여 물을 공급합니다.",
        'fan': f"환풍기를 {command.get('duration', 0)}초간 작동하여 환기를 실시합니다.",
        'led': f"LED 조명을 {command.get('duration', 0)}초간 켜서 광합성을 촉진합니다.",
        'none': '상황 분석 완료. 현재 조치가 필요하지 않습니다.'
    }
    return msgs.get(command.get('device', 'none'), msgs['none'])

async def execute_prompt(role: str, context: str, action: str, model: str = 'gpt-4o'):
    cost_analysis = analyze_prompt_cost(role, context, action)
    struct_analysis = analyze_structure(role, context, action)

    await asyncio.sleep(0.5)

    command = {'device': 'none', 'action': 'OFF', 'duration': 0}
    ctx_lower = (context or '').lower()
    act_lower = (action or '').lower()

    if any(k in ctx_lower for k in ['건조', '습도', 'dry', 'humidity']) or any(k in act_lower for k in ['물', 'water']):
        command = {'device': 'pump', 'action': 'ON', 'duration': 10}
    elif any(k in ctx_lower for k in ['더위', '환기', 'hot', 'ventilat']) or any(k in act_lower for k in ['팬', 'fan']):
        command = {'device': 'fan', 'action': 'ON', 'duration': 15}
    elif any(k in ctx_lower for k in ['어두', '광합성', 'dark', 'light']) or any(k in act_lower for k in ['조명', 'led']):
        command = {'device': 'led', 'action': 'ON', 'duration': 30}

    return {
        'success': True,
        'model': model,
        'analysis': {
            'tokenCount': cost_analysis['inputTokens'],
            'efficiencyScore': cost_analysis['efficiencyScore'],
            'structureScore': struct_analysis['score'],
            'feedback': struct_analysis['feedback'],
            'status': cost_analysis['status'],
            'costAnalysis': cost_analysis['modelComparison'],
            'recommendation': cost_analysis['recommendation']
        },
        'command': command,
        'message': generate_response_message(command)
    }
