/* bestvpsforme mockup behaviour: icons, theme, reveal, X-ray toggle, picks, catalog rows, charts. */
(function () {
  document.documentElement.classList.add("js");
  const stored = new URLSearchParams(location.search).get("theme") || localStorage.getItem("bvf-mock-theme");
  if (stored) document.documentElement.dataset.theme = stored;

  const P = (d) => `<path d="${d}"/>`;
  const ICONS = {
    search: P("M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15ZM21 21l-5.2-5.2"),
    arrow: P("M4 12h15M13 6l6 6-6 6"),
    out: P("M7 17 17 7M8 7h9v9"),
    check: P("m5 12.5 4.5 4.5L19 7.5"),
    warn: P("M12 3.5 2.8 19.5h18.4L12 3.5ZM12 10v4.5M12 17.2v.3"),
    shield: P("M12 3 4.5 6v5.5c0 4.6 3.1 8.2 7.5 9.5 4.4-1.3 7.5-4.9 7.5-9.5V6L12 3ZM8.8 12.2l2.2 2.2 4.3-4.6"),
    info: P("M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 11v5.5M12 7.8v.2"),
    sun: P("M12 16.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM12 2v2M12 20v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2 12h2M20 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"),
    moon: P("M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z"),
    sliders: P("M4 7h9M17 7h3M4 17h3M11 17h9M15 4.5v5M9 14.5v5"),
    list: P("M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"),
    grid: P("M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z"),
    x: P("M6 6l12 12M18 6 6 18"),
    plus: P("M12 5v14M5 12h14"),
    compare: P("M12 3v18M5 7l-3 7a3.5 3.5 0 0 0 6 0L5 7Zm14 0-3 7a3.5 3.5 0 0 0 6 0l-3-7ZM5 7h14M8 21h8"),
    link: P("M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"),
    clock: P("M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 7v5l3 2"),
    receipt: P("M6 3h12v18l-3-2-3 2-3-2-3 2V3ZM9 8h6M9 12h6M9 16h3"),
    globe: P("M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM3 12h18M12 3c2.5 2.6 3.7 5.6 3.7 9s-1.2 6.4-3.7 9c-2.5-2.6-3.7-5.6-3.7-9S9.5 5.6 12 3Z"),
    sparkle: P("M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"),
    pencil: P("M4 20h4L19 9l-4-4L4 16v4ZM14 6l4 4"),
    chevron: P("m9 6 6 6-6 6"),
    down: P("m6 9 6 6 6-6"),
    cmd: P("M9 6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6Z"),
    server: P("M4 4h16v6H4zM4 14h16v6H4zM7.5 7h.01M7.5 17h.01"),
    mail: P("M3.5 6h17v12h-17zM4 7l8 6 8-6"),
    book: P("M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5ZM4 19a2 2 0 0 1 2-2h13"),
    strike: P("M4 12h16M8 7a4 3 0 0 1 8 0M16 17a4 3 0 0 1-8 0")
  };
  const icon = (name, cls = "") => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ""}</svg>`;
  window.bvfIcon = icon;
  document.querySelectorAll("[data-icon]").forEach((el) => { el.outerHTML = icon(el.dataset.icon, el.className); });

  /* Theme */
  document.querySelectorAll("[data-theme-toggle]").forEach((b) => b.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("bvf-mock-theme", next);
  }));

  /* Money */
  const money = (n) => n == null ? "—" : "$" + (n >= 100 ? n.toFixed(2) : n.toFixed(2).replace(/\.00$/, ".00"));
  window.bvfMoney = money;

  /* Catalog rows */
  const flag = (c) => `<img src="../../public/flags/${c === "uk" ? "gb" : c}.svg" alt="${c.toUpperCase()}" width="18" height="13" loading="lazy">`;
  const tbody = document.querySelector("[data-catalog-rows]");
  if (tbody && window.BVF) {
    const rows = [...BVF.offers].sort((a, b) => a.real - b.real);
    tbody.innerHTML = rows.map((o, i) => {
      const hidden = o.ad < o.real - 0.005;
      const picked = i === 0 || o.id === "hostinger-kvm-1";
      const extra = o.flags.length + (o.more || 0) - 4;
      return `<tr data-id="${o.id}" class="${picked ? "is-picked" : ""}">
        <td class="c-pick"><input type="checkbox" class="check" aria-label="Pick ${o.provider} ${o.plan} to compare" ${picked ? "checked" : ""}></td>
        <td class="c-plan"><a class="id" href="offer.html"><span class="pmark"><img src="../../public/logos/${o.logo}" alt=""></span><span style="min-width:0"><strong>${o.plan}</strong><span class="id__sub">${o.provider}<span class="flags" aria-label="${o.flags.length + (o.more || 0)} countries">${o.flags.slice(0, 4).map(flag).join("")}${extra > 0 ? `<span>+${extra}</span>` : ""}</span></span></span></a></td>
        <td class="c-price r"><span class="price"><b>${money(o.real)}<small>/mo</small></b>${hidden ? `<span><span class="strike num">${money(o.ad)}</span> advertised</span>` : `<span>${o.today > o.real + 0.01 ? money(o.today) + " due today" : "same every month"}</span>`}</span></td>
        <td class="c-spec"><span class="spec3"><span>${o.cpu}<small>vCPU</small></span><span>${o.ram}<small>GB</small></span><span>${o.disk == null ? '<span title="Not published">—</span>' : o.disk}<small>${o.disk == null ? "disk extra" : "GB " + o.diskType.split(" ")[0]}</small></span></span><span class="spec-sub">${o.transfer} transfer</span></td>
        <td class="c-trust"><span class="trust">${o.trust.toFixed(1)}<span>${o.reviews >= 1000 ? (o.reviews / 1000).toFixed(o.reviews >= 10000 ? 0 : 1) + "k" : o.reviews} reviews</span></span></td>
        <td class="c-catch">${o.catch ? `<span class="catchcell"><span class="dot dot--catch"></span><span>${o.catch}</span></span>` : `<span class="catchcell catchcell--none"><span class="dot dot--ok"></span>No catch found in the source</span>`}</td>
        <td class="c-act r"><a class="btn btn--line btn--sm visit" href="#" rel="${o.affiliate ? "sponsored nofollow" : "nofollow"}">Visit ${icon("out")}</a><span class="affil">${o.affiliate ? "Affiliate link" : "Direct link"}</span></td>
      </tr>`;
    }).join("");
  }

  /* Mobile catalog cards */
  const cards = document.querySelector("[data-catalog-cards]");
  if (cards && window.BVF) {
    cards.innerHTML = [...BVF.offers].sort((a, b) => a.real - b.real).slice(0, 7).map((o, i) => {
      const hidden = o.ad < o.real - 0.005;
      return `<article class="mcard ${i === 0 ? "is-picked" : ""}" data-id="${o.id}">
        <a class="mcard__top" href="offer.html"><span class="pmark"><img src="../../public/logos/${o.logo}" alt=""></span><span class="mcard__id"><strong>${o.plan}</strong><span>${o.provider} · ${o.trust.toFixed(1)} ★ Trustpilot</span></span>
        <span class="price"><b>${money(o.real)}<small>/mo</small></b>${hidden ? `<span><span class="strike num">${money(o.ad)}</span> ad</span>` : `<span>real price</span>`}</span></a>
        <div class="mcard__specs num"><span>${o.cpu} vCPU</span><span>${o.ram} GB</span><span>${o.disk == null ? "Disk extra" : o.disk + " GB"}</span><span>${o.transfer}</span></div>
        ${o.catch ? `<p class="mcard__catch"><span class="dot dot--catch"></span>${o.catch}</p>` : ""}
        <div class="mcard__actions"><label class="mcard__pick"><input type="checkbox" class="check" ${i === 0 ? "checked" : ""}> Pick</label><a class="btn btn--line btn--sm" href="#">Visit ${icon("out")}</a></div>
      </article>`;
    }).join("");
  }

  /* Picks → tray */
  const tray = document.querySelector(".tray");
  const updateTray = () => {
    if (!tray) return;
    const seen = new Set(); const picked = [...document.querySelectorAll("tr.is-picked, .mcard.is-picked")].filter((el) => { const id = el.dataset.id; if (seen.has(id)) return false; seen.add(id); return true; });
    const n = picked.length;
    tray.hidden = n === 0;
    tray.querySelector(".num").textContent = n;
    const slots = tray.querySelectorAll(".tray__slot");
    slots.forEach((s, i) => {
      const row = picked[i];
      const img = row && row.querySelector(".pmark img");
      s.innerHTML = img ? `<span class="pmark"><img src="${img.getAttribute("src")}" alt=""></span>` : icon("plus");
    });
    document.querySelectorAll(".nav__count").forEach((c) => (c.textContent = n));
  };
  document.addEventListener("change", (e) => {
    const box = e.target.closest(".check");
    if (!box) return;
    const row = box.closest("tr, .mcard");
    if (row) row.classList.toggle("is-picked", box.checked);
    updateTray();
  });
  updateTray();

  /* Price X-ray toggle */
  document.querySelectorAll(".xray").forEach((x) => {
    x.querySelectorAll("[data-xray]").forEach((b) => b.addEventListener("click", () => {
      x.classList.toggle("is-ad", b.dataset.xray === "ad");
      x.querySelectorAll("[data-xray]").forEach((o) => o.setAttribute("aria-pressed", String(o === b)));
    }));
  });

  /* Strip chart: price distribution for a tier */
  document.querySelectorAll("[data-strip]").forEach((el) => {
    const values = BVF.tier4, max = 56, w = 1000, h = 120;
    const x = (v) => 20 + (v / max) * (w - 40);
    const sorted = [...values].sort((a, b) => a - b);
    const median = Math.round(((sorted[17] + sorted[18]) / 2) * 100) / 100;
    const dots = values.map((v, i) => {
      const lane = i % 3;
      return `<circle cx="${x(v).toFixed(1)}" cy="${48 + lane * 13}" r="6" fill="${v <= 6.5 ? "var(--volt-400)" : "var(--fg)"}" stroke="${v <= 6.5 ? "var(--ink-950)" : "none"}" stroke-width="1.5" opacity="${v <= 6.5 ? 1 : 0.82}"/>`;
    }).join("");
    const ticks = [0, 10, 20, 30, 40, 50].map((t) => `<line x1="${x(t)}" x2="${x(t)}" y1="100" y2="106" stroke="var(--border-strong)"/><text class="chart-label" x="${x(t)}" y="120" text-anchor="middle">$${t}</text>`).join("");
    el.innerHTML = `<svg viewBox="0 0 ${w} ${h + 10}" role="img" aria-label="36 plans with 4 GB RAM. Cheapest $3.99, median $${median.toFixed(2)}, most expensive $53.87 per month.">
      <line x1="20" x2="${w - 20}" y1="100" y2="100" stroke="var(--border-strong)"/>${ticks}
      <line x1="${x(median)}" x2="${x(median)}" y1="14" y2="100" stroke="var(--fg)" stroke-dasharray="3 4"/>
      <text class="chart-label chart-label--ink" x="${x(median) + 8}" y="22">median $${median.toFixed(2)}</text>
      <text class="chart-label chart-label--ink" x="${x(3.99)}" y="22">from $3.99</text>
      ${dots}</svg>`;
  });

  /* Reveal + highlight on scroll */
  const io = "IntersectionObserver" in window ? new IntersectionObserver((entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-lit"); io.unobserve(en.target); } }), { threshold: 0.25 }) : null;
  document.querySelectorAll("[data-reveal], [data-animate], .rack, [data-lit]").forEach((el) => (io ? io.observe(el) : el.classList.add("is-lit")));
  if (new URLSearchParams(location.search).has("static")) document.querySelectorAll("[data-reveal], [data-animate], .rack, [data-lit]").forEach((el) => el.classList.add("is-lit"));

  /* ⌘K palette */
  const palette = document.querySelector("[data-palette]");
  const openPalette = () => { if (palette && !palette.open) { palette.showModal(); palette.querySelector("input")?.focus(); } };
  document.querySelectorAll("[data-open-palette]").forEach((b) => b.addEventListener("click", openPalette));
  document.addEventListener("keydown", (e) => {
    const typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName || "");
    if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) { e.preventDefault(); openPalette(); }
  });
  palette?.addEventListener("click", (e) => { if (e.target === palette) palette.close(); });

  /* Mockup badge */
  if (!document.querySelector(".mock-badge") && !document.body.hasAttribute("data-no-badge")) {
    const b = document.createElement("div");
    b.className = "mock-badge";
    b.innerHTML = `Mockup · ${document.title.split("—")[0].trim()} <button type="button" data-theme-toggle>Theme</button>`;
    document.body.append(b);
    b.querySelector("button").addEventListener("click", () => {
      const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      localStorage.setItem("bvf-mock-theme", next);
    });
  }
})();
