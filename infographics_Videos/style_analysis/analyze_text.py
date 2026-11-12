#!/usr/bin/env python3
import re, glob, os, json, statistics, collections

BASE = "/home/twarga/infographics_Videos"
OUT = os.path.join(BASE, "style_analysis")
CLEAN = os.path.join(OUT, "transcripts_clean")
os.makedirs(CLEAN, exist_ok=True)

def parse_srt(path):
    txt = open(path, encoding="utf-8", errors="ignore").read()
    blocks = re.split(r"\r?\n\s*\r?\n", txt)
    cues = []
    for b in blocks:
        parts = [p.strip() for p in b.split("\n") if p.strip()]
        idx = [i for i, p in enumerate(parts) if "-->" in p]
        if not idx:
            continue
        i = idx[0]
        m = re.search(r"(\d+):(\d+):(\d+)[,.](\d+)\s*-->\s*(\d+):(\d+):(\d+)[,.](\d+)", parts[i])
        if not m:
            continue
        g = list(map(int, m.groups()))
        start = g[0]*3600 + g[1]*60 + g[2] + g[3]/1000
        end = g[4]*3600 + g[5]*60 + g[6] + g[7]/1000
        text = " ".join(p for p in parts[i+1:] if p.strip())
        text = re.sub(r"<[^>]+>", "", text)
        text = re.sub(r"\s+", " ", text).strip()
        if text:
            cues.append((start, end, text))
    return cues

def dedupe(cues):
    out, prev = [], ""
    for start, end, text in cues:
        if prev and text.startswith(prev):
            add = text[len(prev):].strip()
        elif prev and prev.endswith(text):
            add = ""
        elif prev and text == prev:
            add = ""
        else:
            add = text
        if add:
            out.append((start, end, add))
        prev = text
    return out

DARIJA = ["شنو","كيفاش","غادي","غاديين","دابا","بزاف","ديال","كاين","كاينة","كيدير","كيديرو","خاصنا","واخا","دروك","تماك","هاد","هادي","هادو","نتا","نتوما","احنا","بصح","غير","باش","مزيان","شحال","علاش","فين","امتى","دوك","ديالنا","ديالهم","كيما","بحال","صافي","يالله","خلينا","شوف","تخيل","تصور","سمع","راه","راهو","ماشي","والو","شي","حاجة","ناس","بلاد","فلوس","درهم","مليار","مليون"]
MSA = ["هذا","هذه","ذلك","التي","الذي","الذين","كان","كانت","يجب","يمكن","حيث","بين","حول","خلال","بعد","قبل","أيضا","لكن","كما","على","في","من","إلى","عن","أن","إن","قد","لم","لن","هو","هي","هم","نحن"]

def words(text):
    return re.findall(r"[\u0600-\u06FF]+", text)

stats = []
all_texts = {}
for srt in sorted(glob.glob(os.path.join(BASE, "downloads", "*", "*.ar-orig.srt"))):
    vid = os.path.basename(os.path.dirname(srt))
    m = re.search(r"\[([A-Za-z0-9_-]{11})\]", vid)
    vid = m.group(1) if m else vid
    cues = parse_srt(srt)
    if not cues:
        continue
    ded = dedupe(cues)
    text = " ".join(t for _, _, t in ded)
    w = words(text)
    all_texts[vid] = text
    open(os.path.join(CLEAN, vid + ".txt"), "w", encoding="utf-8").write(text)
    speech_time = sum(e - s for s, e, _ in cues)
    duration = cues[-1][1]
    gap_time = max(0, duration - speech_time)
    gaps = []
    for i in range(1, len(cues)):
        g = cues[i][0] - cues[i-1][1]
        if g > 0.15:
            gaps.append(g)
    sentences = [s.strip() for s in re.split(r"[.!؟?]+", text) if s.strip()]
    dcount = sum(1 for x in w if x in DARIJA)
    mcount = sum(1 for x in w if x in MSA)
    nums = len(re.findall(r"\d[\d,\.]*", text))
    money = len(re.findall(r"(مليار|مليون|ألف|درهم|دولار|يورو)", text))
    qmarks = text.count("؟") + text.count("?")
    stats.append({
        "id": vid, "file": srt, "words": len(w), "chars": len(text),
        "duration_s": round(duration, 1), "speech_ratio": round(speech_time/duration, 3),
        "wpm_start": round(len(w)/(cues[-1][1]/60), 1),
        "wpm_speech": round(len(w)/(speech_time/60), 1),
        "first_cue_s": cues[0][0], "last_cue_s": cues[-1][1],
        "median_gap_s": round(statistics.median(gaps), 2) if gaps else 0,
        "gaps_over_1s": sum(1 for g in gaps if g > 1),
        "darija_markers": dcount, "msa_markers": mcount,
        "numbers": nums, "money_mentions": money, "questions": qmarks,
        "sentences": len(sentences), "avg_sentence_words": round(len(w)/max(1, len(sentences)), 1),
        "hook": " ".join(t for _, _, t in ded[:4])[:400],
        "outro": " ".join(t for _, _, t in ded[-4:])[:400],
    })

with open(os.path.join(OUT, "transcript_stats.json"), "w", encoding="utf-8") as f:
    json.dump(stats, f, ensure_ascii=False, indent=2)

print(f"{'id':<13}{'min':>5}{'wpm':>5}{'speech%':>8}{'darija':>7}{'msa':>6}{'q':>4}{'nums':>5}{'avg_sent':>9}")
for s in stats:
    print(f"{s['id']:<13}{s['duration_s']/60:5.1f}{s['wpm_start']:5.0f}{s['speech_ratio']*100:7.0f}%{s['darija_markers']:7d}{s['msa_markers']:6d}{s['questions']:4d}{s['numbers']:5d}{s['avg_sentence_words']:9.1f}")

print("\n=== HOOKS ===")
for s in stats:
    print(f"\n[{s['id']}] {s['hook']}")
print("\n=== OUTROS ===")
for s in stats:
    print(f"\n[{s['id']}] {s['outro']}")

# cross-video phrase mining
stop = set("من في على إلى عن أن إن هذا هذه ذلك التي الذي مع كان كانت ما لا لم لن هو هي هم نحن قد قد إلى و أو ثم لكن حتى بين بعد قبل خلال حول عند كما كل بعض غير هو وهي وهو وفي ومن على".split())
cnt = collections.Counter()
for text in all_texts.values():
    toks = words(text)
    for n in (2, 3):
        for i in range(len(toks)-n+1):
            gram = tuple(toks[i:i+n])
            if any(t in stop for t in gram):
                continue
            cnt[gram] += 1
print("\n=== TOP PHRASES (2-3 words) ===")
for gram, c in cnt.most_common(30):
    print(c, " ".join(gram))
