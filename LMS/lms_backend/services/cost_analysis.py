import math
import re

MODEL_PRICING = {
    'gpt-5.2': {
        'name': 'GPT-5.2 (Garlic)',
        'provider': 'OpenAI',
        'inputCostPer1M': 2.50,
        'outputCostPer1M': 10.00,
        'contextWindow': 512000,
        'description': '최신 멀티모달 모델, 코딩/로직 최강'
    },
    'gpt-5': {
        'name': 'GPT-5',
        'provider': 'OpenAI',
        'inputCostPer1M': 2.00,
        'outputCostPer1M': 8.00,
        'contextWindow': 256000,
        'description': '범용 최상위 모델'
    },
    'claude-opus-4.6': {
        'name': 'Claude Opus 4.6',
        'provider': 'Anthropic',
        'inputCostPer1M': 15.00,
        'outputCostPer1M': 75.00,
        'contextWindow': 1000000,
        'description': 'Agent Team 지원, 1M 컨텍스트'
    },
    'claude-sonnet-5': {
        'name': 'Claude Sonnet 5',
        'provider': 'Anthropic',
        'inputCostPer1M': 3.00,
        'outputCostPer1M': 15.00,
        'contextWindow': 500000,
        'description': '균형잡힌 성능, 500K 컨텍스트'
    },
    'gemini-3-pro': {
        'name': 'Gemini 3 Pro',
        'provider': 'Google',
        'inputCostPer1M': 1.75,
        'outputCostPer1M': 7.00,
        'contextWindow': 2000000,
        'description': 'Deep Think 모드, 2M 컨텍스트'
    },
    'gemini-3-flash': {
        'name': 'Gemini 3 Flash',
        'provider': 'Google',
        'inputCostPer1M': 0.10,
        'outputCostPer1M': 0.40,
        'contextWindow': 1000000,
        'description': '초저가 고속 모델, 대량 처리에 적합'
    }
}

def estimate_token_count(text: str) -> int:
    if not text: return 0
    korean_chars = len(re.findall(r'[가-힣]', text))
    english_words = len(re.findall(r'[a-zA-Z]+', text))
    numbers = len(re.findall(r'\d+', text))
    punctuation = len(re.findall(r'[.,!?;:()]', text))

    token_count = 0.0
    token_count += korean_chars * 2.5
    token_count += english_words * 1.3
    token_count += numbers + punctuation * 0.5

    return math.ceil(token_count)

def calculate_model_cost(input_tokens: int, output_tokens: int, model_id: str):
    pricing = MODEL_PRICING.get(model_id)
    if not pricing: return None

    input_cost = (input_tokens / 1000000.0) * pricing['inputCostPer1M']
    output_cost = (output_tokens / 1000000.0) * pricing['outputCostPer1M']
    total_cost = input_cost + output_cost

    return {
        'modelId': model_id,
        'modelName': pricing['name'],
        'provider': pricing['provider'],
        'inputTokens': input_tokens,
        'outputTokens': output_tokens,
        'inputCost': input_cost,
        'outputCost': output_cost,
        'totalCost': total_cost,
        'costPer1000': total_cost * 1000
    }

def compare_all_models(input_tokens: int, output_tokens: int):
    comparisons = []
    for model_id in MODEL_PRICING.keys():
        res = calculate_model_cost(input_tokens, output_tokens, model_id)
        if res: comparisons.append(res)
        
    comparisons.sort(key=lambda x: x['totalCost'])
    most_expensive = comparisons[-1]

    for model in comparisons:
        model['savingsVsMostExpensive'] = most_expensive['totalCost'] - model['totalCost']
        model['savingsPercentage'] = (model['savingsVsMostExpensive'] / most_expensive['totalCost']) * 100 if most_expensive['totalCost'] > 0 else 0

    return {
        'models': comparisons,
        'cheapest': comparisons[0],
        'mostExpensive': most_expensive,
        'maxSavings': most_expensive['totalCost'] - comparisons[0]['totalCost'],
        'maxSavingsPercentage': ((most_expensive['totalCost'] - comparisons[0]['totalCost']) / most_expensive['totalCost'] * 100) if most_expensive['totalCost'] > 0 else 0
    }

def recommend_model(input_tokens: int, output_tokens: int, priority: str = 'cost'):
    comparison = compare_all_models(input_tokens, output_tokens)
    if priority == 'cost': return comparison['cheapest']
    elif priority == 'performance': return next((m for m in comparison['models'] if m['modelId'] == 'gpt-5.2'), comparison['cheapest'])
    elif priority == 'balance': return next((m for m in comparison['models'] if m['modelId'] == 'claude-sonnet-5'), comparison['cheapest'])
    elif priority == 'context': return next((m for m in comparison['models'] if m['modelId'] == 'gemini-3-pro'), comparison['cheapest'])
    return comparison['cheapest']

def calculate_annual_savings(original_tokens: int, optimized_tokens: int, requests_per_year: int, model_id: str):
    original_cost = calculate_model_cost(original_tokens, 50, model_id)
    optimized_cost = calculate_model_cost(optimized_tokens, 50, model_id)
    
    savings_per_request = original_cost['totalCost'] - optimized_cost['totalCost']
    annual_savings = savings_per_request * requests_per_year
    savings_percentage = (savings_per_request / original_cost['totalCost'] * 100) if original_cost['totalCost'] > 0 else 0
    
    return {
        'originalCostPerRequest': original_cost['totalCost'],
        'optimizedCostPerRequest': optimized_cost['totalCost'],
        'savingsPerRequest': savings_per_request,
        'requestsPerYear': requests_per_year,
        'annualSavings': annual_savings,
        'savingsPercentage': savings_percentage,
        'tokenReduction': original_tokens - optimized_tokens,
        'tokenReductionPercentage': ((original_tokens - optimized_tokens) / original_tokens * 100) if original_tokens > 0 else 0
    }

def analyze_prompt_cost(role: str, context: str, action: str):
    full_prompt = '\n'.join(filter(None, [role, context, action]))
    input_tokens = estimate_token_count(full_prompt)
    estimated_output_tokens = 50
    
    comparison = compare_all_models(input_tokens, estimated_output_tokens)
    efficiency_score = max(0, min(100, 100 - (input_tokens / 5.0)))
    
    status = 'efficient'
    if input_tokens > 200: status = 'inefficient'
    elif input_tokens > 100: status = 'moderate'
    
    return {
        'inputTokens': input_tokens,
        'estimatedOutputTokens': estimated_output_tokens,
        'efficiencyScore': round(efficiency_score),
        'status': status,
        'modelComparison': comparison,
        'recommendation': recommend_model(input_tokens, estimated_output_tokens, 'cost')
    }
