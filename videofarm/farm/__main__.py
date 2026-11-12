"""CLI.  python -m farm <command>

  new "<subject>" "<title>" [--style NAME] [--minutes N] [--shorts N]   create a job (prints its id)
  suggest <job>                    score every style for the job, propose titles
  pick <job> <style> [--title T]   choose the style (and optionally a suggested title)
  run <job> [--no-wait] [--rerender]   run / resume the whole pipeline
  specs <job>                      turn the storyboard's scene text into drawable recipes (shot specs)
  reimage <job>                    drop the job's plates so they are drawn again (after changing the art)
  status                           one line per job
  styles                           list style packs
"""
import argparse
import json
import sys

from . import images, pipeline, style as S, write
from .job import Job, all_jobs


def main(argv=None):
    ap = argparse.ArgumentParser(prog="farm", description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)
    p = sub.add_parser("new")
    p.add_argument("subject")
    p.add_argument("title")
    p.add_argument("--style", choices=S.names())
    p.add_argument("--minutes", type=float)
    p.add_argument("--shorts", type=int, default=3)
    sub.add_parser("suggest").add_argument("job")
    p = sub.add_parser("pick")
    p.add_argument("job")
    p.add_argument("style", choices=S.names())
    p.add_argument("--title")
    p = sub.add_parser("run")
    p.add_argument("job")
    p.add_argument("--no-wait", action="store_true")
    p.add_argument("--rerender", action="store_true")
    sub.add_parser("reimage").add_argument("job")
    sub.add_parser("specs").add_argument("job")
    sub.add_parser("status")
    sub.add_parser("styles")
    a = ap.parse_args(argv)

    if a.cmd == "new":
        j = Job.create(a.subject, a.title, a.style, a.minutes, a.shorts)
        print(j.slug)
    elif a.cmd == "suggest":
        print(json.dumps(write.suggest(Job(a.job)), indent=2))
    elif a.cmd == "pick":
        j = Job(a.job)
        j.meta["style"] = a.style
        if a.title:
            j.meta["title"] = a.title
        j.save()
        print(f"{j.slug}: style={a.style} title={j.meta['title']}")
    elif a.cmd == "run":
        print(pipeline.run(Job(a.job), wait_images=not a.no_wait, rerender=a.rerender))
    elif a.cmd == "reimage":
        images.reset(Job(a.job))
    elif a.cmd == "specs":
        j = Job(a.job)
        write.specs(j, S.load(j.style))
    elif a.cmd == "status":
        for j in all_jobs():
            st = " ".join(f"{k}:{v['state']}" + (f"({v['detail']})" if v.get("detail") else "")
                          for k, v in j.meta.get("stages", {}).items())
            print(f"{j.slug:40s} {j.style or '-':10s} {st}")
    elif a.cmd == "styles":
        for n in S.names():
            print(n, "-", S.load(n)["pitch"])


if __name__ == "__main__":
    sys.exit(main())
