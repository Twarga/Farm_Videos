from faster_whisper import WhisperModel
import json
V="/home/tlab/oday/factory/jobs/2026-11-11-all-types-of-asses/voice/voiceover.wav"
OUT="/home/tlab/oday/factory/jobs/2026-11-11-all-types-of-asses/build"
m=WhisperModel("base",device="cpu",compute_type="int8")
segs,info=m.transcribe(V,word_timestamps=True)
def ts(t):
    h=int(t//3600);m2=int((t%3600)//60);s=t%60
    return f"{h:02d}:{m2:02d}:{s:06.3f}".replace(".",",")
beats=[];srt=[];i=0
for seg in segs:
    beats.append({"i":i,"start":seg.start,"end":seg.end,"text":seg.text.strip()})
    srt.append(f"{i+1}\n{ts(seg.start)} --> {ts(seg.end)}\n{seg.text.strip()}\n")
    i+=1
open(f"{OUT}/beats.json","w").write(json.dumps(beats,indent=1))
open(f"{OUT}/subs.srt","w").write("\n".join(srt))
print("segments:",i)
