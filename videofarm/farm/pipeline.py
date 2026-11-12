"""Run a job end to end. Every stage is skipped when its output exists, so `run` doubles as `resume`."""
import traceback

from . import images, package, render, shorts, style as S, voice, write

STAGES = ["outline", "script", "shots", "voice", "images", "render", "shorts", "package"]


def _stage(job, name, fn, *a):
    job.set_stage(name, "running")
    try:
        r = fn(*a)
    except Exception as e:
        job.set_stage(name, "error", f"{type(e).__name__}: {e}")
        job.log(traceback.format_exc())
        raise
    job.set_stage(name, "done")
    return r


def run(job, wait_images=True, image_timeout=None, rerender=False):
    if not job.style:
        if not job.path("styles.json").exists():
            _stage(job, "suggest", write.suggest, job)
        job.log("waiting for a style choice (farm pick <job> <style>)")
        return "needs-style"
    st = S.load(job.style)
    if not job.path("outline.json").exists():
        _stage(job, "outline", write.outline, job, st)
    if not job.stage_done("script"):
        _stage(job, "script", write.script, job, st)
    if not job.stage_done("shots"):
        _stage(job, "shots", write.shots, job, st)
    if not job.stage_done("images"):
        job.set_stage("images", "waiting", f"{len(images.missing(job))} missing")  # the worker starts now
    if not job.stage_done("voice"):
        _stage(job, "voice", voice.run, job, st)
    if not job.stage_done("images"):
        if wait_images:
            if not images.wait(job, timeout=image_timeout):
                job.log("image timeout: rendering with placeholders for the missing ones")
        else:
            job.log(f"rendering without waiting: {len(images.missing(job))} images still missing")
    if rerender or not job.stage_done("render"):
        _stage(job, "render", render.run, job, st)
    if rerender or not job.stage_done("shorts"):
        _stage(job, "shorts", shorts.run, job, st)
    if rerender or not job.stage_done("package"):
        _stage(job, "package", package.run, job, st)
    job.log("all done")
    return "done"
