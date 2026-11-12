import json
timing=json.load(open("04-voice/timing.json",encoding="utf-8"))
visuals=json.load(open("/home/tlab/infographics_Videos/video/src/data/visuals.json",encoding="utf-8"))
chapters=[]
for t,v in zip(timing,visuals):
    if v.get("type")=="chapter":
        m=int(t["start"]//60); s=int(t["start"]%60)
        num=v.get("number","")
        title=v.get("title","")
        chapters.append("%02d:%02d %s — %s" % (m,s,num,title))
with open("09-metadata.md","a",encoding="utf-8") as f:
    f.write("\n## Chapters\n")
    for c in chapters: f.write("- "+c+"\n")
print("chapters added:", len(chapters))
