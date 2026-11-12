#!/usr/bin/env bash
# Starts the Habibi-TTS browser interface on http://127.0.0.1:7860
# First start downloads all Habibi models (about 10 GB) into ~/.cache/huggingface.
cd "$(dirname "$0")"
exec .venv/bin/habibi-tts_infer-gradio --host 127.0.0.1 --port 7860
