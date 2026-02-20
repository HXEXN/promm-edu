import re
from datetime import datetime

DOMAIN_WEIGHTS = {
    'coding': {'clarity': 0.15, 'specificity': 0.20, 'structure': 0.20, 'completeness': 0.15, 'efficiency': 0.10, 'actionability': 0.15, 'domainFit': 0.05},
    'creative': {'clarity': 0.20, 'specificity': 0.10, 'structure': 0.10, 'completeness': 0.15, 'efficiency': 0.05, 'actionability': 0.20, 'domainFit': 0.20},
    'business': {'clarity': 0.15, 'specificity': 0.15, 'structure': 0.20, 'completeness': 0.20, 'efficiency': 0.10, 'actionability': 0.15, 'domainFit': 0.05},
    'education': {'clarity': 0.25, 'specificity': 0.15, 'structure': 0.15, 'completeness': 0.15, 'efficiency': 0.05, 'actionability': 0.15, 'domainFit': 0.10},
    'general': {'clarity': 0.20, 'specificity': 0.15, 'structure': 0.15, 'completeness': 0.15, 'efficiency': 0.10, 'actionability': 0.15, 'domainFit': 0.10}
}

EVALUATION_RULES = {
    'clarity': {
        'positivePatterns': [
            {'pattern': re.compile(r'^you are', re.I), 'points': 10, 'label': 'Clear role definition'},
            {'pattern': re.compile(r'\b(specifically|exactly|precisely)\b', re.I), 'points': 5, 'label': 'Precision words'},
            {'pattern': re.compile(r'\b(must|should|need to)\b', re.I), 'points': 5, 'label': 'Clear requirements'}
        ],
        'negativePatterns': [
            {'pattern': re.compile(r'\b(maybe|perhaps|possibly|might)\b', re.I), 'points': -5, 'label': 'Ambiguous hedging'},
            {'pattern': re.compile(r'\b(stuff|things|something|whatever)\b', re.I), 'points': -8, 'label': 'Vague terms'},
            {'pattern': re.compile(r'\b(etc|and so on|and more)\b', re.I), 'points': -5, 'label': 'Incomplete listing'}
        ],
        'baseScore': 50
    },
    'specificity': {
        'positivePatterns': [
            {'pattern': re.compile(r'\b\d+\s*(words?|characters?|lines?|sentences?)\b', re.I), 'points': 15, 'label': 'Quantified output'},
            {'pattern': re.compile(r'\b(example|for instance|such as)\b', re.I), 'points': 10, 'label': 'Examples provided'},
            {'pattern': re.compile(r'\b(between|range|from\s+\d+\s+to\s+\d+)\b', re.I), 'points': 10, 'label': 'Specific ranges'},
            {'pattern': re.compile(r'```[\s\S]*?```'), 'points': 15, 'label': 'Code examples'}
        ],
        'negativePatterns': [
            {'pattern': re.compile(r'\b(some|a few|several|many)\b', re.I), 'points': -5, 'label': 'Vague quantities'},
            {'pattern': re.compile(r'\b(good|nice|better|best|great)\b', re.I), 'points': -3, 'label': 'Subjective quality'}
        ],
        'baseScore': 40
    },
    'structure': {
        'positivePatterns': [
            {'pattern': re.compile(r'\n\d+\.\s'), 'points': 15, 'label': 'Numbered list'},
            {'pattern': re.compile(r'\n[-•]\s'), 'points': 10, 'label': 'Bullet points'},
            {'pattern': re.compile(r'#{1,6}\s'), 'points': 10, 'label': 'Headers'},
            {'pattern': re.compile(r'\*\*[^*]+\*\*'), 'points': 5, 'label': 'Bold emphasis'},
            {'pattern': re.compile(r'context:|background:|task:|output:|format:', re.I), 'points': 15, 'label': 'Section labels'}
        ],
        'negativePatterns': [
            {'pattern': re.compile(r'^[^\n]{500,}$', re.M), 'points': -15, 'label': 'Wall of text'},
            {'pattern': re.compile(r'([.!?])\s*\1'), 'points': -5, 'label': 'Repeated punctuation'}
        ],
        'baseScore': 45
    },
    'completeness': {
        'positivePatterns': [
            {'pattern': re.compile(r'you are|act as|role', re.I), 'points': 15, 'label': 'Role defined'},
            {'pattern': re.compile(r'context|background|given', re.I), 'points': 15, 'label': 'Context provided'},
            {'pattern': re.compile(r'task|goal|objective|purpose', re.I), 'points': 15, 'label': 'Task stated'},
            {'pattern': re.compile(r'format|structure|output', re.I), 'points': 10, 'label': 'Format specified'},
            {'pattern': re.compile(r'constraint|requirement|rule|must not', re.I), 'points': 10, 'label': 'Constraints listed'}
        ],
        'negativePatterns': [],
        'baseScore': 25
    },
    'efficiency': {
        'checkTokenEfficiency': True,
        'optimalTokenRange': {'min': 50, 'max': 500},
        'penaltyPerExtraToken': 0.05,
        'positivePatterns': [],
        'negativePatterns': [
            {'pattern': re.compile(r'\b(please|kindly|would you|could you)\b', re.I), 'points': -3, 'label': 'Unnecessary politeness'},
            {'pattern': re.compile(r'\b(very|really|extremely|absolutely)\b', re.I), 'points': -2, 'label': 'Excessive intensifiers'}
        ],
        'baseScore': 70
    },
    'actionability': {
        'positivePatterns': [
            {'pattern': re.compile(r'\b(write|create|generate|analyze|summarize|explain|describe)\b', re.I), 'points': 15, 'label': 'Action verb'},
            {'pattern': re.compile(r'\b(first|then|next|finally|step\s+\d+)\b', re.I), 'points': 10, 'label': 'Sequenced actions'},
            {'pattern': re.compile(r'\b(provide|include|ensure|make sure)\b', re.I), 'points': 8, 'label': 'Clear deliverables'}
        ],
        'negativePatterns': [
            {'pattern': re.compile(r'\?$', re.M), 'points': -5, 'label': 'Ends with question'}
        ],
        'baseScore': 45
    },
    'domainFit': {
        'domains': {
            'coding': [re.compile(r'\b(code|function|class|variable|algorithm|debug|refactor|api|database)\b', re.I)],
            'creative': [re.compile(r'\b(story|poem|creative|imaginative|artistic|narrative|character)\b', re.I)],
            'business': [re.compile(r'\b(business|market|strategy|roi|revenue|customer|sales|marketing)\b', re.I)],
            'education': [re.compile(r'\b(teach|learn|explain|student|lesson|curriculum|educational)\b', re.I)],
            'analysis': [re.compile(r'\b(analyze|data|statistics|trend|insight|research|evaluate)\b', re.I)]
        },
        'baseScore': 50
    }
}

IMPROVEMENT_SUGGESTIONS = {
    'clarity': {
        'low': [
            'Add a clear role definition at the beginning (e.g., "You are an expert...")',
            'Replace vague terms like "stuff" or "things" with specific nouns',
            'Use definitive language instead of "maybe" or "possibly"'
        ],
        'medium': ['Consider adding more precision words like "exactly" or "specifically"']
    },
    'specificity': {
        'low': [
            'Add specific numbers for output length (e.g., "500 words")',
            'Include concrete examples of desired output'
        ],
        'medium': ['Consider adding sample inputs and outputs']
    },
    'structure': {
        'low': [
            'Break the prompt into labeled sections (Role, Context, Task, Format)',
            'Use numbered lists for sequential instructions'
        ],
        'medium': ['Consider using headers or bold text for key sections']
    },
    'completeness': {
        'low': [
            'Add a role definition (who should the AI be?)',
            'Include context or background information',
            'Specify the desired output format'
        ],
        'medium': ['Consider adding examples of expected output']
    },
    'efficiency': {
        'low': [
            'Remove polite phrases like "please" or "would you"',
            'Eliminate filler words and redundant expressions'
        ],
        'medium': ['Consider more concise phrasing for long sentences']
    },
    'actionability': {
        'low': [
            'Start with a clear action verb (write, create, analyze, etc.)',
            'Specify the exact deliverable expected'
        ],
        'medium': ['Consider sequencing multiple tasks with "first", "then", "finally"']
    },
    'domainFit': {
        'low': ['Include domain-specific terminology'],
        'medium': ['Consider adding domain-specific constraints']
    }
}

class MultiDimensionalQualityScorer:
    def __init__(self, domain='general'):
        self.domain = domain
        self.weights = DOMAIN_WEIGHTS.get(domain, DOMAIN_WEIGHTS['general'])

    def evaluate_dimension(self, text: str, dimension: str):
        rules = EVALUATION_RULES.get(dimension)
        if not rules: return {'score': 0, 'details': []}

        score = rules.get('baseScore', 0)
        details = []

        for p in rules.get('positivePatterns', []):
            matches = p['pattern'].findall(text)
            if matches:
                count = len(matches)
                points = p['points'] * min(count, 3)
                score += points
                details.append({'type': 'positive', 'label': p['label'], 'points': points, 'count': count})

        for p in rules.get('negativePatterns', []):
            matches = p['pattern'].findall(text)
            if matches:
                count = len(matches)
                points = p['points'] * min(count, 3)
                score += points
                details.append({'type': 'negative', 'label': p['label'], 'points': points, 'count': count})

        if dimension == 'efficiency' and rules.get('checkTokenEfficiency'):
            word_count = len(re.split(r'\s+', text))
            if word_count > rules['optimalTokenRange']['max']:
                excess = word_count - rules['optimalTokenRange']['max']
                penalty = min(excess * rules['penaltyPerExtraToken'], 30)
                score -= penalty
                details.append({'type': 'negative', 'label': f"Exceeds optimal length by {excess} words", 'points': -penalty})

        if dimension == 'domainFit':
            detected_domains = []
            for dom, patterns in rules.get('domains', {}).items():
                for pattern in patterns:
                    if pattern.search(text):
                        detected_domains.append(dom)
                        break
            if detected_domains:
                score += 20
                details.append({'type': 'positive', 'label': f"Detected domains: {', '.join(detected_domains)}", 'points': 20})
            if self.domain in detected_domains:
                score += 15
                details.append({'type': 'positive', 'label': 'Matches target domain', 'points': 15})

        return {'score': max(0, min(100, score)), 'details': details}

    def evaluate(self, text: str):
        dimensions = ['clarity', 'specificity', 'structure', 'completeness', 'efficiency', 'actionability', 'domainFit']
        results = {}
        weighted_total = 0
        total_weight = 0

        for dim in dimensions:
            evaluation = self.evaluate_dimension(text, dim)
            weight = self.weights.get(dim, 0)
            weighted_score = evaluation['score'] * weight
            level = self._get_level(evaluation['score'])
            results[dim] = {'score': evaluation['score'], 'weight': weight, 'weightedScore': weighted_score, 'details': evaluation['details'], 'level': level}
            weighted_total += weighted_score
            total_weight += weight

        overall_score = round(weighted_total / total_weight) if total_weight > 0 else 0

        return {
            'overall': {'score': overall_score, 'grade': self._get_grade(overall_score), 'level': self._get_level(overall_score)},
            'dimensions': results,
            'recommendations': self._generate_recommendations(results),
            'radarData': self._format_for_radar(results),
            'metadata': {'domain': self.domain, 'weights': self.weights, 'algorithm': 'PROMM-MDQS-v1.0-FastAPI', 'timestamp': datetime.utcnow().isoformat() + 'Z'}
        }

    def _get_level(self, score: float) -> str:
        if score >= 80: return 'high'
        if score >= 50: return 'medium'
        return 'low'

    def _get_grade(self, score: float) -> str:
        if score >= 95: return 'A+'
        if score >= 90: return 'A'
        if score >= 85: return 'A-'
        if score >= 80: return 'B+'
        if score >= 75: return 'B'
        if score >= 70: return 'B-'
        if score >= 65: return 'C+'
        if score >= 60: return 'C'
        if score >= 55: return 'C-'
        if score >= 50: return 'D'
        return 'F'

    def _generate_recommendations(self, results: dict) -> list:
        recommendations = []
        sorted_dims = sorted(results.items(), key=lambda x: x[1]['score'])
        priority = 1
        for dim, data in sorted_dims[:3]:
            suggestions = IMPROVEMENT_SUGGESTIONS.get(dim)
            if suggestions:
                level = data['level']
                rel = suggestions.get(level, [])
                if level == 'low': rel.extend(suggestions.get('medium', []))
                recommendations.append({'dimension': dim, 'score': data['score'], 'priority': priority, 'suggestions': rel[:3]})
                priority += 1
        return recommendations

    def _format_for_radar(self, results: dict) -> list:
        names = {'clarity': '명확성', 'specificity': '구체성', 'structure': '구조성', 'completeness': '완전성', 'efficiency': '효율성', 'actionability': '실행가능성', 'domainFit': '도메인 적합성'}
        return [{'dimension': dim, 'displayName': names.get(dim, dim), 'score': data['score'], 'fullMark': 100} for dim, data in results.items()]
