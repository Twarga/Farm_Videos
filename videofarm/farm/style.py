"""Style packs live in styles/<name>/ (style.json, character.png, prompts/*.md). Adding a style = adding a folder."""
import hashlib
import json
from functools import lru_cache

from . import config


@lru_cache(maxsize=None)
def load(name):
    d = config.STYLES / name
    s = json.loads((d / "style.json").read_text())
    s["dir"] = str(d)
    s["ref"] = str(d / "character.png")
    s["ref_sha"] = hashlib.sha1((d / "character.png").read_bytes()).hexdigest()[:12]
    return s


def names():
    return sorted(p.name for p in config.STYLES.iterdir() if (p / "style.json").exists())


def prompt(style, which, **kw):
    """Fill a prompt template; unknown {braces} in the template text are left alone."""
    text = (config.STYLES / style["name"] / "prompts" / f"{which}.md").read_text()
    for k, v in kw.items():
        text = text.replace("{" + k + "}", str(v))
    return text


def image_prompt(style, scene, outfit="", text=""):
    im = style["image"]
    parts = [im["prefix"], im["character"].replace("{outfit}", outfit or "his usual clothes"), im["composition"],
             im["text_some"].replace("{text}", text) if text else im["text_none"], f"SCENE: {scene}"]
    return " ".join(p.strip() for p in parts if p.strip())


def icon_prompt(style, icon):
    return style["image"]["icon"].replace("{icon}", icon)


def image_key(style, prompt_text):
    return hashlib.sha1(f"{style['name']}|{style['ref_sha']}|{prompt_text}".encode()).hexdigest()[:16]
