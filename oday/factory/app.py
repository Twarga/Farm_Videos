#!/usr/bin/env python3
"""dados_sewa · asset viewer — clean single-file app."""
import http.server, json, os, re, urllib.parse, socketserver, mimetypes

ROOT = os.path.expanduser("~/oday/factory")
JOBS = os.path.join(ROOT, "jobs")
PORT = int(os.sys.argv[1]) if len(os.sys.argv) > 1 else 8787
IMG = {".png",".jpg",".jpeg",".webp",".gif"}; VID={".mp4",".webm",".mov"}; AUD={".wav",".mp3",".m4a",".aac",".ogg"}
DOC = {".md",".txt",".json",".srt",".vtt"}

def scan():
    out={}
    for base in [JOBS]:
        if not os.path.isdir(base): continue
        for job in sorted(os.listdir(base),reverse=True):
            jp=os.path.join(base,job)
            if not os.path.isdir(jp): continue
            d={"images":[],"videos":[],"audio":[],"docs":[]}
            for dp,_,fs in os.walk(jp):
                for f in sorted(fs):
                    rel=os.path.relpath(os.path.join(dp,f),jp); e=os.path.splitext(f)[1].lower()
                    if e in IMG: d["images"].append(rel)
                    elif e in VID: d["videos"].append(rel)
                    elif e in AUD: d["audio"].append(rel)
                    elif e in DOC: d["docs"].append(rel)
            out[job]=d
    return out

CSS="""
*{box-sizing:border-box;margin:0;padding:0}
:root{--bg:#0e0f11;--card:#17191c;--bd:#26292e;--tx:#e8e9ea;--mu:#8a8f96;--ac:#fdca3b}
body{background:var(--bg);color:var(--tx);font:15px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
a{color:var(--ac)}
.top{position:sticky;top:0;z-index:50;display:flex;align-items:center;gap:14px;padding:12px 22px;background:rgba(14,15,17,.9);backdrop-filter:blur(10px);border-bottom:1px solid var(--bd)}
.top img{width:36px;height:36px;border-radius:50%}
.top h1{font-size:16px;font-weight:700;letter-spacing:-.2px}
.top span{color:var(--mu);font-size:12px}
.tabs{display:flex;gap:4px;padding:10px 22px;border-bottom:1px solid var(--bd);flex-wrap:wrap;position:sticky;top:61px;background:var(--bg);z-index:40}
.tabs button{background:transparent;border:1px solid var(--bd);color:var(--mu);padding:6px 14px;border-radius:99px;font-size:12.5px;cursor:pointer;font-weight:600}
.tabs button.on{background:var(--ac);color:#111;border-color:var(--ac)}
main{padding:24px;max-width:1400px;margin:0 auto}
.sec-t{font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:var(--mu);margin:26px 0 14px;font-weight:700}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px}
.t{border:1px solid var(--bd);border-radius:12px;overflow:hidden;background:var(--card);transition:border-color .15s}
.t:hover{border-color:var(--ac)}
.t img{width:100%;aspect-ratio:16/10;object-fit:cover;display:block;cursor:zoom-in;background:#0a0a0a}
.t .n{padding:9px 11px;font-size:11px;color:var(--mu);font-family:ui-monospace,monospace;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
video{width:100%;border-radius:12px;background:#000;border:1px solid var(--bd)}
audio{width:100%;margin:8px 0}
.doc{background:var(--card);border:1px solid var(--bd);border-radius:12px;padding:18px;margin-bottom:12px}
.doc pre{white-space:pre-wrap;font:12.5px/1.6 ui-monospace,monospace;color:#c8ccd2;max-height:420px;overflow:auto}
.doc h3{font-size:12px;color:var(--ac);margin-bottom:10px;font-family:ui-monospace,monospace}
.lb{position:fixed;inset:0;background:rgba(0,0,0,.94);display:none;align-items:center;justify-content:center;z-index:99;cursor:zoom-out;padding:3vw}
.lb img{max-width:100%;max-height:100%;border-radius:10px}
.empty{color:var(--mu);text-align:center;padding:80px 0;font-size:14px}
.cnt{color:var(--mu);font-weight:400;font-size:11px}
"""

JS="""
let J={},C=null;
async function go(){J=await(await fetch('/api/jobs')).json();
 const n=document.querySelector('.tabs');Object.keys(J).forEach((j,i)=>{let b=document.createElement('button');b.textContent=j.replace(/^\\d+-\\d+-\\d+-/,'');b.onclick=()=>show(j);n.appendChild(b);if(i===0)show(j);});}
function show(j){C=j;[...document.querySelectorAll('.tabs button')].forEach((b,i)=>b.classList.toggle('on',Object.keys(J)[i]===j));
 const d=J[j],m=document.querySelector('main');let h='';
 const secs=[['videos','Videos'],['audio','Voice'],['images','Images'],['docs','Script & Docs']];
 secs.forEach(([k,t])=>{if(!d[k].length)return;h+=`<div class=sec-t>${t} <span class=cnt>${d[k].length}</span></div>`;
  if(k==='videos')h+=d[k].map(v=>`<video controls preload=metadata src="/f/${j}/${v}"></video>`).join('');
  if(k==='audio')h+=d[k].map(v=>`<audio controls src="/f/${j}/${v}"></audio>`).join('');
  if(k==='images')h+=`<div class=grid>`+d[k].map(v=>`<div class=t><img loading=lazy src="/f/${j}/${v}" onclick="document.querySelector('.lb').style.display='flex';document.querySelector('.lb img').src=this.src"><div class=n>${v}</div></div>`).join('')+`</div>`;
  if(k==='docs')h+=d[k].map(v=>`<div class=doc><h3>${v}</h3><pre data-src="/f/${j}/${v}">loading…</pre></div>`).join('');});
 m.innerHTML=h||'<div class=empty>No assets yet.</div>';
 document.querySelectorAll('pre[data-src]').forEach(async p=>{p.textContent=await(await fetch(p.dataset.src)).text();});}
go();
"""

class H(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        p=urllib.parse.urlparse(self.path).path
        if p in ("/","/index.html"):
            return self._s(("""<!doctype html><html lang=en><head><meta charset=utf-8>
<meta name=viewport content="width=device-width,initial-scale=1">
<title>dados_sewa</title><style>%s</style></head><body>
<div class=top><img src="/mascot" alt=""><div><h1>dados_sewa</h1><span>asset viewer</span></div></div>
<div class=tabs></div><main></main>
<div class=lb onclick="this.style.display='none'"><img></div>
<script>%s</script></body></html>""")%(CSS,JS),"text/html")
        if p=="/api/jobs": return self._s(json.dumps(scan()),"application/json")
        if p=="/mascot":
            c=os.path.join(ROOT,"brand/mascot_v1.png")
            if os.path.exists(c): return self._s(open(c,'rb').read(),"image/png")
            return self.send_error(404)
        m=re.match(r"^/f/([^/]+)/(.+)$",p)
        if m:
            full=os.path.normpath(os.path.join(JOBS,m.group(1),urllib.parse.unquote(m.group(2))))
            if full.startswith(os.path.abspath(JOBS)) and os.path.isfile(full):
                return self._s(open(full,'rb').read(),mimetypes.guess_type(full)[0] or "application/octet-stream")
        return self.send_error(404)
    def _s(self,d,ct):
        b=d if isinstance(d,bytes) else d.encode()
        self.send_response(200);self.send_header("Content-Type",ct);self.send_header("Content-Length",str(len(b)));self.end_headers();self.wfile.write(b)
    def log_message(self,*a):pass

socketserver.ThreadingTCPServer.allow_reuse_address=True
with socketserver.ThreadingTCPServer(("0.0.0.0",PORT),H) as s:
    print("viewer :%d"%PORT);s.serve_forever()
