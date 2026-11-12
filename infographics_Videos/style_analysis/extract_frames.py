#!/usr/bin/env python3
import subprocess, json, os, glob, re, sys

BASE = "/home/twarga/infographics_Videos"
OUT = os.path.join(BASE, "style_analysis")
FRAMES = os.path.join(OUT, "frames")
SHEETS = os.path.join(OUT, "contact_sheets")
os.makedirs(FRAMES, exist_ok=True)
os.makedirs(SHEETS, exist_ok=True)

FONT = "/usr/share/fonts/google-droid-sans-fonts/DroidSans.ttf"

def run(cmd):
    return subprocess.run(cmd, capture_output=True, text=True)

def probe(path):
    p = run(["ffprobe", "-v", "error", "-show_entries", "format=duration,size,bit_rate",
             "-show_entries", "stream=codec_name,width,height,r_frame_rate,channels,sample_rate",
             "-of", "json", path])
    d = json.loads(p.stdout)
    info = {"duration": float(d["format"].get("duration", 0)),
            "size": int(d["format"].get("size", 0)),
            "bit_rate": int(d["format"].get("bit_rate", 0)),
            "streams": d.get("streams", [])}
    return info

def fmt_ts(seconds):
    m, s = divmod(int(seconds), 60)
    return f"{m:02d}:{s:02d}"

videos = sorted(glob.glob(os.path.join(BASE, "downloads", "*", "*.mp4")))
videos = [v for v in videos if not os.path.basename(v).startswith(".")]
print(f"{len(videos)} videos")

meta = []
for idx, path in enumerate(videos, 1):
    vid = re.search(r"\[([A-Za-z0-9_-]{11})\]", path).group(1)
    info = probe(path)
    dur = info["duration"]
    vstream = next((s for s in info["streams"] if s.get("codec_name") in ("h264", "hevc")), {})
    meta.append({"id": vid, "file": path, "duration": dur, "size": info["size"],
                 "bit_rate": info["bit_rate"], "width": vstream.get("width"),
                 "height": vstream.get("height"), "fps": vstream.get("r_frame_rate")})
    # 16 frames evenly spaced
    frame_dir = os.path.join(FRAMES, vid)
    os.makedirs(frame_dir, exist_ok=True)
    for f in glob.glob(os.path.join(frame_dir, "*.jpg")):
        os.remove(f)
    times = [dur * (i + 0.5) / 16 for i in range(16)]
    for i, t in enumerate(times):
        label = fmt_ts(t)
        vf = f"scale=480:270,drawtext=fontfile={FONT}:text='{label.replace(':', chr(92)+':')}':x=8:y=8:fontsize=26:fontcolor=white:box=1:boxcolor=black@0.65"
        run(["ffmpeg", "-v", "error", "-ss", f"{t:.2f}", "-i", path, "-frames:v", "1",
             "-vf", vf, "-q:v", "3", os.path.join(frame_dir, f"{i:02d}_{label.replace(':','')}.jpg")])
    sheet = os.path.join(SHEETS, f"{idx:02d}_{vid}.jpg")
    run(["magick", "montage", *sorted(glob.glob(os.path.join(frame_dir, "*.jpg"))),
         "-tile", "4x4", "-geometry", "+2+2", "-background", "#222", sheet])
    print(f"{idx:02d}/{len(videos)} {vid} {fmt_ts(dur)}")

    # scene cut detection
    sc = run(["ffmpeg", "-v", "error", "-i", path, "-an",
              "-vf", "select='gt(scene,0.35)',showinfo", "-f", "null", "-"])
    times_cut = [float(m) for m in re.findall(r"pts_time:([0-9.]+)", sc.stderr)]
    meta[-1]["cuts"] = len(times_cut)
    meta[-1]["cut_times"] = times_cut

with open(os.path.join(OUT, "metadata.json"), "w", encoding="utf-8") as f:
    json.dump(meta, f, ensure_ascii=False, indent=2)
print("done")
