#!/usr/bin/env python3
import subprocess, json, os, glob, re, wave, statistics
import numpy as np

BASE = "/home/twarga/infographics_Videos"
OUT = os.path.join(BASE, "style_analysis")
TMP = "/tmp/style_audio"
os.makedirs(TMP, exist_ok=True)

def parse_srt_first_last(path):
    txt = open(path, encoding="utf-8", errors="ignore").read()
    times = re.findall(r"(\d+):(\d+):(\d+)[,.](\d+)\s*-->\s*(\d+):(\d+):(\d+)[,.](\d+)", txt)
    if not times:
        return 0.0, 0.0
    g = list(map(int, times[0])); start = g[0]*3600+g[1]*60+g[2]+g[3]/1000
    g = list(map(int, times[-1])); end = g[4]*3600+g[5]*60+g[6]+g[7]/1000
    return start, end

def loudness(path):
    p = subprocess.run(["ffmpeg", "-hide_banner", "-i", path, "-af",
                        "loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json", "-f", "null", "-"],
                       capture_output=True, text=True, encoding="utf-8", errors="ignore")
    out = p.stderr
    m = re.search(r"\{[^{}]*\"input_i\"[^{}]*\}", out, re.S)
    if not m:
        return {}
    try:
        d = json.loads(m.group(0))
        return {k: float(d[k]) for k in ("input_i", "input_tp", "input_lra", "input_thresh")}
    except Exception:
        return {}

def f0_median(y, fs=16000, fmin=70, fmax=300):
    y = y.astype(np.float32)
    y = y - np.mean(y)
    frame = int(0.05 * fs); hop = int(0.025 * fs)
    vals = []
    for start in range(0, len(y) - frame, hop):
        x = y[start:start+frame] * np.hanning(frame)
        if np.sqrt(np.mean(x*x)) < 0.01:
            continue
        ac = np.correlate(x, x, mode="full")[frame-1:]
        lo, hi = int(fs/fmax), int(fs/fmin)
        if hi >= len(ac):
            continue
        seg = ac[lo:hi]
        if len(seg) == 0:
            continue
        lag = lo + int(np.argmax(seg))
        if ac[lag] / (ac[0] + 1e-9) < 0.25:
            continue
        vals.append(fs / lag)
    return float(np.median(vals)) if vals else 0.0

meta = json.load(open(os.path.join(OUT, "metadata.json")))
rows = []
for m in meta:
    vid = m["id"]; path = m["file"]
    wav = os.path.join(TMP, vid + ".wav")
    if not os.path.exists(wav):
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", path, "-vn", "-ac", "1", "-ar", "16000", wav], check=True)
    with wave.open(wav, "rb") as w:
        fs = w.getframerate(); n = w.getnframes()
        raw = w.readframes(n)
    y = np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768.0
    frame = int(0.05 * fs); hop = int(0.05 * fs)
    rms = []
    for start in range(0, len(y) - frame, hop):
        x = y[start:start+frame]
        rms.append(float(np.sqrt(np.mean(x*x))))
    rms = np.array(rms) + 1e-10
    db = 20 * np.log10(rms)
    speech = np.percentile(db, 75)
    quiet = np.percentile(db, 15)
    p10 = np.percentile(db, 10); p50 = np.percentile(db, 50); p90 = np.percentile(db, 90)
    near_silence = float(np.mean(db < -50) * 100)
    # first 10s level and first/last cue
    first10 = db[:200].mean() if len(db) > 200 else db.mean()
    first_cue, last_cue = parse_srt_first_last(m["file"].replace(".mp4", ".ar-orig.srt"))
    # pitch on 2 minutes starting at 60s (skip intro music)
    seg = y[int(60*fs):int(180*fs)] if len(y) > 180*fs else y
    f0 = f0_median(seg, fs)
    L = loudness(path)
    rows.append({
        "id": vid, "duration_s": round(len(y)/fs, 1),
        "lufs_i": L.get("input_i"), "true_peak": L.get("input_tp"), "lra": L.get("input_lra"),
        "db_p10": round(float(p10),1), "db_p50": round(float(p50),1), "db_p90": round(float(p90),1),
        "speech_db": round(float(speech),1), "quiet_db": round(float(quiet),1),
        "speech_to_bg_db": round(float(speech-quiet),1),
        "near_silence_pct": round(near_silence,1), "first10s_db": round(float(first10),1),
        "f0_hz": round(f0,1),
        "first_cue_s": round(first_cue,1), "last_cue_s": round(last_cue,1),
    })
    print(f"{vid} LUFS={L.get('input_i')} F0={f0:.0f}Hz speech={speech:.0f}dB quiet={quiet:.0f}dB silence={near_silence:.0f}%")

json.dump(rows, open(os.path.join(OUT, "audio_stats.json"), "w"), indent=2)
print("\nmedian LUFS:", round(statistics.median([r['lufs_i'] for r in rows if r['lufs_i'] is not None]),1))
print("median true peak:", round(statistics.median([r['true_peak'] for r in rows if r['true_peak'] is not None]),1))
print("median F0:", round(statistics.median([r['f0_hz'] for r in rows if r['f0_hz']]),1))
print("median speech-bg gap dB:", round(statistics.median([r['speech_to_bg_db'] for r in rows]),1))
