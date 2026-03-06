"""
한국어 프롬프트 정제 규칙
========================
한국어 프롬프트에서 자주 발생하는 토큰 낭비 패턴을 정의한다.
"""

import re

# ──────────────────────────────────────
# 패턴 1: 과잉 공손 표현
# ──────────────────────────────────────
POLITE_PATTERNS = [
    # 서두 인사
    (r"안녕하세요[,.]?\s*", ""),
    (r"안녕하십니까[,.]?\s*", ""),
    (r"반갑습니다[,.]?\s*", ""),
    # 과잉 부탁
    (r"혹시\s*괜찮으시다면\s*", ""),
    (r"가능하시다면\s*", ""),
    (r"부탁드립니다[,.]?\s*", ""),
    (r"부탁드려요[,.]?\s*", ""),
    (r"감사합니다[,.]?\s*$", ""),
    (r"감사드립니다[,.]?\s*$", ""),
    (r"수고하세요[,.]?\s*$", ""),
    (r"고맙습니다[,.]?\s*$", ""),
    # 불필요한 겸양 표현
    (r"혹시\s+", ""),
    (r"실례지만\s*", ""),
    (r"죄송하지만\s*", ""),
    (r"바쁘시겠지만\s*", ""),
]

# ──────────────────────────────────────
# 패턴 2: 불필요한 접속사·수식어
# ──────────────────────────────────────
FILLER_PATTERNS = [
    (r"그리고\s+또한\s+", "또한 "),
    (r"또한\s+추가적으로\s+", "추가로 "),
    (r"그리고\s+추가적으로\s+", "추가로 "),
    (r"기본적으로\s+", ""),
    (r"일반적으로\s+말하자면\s+", ""),
    (r"사실상\s+", ""),
    (r"결론적으로\s+말하자면\s+", "결론적으로 "),
    (r"다시\s+말해서\s+", "즉 "),
    (r"다시\s+말하자면\s+", "즉 "),
    (r"즉,?\s+다시\s+말해\s+", "즉 "),
    (r"그래서\s+결국\s+", "결국 "),
    (r"아무튼\s+", ""),
    (r"어쨌든\s+", ""),
    (r"그런데\s+말이야\s+", ""),
]

# ──────────────────────────────────────
# 패턴 3: 반복 지시 패턴
# ──────────────────────────────────────
REPETITIVE_INSTRUCTION_PATTERNS = [
    # "꼭 반드시" 같은 중복 강조
    (r"꼭\s+반드시\s+", "반드시 "),
    (r"반드시\s+꼭\s+", "반드시 "),
    (r"절대로\s+절대\s+", "절대 "),
    (r"매우\s+매우\s+", "매우 "),
    (r"정말\s+정말\s+", "정말 "),
    (r"아주\s+매우\s+", "매우 "),
    (r"정말로\s+진짜로\s+", "정말 "),
    (r"확실하게\s+확실히\s+", "확실히 "),
    (r"명확하게\s+명확히\s+", "명확히 "),
]

# ──────────────────────────────────────
# 패턴 4: 불필요한 지시 문구
# ──────────────────────────────────────
UNNECESSARY_INSTRUCTION_PATTERNS = [
    (r"아래의?\s+내용을?\s+(?:잘\s+)?(?:읽고|보고)\s+", ""),
    (r"다음(?:의|에)\s+(?:대해|대한)\s+(?:자세하게|자세히|상세하게|상세히)\s+", "다음에 대해 "),
    (r"최대한\s+자세하게\s+", "자세히 "),
    (r"최대한\s+자세히\s+", "자세히 "),
    (r"가능한\s+한\s+자세하게\s+", "자세히 "),
    (r"(?:제가|내가)\s+(?:지금부터|이제)\s+(?:질문|물어볼)\s+", ""),
    (r"너는\s+(?:지금부터|이제부터)\s+", ""),
]


def get_all_korean_rules() -> list[tuple[str, str, str]]:
    """
    모든 한국어 규칙을 (패턴, 대체문자열, 카테고리) 튜플 목록으로 반환한다.
    """
    rules = []
    for pat, repl in POLITE_PATTERNS:
        rules.append((pat, repl, "과잉 공손 표현"))
    for pat, repl in FILLER_PATTERNS:
        rules.append((pat, repl, "불필요 접속사/수식어"))
    for pat, repl in REPETITIVE_INSTRUCTION_PATTERNS:
        rules.append((pat, repl, "반복 강조 표현"))
    for pat, repl in UNNECESSARY_INSTRUCTION_PATTERNS:
        rules.append((pat, repl, "불필요 지시 문구"))
    return rules


def apply_korean_rules(text: str) -> tuple[str, list[dict]]:
    """
    한국어 정제 규칙을 적용하고, 적용된 규칙 목록을 반환한다.

    Returns:
        tuple: (정제된 텍스트, [{"category": str, "pattern": str, "count": int}, ...])
    """
    applied = []
    for pattern, replacement, category in get_all_korean_rules():
        matches = re.findall(pattern, text)
        if matches:
            applied.append({
                "category": category,
                "pattern": pattern,
                "matched": matches[0] if matches else "",
                "count": len(matches),
            })
            text = re.sub(pattern, replacement, text)
    return text, applied
