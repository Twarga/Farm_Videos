"""Thumbnail + YouTube text (title, description with chapter timestamps, tags)."""
import re

from PIL import Image, ImageDraw

from . import config, gfx, llm


def ts(sec):
    sec = int(sec)
    return f"{sec // 3600}:{sec % 3600 // 60:02d}:{sec % 60:02d}" if sec >= 3600 else f"{sec // 60}:{sec % 60:02d}"


def thumbnail(job, st):
    W, H = 1280, 720
    chs = [c for c in job.read("shots.json")["chapters"] if not c.get("intro")]
    title = job.meta["title"]
    if st["transition"] == "roster":  # Professor: roster grid of icon discs under a big title, one red word
        im = Image.new("RGB", (W, H), (255, 255, 255))
        words = title.split()
        red = max(range(len(words)), key=lambda i: (words[i].isupper(), len(words[i])))
        f = gfx.fit_font(st["fonts"]["title"], title.upper(), W - 80, 150, 120)
        d = ImageDraw.Draw(im)
        full = " ".join(w.upper() for w in words)
        x = (W - d.textlength(full, font=f)) / 2
        for i, w in enumerate(words):
            col = gfx.hexrgb(st["palette"]["accent"]) if i == red else (15, 15, 15)
            d.text((x, 38), w.upper(), font=f, fill=col, stroke_width=2, stroke_fill=col)
            x += d.textlength(w.upper() + " ", font=f)
        show = chs[:10]
        cols = min(5, len(show))
        rows = (len(show) + cols - 1) // cols
        dd = int(min((W - 80) / cols * 0.80, (H - 230) / rows * 0.72))
        for i, ch in enumerate(show):
            r, c = divmod(i, cols)
            cx = 40 + (W - 80) / cols * (c + 0.5)
            cy = 215 + (H - 230) / rows * (r + 0.42)
            disc = gfx.icon_disc(ch.get("icon_image"), ch.get("color") or "#888888", dd)
            im.paste(disc, (int(cx - dd / 2), int(cy - dd / 2)), disc)
            lf = gfx.fit_font(st["fonts"]["label"], ch["name"], (W - 80) / cols * 0.95, 40, 30)
            d.text((cx, cy + dd / 2 + 22), ch["name"], font=lf, fill=(15, 15, 15), anchor="mm")
    else:  # Stickman: black, character close-up on the right, shouted phrase on the left
        im = Image.new("RGB", (W, H), (10, 10, 10))
        key = next((s["image"] for c in chs for s in c["shots"] if s["kind"] == "image"
                    and (config.IMAGE_CACHE / f"{s['image']}.png").exists()), None)
        if key:
            pic = gfx.source(key, 760, 720, st["palette"]["bg"])
            pic = pic.crop(((pic.width - 760) // 2, 0, (pic.width - 760) // 2 + 760, 720))
            im.paste(pic, (W - 760, 0))
            fade = Image.linear_gradient("L").rotate(90).resize((200, H))
            im.paste(Image.new("RGB", (200, H), (10, 10, 10)), (W - 760, 0), fade)
        words = re.sub(r"[^\w' ]", "", title).split()
        phrase = " ".join(words[:5]).upper()
        gfx.draw_center(im, phrase, st["fonts"]["card"], (40, 80, 560, 640), (245, 240, 230), start=130,
                        stroke=4, stroke_color=(0, 0, 0))
        ImageDraw.Draw(im).rectangle((40, 650, 300, 662), fill=gfx.hexrgb(st["palette"]["accent"]))
    out = job.path("out/thumbnail.png")
    im.save(out)
    return out


def metadata(job, st):
    tl = job.read("timeline.json")
    chapters = "\n".join(f"{ts(c['start'])} {c['name'] if not c['intro'] else 'Intro'}" for c in tl["chapters"])

    def validate(o):
        desc = str(o["description"]).strip()
        tags = [str(t).strip() for t in o["tags"] if str(t).strip()][:15]
        if len(desc.split()) < 20 or len(tags) < 5:
            raise ValueError("description needs 2-4 sentences and at least 5 tags")
        return {"description": desc, "tags": tags}

    names = ", ".join(c["name"] for c in tl["chapters"] if not c["intro"])
    try:
        m = llm.ask_json(f"Write the YouTube description opening (2-4 sentences, no emojis spam, no links) and 10 "
                         f"search tags for this video.\nTitle: {job.meta['title']}\nTopics covered: {names}\n"
                         f'Reply with JSON only: {{"description": "...", "tags": ["..."]}}', validate, log=job.log)
    except llm.LLMError:
        m = {"description": f"{job.meta['title']}. In this video: {names}.", "tags": [job.meta["subject"]]}
    text = (f"TITLE\n{job.meta['title']}\n\nDESCRIPTION\n{m['description']}\n\nChapters\n{chapters}\n\n"
            f"TAGS\n{', '.join(m['tags'])}\n")
    job.path("out/youtube.txt").write_text(text)
    return text


def run(job, st):
    thumbnail(job, st)
    metadata(job, st)
