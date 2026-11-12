#!/usr/bin/env python3
import http.server, os, urllib.parse, socketserver, mimetypes, re

ROOT = os.path.expanduser("~/oday/factory")
JOB  = "2026-11-11-all-types-of-asses"
BASE = os.path.join(ROOT, "jobs", JOB)
PORT = 8790

CSS = """
*{box-sizing:border-box;margin:0;padding:0}
:root{--bg:#0e0f11;--card:#17191c;--bd:#26292e;--tx:#e8e9ea;--mu:#8a8f96;--ac:#fdca3b}
body{background:var(--bg);color:var(--tx);font:15px/1.6 system-ui,-apple-system,"Segoe UI",sans-serif}
.wrap{max-width:1280px;margin:0 auto;padding:22px}
video{width:100%;border-radius:14px;background:#000;border:1px solid var(--bd);aspect-ratio:16/9}
h1{font-size:22px;margin:18px 0 6px;font-weight:700}
.sub{color:var(--mu);font-size:13px;margin-bottom:18px}
.row{display:grid;grid-template-columns:1fr 340px;gap:24px;margin-top:10px}
@media(max-width:900px){.row{grid-template-columns:1fr}}
.card{background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:18px}
h3{font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:var(--mu);margin-bottom:10px;font-weight:700}
.ch{display:flex;gap:10px;padding:8px 0;border-bottom:1px solid var(--bd);cursor:pointer;font-size:13.5px}
.ch:hover{color:var(--ac)}
.ch:last-child{border:none}
.t{color:var(--ac);font-family:ui-monospace,monospace;font-size:12px;min-width:44px}
.thumbs{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.thumbs img{width:100%;border-radius:8px;border:1px solid var(--bd)}
.desc{white-space:pre-wrap;font-size:14px;color:#c8ccd2;line-height:1.7}
.back{color:var(--mu);font-size:13px;text-decoration:none;display:inline-block;margin-bottom:14px}
.back:hover{color:var(--ac)}
"""

HTML = """<!doctype html><html lang=en><head><meta charset=utf-8>
<meta name=viewport content="width=device-width,initial-scale=1">
<title>All Types of Asses — dados_sewa</title><style>__CSS__</style></head><body>
<div class=wrap>
<a class=back href="http://192.168.100.26:8787">&larr; back to jobs</a>
<video id=v controls src="/final/final.mp4"></video>
<h1>All Types of Asses, Explained</h1>
<div class=sub>dados_sewa &middot; 7.7 min &middot; 1080p &middot; flat-cartoon docucomedy</div>
<div class=row>
 <div>
  <div class=card><h3>Description</h3><div class=desc>__DESC__</div></div>
  <div class=card style="margin-top:16px"><h3>Chapters</h3><div id=ch></div></div>
 </div>
 <div>
  <div class=card><h3>Thumbnails</h3><div class=thumbs id=th></div></div>
  <div class=card style="margin-top:16px"><h3>Stats</h3><div class=desc id=st></div></div>
 </div>
</div>
</div>
<script>
const V=document.getElementById('v');
const CHAPTERS=[
 [0,"47 million asses — the hook"],
 [60,"The OG: actual donkeys"],
 [150,"Figurative asses"],
 [240,"Literal asses — anatomy"],
 [300,"Asses that fight back"],
 [360,"Bombardier beetle (100 C)"],
 [420,"Regrow, drop, explode"],
 [450,"The verdict"]];
document.getElementById('ch').innerHTML=CHAPTERS.map(function(c){
 const t=c[0],n=c[1];
 const mm=String(Math.floor(t/60)).padStart(2,'0'),ss=String(t%60).padStart(2,'0');
 return '<div class=ch onclick="V.currentTime='+t+';V.play()"><span class=t>'+mm+':'+ss+'</span><span>'+n+'</span></div>';}).join('');
const thumbs=["thumb_a.png","verdict_winner.png","verdict_scariest.png","verdict_tragic.png","outro_mascot.png","outro_next.png"];
document.getElementById('th').innerHTML=thumbs.map(function(t){return '<img loading=lazy src="/final/'+t+'" onerror="this.style.display=\'none\'">';}).join('');
fetch('/final/final.mp4',{method:'HEAD'}).then(function(r){
 document.getElementById('st').innerHTML='Size: '+(r.headers.get('content-length')/1048576).toFixed(0)+' MB<br>Duration: ~7:41<br>Resolution: 1920x1080<br>Codec: H.264 + AAC<br>Subtitles: burned-in EN<br>LUFS: -14';});
</script></body></html>"""

class H(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        p = urllib.parse.urlparse(self.path).path
        if p in ("/", "/index.html"):
            desc = ""
            dp = os.path.join(BASE, "final", "description.md")
            if os.path.exists(dp):
                desc = open(dp).read()
            html = HTML.replace("__CSS__", CSS).replace("__DESC__", desc.replace("</", "<\\/"))
            return self._s(html, "text/html")
        m = re.match(r"^/final/(.+)$", p)
        if m:
            f = urllib.parse.unquote(m.group(1))
            for d in [os.path.join(BASE, "final"), os.path.join(BASE, "images")]:
                fp = os.path.join(d, f)
                if os.path.isfile(fp):
                    return self._s(open(fp, "rb").read(), mimetypes.guess_type(fp)[0] or "application/octet-stream")
        return self.send_error(404)
    def do_HEAD(self):
        p = urllib.parse.urlparse(self.path).path
        m = re.match(r"^/final/(.+)$", p)
        if m:
            f = urllib.parse.unquote(m.group(1))
            for d in [os.path.join(BASE, "final"), os.path.join(BASE, "images")]:
                fp = os.path.join(d, f)
                if os.path.isfile(fp):
                    self.send_response(200)
                    self.send_header("Content-Type", mimetypes.guess_type(fp)[0] or "application/octet-stream")
                    self.send_header("Content-Length", str(os.path.getsize(fp)))
                    self.end_headers()
                    return
        return self.send_error(404)
    def _s(self, d, ct):
        b = d if isinstance(d, bytes) else d.encode()
        self.send_response(200)
        self.send_header("Content-Type", ct)
        self.send_header("Content-Length", str(len(b)))
        self.end_headers()
        self.wfile.write(b)
    def log_message(self, *a):
        pass

socketserver.ThreadingTCPServer.allow_reuse_address = True
with socketserver.ThreadingTCPServer(("0.0.0.0", PORT), H) as s:
    print("video page :%d" % PORT)
    s.serve_forever()
