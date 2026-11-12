"""Paths and defaults. Override anything with environment variables (FARM_*)."""
import os
from pathlib import Path

ROOT = Path(os.environ.get("FARM_ROOT", Path(__file__).resolve().parent.parent))
JOBS = ROOT / "jobs"
STYLES = ROOT / "styles"
FONTS = ROOT / "fonts"
MODELS = ROOT / "models"
IMAGE_CACHE = ROOT / "cache" / "images"

# LLM: an Anthropic-compatible /v1/messages endpoint (the agentrouter proxy on tlab by default).
LLM_URL = os.environ.get("FARM_LLM_URL", "http://127.0.0.1:7187/v1/messages")
LLM_MODEL = os.environ.get("FARM_LLM_MODEL", "gpt-6.1-sol")
LLM_KEY = os.environ.get("FARM_LLM_KEY", "x")
LLM_RETRIES = int(os.environ.get("FARM_LLM_RETRIES", "4"))
LLM_TIMEOUT = int(os.environ.get("FARM_LLM_TIMEOUT", "240"))

FPS = 30
LONG_W, LONG_H = 1920, 1080
SHORT_W, SHORT_H = 1080, 1920
SR = 24000  # Kokoro sample rate; the whole mix is built at this rate, then encoded to 48k AAC

for d in (JOBS, IMAGE_CACHE):
    d.mkdir(parents=True, exist_ok=True)
