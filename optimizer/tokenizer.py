"""
토큰 분석 모듈
=============
tiktoken을 사용하여 프롬프트의 토큰 수를 측정하고,
토큰별 텍스트 매핑을 제공한다.
"""

import tiktoken


# 모델별 인코딩 매핑
MODEL_ENCODINGS = {
    "gpt-4o": "o200k_base",
    "gpt-4o-mini": "o200k_base",
    "gpt-4-turbo": "cl100k_base",
    "gpt-4": "cl100k_base",
    "gpt-3.5-turbo": "cl100k_base",
}


class TokenCounter:
    """tiktoken 기반 토큰 카운터"""

    def __init__(self, model: str = "gpt-4o-mini"):
        """
        Args:
            model: 사용할 모델 이름. 기본값은 gpt-4o-mini (저비용 모델).
        """
        self.model = model
        encoding_name = MODEL_ENCODINGS.get(model, "o200k_base")
        self.encoding = tiktoken.get_encoding(encoding_name)

    def count(self, text: str) -> int:
        """텍스트의 토큰 수를 반환한다."""
        if not text:
            return 0
        return len(self.encoding.encode(text))

    def tokenize(self, text: str) -> list[dict]:
        """
        텍스트를 토큰 단위로 분해하여 각 토큰의 정보를 반환한다.

        Returns:
            list[dict]: [{"token_id": int, "text": str, "bytes": int}, ...]
        """
        if not text:
            return []

        token_ids = self.encoding.encode(text)
        result = []
        for tid in token_ids:
            decoded = self.encoding.decode([tid])
            result.append({
                "token_id": tid,
                "text": decoded,
                "bytes": len(decoded.encode("utf-8")),
            })
        return result

    def compare(self, original: str, optimized: str) -> dict:
        """
        원본과 최적화 프롬프트의 토큰 수를 비교한다.

        Returns:
            dict: {
                "original_tokens": int,
                "optimized_tokens": int,
                "saved_tokens": int,
                "reduction_rate": float (0~1)
            }
        """
        orig_count = self.count(original)
        opt_count = self.count(optimized)
        saved = orig_count - opt_count
        rate = saved / orig_count if orig_count > 0 else 0.0

        return {
            "original_tokens": orig_count,
            "optimized_tokens": opt_count,
            "saved_tokens": saved,
            "reduction_rate": round(rate, 4),
        }
