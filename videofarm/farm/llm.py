"""LLM calls that must return JSON. Every call is validated; on failure the error is fed back and retried,
so small/weak models still converge."""
import json
import re
import time
import urllib.request

from . import config


class LLMError(RuntimeError):
    pass


def _post(messages, system, max_tokens):
    body = json.dumps({
        "model": config.LLM_MODEL,
        "max_tokens": max_tokens,
        "system": system,
        "messages": messages,
    }).encode()
    req = urllib.request.Request(config.LLM_URL, data=body, headers={
        "content-type": "application/json",
        "anthropic-version": "2023-06-01",
        "x-api-key": config.LLM_KEY,
    })
    with urllib.request.urlopen(req, timeout=240) as r:
        data = json.loads(r.read())
    if "error" in data:
        raise LLMError(str(data["error"]))
    return "".join(b.get("text", "") for b in data.get("content", []) if b.get("type") == "text")


def _extract_json(text):
    """Take the first top-level JSON object/array out of a reply (models love wrapping JSON in prose/fences)."""
    m = re.search(r"```(?:json)?\s*(.*?)```", text, re.S)
    if m:
        text = m.group(1)
    start = min([i for i in (text.find("{"), text.find("[")) if i != -1], default=-1)
    if start == -1:
        raise ValueError("no JSON object in reply")
    depth, in_str, esc = 0, False, False
    for i in range(start, len(text)):
        c = text[i]
        if in_str:
            if esc:
                esc = False
            elif c == "\\":
                esc = True
            elif c == '"':
                in_str = False
        elif c == '"':
            in_str = True
        elif c in "{[":
            depth += 1
        elif c in "}]":
            depth -= 1
            if depth == 0:
                return json.loads(text[start:i + 1])
    raise ValueError("unterminated JSON in reply")


def ask_json(prompt, validate, system="You are a precise assistant. Reply with JSON only.", max_tokens=8000, log=None):
    """Ask for JSON; `validate(obj)` returns the (possibly normalized) object or raises ValueError(reason)."""
    messages = [{"role": "user", "content": prompt}]
    last_err = None
    for attempt in range(1, config.LLM_RETRIES + 1):
        if log:
            log(f"llm request (attempt {attempt}, {len(prompt)} chars)")
        try:
            reply = _post(messages, system, max_tokens)
        except Exception as e:  # network / quota / hung upstream: back off and retry the same request
            last_err = f"request failed: {e}"
            if log:
                log(f"llm {last_err}")
            time.sleep(min(60, 5 * attempt))
            continue
        try:
            obj = validate(_extract_json(reply))
            if log:
                log(f"llm ok (attempt {attempt})")
            return obj
        except (ValueError, KeyError, TypeError) as e:
            last_err = str(e)
            if log:
                log(f"llm reply rejected (attempt {attempt}): {last_err}")
            messages = messages + [
                {"role": "assistant", "content": reply},
                {"role": "user", "content": f"That reply was rejected: {last_err}\n"
                                            f"Fix it and reply again with the complete corrected JSON only."},
            ]
    raise LLMError(f"LLM failed after {config.LLM_RETRIES} attempts: {last_err}")
