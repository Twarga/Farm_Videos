"""Plates are drawn in code: farm/compose.py lays each shot's validated recipe (shot['spec']) out with the hand-built
vector art (farm/art.py, farm/props_*.py) into cache/images/<key>.png. No image model is involved."""
from PIL import Image

from . import compose, config, style as S
from .art import Canvas


def missing(job):
    q = job.read("images.json", {"images": []})["images"]
    return [i for i in q if not (config.IMAGE_CACHE / f"{i['key']}.png").exists()]


def reset(job):
    """Forget this job's plates (after changing the art or a spec) so `wait` draws them again."""
    for i in job.read("images.json", {"images": []})["images"]:
        (config.IMAGE_CACHE / f"{i['key']}.png").unlink(missing_ok=True)
    job.set_stage("images", "waiting", f"{len(missing(job))} missing")


def _icon(prop):
    cv = Canvas((1, 1, 1), 1024, 1024)
    compose.PROPS[prop](cv, 512, 512, 760, "professor")
    surf = cv.s
    return Image.frombuffer("RGBA", (1024, 1024), bytes(surf.get_data()), "raw", "BGRA", 0, 1).convert("RGB")


def _fill(job, st):
    """Draw every missing plate of this job, right now."""
    miss = missing(job)
    shots = job.read("shots.json", {"chapters": []})["chapters"]
    by_key = {}
    for ch in shots:
        for s in ch["shots"] if ch else []:
            if s.get("image"):
                by_key[s["image"]] = (s, ch)
        if ch and ch.get("icon_image"):
            by_key[ch["icon_image"]] = (None, ch)
    total = len(job.read("images.json")["images"])
    done = total - len(miss)
    for item in miss:
        s, ch = by_key[item["key"]]
        if item["kind"] == "icon":
            im = _icon(ch.get("icon_prop") or "lightbulb")
        else:
            im = compose.render(job.style, s["spec"], ch.get("outfit", ""), st["palette"])
        im.save(config.IMAGE_CACHE / f"{item['key']}.png")
        done += 1
        job.set_stage("images", "running", f"{done}/{total}")
    job.log(f"{len(miss)} plates drawn")


def wait(job, poll=5, timeout=None):
    _fill(job, S.load(job.style))
    job.set_stage("images", "done")
    return True
