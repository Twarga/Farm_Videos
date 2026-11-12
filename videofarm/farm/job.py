"""A job is a folder under jobs/. All state lives in files, so every stage can be re-run or resumed."""
import json
import re
import time
from pathlib import Path

from . import config


def slugify(s):
    s = re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")
    return s[:60] or "job"


class Job:
    def __init__(self, slug):
        self.slug = slug
        self.dir = config.JOBS / slug
        self.meta = self.read("job.json")

    # ---------- files ----------
    def path(self, name):
        return self.dir / name

    def read(self, name, default=None):
        p = self.path(name)
        return json.loads(p.read_text()) if p.exists() else default

    def write(self, name, obj):
        p = self.path(name)
        p.parent.mkdir(parents=True, exist_ok=True)
        tmp = p.with_suffix(p.suffix + ".tmp")
        tmp.write_text(json.dumps(obj, indent=2, ensure_ascii=False))
        tmp.replace(p)

    def save(self):
        self.write("job.json", self.meta)

    # ---------- progress ----------
    def log(self, msg):
        line = f"{time.strftime('%H:%M:%S')} {msg}"
        print(f"[{self.slug}] {line}", flush=True)
        with open(self.path("log.txt"), "a") as f:
            f.write(line + "\n")

    def set_stage(self, stage, state, detail=""):
        self.meta.setdefault("stages", {})[stage] = {"state": state, "detail": detail, "t": time.time()}
        self.save()

    def stage_done(self, stage):
        return self.meta.get("stages", {}).get(stage, {}).get("state") == "done"

    @property
    def style(self):
        return self.meta.get("style")

    @staticmethod
    def create(subject, title, style=None, minutes=None, shorts=3):
        slug = slugify(title)
        base, n = slug, 2
        while (config.JOBS / slug).exists():
            slug, n = f"{base}-{n}", n + 1
        (config.JOBS / slug).mkdir(parents=True)
        job = Job.__new__(Job)
        job.slug, job.dir = slug, config.JOBS / slug
        job.meta = {"slug": slug, "subject": subject, "title": title, "style": style,
                    "minutes": minutes, "shorts": shorts, "created": time.time(), "stages": {}}
        job.save()
        return job


def all_jobs():
    return sorted((Job(p.name) for p in config.JOBS.iterdir() if (p / "job.json").exists()),
                  key=lambda j: -j.meta.get("created", 0))
