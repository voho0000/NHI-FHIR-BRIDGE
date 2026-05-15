"""Robust JSON extraction shared by both Claude and Ollama providers.

LLM JSON output is rarely pristine: models wrap in markdown fences, prepend
prose ("Here's the JSON:"), append chatter, or get truncated mid-string by
max_tokens. A naive `json.loads()` fails for any of those.
"""
import json
import re

_JSON_FENCE = re.compile(r"```(?:json)?\s*(.*?)```", re.DOTALL)


def safe_json_loads(text: str) -> dict | list:
    """Extract a JSON object/array from `text` that may be wrapped in markdown
    fences, prefixed with prose, or have trailing chatter.

    Order of attempts:
      1. Whole text (covers Ollama format=json and well-behaved Claude)
      2. Content inside the first ```...``` fence
      3. The first balanced {...} block by brace matching, ignoring braces
         inside strings (handles cases where the fence isn't closed because
         max_tokens cut off the response mid-array)
      4. The first balanced [...] block, same logic
    """
    if not text:
        raise ValueError("empty response")

    text = text.strip()

    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    fence = _JSON_FENCE.search(text)
    if fence:
        candidate = fence.group(1).strip()
        try:
            return json.loads(candidate)
        except json.JSONDecodeError:
            # Fence body itself might be malformed; fall through to brace-match
            text = candidate

    for open_ch, close_ch in (("{", "}"), ("[", "]")):
        start = text.find(open_ch)
        if start < 0:
            continue
        block = _balanced_block(text, start, open_ch, close_ch)
        if block is None:
            continue
        try:
            return json.loads(block)
        except json.JSONDecodeError:
            continue

    raise ValueError(f"no parseable JSON found in: {text[:200]}")


def _balanced_block(text: str, start: int, open_ch: str, close_ch: str) -> str | None:
    """Return the substring from `start` to the matching close_ch, accounting
    for nesting and `"`-quoted strings. None when no balanced block exists.
    """
    depth = 0
    in_string = False
    escape = False
    for i in range(start, len(text)):
        ch = text[i]
        if escape:
            escape = False
            continue
        if ch == "\\" and in_string:
            escape = True
            continue
        if ch == '"':
            in_string = not in_string
            continue
        if in_string:
            continue
        if ch == open_ch:
            depth += 1
        elif ch == close_ch:
            depth -= 1
            if depth == 0:
                return text[start:i + 1]
    return None
