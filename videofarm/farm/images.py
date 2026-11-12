"""Scene plates are drawn in code (farm/scenes.py) into cache/images/<key>.png.
`wait` renders whatever is missing; `pending_all` is kept for the web UI's queue view."""
from . import config, scenes


def missing(job):
    q = job.read("images.json", {"images": []})["images"]
    return [i for i in q if not (config.IMAGE_CACHE / f"{i['key']}.png").exists()]


def pending_all():
    """Every missing image across all jobs that are waiting for images (used by the web UI)."""
    from .job import all_jobs
    out = []
    for j in all_jobs():
        if j.meta.get("stages", {}).get("images", {}).get("state") in ("waiting", "running"):
            q = j.read("images.json", {})
            for i in missing(j):
                out.append({**i, "job": j.slug, "ref": q.get("ref")})
    return out


def _fill(job, st):
    """Draw every missing plate for this job, right now."""
    miss = missing(job)
    shots = job.read("shots.json", {"chapters": []})["chapters"]
    by_key = {}
    for ch in shots:
        if ch is None:
            continue
        for s in ch["shots"]:
            if s.get("image"):
                by_key[s["image"]] = (s, ch)
        if ch.get("icon_image"):
            by_key[ch["icon_image"]] = (None, ch)
    total = len(job.read("images.json")["images"])
    done = total - len(miss)
    for i, item in enumerate(miss):
        shot, ch = by_key.get(item["key"], ({}, {}))
        if item.get("kind") == "icon":
            item["icon"] = ch.get("icon", "lightbulb")
        item.setdefault("shot", shot)
        item.setdefault("chapter", ch)
        scenes.render_item(job.style, item, job.path)
        done += 1
        job.set_stage("images", "running", f"{done}/{total}")
        job.log(f"image {done}/{total} {item['key']} drawn")


def wait(job, poll=5, timeout=None):
    from . import style as S
    _fill(job, S.load(job.style))
    job.set_stage("images", "done")
    return True
