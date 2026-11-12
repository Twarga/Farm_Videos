import json, re
import os; base=os.path.dirname(os.path.abspath(__file__)); timing=json.load(open(os.path.join(base,"timing.json"),encoding="utf-8"))
def ts(sec):
    h=int(sec//3600); m=int((sec%3600)//60); s=int(sec%60); ms=int(round((sec-int(sec))*1000))
    if ms>=1000: s+=1; ms-=1000
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"
def words(t): return re.findall(r"[\u0600-\u06FF]+",t)
cues=[]
for sc in timing:
    text=sc.get("text","").strip()
    if not text or not sc.get("duration"): continue
    parts=[p.strip() for p in re.split(r"(?<=[.!؟?])\s+",text) if p.strip()]
    if not parts: continue
    total=sum(max(1,len(words(p))) for p in parts)
    cur=float(sc["start"]); end=float(sc["end"])
    for p in parts:
        w=max(1,len(words(p)))
        dur=(end-cur)*w/total if total else (end-cur)/len(parts)
        dur=max(0.8,dur)
        cues.append((cur,min(end,cur+dur),p))
        cur+=dur
with open("07-subtitles.srt","w",encoding="utf-8") as f:
    for i,(a,b,t) in enumerate(cues,1):
        f.write(f"{i}\n{ts(a)} --> {ts(b)}\n{t}\n\n")
print(len(cues),"cues -> 07-subtitles.srt")
