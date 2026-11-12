import json, re
lines=open("03-script.md",encoding="utf-8").read().splitlines()
scenes=[]; cur=None; buf=[]
for line in lines:
    s=line.strip()
    if not s or s.startswith("#"): continue
    m=re.match(r"\[SCENE:\s*([a-zA-Z_-]+)\]", s)
    if m:
        if cur is not None:
            scenes.append({"type":cur,"text":" ".join(buf).strip()})
        cur=m.group(1); buf=[]
    else:
        buf.append(s)
if cur is not None:
    scenes.append({"type":cur,"text":" ".join(buf).strip()})
json.dump(scenes,open("04-voice/tts_scenes.json","w",encoding="utf-8"),ensure_ascii=False,indent=2)
print(len(scenes), "scenes")
for i,s in enumerate(scenes):
    print(i, s["type"], len(s["text"].split()), "words")
