import fs from "node:fs";
import { chromium } from "@playwright/test";
const M="http://127.0.0.1:8794/bestvpsforme/bestvpsforme/brand/shore/";const A=process.env.APP_ORIGIN??"http://127.0.0.1:3271";
const out="/tmp/bvf-rv/shots";fs.mkdirSync(out,{recursive:true});
const token=fs.readFileSync("/tmp/bvf-rv/session.txt","utf8").trim();
const pairs=[["home","mockup/index.html#home","/"],["catalog","mockup/index.html#catalog","/catalog"],["cards","mockup/index.html#catalog?view=cards","/catalog?view=cards"],["offer","mockup/index.html#offer/hostinger-kvm-2","/offers/hostinger-kvm-2"],["compare","mockup/index.html#compare","/compare"],["providers","mockup/index.html#providers","/providers"],["provider","mockup/index.html#provider/hostinger","/providers/hostinger"],["specials","mockup/index.html#special-offers","/special-offers"],["guides","mockup/index.html#guides","/guides"],["guide","mockup/index.html#guide/intro-vs-renewal","/guides/compare-vps-prices-without-traps"],["nf","mockup/index.html#nowhere","/nowhere-xyz"],
["a-dash","admin-preview/index.html#dashboard","/admin"],["a-prov","admin-preview/index.html#providers","/admin/providers"],["a-terms","admin-preview/index.html#terms","/admin/terms"],["a-edit","admin-preview/index.html#editorial","/admin/editorial"],["a-imp","admin-preview/index.html#imports","/admin/imports"],["a-corr","admin-preview/index.html#corrections","/admin/corrections"],["a-pub","admin-preview/index.html#publications","/admin/publications"],["a-aff","admin-preview/index.html#affiliates","/admin/affiliates"],["a-audit","admin-preview/index.html#audit","/admin/audit"],["a-health","admin-preview/index.html#health","/admin/health"],["a-set","admin-preview/index.html#settings","/admin/settings"]];
const b=await chromium.launch();const rows=[];
for(const w of [1440,390]){const ctx=await b.newContext({viewport:{width:w,height:900},colorScheme:"dark"});
await ctx.addCookies([{name:"bvf_admin_session",value:token,url:A,httpOnly:true,sameSite:"Lax"}]);
await ctx.addInitScript(()=>{try{localStorage.setItem("shore-theme","night")}catch{}});
const p=await ctx.newPage();const errs=[];p.on("pageerror",e=>errs.push(String(e.message).slice(0,140)));p.on("console",m=>{if(m.type()==="error")errs.push(m.text().slice(0,140))});
for(const [n,m,a] of pairs){for(const [side,url] of [["mock",M+m],["app",A+a]]){errs.length=0;
try{await p.goto(url,{waitUntil:"load",timeout:60000});if(side==="mock"){await p.evaluate(()=>window.scrollTo(0,0));}await p.waitForTimeout(1600);
const met=await p.evaluate(()=>({el:document.querySelectorAll("*").length,h:document.documentElement.scrollHeight,ox:document.documentElement.scrollWidth-innerWidth,anim:document.getAnimations().length,title:(document.querySelector("h1")?.textContent||"").trim().slice(0,60)}));
await p.screenshot({path:out+"/"+w+"-"+n+"-"+side+".png",fullPage:w===390?false:false});
rows.push({w,n,side,...met,errs:[...new Set(errs)].slice(0,3)});}catch(e){rows.push({w,n,side,fail:String(e).slice(0,120)})}}}
await ctx.close();}
await b.close();fs.writeFileSync("/tmp/bvf-rv/rows.json",JSON.stringify(rows,null,1));
for(const r of rows)console.log(r.w,r.n,r.side,"el="+r.el,"h="+r.h,"ox="+r.ox,"anim="+r.anim,"|",r.title,r.errs?.join(" ; ")||r.fail||"");