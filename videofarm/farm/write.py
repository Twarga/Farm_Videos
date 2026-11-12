"""LLM stages: suggest → outline → script → shots. One small validated JSON per call; resumable per chapter."""
import concurrent.futures as cf
import math
import re
import threading

from . import llm, style as S


def _words(s):
    return len(re.findall(r"[A-Za-z0-9'’$%.,-]+", s))


# ---------------------------------------------------------------- suggest
def suggest(job):
    styles = [S.load(n) for n in S.names()]
    menu = "\n".join(f'- "{s["name"]}": {s["pitch"]} Best for: {", ".join(s["best_for"])}. '
                     f'Example titles: {"; ".join(s["title_examples"])}' for s in styles)
    names = [s["name"] for s in styles]

    def validate(o):
        out = {}
        for n in names:
            v = o["styles"][n]
            score = int(v["score"])
            if not 0 <= score <= 10:
                raise ValueError(f"score for {n} must be 0-10")
            titles = [str(t).strip() for t in v["titles"] if str(t).strip()]
            if len(titles) < 2:
                raise ValueError(f"give at least 2 alternative titles for {n}")
            out[n] = {"score": score, "why": str(v["why"]).strip(), "titles": titles[:4]}
        return {"styles": out, "best": max(out, key=lambda n: out[n]["score"])}

    res = llm.ask_json(
        f"""A YouTube video is being planned.
Subject: {job.meta['subject']}
Working title: {job.meta['title']}

Available visual/writing styles:
{menu}

For EACH style: score 0-10 how well it fits this subject (audience, tone, format), explain why in one sentence, and
write 3 alternative titles in that style's title formula (clickable, honest, under 70 characters).
Reply with JSON only: {{"styles": {{"<style name>": {{"score": 0, "why": "...", "titles": ["...", "...", "..."]}}}}}}
Style names: {", ".join(names)}""", validate, log=job.log)
    job.write("styles.json", res)
    return res


# ---------------------------------------------------------------- outline
def outline(job, st):
    minutes = job.meta.get("minutes") or st["long"]["target_minutes"]
    lo, hi = st["long"]["chapters"]

    def validate(o):
        ch = o["chapters"]
        if not lo <= len(ch) <= hi:
            raise ValueError(f"need between {lo} and {hi} chapters, got {len(ch)}")
        seen = set()
        for c in ch:
            c["name"] = re.sub(r"^\s*(#?\d+\s*[.):-]|\d+\s+)\s*", "", str(c["name"])).strip().rstrip(".")
            if not c["name"] or _words(c["name"]) > 7:
                raise ValueError(f"chapter name must be 1-7 words: {c['name']!r}")
            if c["name"].lower() in seen:
                raise ValueError(f"duplicate chapter {c['name']!r}")
            seen.add(c["name"].lower())
            c["angle"] = str(c["angle"]).strip()
            c["facts"] = [str(f) for f in c.get("facts", [])][:4]
            c["outfit"] = str(c.get("outfit") or "his usual clothes")
            c.setdefault("scenario", "")
            c.setdefault("icon", c["name"])
            col = str(c.get("color", ""))
            c["color"] = col if re.fullmatch(r"#[0-9A-Fa-f]{6}", col) else None
        if st["long"].get("intro") and _words(str(o.get("hook", ""))) < 12:
            raise ValueError("write the top-level 'hook' (2-4 sentences)")
        return o

    res = llm.ask_json(S.prompt(st, "outline", subject=job.meta["subject"], title=job.meta["title"],
                                min_ch=lo, max_ch=hi), validate, log=job.log)
    palette = ["#E8443A", "#3D7DD8", "#F28C28", "#2BA36B", "#8E5BD9", "#E05596", "#1BA6B0", "#C9A227",
               "#5C6B7A", "#D9534F", "#4CAF50", "#7E57C2", "#FF7043", "#26A69A"]
    for i, c in enumerate(res["chapters"]):
        c["color"] = c["color"] or palette[i % len(palette)]
    res["minutes"] = minutes
    job.write("outline.json", res)
    return res


# ---------------------------------------------------------------- script
def script(job, st):
    ol = job.read("outline.json")
    target_words = ol["minutes"] * st["words_per_minute"]
    chapters = list(ol["chapters"])
    sections = []
    if st["long"].get("intro"):
        sections.append({"name": "Intro", "angle": ol.get("hook", ""), "facts": [], "scenario": "",
                         "outfit": "no clothes, plain stick figure", "intro": True})
    sections += chapters
    n_body = len(chapters)
    lo, hi = st["chapter_words"]
    per = max(lo, math.ceil(target_words / n_body))
    max_sent = st["sentence_words"][1]

    done = job.read("script.json", {"chapters": []})["chapters"]
    for i, sec in enumerate(sections):
        if i < len(done):
            continue
        is_intro = sec.get("intro")
        mn, mx = (st["intro_words"] if is_intro else (per, max(hi, per + 50)))

        def validate(o, sec=sec, mn=mn, mx=mx, is_intro=is_intro):
            sents = [re.sub(r"\s+", " ", str(s)).strip() for s in o["sentences"] if str(s).strip()]
            if len(sents) < 4:
                raise ValueError("too few sentences")
            long_ones = [s for s in sents if _words(s) > max_sent]
            if long_ones:
                raise ValueError(f"these sentences are longer than {max_sent} words, split them: {long_ones[:3]}")
            total = sum(_words(s) for s in sents)
            if total < mn * 0.9:
                raise ValueError(f"too short: {total} words, need at least {mn}")
            if total > mx * 1.15:
                raise ValueError(f"too long: {total} words, keep it under {mx}")
            if st["name"] == "professor" and not is_intro:
                first = sents[0].lower().rstrip(".!")
                if sec["name"].lower().rstrip(".") not in first or _words(sents[0]) > 6:
                    raise ValueError(f'the first sentence must be just the item name, e.g. "{sec["name"]}."')
            return sents

        prev = done[-1]["sentences"][-3:] if done else "(none, this is the first)"
        sents = llm.ask_json(S.prompt(st, "script", title=job.meta["title"], name=sec["name"], angle=sec["angle"],
                                      facts="; ".join(sec.get("facts", [])) or "(general knowledge)",
                                      scenario=sec.get("scenario", ""), prev=prev, min_words=mn, max_words=mx),
                             validate, log=job.log)
        done.append({"name": sec["name"], "intro": bool(is_intro), "outfit": sec.get("outfit", ""),
                     "color": sec.get("color"), "icon": sec.get("icon", sec["name"]), "sentences": sents})
        job.write("script.json", {"chapters": done})
        job.log(f"script {i + 1}/{len(sections)} '{sec['name']}': {sum(_words(s) for s in sents)} words")
    total = sum(_words(s) for c in done for s in c["sentences"])
    job.log(f"script total {total} words ≈ {total / st['words_per_minute']:.1f} min")
    return done


# ---------------------------------------------------------------- shots
def shots(job, st, parallel=4):
    """Storyboard every chapter (independent, so in parallel). Each finished chapter is queued for images at once,
    so the image worker starts while the rest are still being written. shots.json holds null for unfinished ones."""
    sc = job.read("script.json")["chapters"]
    out = job.read("shots.json", {"chapters": []})["chapters"]
    out = (out + [None] * len(sc))[: len(sc)]
    cams = {"push", "pull", "left", "right", "still"}
    lock = threading.Lock()

    def board(ci):
        ch = sc[ci]
        n = len(ch["sentences"])

        def validate(o):
            sh = o["shots"]
            if len(sh) != n:
                raise ValueError(f"need exactly {n} shots (one per sentence), got {len(sh)}")
            cards = 0
            for k, s in enumerate(sh):
                s["kind"] = "card" if s.get("kind") == "card" else "image"
                s["text"] = str(s.get("text") or "").strip()
                s["scene"] = str(s.get("scene") or "").strip()
                s["camera"] = s.get("camera") if s.get("camera") in cams else "push"
                if s["kind"] == "card":
                    cards += 1
                    if k == 0:
                        raise ValueError("the first shot cannot be a card")
                    if not s["text"] or _words(s["text"]) > 6:
                        raise ValueError(f"card {k + 1} needs 1-6 words of text")
                else:
                    if _words(s["scene"]) < 6:
                        raise ValueError(f"shot {k + 1}: describe the scene in 15-40 words")
                    if _words(s["text"]) > 3:
                        s["text"] = " ".join(s["text"].split()[:3])
            if cards > 2:
                raise ValueError("use at most 1-2 cards per chapter")
            return sh

        numbered = "\n".join(f"{k + 1}. {s}" for k, s in enumerate(ch["sentences"]))
        sh = llm.ask_json(S.prompt(st, "shots", name=ch["name"], outfit=ch.get("outfit") or "his usual clothes",
                                   sentences=numbered, count=n), validate, max_tokens=48000, log=job.log)
        for s, line in zip(sh, ch["sentences"]):
            s["line"] = line
            if s["kind"] == "image":
                p = S.image_prompt(st, s["scene"], ch.get("outfit", ""), s["text"])
                s["prompt"], s["image"] = p, S.image_key(st, p)
        with lock:
            out[ci] = {**{k: ch[k] for k in ("name", "intro", "outfit", "color", "icon")}, "shots": sh}
            job.write("shots.json", {"chapters": out})
            queue_images(job, st)
            job.log(f"shots {sum(c is not None for c in out)}/{len(sc)} '{ch['name']}': {n}")

    todo = [ci for ci, c in enumerate(out) if c is None]
    if todo:
        with cf.ThreadPoolExecutor(parallel) as ex:
            for f in [ex.submit(board, ci) for ci in todo]:
                f.result()
    queue_images(job, st)
    return out


def queue_images(job, st):
    """images.json = every image this job needs so far (shots + chapter icons). The image worker fills cache/images."""
    data = job.read("shots.json")
    q, seen = [], set()
    for ch in data["chapters"]:
        if ch is None:
            continue
        if st["transition"] == "roster" and not ch.get("intro") and st["image"].get("icon"):
            p = S.icon_prompt(st, ch["icon"])
            ch["icon_image"] = S.image_key(st, p)
            if ch["icon_image"] not in seen:
                seen.add(ch["icon_image"])
                q.append({"key": ch["icon_image"], "prompt": p, "kind": "icon"})
        for s in ch["shots"]:
            if s["kind"] == "image" and s["image"] not in seen:
                seen.add(s["image"])
                q.append({"key": s["image"], "prompt": s["prompt"], "kind": "shot"})
    job.write("shots.json", data)
    job.write("images.json", {"style": st["name"], "ref": f"styles/{st['name']}/character.png", "images": q})
    if q and not job.stage_done("images"):
        job.set_stage("images", "waiting", f"{len(q)} queued")
    return q


def reprompt(job, st):
    """Rebuild every shot's image prompt and plate key from its stored scene with the current style pack and
    reference image (use after editing the pack), then requeue. Plates made from the old prompts are orphaned."""
    data = job.read("shots.json")
    for ch in data["chapters"]:
        for s in ch["shots"] if ch else []:
            if s["kind"] == "image":
                s["prompt"] = S.image_prompt(st, s["scene"], ch.get("outfit", ""), s["text"])
                s["image"] = S.image_key(st, s["prompt"])
    job.write("shots.json", data)
    q = queue_images(job, st)
    job.set_stage("images", "waiting", f"{len(q)} queued")
    return q
