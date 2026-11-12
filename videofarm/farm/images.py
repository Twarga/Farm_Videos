"""Plates come from Nano Banana through the Antigravity CLI. `agy` is logged in on the laptop, not on this host, so the
farm only owns the queue: images.json lists every plate a job needs, `pending_all` lists the ones still missing, and
farm/imgworker.py fills cache/images/<key>.png over ssh. `wait` blocks until a job's plates exist."""
import time

from . import config


def missing(job):
    q = job.read("images.json", {"images": []})["images"]
    return [i for i in q if not (config.IMAGE_CACHE / f"{i['key']}.png").exists()]


def pending_all():
    """Every missing plate of every job, with the job and style it belongs to (read by imgworker.py)."""
    from .job import all_jobs
    out = []
    for j in all_jobs():
        q = j.read("images.json")
        if q:
            out += [{**i, "job": j.slug, "style": q["style"]} for i in missing(j)]
    return out


def reset(job):
    """Forget this job's plates (e.g. after changing its image prompts) so the worker makes them again."""
    for i in job.read("images.json", {"images": []})["images"]:
        (config.IMAGE_CACHE / f"{i['key']}.png").unlink(missing_ok=True)
    job.set_stage("images", "waiting", f"{len(missing(job))} missing")


def wait(job, poll=5, timeout=None):
    """Block until every plate exists, publishing progress. False if `timeout` seconds pass first."""
    total = len(job.read("images.json")["images"])
    t0, last = time.time(), None
    while True:
        left = len(missing(job))
        if not left:
            job.set_stage("images", "done")
            return True
        if left != last:
            job.set_stage("images", "running" if left < total else "waiting", f"{total - left}/{total}")
            last = left
        if timeout is not None and time.time() - t0 > timeout:
            return False
        time.sleep(poll)
