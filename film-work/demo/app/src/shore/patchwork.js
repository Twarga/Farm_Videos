let patchwork;
function registerStyle(style) { patchwork = style; }
/* Patchwork v2 — plush textile avatars for the website.
   One construction kit for every character: felt shadow, one fabric + one texture,
   cream running-stitch seam, sewn button eyes, stitched mouths. */
(() => {
  const S = '.s-patchwork';

  /* ── Kit ─────────────────────────────────────────────────────────── */
  const ell = (cx, cy, rx, ry) =>
    `M${cx - rx} ${cy} a${rx} ${ry} 0 1 0 ${2 * rx} 0 a${rx} ${ry} 0 1 0 ${-2 * rx} 0 Z`;

  /* A plush piece: felt shadow, fabric, optional texture, stitched seam. */
  const plush = (d, fab, id, tex) =>
    `<path class="pw-shadow" d="${d}"/><path class="pw-fab ${fab}" d="${d}"/>` +
    (tex ? `<path class="pw-tex" d="${d}" fill="url(#${id}-${tex})"/>` : '') +
    `<path class="pw-seam" d="${d}"/>`;

  /* Sewn button eye with every expression layer; CSS picks the one to show. side: 1 = left eye, -1 = right eye. */
  const eye = (cx, cy, r = 3.4, side = 1) => `<g transform="translate(${cx} ${cy})">
    <g class="e-open">
      <circle class="e-btn" r="${r}"/>
      <g class="look">
        <circle class="e-hole" cx="${(-r * 0.3).toFixed(2)}" cy="0" r="${(r * 0.17).toFixed(2)}"/>
        <circle class="e-hole" cx="${(r * 0.3).toFixed(2)}" cy="0" r="${(r * 0.17).toFixed(2)}"/>
        <circle class="e-glint" cx="${(-r * 0.38).toFixed(2)}" cy="${(-r * 0.48).toFixed(2)}" r="${(r * 0.24).toFixed(2)}"/>
      </g>
    </g>
    <circle class="e-ring" r="${(r * 1.45).toFixed(2)}"/>
    <path class="e-happy" d="M${-r} ${r * 0.35} Q0 ${-r * 1.15} ${r} ${r * 0.35}"/>
    <path class="e-shut" d="M${-r} ${-r * 0.1} Q0 ${r * 0.9} ${r} ${-r * 0.1}"/>
    <path class="e-x" d="M${-r * 0.8} ${-r * 0.8} L${r * 0.8} ${r * 0.8} M${r * 0.8} ${-r * 0.8} L${-r * 0.8} ${r * 0.8}"/>
    <path class="e-strain" d="M${-r * 0.8 * side} ${-r * 0.7} L${r * 0.6 * side} 0 L${-r * 0.8 * side} ${r * 0.7}"/>
    <g class="e-spiral"><path d="M0 0 a${r * 0.25} ${r * 0.25} 0 1 1 ${r * 0.5} 0 a${r * 0.5} ${r * 0.5} 0 1 1 ${-r} 0 a${r * 0.75} ${r * 0.75} 0 1 1 ${r * 1.5} 0"/></g>
  </g>`;

  const mouth = (x, y, w = 2.6) => `<g class="pw-mouth" transform="translate(${x} ${y})">
    <path class="m-smile" d="M${-w} 0 Q0 ${w * 0.9} ${w} 0"/>
    <path class="m-flat" d="M${-w * 0.7} 0.6 H${w * 0.7}"/>
    <ellipse class="m-o" cx="0" cy="1" rx="${w * 0.5}" ry="${w * 0.62}"/>
    <path class="m-big" d="M${-w * 1.1} -0.4 Q0 ${w * 1.6} ${w * 1.1} -0.4 Z"/>
    <path class="m-frown" d="M${-w} 1.6 Q0 ${-w * 0.6} ${w} 1.6"/>
    <path class="m-zig" d="M${-w} 0.6 l${w / 2} -1.3 l${w / 2} 1.3 l${w / 2} -1.3 l${w / 2} 1.3"/>
  </g>`;

  const blush = (x, y, rx = 2.4) => `<ellipse class="pw-blush" cx="${x}" cy="${y}" rx="${rx}" ry="${rx * 0.5}"/>`;

  /* Baby machine: the little VM every product makes. Bottom sits at y. */
  const baby = (x, y, s = 1, cls = '') => `<g class="${cls}"><g transform="translate(${x} ${y}) scale(${s})">
    <rect class="pw-shadow" x="-7" y="-12.5" width="14" height="11.5" rx="3"/>
    <rect class="mm-body" x="-7" y="-12.5" width="14" height="11.5" rx="3"/>
    <rect class="mm-screen" x="-4.8" y="-10.4" width="9.6" height="5.6" rx="1.4"/>
    <circle class="mm-dot" cx="-2" cy="-7.6" r="0.75"/><circle class="mm-dot" cx="2" cy="-7.6" r="0.75"/>
    <rect class="mm-foot" x="-5" y="-1.2" width="3" height="1.4" rx="0.6"/><rect class="mm-foot" x="2" y="-1.2" width="3" height="1.4" rx="0.6"/>
  </g></g>`;

  const zzz = (x, y) => `<g class="on-z" transform="translate(${x} ${y})"><g class="pw-zzz"><text>z</text><text x="5" y="-5">z</text><text x="10" y="-11">z</text></g></g>`;

  const defs = id => `<defs>
    <pattern id="${id}-h" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 2.5 H5" stroke="rgba(239,227,200,.14)" stroke-width="0.9" stroke-dasharray="1.6 0.9"/></pattern>
    <pattern id="${id}-d" width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="0.8" fill="rgba(239,227,200,.22)"/></pattern>
    <pattern id="${id}-g" width="7" height="7" patternUnits="userSpaceOnUse"><path d="M0 0.4 H7 M0.4 0 V7" stroke="rgba(239,227,200,.17)" stroke-width="0.7" stroke-dasharray="1.4 1"/></pattern>
    <pattern id="${id}-x" width="5" height="5" patternUnits="userSpaceOnUse"><path d="M0 0 L5 5 M5 0 L0 5" stroke="rgba(239,227,200,.12)" stroke-width="0.6"/></pattern>
  </defs>`;

  /* ── Characters ──────────────────────────────────────────────────── */
  function bear(id) {
    const body = 'M75 58 C90 58 99 67 99 80 C103 87 105 97 103 106 C101 114 91 117 75 117 C59 117 49 114 47 106 C45 97 47 87 51 80 C51 67 60 58 75 58 Z';
    const lantern = (extra = '') => `
      <path class="lamp-handle" d="M105.5 100 Q105.5 95.5 108.5 95.5 Q111.5 95.5 111.5 100"/>
      <rect class="lamp-cap" x="103.5" y="99.5" width="10" height="3" rx="1.2"/>
      <circle class="lamp-glow" cx="108.5" cy="107.5" r="7"/>
      <rect class="lamp-glass" x="104.5" y="102.5" width="8" height="9.5" rx="1.6"/>
      <path class="lamp-strut" d="M108.5 102.5 V112"/>
      <path class="lamp-flame" d="M108.5 110.6 C106.6 108.8 107 106.2 108.5 104.2 C110 106.2 110.4 108.8 108.5 110.6 Z"/>
      <rect class="lamp-cap" x="103.5" y="112" width="10" height="2.6" rx="1"/>${extra}`;
    return `
      <ellipse class="pw-contact" cx="75" cy="119.5" rx="27" ry="2.6"/>
      <g class="bear-body">
        ${plush(ell(61, 63, 7, 7), 'f-bear', id, 'h')}${plush(ell(89, 63, 7, 7), 'f-bear', id, 'h')}
        <circle class="f-muzzle" cx="61" cy="64" r="3.4"/><circle class="f-muzzle" cx="89" cy="64" r="3.4"/>
        ${plush(body, 'f-bear', id, 'h')}
        ${plush(ell(75, 102, 13, 10), 'f-belly', id)}
        ${plush(ell(64, 117.4, 6, 2.6), 'f-bear-dark', id)}${plush(ell(86, 117.4, 6, 2.6), 'f-bear-dark', id)}
        ${plush(ell(53, 100, 4, 5.6), 'f-bear', id)}
        ${plush(ell(75, 81, 8.6, 6), 'f-muzzle', id)}
        <path class="pw-nose" d="M72.6 78.2 Q75 76.6 77.4 78.2 Q75 81.2 72.6 78.2 Z"/>
        ${eye(67, 72, 3.4, 1)}${eye(83, 72, 3.4, -1)}
        ${mouth(75, 84, 2.4)}
        ${blush(61.5, 79.5)}${blush(88.5, 79.5)}
        <g class="scarf-tail">${plush('M88 93 L92.5 108 L98.5 106 L95 92 Z', 'f-amber', id)}<path class="fringe" d="M93 108 v2.5 M95.5 107.4 v2.5 M98 106.6 v2.5"/></g>
        ${plush('M52 88 Q75 97 98 88 L99 94 Q75 103 51 94 Z', 'f-amber', id)}
        <g class="on-z">${plush('M59 68 Q75 74 91 68 L91 76 Q75 82 59 76 Z', 'f-amber', id)}</g>
      </g>
      <g class="bear-arm off-z">
        ${plush('M95 88 C101 90 105 94 107 99 L103.5 102 C100.5 98 97.5 95.5 93 93.5 Z', 'f-bear', id, 'h')}
        <g class="bear-lantern">
          ${lantern(`
          <circle class="lamp-ring on-w" cx="108.5" cy="107" r="6"/>
          <circle class="lamp-ring r2 on-w" cx="108.5" cy="107" r="6"/>
          <g class="firework on-s">
            <path class="fw" d="M108.5 98 V93 M108.5 117 V121 M99 107 H94 M118 107 H123 M102 100.5 L98.5 97 M115 100.5 L118.5 97 M102 113.5 L98.5 117 M115 113.5 L118.5 117"/>
            <circle class="fw-dot" cx="108.5" cy="91" r="0.9"/><circle class="fw-dot" cx="96" cy="95" r="0.9"/><circle class="fw-dot" cx="121" cy="95" r="0.9"/>
          </g>
          <path class="smoke on-e" d="M108.5 99 C106 95 111 92 108.5 88 C106 84 110 82 109 78"/>`)}
        </g>
        ${plush(ell(106, 100.5, 3.6, 3.2), 'f-bear', id)}
      </g>
      <g class="bear-tap on-q">${plush(ell(100, 108, 3.4, 3), 'f-bear', id)}<path class="tink" d="M99 102 l-2 -2 M102 101 l0 -3 M96 105 l-3 0"/></g>
      <g class="on-z">
        <g transform="translate(-33 -2)">${lantern()}</g>
      </g>
      ${zzz(98, 64)}`;
  }

  function yeast(id) {
    const body = 'M70 63 C87 63 97 75 97 91 C97 108 87 117 70 117 C53 117 43 108 43 91 C43 75 53 63 70 63 Z';
    return `
      <ellipse class="pw-contact" cx="70" cy="119.4" rx="25" ry="2.4"/>
      <g class="y-bubbles off-z off-e">
        <circle class="bub b1" cx="64" cy="56" r="2.2"/><circle class="bub b2" cx="72.5" cy="50" r="1.6"/><circle class="bub b3" cx="79" cy="57" r="1.2"/>
      </g>
      <g class="y-bud on-w on-e">${plush(ell(95.5, 99, 6, 5.5), 'f-yeast', id, 'd')}</g>
      <g class="y-body">
        ${plush(body, 'f-yeast', id, 'd')}
        <path class="membrane" d="${ell(70, 90.5, 22, 22.5)}"/>
        ${plush(ell(80, 104, 6, 5), 'f-nucleus', id)}
        <path class="wrinkle on-e" d="M52 80 q3 -2 6 0 M82 78 q3 -2 6 0 M60 108 q3 2 6 0"/>
        ${eye(62, 86, 3.6, 1)}${eye(78, 86, 3.6, -1)}
        ${mouth(70, 95, 2.6)}
        ${blush(56.5, 93)}${blush(83.5, 93)}
        <g class="on-z">${plush('M47 76 C50 61 64 53 78 55 C90 57 99 64 104 73 C96 70 88 67 79 67 C67 67 57 71 51 79 Z', 'f-cap', id)}<circle class="cap-pom" cx="105" cy="74" r="3"/></g>
      </g>
      ${baby(112, 120, 0.9, 'yb yb1 on-w')}${baby(127, 120, 0.9, 'yb yb2 on-w')}${baby(26, 120, 0.9, 'yb yb3 on-w')}${baby(119.5, 109, 0.85, 'yb yb4 on-w')}
      <g class="on-q">
        <g class="fz f1">${plush(ell(54, 60, 2.6, 2.6), 'f-yeast', id)}</g>
        <g class="fz f2">${plush(ell(86, 56, 2.2, 2.2), 'f-yeast', id)}</g>
        <g class="fz f3">${plush(ell(70, 47, 3, 3), 'f-yeast', id)}</g>
        <g class="fz f4">${plush(ell(93, 68, 2, 2), 'f-yeast', id)}</g>
        <g class="fz f5">${plush(ell(46, 70, 2.2, 2.2), 'f-yeast', id)}</g>
      </g>
      <g class="on-s">
        <circle class="bub burst p1" cx="56" cy="62" r="2.4"/><circle class="bub burst p2" cx="70" cy="56" r="3"/>
        <circle class="bub burst p3" cx="84" cy="62" r="2.2"/><circle class="bub burst p4" cx="92" cy="74" r="1.6"/>
      </g>
      <g class="on-e"><circle class="bub sad" cx="70" cy="54" r="2.6"/><path class="pop" d="M66 50 l-2 -2 M74 50 l2 -2 M66 58 l-2 2 M74 58 l2 2"/></g>
      <circle class="bub on-z slowbub" cx="84" cy="62" r="1.6"/>
      ${zzz(96, 60)}`;
  }

  function chefs(id) {
    const hats = {
      whisk: 'M-6.6 82 C-8.6 74 -6 66.5 0 66.5 C6 66.5 8.6 74 6.6 82 Z',
      crumb: 'M-7.6 82 C-12 77 -8.6 70.5 -3.4 72.4 C-2.4 66.8 4 66.4 5 71.4 C10.4 69.6 12.4 77 7.6 82 Z',
      pip: 'M-6 82 C-7 77.5 -4 74.5 0 74.5 C4 74.5 7 77.5 6 82 Z',
    };
    const chef = (name, x) => `<g class="chef chef-${name}" transform="translate(${x} 0)"><g class="chef-in">
      ${plush('M-8 101 C-8 97 -5 95.5 0 95.5 C5 95.5 8 97 8 101 V112 C8 115 6 116.5 3 116.5 H-3 C-6 116.5 -8 115 -8 112 Z', 'f-apron', id)}
      ${plush('M-4.6 98.5 H4.6 V106 C4.6 108 3 109 0 109 C-3 109 -4.6 108 -4.6 106 Z', 'f-bib', id)}
      ${plush(ell(-3.4, 118.2, 3, 1.6), 'f-shoe', id)}${plush(ell(3.4, 118.2, 3, 1.6), 'f-shoe', id)}
      ${plush(ell(0, 88.5, 8, 7.6), 'f-face', id)}
      <ellipse class="flour on-q" cx="0" cy="88.5" rx="7.2" ry="6.8"/>
      ${eye(-3.2, 88, 2.1, 1)}${eye(3.2, 88, 2.1, -1)}
      ${mouth(0, 92.4, 1.6)}
      ${blush(-5.4, 91.2, 1.5)}${blush(5.4, 91.2, 1.5)}
      <g class="hat">${plush(hats[name], 'f-hat', id)}${plush('M-6.8 80.6 H6.8 V83.4 H-6.8 Z', 'f-hat', id)}</g>
      ${name === 'crumb' ? `<g class="pin on-i"><rect class="f-wood pw-seamed" x="-8" y="62.6" width="16" height="3" rx="1.4"/><path class="pin-handle" d="M-10.5 64.1 H-8 M8 64.1 H10.5"/></g>` : ''}
    </g></g>`;
    return `
      <ellipse class="pw-contact" cx="80" cy="119.5" rx="48" ry="2.4"/>
      <g class="on-z">${plush('M30 112 C28 100 32 90 40 88 C52 85 76 85 92 88 C100 90 102 100 100 112 Z', 'f-sack', id, 'x')}<path class="sack-tie" d="M38 90 q4 -4 8 0"/></g>
      <g class="oven">
        ${plush('M100 96 C100 93.5 101.5 92 104 92 H122 C124.5 92 126 93.5 126 96 V117 H100 Z', 'f-oven', id, 'x')}
        <rect class="oven-win" x="104" y="99" width="18" height="12" rx="2"/>
        <rect class="oven-glow on-w on-e" x="105" y="100" width="16" height="10" rx="1.5"/>
        <path class="pw-seam" d="M104 99 H122 V111 H104 Z"/>
        <circle class="oven-dial" cx="106" cy="95.4" r="1.2"/><circle class="oven-dial" cx="120" cy="95.4" r="1.2"/>
        <path class="oven-handle" d="M108 113.6 H118"/>
        ${plush(ell(103.5, 118.6, 2.4, 1.4), 'f-shoe', id)}${plush(ell(122.5, 118.6, 2.4, 1.4), 'f-shoe', id)}
      </g>
      <g class="on-q board">
        <path class="board-string" d="M54 40 L63 34 L72 40"/>
        <rect class="board-frame" x="50" y="40" width="26" height="15" rx="2"/>
        <rect class="board-face" x="52" y="42" width="22" height="11" rx="1"/>
        <path class="tally" d="M56 44.5 V50.5 M59 44.5 V50.5 M62 44.5 V50.5"/>
        <path class="tally t4" d="M65 44.5 V50.5"/>
        <path class="tally t5" d="M54.5 49 L67 46"/>
      </g>
      ${chef('whisk', 42)}${chef('crumb', 63)}${chef('pip', 84)}
      <g class="tray-in on-w">${tray(78, 105)}</g>
      <g class="tray-out on-w">${tray(78, 105, true)}</g>
      <g class="tray-up on-s">${tray(56, 60, true)}</g>
      <g class="on-w steam">
        <path class="puff s1" d="M108 90 C105 86 110 84 108 80"/><path class="puff s2" d="M117 90 C114 86 119 84 117 80"/>
      </g>
      <g class="ding on-w"><path class="ding-ray" d="M113 86 V81 M106 88 L103 85 M120 88 L123 85"/></g>
      <g class="on-e bigsmoke">
        <path class="smoke-cloud" d="M104 88 C100 88 99 82 104 81 C104 75 112 74 114 79 C118 75 125 78 123 83 C127 84 126 89 121 89 Z"/>
      </g>
      <g class="on-q poof">
        <path class="poof-cloud" d="M30 92 C26 88 30 82 35 84 C36 78 45 77 47 82 C51 76 60 78 60 84 C64 80 72 80 73 86 C78 82 88 84 87 90 C92 90 93 98 86 98 H34 C29 98 27 95 30 92 Z"/>
      </g>
      <g class="heart on-s"><path d="M103 72 C103 69 99 69 99 72 C99 74 103 76.5 103 76.5 C103 76.5 107 74 107 72 C107 69 103 69 103 72 Z"/></g>
      ${zzz(90, 66)}`;
    function tray(x, y, fresh = false) {
      return `<rect class="tray-base" x="${x}" y="${y}" width="15" height="2.4" rx="1"/>
        ${[0, 5, 10].map(dx => `<rect class="${fresh ? 'cake fresh' : 'cake'}" x="${x + 1 + dx}" y="${y - 3.6}" width="3.4" height="3.6" rx="0.8"/>`).join('')}`;
    }
  }

  function crab(id) {
    const shell = 'M84 73 C97 73 105 82.5 105 94 C105 106.5 95.5 115 83 115 C74 115 67.5 110 65.5 102.5 C70 104.5 76.5 103.5 78.5 98 C80.5 92 77 87 71.5 86 C73.5 78.5 77.5 73 84 73 Z';
    return `
      <ellipse class="pw-contact" cx="80" cy="119.5" rx="30" ry="2.4"/>
      <g class="cand on-w">
        <g class="cand-a">${plush(ell(113, 116, 4.4, 3.8), 'f-shell2', id)}<path class="spiral-s" d="M113 116 m0 0 a1.2 1.2 0 1 1 -1.2 -1.2 a2.4 2.4 0 1 1 2.4 2.4"/></g>
        <g class="cand-b">${plush(ell(131, 111.5, 7.6, 7.2), 'f-shell2', id, 'x')}<path class="spiral-s" d="M131 111.5 a1.6 1.6 0 1 1 -1.6 -1.6 a3.4 3.4 0 1 1 3.4 3.4 a5 5 0 1 1 -5 -5"/></g>
        <path class="mark-x" d="M110 103 L116 109 M116 103 L110 109"/>
        <path class="mark-ok" d="M126 99 L129.5 102.5 L136 95.5"/>
      </g>
      <g class="shell">
        ${plush(shell, 'f-shell', id, 'x')}
        <path class="spiral" d="M89 95 a2.6 2.6 0 1 1 -2.6 -2.6 a5.6 5.6 0 1 1 5.6 5.6 a9 9 0 1 1 -9 -9 a12.6 12.6 0 1 1 11.6 14.6"/>
        <circle class="led led-g" cx="98" cy="104.5" r="1.1"/><circle class="led led-a" cx="98" cy="100.5" r="1.1"/>
      </g>
      <g class="crab off-z">
        <g class="legs"><path d="M57 111 L52.5 119.4 M62.5 112.5 L60.5 119.6 M68.5 112.5 L71 119.6"/></g>
        <g class="stalk stalk-l"><path class="stalk-line" d="M59.5 97 L55 82"/>${eye(55, 80, 3.3, 1)}</g>
        <g class="stalk stalk-r"><path class="stalk-line" d="M67.5 97 L70.5 82"/>${eye(70.5, 80, 3.3, -1)}</g>
        ${plush(ell(63.5, 104, 12.5, 9.2), 'f-crab', id)}
        ${mouth(63.5, 107.4, 2)}
        ${blush(56.5, 105.5, 2)}${blush(70.5, 105.5, 2)}
        <g class="claw claw-r">${plush(ell(77, 110, 3.6, 2.8), 'f-crab', id)}</g>
        <g class="claw claw-l">
          <path class="arm" d="M53.5 105.5 Q48.5 104 45.5 100.5"/>
          ${plush(ell(42, 101.5, 5.6, 4.2), 'f-crab', id)}
          <path class="jaw" d="M36.8 100 Q39.8 95 45.6 97.6"/>
        </g>
        <g class="tag on-q"><path class="tag-string" d="M41 97 L36 88"/><path class="tag-card" d="M30 80 H40 L42.5 84 L40 88 H30 Z"/><text class="tag-txt" x="34.4" y="86.4">$</text></g>
      </g>
      <g class="peek on-q"><path class="stalk-line" d="M74 101 L72 89"/>${eye(72, 87, 3, -1)}</g>
      <g class="on-s ok-big"><path class="mark-ok" d="M58 66 L62.5 70.5 L71 61.5"/></g>
      <g class="on-e qm"><text class="q q1" x="46" y="72">?</text><text class="q q2" x="56" y="66">?</text></g>
      <g class="on-z sleepy">
        <path class="stalk-line" d="M71 102 C66 100 63 101 60.5 104"/><path class="stalk-line" d="M73 104 C70 106 67 108 66 111"/>
        <path class="e-shut-s" d="M57.6 104 q2.4 2.2 4.8 0 M62.8 111 q2.4 2.2 4.8 0"/>
      </g>
      ${zzz(98, 64)}`;
  }

  function lamb(id) {
    const cloud = 'M58 70 C50 70 48 60 55 57 C53 49 62 44 69 48 C72 41 84 40 88 47 C95 43 104 49 101 56 C109 58 108 70 100 70 C98 74 92 74 90 71 C87 75 80 75 78 71 C75 75 68 75 66 71 C63 74 58 73 58 70 Z';
    return `
      <g class="spool">
        <rect class="f-wood pw-seamed" x="73.5" y="109.6" width="13" height="2.4" rx="0.9"/>
        <rect class="spool-thread" x="75.2" y="112" width="9.6" height="5" rx="0.6"/>
        <path class="spool-lines" d="M75.2 113.6 H84.8 M75.2 115.4 H84.8"/>
        <rect class="f-wood pw-seamed" x="73.5" y="117" width="13" height="2.6" rx="0.9"/>
      </g>
      <path class="thread off-e off-z" d="M80 60 V110"/>
      <g class="pulses on-w"><circle class="pulse p1" cx="80" cy="108" r="1.1"/><circle class="pulse p2" cx="80" cy="108" r="1.1"/></g>
      <path class="tangle on-e" d="M80 76 C74 80 86 84 80 88 C74 92 87 95 79 99 C73 102 85 105 80 110"/>
      <g class="on-s rainbow">
        <path class="rb rb1" d="M40 92 A40 40 0 0 1 120 92"/><path class="rb rb2" d="M44 92 A36 36 0 0 1 116 92"/>
        <path class="rb rb3" d="M48 92 A32 32 0 0 1 112 92"/><path class="rb rb4" d="M52 92 A28 28 0 0 1 108 92"/>
      </g>
      <g class="on-q rain">
        <path class="raincloud" d="M72 34 C68 34 68 28 72 28 C72 23 79 22 81 26 C84 23 90 26 88 30 C91 31 90 34 87 34 Z"/>
        <path class="drop d1" d="M75 38 v3"/><path class="drop d2" d="M80 37 v3"/><path class="drop d3" d="M85 38 v3"/>
      </g>
      <g class="float">
        ${baby(80, 44, 0.8, 'on-w')}
        ${plush('M51 57.5 C46 56.5 44 62 47 65 C49.5 66.5 52.5 62.5 51 57.5 Z', 'f-ear', id)}
        ${plush('M109 57.5 C114 56.5 116 62 113 65 C110.5 66.5 107.5 62.5 109 57.5 Z', 'f-ear', id)}
        ${plush(ell(74, 73.2, 2.4, 1.7), 'f-ear', id)}${plush(ell(86, 73.2, 2.4, 1.7), 'f-ear', id)}
        ${plush(cloud, 'f-cloud', id, 'g')}
        <path class="curl" d="M88 45 C87 40 93 39 93 43 C93 46 89 46 89 44"/>
        <path class="brow on-e" d="M69.5 52.6 L75.5 54.4 M90.5 52.6 L84.5 54.4"/>
        ${eye(73, 58, 3.3, 1)}${eye(87, 58, 3.3, -1)}
        ${mouth(80, 64, 2.4)}
        ${blush(67.5, 63)}${blush(92.5, 63)}
        <path class="sweat on-e" d="M97 52 C95.5 55 95.5 57 97 57 C98.5 57 98.5 55 97 52 Z"/>
        <g class="chefhat on-q">${plush('M73 45 C70 41 73 36 77 38 C78 33.5 84 33.5 84.5 38 C88 36 91 41 87 45 Z', 'f-hat', id)}${plush('M73.4 44 H86.6 V46.6 H73.4 Z', 'f-hat', id)}</g>
      </g>
      <path class="bolt on-e" d="M104 42 L99 52 H103 L98 62"/>
      <g class="on-z sheep">
        <g class="sh sh1"><ellipse class="sh-body" cx="56" cy="36" rx="3.4" ry="2.4"/><circle class="sh-head" cx="59.4" cy="35" r="1.3"/></g>
        <g class="sh sh2"><ellipse class="sh-body" cx="56" cy="36" rx="3.4" ry="2.4"/><circle class="sh-head" cx="59.4" cy="35" r="1.3"/></g>
      </g>
      ${zzz(108, 72)}`;
  }

  /* ═══ 6. dododada · Teaching Dodo ═══
     A rose-felt dodo in round spectacles with a chalk slate, eggs and chicks.
     Face is symmetric around x=68; the slate stands to the right, the class on the left. */
  function dodo(id) {
    const body = 'M68 76 C87 76 95 89 95 101 C95 112.5 85 118 68 118 C51 118 41 112.5 41 101 C41 89 49 76 68 76 Z';
    const GY = 119.6;
    const egg = (cx, cls) => {
      const d = `M${cx} ${GY - 15} C${cx + 6.6} ${GY - 15} ${cx + 7.6} ${GY - 5} ${cx + 7} ${GY - 3} C${cx + 6} ${GY} ${cx + 3} ${GY} ${cx} ${GY} C${cx - 3} ${GY} ${cx - 6} ${GY} ${cx - 7} ${GY - 3} C${cx - 7.6} ${GY - 5} ${cx - 6.6} ${GY - 15} ${cx} ${GY - 15} Z`;
      return `<g class="egg ${cls}">${plush(d, 'f-egg', id)}<circle class="egg-spot" cx="${cx - 2.6}" cy="${GY - 9}" r="1"/><circle class="egg-spot" cx="${cx + 2.4}" cy="${GY - 5.4}" r="0.8"/><circle class="egg-spot" cx="${cx + 1.6}" cy="${GY - 11.6}" r="0.7"/><path class="egg-crack" d="M${cx - 4.6} ${GY - 8.6} l2.4 -2.2 l1.8 2.4 l2.2 -2.4 l2.2 2 l2 -1.6"/></g>`;
    };
    const shell = (cx, cls) => `<path class="egg-shell ${cls}" d="M${cx - 5.5} ${GY} L${cx - 4.5} ${GY - 3.2} L${cx - 2.5} ${GY - 1.6} L${cx - 0.5} ${GY - 4.2} L${cx + 1.5} ${GY - 1.6} L${cx + 3.7} ${GY - 3.4} L${cx + 5.5} ${GY} Z"/>`;
    const chick = (cx, fab, cls) => `<g class="chick ${cls}">${plush(ell(cx, GY - 5.8, 6.2, 5.8), fab, id)}${plush(ell(cx - 5.4, GY - 5, 1.7, 2.6), fab, id)}${plush(ell(cx + 5.4, GY - 5, 1.7, 2.6), fab, id)}
      <path class="chick-beak" d="M${cx - 1.7} ${GY - 6.4} H${cx + 1.7} L${cx} ${GY - 4.1} Z"/>
      ${eye(cx - 2.9, GY - 8.6, 1.9, 1)}${eye(cx + 2.9, GY - 8.6, 1.9, -1)}
      <path class="chick-tuft" d="M${cx} ${GY - 11.5} q-1.4 -3 -3 -2.6 M${cx} ${GY - 11.5} q1.4 -3 3 -2.6"/></g>`;
    return `
      <ellipse class="pw-contact" cx="68" cy="119.7" rx="28" ry="2.5"/>
      <g class="d-board">
        <path class="easel-leg" d="M115 102 L111 119.6 M143 102 L147 119.6 M129 102 V119.6"/>
        <rect class="board-frame" x="109" y="70" width="40" height="32" rx="2.4"/>
        <rect class="board-face" x="111.6" y="72.6" width="34.8" height="26.8" rx="1.2"/>
        <rect class="board-tray" x="111" y="101.4" width="36" height="2.4" rx="1"/>
        <path class="chalk c1" pathLength="1" d="M114.5 77.5 q2 -2 4 0 t4 0 t4 0 t4 0"/>
        <path class="chalk c2" pathLength="1" d="M114.5 83 q2 -2 4 0 t4 0 t4 0"/>
        <path class="chalk c3" pathLength="1" d="M114.5 88.5 H123.5"/>
        <path class="chalk c4" pathLength="1" d="M134 81 a4 4 0 1 1 8 0 c0 2 -1.2 3 -2 4 h-4 c-0.8 -1 -2 -2 -2 -4 Z M136 88 h4"/>
        <path class="chalk c5" pathLength="1" d="M133.5 94 H142.5 M140.3 91.8 L142.5 94 L140.3 96.2"/>
        <path class="chalk-ok" pathLength="1" d="M114.5 94.5 L118.5 98 L126.5 91.2"/>
        <path class="chalk-scribble on-e" d="M113 75 L145 79 L113 83 L145 87 L113 91 L145 95 L113 98"/>
        <path class="chalk-stick on-e" d="M120 101.2 l3.4 -0.6 M126 101.2 l2.6 -0.3"/>
      </g>
      <g class="d-eggs on-i on-q on-e on-w">${egg(15.5, 'egg-a')}${egg(29, 'egg-b')}</g>
      <g class="d-hatch on-w">
        ${shell(15.5, 'shell-a')}${shell(29, 'shell-b')}
        ${chick(15.5, 'f-chick-a', 'chick-w chick-wa')}${chick(29, 'f-chick-b', 'chick-w chick-wb')}
      </g>
      <g class="d-kids on-s on-z">${chick(15.5, 'f-chick-a', 'chick-1')}${chick(29, 'f-chick-b', 'chick-2')}</g>
      <g class="d-all">
        <g class="d-tail">
          ${plush('M91 92 C101 85 106 90 103 96 C101 100 95 99 92 98 Z', 'f-dodo-dark', id)}
          ${plush('M92 101 C101 99 106 105 102 110 C99 113 93 110 92 107 Z', 'f-dodo-dark', id)}
          ${plush('M89 86 C93 78 100 77 100 83 C100 88 94 90 90 90 Z', 'f-tuft', id)}
        </g>
        ${plush(body, 'f-dodo', id, 'h')}
        ${plush(ell(68, 106, 15, 10), 'f-belly-d', id)}
        ${plush(ell(58, 118, 6, 2.5), 'f-beak', id)}${plush(ell(78, 118, 6, 2.5), 'f-beak', id)}
        ${plush('M68 102 L58.5 96.5 L58.5 107.5 Z', 'f-rose', id)}${plush('M68 102 L77.5 96.5 L77.5 107.5 Z', 'f-rose', id)}${plush(ell(68, 102, 3, 3.4), 'f-rose-dark', id)}
        <g class="d-book on-z">
          <path class="f-cover pw-seamed" d="M47 112 Q58 109 68 113 Q78 109 89 112 V117 Q78 114 68 118 Q58 114 47 117 Z"/>
          ${plush('M49 102 Q58.5 99 68 103 V115 Q58.5 111 49 114 Z', 'f-page', id)}${plush('M87 102 Q77.5 99 68 103 V115 Q77.5 111 87 114 Z', 'f-page', id)}
          <path class="book-lines" d="M53 105.6 q5 -1.2 10 0.8 M53 109 q5 -1.2 10 0.8 M83 105.6 q-5 -1.2 -10 0.8 M83 109 q-5 -1.2 -10 0.8"/>
        </g>
        <g class="d-wing-l">${plush('M45 90 C38 92 36.5 103 41 110 C45 113 50 108 51 100 Z', 'f-dodo-dark', id)}</g>
        <g class="d-wing-r">${plush('M91 90 C98 92 99.5 103 95 110 C91 113 86 108 85 100 Z', 'f-dodo-dark', id)}<path class="chalk-stick" d="M92.4 111.2 l3.4 -3.8"/></g>
        <g class="d-head">
          ${plush(ell(68, 64, 17.5, 15), 'f-dodo', id, 'h')}
          ${blush(53.5, 68.5, 2.6)}${blush(82.5, 68.5, 2.6)}
          ${eye(60.5, 61.5, 3.4, 1)}${eye(75.5, 61.5, 3.4, -1)}
          <g class="d-glasses">
            <circle class="d-lens" cx="60.5" cy="61.5" r="5.7"/><circle class="d-lens" cx="75.5" cy="61.5" r="5.7"/>
            <path class="d-temple" d="M66.2 60.5 Q68 59.1 69.8 60.5 M54.8 60.5 L51.2 58.6 M81.2 60.5 L84.8 58.6"/>
          </g>
          ${plush('M57 70 Q68 65 79 70 Q82 80 74.5 88 Q71 93.5 68 93.5 Q65 93.5 61.5 88 Q54 80 57 70 Z', 'f-beak', id)}
          <path class="beak-tip" d="M64.2 88.8 Q68 97.4 71.8 88.8 Q69.8 92.4 68 92.4 Q66.2 92.4 64.2 88.8 Z"/>
          <circle class="nostril" cx="64.4" cy="74.2" r="0.85"/><circle class="nostril" cx="71.6" cy="74.2" r="0.85"/>
          ${mouth(68, 81.6, 3.6)}
          <g class="d-tuft">
            ${plush('M68 51 C61.5 46 63 37 68 35 C73 37 74.5 46 68 51 Z', 'f-tuft', id)}
            ${plush('M61.5 52 C55 49 53.5 42 57 39.5 C61.5 41 64 46 61.5 52 Z', 'f-tuft', id)}
            ${plush('M74.5 52 C81 49 82.5 42 79 39.5 C74.5 41 72 46 74.5 52 Z', 'f-tuft', id)}
          </g>
        </g>
      </g>
      <g class="dust on-q"><g class="dust-in"><path class="poof-cloud" d="M42 118.6 Q38.6 118.4 38.8 115.8 Q39 113.4 42.2 113.7 Q43.2 111.4 46.2 112.2 Q48.8 111.8 49.6 114.2 Q52.6 114.2 52.4 116.6 Q52.2 118.8 49.4 118.6 Z"/><path class="poof-cloud" d="M82 118.6 Q78.6 118.4 78.8 115.8 Q79 113.4 82.2 113.7 Q83.2 111.4 86.2 112.2 Q88.8 111.8 89.6 114.2 Q92.6 114.2 92.4 116.6 Q92.2 118.8 89.4 118.6 Z"/></g></g>
      <g class="feather on-q"><g transform="translate(46 80)">${plush('M0 0 C-2.4 -3.4 0 -7.6 3.4 -8.6 C4.6 -4.6 3.4 -1 0 0 Z', 'f-tuft', id)}</g></g>
      <g class="bulb on-s">
        <circle class="bulb-glow" cx="96" cy="44" r="10"/>
        <path class="bulb-glass" d="M96 36 a6 6 0 0 1 3.4 10.9 V50 h-6.8 V46.9 A6 6 0 0 1 96 36 Z"/>
        <path class="bulb-base" d="M93.4 52 h5.2 M94.2 54.4 h3.6"/>
        <path class="bulb-ray" d="M96 30 v-3.4 M105 33.6 l2.4 -2.4 M87 33.6 l-2.4 -2.4 M108 43 h3.4 M84 43 h-3.4"/>
      </g>
      <g class="mortar on-s"><g class="mortar-in">
        <path class="f-grad pw-seamed" d="M14 90 L22.5 86 L31 90 L22.5 94 Z"/>
        <path class="f-grad pw-seamed" d="M17.5 92.4 V97 Q22.5 99.4 27.5 97 V92.4"/>
        <path class="mortar-tassel" d="M31 90 V96"/><circle class="mortar-dot" cx="31" cy="97" r="1.2"/>
      </g></g>
      <path class="sweat on-e" d="M88 52 C86.5 55 86.5 57 88 57 C89.5 57 89.5 55 88 52 Z"/>
      <g class="on-e qm"><text class="q q1" x="89" y="46">?</text><text class="q q2" x="44" y="50">?</text></g>
      ${zzz(94, 60)}`;
  }

  function backdrop() {
    const star = (x, y, s = 1) => `<path class="bd-star" d="M${x} ${y - 3 * s} Q${x} ${y} ${x - 3 * s} ${y} Q${x} ${y} ${x} ${y + 3 * s} Q${x} ${y} ${x + 3 * s} ${y} Q${x} ${y} ${x} ${y - 3 * s} Z"/>`;
    return `<path class="bd-moon" d="M748 22 A11 11 0 1 0 759 42 A8.6 8.6 0 1 1 748 22 Z"/>
      ${star(52, 26)}${star(230, 38, 0.8)}${star(398, 22)}${star(566, 34, 0.8)}${star(690, 46, 0.7)}${star(836, 30)}${star(918, 24, 0.8)}`;
  }

  const DRAW = { twargaops: bear, yeast, labs: chefs, bvp: crab, cloud: lamb, dodo };

  registerStyle({
    id: 'patchwork',
    name: 'Patchwork',
    idea: 'Plush textile avatars: felt, running stitches and sewn button eyes.',
    viewBox: '7.5 12.5 145 117.5',
    look: 0.9,
    cycle: { twargaops: 3000, yeast: 4000, labs: 3400, bvp: 3000, cloud: 2400, dodo: 4400 },
    quirk: { twargaops: 3000, yeast: 2800, labs: 3400, bvp: 3000, cloud: 3000, dodo: 3000 },
    backdrop,
    draw(kind, uid) {
      return `${defs(uid)}<path class="pw-ground" d="M0 120 H160"/>${DRAW[kind](uid)}`;
    },
    css: `
  /* ── Kit ── */
  ${S} .pw-ground { fill: none; stroke: var(--line); stroke-width: 1.3px; stroke-dasharray: 4 3; stroke-linecap: round; opacity: .4; }
  ${S} .pw-contact { fill: rgba(0, 0, 0, .35); }
  ${S} .pw-shadow { fill: rgba(0, 0, 0, .38); transform: translate(1.2px, 1.6px); }
  ${S} .pw-tex { pointer-events: none; }
  ${S} .pw-seam { fill: none; }
  ${S} .pw-seam, ${S} .pw-seamed { stroke: var(--line); stroke-width: 1.15px; stroke-dasharray: 2.8 2; stroke-linecap: round; stroke-linejoin: round; }
  ${S} .pw-blush { fill: var(--accent); opacity: .45; }
  ${S} .pw-nose { fill: #1a1410; }
  ${S} .bd-star { fill: var(--line); opacity: .45; }
  ${S} .bd-moon { fill: var(--line); opacity: .7; }

  /* Fabrics */
  ${S} .f-bear { fill: #6b4a2e; } ${S} .f-bear-dark { fill: #4d3420; } ${S} .f-belly { fill: #8f6a43; } ${S} .f-muzzle { fill: #d9bb8f; }
  ${S} .f-amber { fill: #d98f2b; }
  ${S} .f-yeast { fill: #2e8a58; } ${S} .f-nucleus { fill: #63c788; } ${S} .f-cap { fill: #4b3d8f; }
  ${S} .f-apron { fill: #f07020; } ${S} .f-bib, ${S} .f-hat { fill: #f3ece0; } ${S} .f-face { fill: #efcda6; } ${S} .f-shoe { fill: #3a2418; }
  ${S} .f-oven { fill: #5a3826; } ${S} .f-sack { fill: #e6dac4; } ${S} .f-wood { fill: #c39a63; }
  ${S} .f-shell { fill: #7a5fd4; } ${S} .f-shell2 { fill: #5c47a8; } ${S} .f-crab { fill: #e89d88; }
  ${S} .f-cloud { fill: #2b4c76; transition: fill .3s ease; } ${S} .f-ear { fill: #2a2433; }

  /* Eyes */
  ${S} .e-btn { fill: #15120f; stroke: var(--line); stroke-width: .8px; }
  ${S} .e-hole { fill: var(--line); opacity: .5; }
  ${S} .e-glint { fill: #fff; opacity: .92; }
  ${S} .e-ring { fill: none; stroke: var(--line); stroke-width: .9px; }
  ${S} .e-happy, ${S} .e-shut, ${S} .e-strain { fill: none; stroke: var(--line); stroke-width: 1.3px; stroke-linecap: round; stroke-linejoin: round; }
  ${S} .e-x, ${S} .e-spiral path { fill: none; stroke: var(--alarm); stroke-width: 1.2px; stroke-linecap: round; }
  ${S} .e-open { transform-box: fill-box; transform-origin: center; transition: transform 70ms ease-out; }
  ${S}.blink .e-open { transform: scaleY(.15); }
  ${S} .e-spiral { transform-box: fill-box; transform-origin: center; }

  /* Mouths */
  ${S} .pw-mouth > * { fill: none; stroke: var(--line); stroke-width: 1.15px; stroke-linecap: round; stroke-linejoin: round; }
  ${S} .m-o, ${S} .m-big { fill: #15120f; stroke-width: .9px; }

  /* Face per state */
  ${S} .e-ring, ${S} .e-happy, ${S} .e-shut, ${S} .e-x, ${S} .e-strain, ${S} .e-spiral, ${S} .pw-mouth > * { opacity: 0; }
  ${S}[data-state="idle"] .m-smile, ${S}[data-state="working"] .m-flat, ${S}[data-state="quirk"] .m-o { opacity: 1; }
  ${S}[data-state="success"] .e-open { opacity: 0; }
  ${S}[data-state="success"] .e-happy, ${S}[data-state="success"] .m-big { opacity: 1; }
  ${S}[data-state="error"] .m-frown { opacity: 1; }
  ${S}[data-state="sleep"] .e-open { opacity: 0; }
  ${S}[data-state="sleep"] .e-shut, ${S}[data-state="sleep"] .m-smile { opacity: 1; }

  /* Props per state */
  ${S} .on-i, ${S} .on-w, ${S} .on-q, ${S} .on-s, ${S} .on-e, ${S} .on-z { display: none; }
  ${S}[data-state="idle"] .on-i, ${S}[data-state="working"] .on-w, ${S}[data-state="quirk"] .on-q,
  ${S}[data-state="success"] .on-s, ${S}[data-state="error"] .on-e, ${S}[data-state="sleep"] .on-z { display: inline; }
  ${S}[data-state="error"] .off-e, ${S}[data-state="sleep"] .off-z { display: none; }

  /* Baby machine */
  ${S} .mm-body { fill: #1d2b38; stroke: var(--line); stroke-width: .9px; stroke-dasharray: 2 1.4; }
  ${S} .mm-screen { fill: #00d26a; }
  ${S} .mm-dot { fill: #0b1a10; }
  ${S} .mm-foot { fill: #0e1620; }

  /* Zzz */
  ${S} .pw-zzz text { fill: var(--line); font: 800 8px ui-monospace, monospace; opacity: 0; }
  ${S} .pw-zzz text:nth-child(2) { font-size: 10px; }
  ${S} .pw-zzz text:nth-child(3) { font-size: 13px; }
  ${S}[data-state="sleep"] .pw-zzz text { animation: patchwork-z 3s ease-out infinite; }
  ${S}[data-state="sleep"] .pw-zzz text:nth-child(2) { animation-delay: 1s; }
  ${S}[data-state="sleep"] .pw-zzz text:nth-child(3) { animation-delay: 2s; }
  @keyframes patchwork-z { 0% { opacity: 0; transform: none; } 25% { opacity: .9; } 100% { opacity: 0; transform: translate(4px, -10px); } }

  /* ═══ 1. TwargaOps · Watchman Bear ═══ */
  ${S} .lamp-handle { fill: none; stroke: var(--line); stroke-width: 1.2px; stroke-linecap: round; }
  ${S} .lamp-cap { fill: #3a2616; stroke: var(--line); stroke-width: .8px; }
  ${S} .lamp-glass { fill: rgba(233, 162, 59, .22); stroke: var(--line); stroke-width: .8px; }
  ${S} .lamp-strut { stroke: var(--line); stroke-width: .6px; opacity: .5; }
  ${S} .lamp-flame { fill: var(--amber); transform-box: fill-box; transform-origin: 50% 100%; animation: patchwork-flame 1.6s ease-in-out infinite; }
  ${S} .lamp-glow { fill: var(--amber); opacity: .18; }
  ${S} .lamp-ring { fill: none; stroke: var(--amber); stroke-width: 1px; transform-box: fill-box; transform-origin: center; }
  ${S} .fw { fill: none; stroke: var(--amber); stroke-width: 1.3px; stroke-linecap: round; }
  ${S} .fw-dot { fill: var(--amber); }
  ${S} .firework { transform-box: fill-box; transform-origin: center; }
  ${S} .smoke { fill: none; stroke: var(--muted); stroke-width: 1.4px; stroke-linecap: round; stroke-dasharray: 3 2.4; }
  ${S} .fringe, ${S} .tink { fill: none; stroke: var(--line); stroke-width: 1px; stroke-linecap: round; }
  ${S} .tink { stroke: var(--amber); }
  ${S} .bear-body { transform-origin: 75px 117px; }
  ${S} .bear-arm { transform-origin: 95px 90px; }
  ${S} .bear-lantern { transform-origin: 106px 100px; }
  ${S} .scarf-tail { transform-origin: 92px 93px; }
  @keyframes patchwork-flame { 0%, 100% { transform: scale(1); } 40% { transform: scale(.88, 1.14); } 70% { transform: scale(1.08, .92); } }

  ${S}.k-twargaops[data-state="idle"] .bear-body { animation: patchwork-breathe 3.6s ease-in-out infinite; }
  ${S}.k-twargaops[data-state="idle"] .bear-arm { animation: patchwork-sway 3.6s ease-in-out infinite; }
  @keyframes patchwork-breathe { 50% { transform: scale(1.012, 1.018); } }
  @keyframes patchwork-sway { 0%, 100% { transform: rotate(-3deg); } 50% { transform: rotate(4deg); } }

  ${S}.k-twargaops[data-state="working"] .bear-arm, ${S}.k-twargaops[data-state="success"] .bear-arm { transform: rotate(-70deg); }
  ${S}.k-twargaops[data-state="working"] .bear-lantern, ${S}.k-twargaops[data-state="success"] .bear-lantern { transform: rotate(70deg); }
  ${S}.k-twargaops[data-state="working"] .bear-arm { animation: patchwork-arm-up 3s var(--ease-io) infinite; }
  ${S}.k-twargaops[data-state="working"] .bear-lantern { animation: patchwork-lantern-up 3s var(--ease-io) infinite; }
  ${S}.k-twargaops[data-state="working"] .lamp-flame { animation-duration: .7s; }
  ${S}.k-twargaops[data-state="working"] .lamp-glow { opacity: .32; }
  ${S}.k-twargaops[data-state="working"] .lamp-ring { animation: patchwork-ring 1.4s ease-out infinite; }
  ${S}.k-twargaops[data-state="working"] .lamp-ring.r2 { animation-delay: .7s; }
  ${S}.k-twargaops[data-state="working"] .scarf-tail { animation: patchwork-flutter .5s ease-in-out infinite; }
  @keyframes patchwork-arm-up { 0%, 100% { transform: none; } 18%, 85% { transform: rotate(-70deg); } }
  @keyframes patchwork-lantern-up { 0%, 100% { transform: none; } 18%, 85% { transform: rotate(70deg); } }
  @keyframes patchwork-ring { 0% { transform: scale(1); opacity: .8; } 100% { transform: scale(2.6); opacity: 0; } }
  @keyframes patchwork-flutter { 50% { transform: rotate(-9deg); } }

  ${S}.k-twargaops[data-state="quirk"] .bear-tap { animation: patchwork-tap 3s ease-in-out 1 both; }
  ${S}.k-twargaops[data-state="quirk"] .tink { animation: patchwork-tink 3s steps(1) 1 both; }
  ${S}.k-twargaops[data-state="quirk"] .e-open { animation: patchwork-yawn-open 3s ease-in-out 1 both; }
  ${S}.k-twargaops[data-state="quirk"] .e-shut { animation: patchwork-yawn-shut 3s ease-in-out 1 both; }
  ${S}.k-twargaops[data-state="quirk"] .m-o { animation: patchwork-yawn-mouth 3s ease-in-out 1 both; transform-box: fill-box; transform-origin: 50% 0; }
  ${S}.k-twargaops[data-state="quirk"] .bear-body { animation: patchwork-stretch 3s ease-in-out 1 both; }
  @keyframes patchwork-tap { 0% { opacity: 0; transform: translate(-3px, 3px); } 8% { opacity: 1; transform: none; } 14% { transform: translate(2px, -1.5px); } 19% { transform: none; } 24% { transform: translate(2px, -1.5px); } 29% { transform: none; } 36%, 100% { opacity: 0; transform: translate(-3px, 3px); } }
  @keyframes patchwork-tink { 0%, 13% { opacity: 0; } 14%, 18% { opacity: 1; } 19%, 23% { opacity: 0; } 24%, 28% { opacity: 1; } 29%, 100% { opacity: 0; } }
  @keyframes patchwork-yawn-open { 0%, 44% { opacity: 1; } 47%, 86% { opacity: 0; } 90%, 100% { opacity: 1; } }
  @keyframes patchwork-yawn-shut { 0%, 44% { opacity: 0; } 47%, 86% { opacity: 1; } 90%, 100% { opacity: 0; } }
  @keyframes patchwork-yawn-mouth { 0%, 44% { opacity: 0; transform: scale(.6); } 52%, 82% { opacity: 1; transform: scale(1.5, 1.8); } 90%, 100% { opacity: 0; transform: scale(.6); } }
  @keyframes patchwork-stretch { 0%, 44%, 92%, 100% { transform: none; } 54%, 80% { transform: scale(1.03, 1.045); } }

  ${S}.k-twargaops[data-state="success"] .firework { animation: patchwork-burst 1.1s var(--ease-out) infinite; }
  ${S}.k-twargaops[data-state="success"] .bear-body { animation: patchwork-hop .8s var(--ease-out) 2; }
  @keyframes patchwork-burst { 0% { transform: scale(.4); opacity: 0; } 30% { opacity: 1; } 70% { transform: scale(1.12); opacity: 1; } 100% { transform: scale(1.25); opacity: 0; } }
  @keyframes patchwork-hop { 35% { transform: translateY(-4px); } 60% { transform: scale(1.02, .98); } }

  ${S}.k-twargaops[data-state="error"] .lamp-flame, ${S}.k-twargaops[data-state="error"] .lamp-glow { opacity: 0; }
  ${S}.k-twargaops[data-state="error"] .smoke { animation: patchwork-smoke 1.8s linear infinite; }
  ${S}.k-twargaops[data-state="error"] .bear-body, ${S}.k-twargaops[data-state="error"] .bear-arm { animation: patchwork-shiver .14s linear infinite; }
  ${S}.k-twargaops[data-state="error"] .e-ring, ${S}.k-twargaops[data-state="error"] .m-zig { opacity: 1; }
  ${S}.k-twargaops[data-state="error"] .m-frown { opacity: 0; }
  @keyframes patchwork-smoke { 0% { stroke-dashoffset: 0; opacity: 0; transform: none; } 20% { opacity: .9; } 100% { stroke-dashoffset: -16; opacity: 0; transform: translateY(-6px); } }
  @keyframes patchwork-shiver { 50% { transform: translateX(.7px); } }

  ${S}.k-twargaops[data-state="sleep"] .bear-body { transform: translateY(2px) scale(1, .97); }
  ${S}.k-twargaops[data-state="sleep"] .lamp-flame { animation-duration: 3s; opacity: .6; }
  ${S}.k-twargaops[data-state="sleep"] .lamp-glow { opacity: .1; }

  /* ═══ 2. Yeast · Yeast Cell ═══ */
  ${S} .membrane { fill: none; stroke: #8fe0ad; stroke-width: .8px; stroke-dasharray: 1.6 2.2; opacity: .45; }
  ${S} .bub { fill: none; stroke: #7fe0a6; stroke-width: 1.1px; }
  ${S} .wrinkle, ${S} .pop { fill: none; stroke: var(--line); stroke-width: 1px; stroke-linecap: round; opacity: .7; }
  ${S} .cap-pom { fill: var(--line); }
  ${S} .y-body { transform-origin: 70px 117px; }
  ${S} .y-bud { transform-box: fill-box; transform-origin: 0% 50%; }
  ${S} .yb, ${S} .fz, ${S} .bub { transform-box: fill-box; transform-origin: center; }

  ${S}.k-yeast[data-state="idle"] .y-body { animation: patchwork-jiggle 1.3s ease-in-out infinite; }
  ${S}.k-yeast[data-state="idle"] .bub, ${S}.k-yeast[data-state="working"] .bub { animation: patchwork-bubble 2.4s ease-in infinite; }
  ${S} .bub.b2 { animation-delay: .8s !important; } ${S} .bub.b3 { animation-delay: 1.6s !important; }
  @keyframes patchwork-jiggle { 0%, 100% { transform: none; } 25% { transform: scale(1.035, .97); } 50% { transform: scale(.98, 1.025); } 75% { transform: scale(1.015, .99); } }
  @keyframes patchwork-bubble { 0% { opacity: 0; transform: translateY(4px) scale(.6); } 30% { opacity: 1; } 100% { opacity: 0; transform: translateY(-9px) scale(1.1); } }

  ${S}.k-yeast[data-state="working"] .y-bud { animation: patchwork-bud .8s var(--ease-io) infinite; }
  ${S}.k-yeast[data-state="working"] .y-body { animation: patchwork-bud-push .8s ease-in-out infinite; }
  ${S}.k-yeast[data-state="working"] .yb1 { animation: patchwork-yb1 4s var(--ease-out) infinite; }
  ${S}.k-yeast[data-state="working"] .yb2 { animation: patchwork-yb2 4s var(--ease-out) infinite; }
  ${S}.k-yeast[data-state="working"] .yb3 { animation: patchwork-yb3 4s var(--ease-out) infinite; }
  ${S}.k-yeast[data-state="working"] .yb4 { animation: patchwork-yb4 4s var(--ease-out) infinite; }
  @keyframes patchwork-bud { 0% { transform: scale(.3); opacity: 0; } 70% { transform: scale(1); opacity: 1; } 80%, 100% { transform: scale(.2); opacity: 0; } }
  @keyframes patchwork-bud-push { 0%, 66%, 100% { transform: none; } 76% { transform: scale(1.03, .97) translateX(-1px); } }
  @keyframes patchwork-yb1 { 0%, 16% { opacity: 0; transform: translate(-15px, -18px) scale(.5); } 17% { opacity: 1; } 22% { transform: translate(-8px, -28px) scale(.85); } 28% { transform: none; } 31% { transform: translateY(-3px); } 34%, 92% { opacity: 1; transform: none; } 98%, 100% { opacity: 0; } }
  @keyframes patchwork-yb2 { 0%, 36% { opacity: 0; transform: translate(-30px, -18px) scale(.5); } 37% { opacity: 1; } 43% { transform: translate(-15px, -32px) scale(.85); } 49% { transform: none; } 52% { transform: translateY(-3px); } 55%, 92% { opacity: 1; transform: none; } 98%, 100% { opacity: 0; } }
  @keyframes patchwork-yb3 { 0%, 56% { opacity: 0; transform: translate(70px, -18px) scale(.5); } 57% { opacity: 1; } 63% { transform: translate(35px, -46px) scale(.85) rotate(-180deg); } 70% { transform: rotate(-360deg); } 73% { transform: translateY(-3px); } 76%, 92% { opacity: 1; transform: none; } 98%, 100% { opacity: 0; } }
  @keyframes patchwork-yb4 { 0%, 76% { opacity: 0; transform: translate(-23px, -8px) scale(.5); } 77% { opacity: 1; } 82% { transform: translate(-11px, -22px) scale(.85); } 87% { transform: none; } 89% { transform: translateY(-2px); } 91%, 94% { opacity: 1; transform: none; } 99%, 100% { opacity: 0; } }

  ${S}.k-yeast[data-state="quirk"] .y-body { animation: patchwork-hiccup 2.8s ease-out 1 both; }
  ${S}.k-yeast[data-state="quirk"] .fz { animation: patchwork-fizz 1s var(--ease-out) 1 both; }
  ${S} .fz.f1 { animation-delay: .2s !important; } ${S} .fz.f2 { animation-delay: .9s !important; } ${S} .fz.f3 { animation-delay: 1.5s !important; }
  ${S} .fz.f4 { animation-delay: 1.7s !important; } ${S} .fz.f5 { animation-delay: 1.9s !important; }
  ${S}.k-yeast[data-state="quirk"] .pw-blush { animation: patchwork-blush 2.8s ease-in-out 1 both; }
  @keyframes patchwork-hiccup { 0%, 6%, 15%, 31%, 40%, 55%, 64%, 100% { transform: none; } 9% { transform: translateY(-4px) scale(1.03, .97); } 34% { transform: translateY(-4px) scale(1.03, .97); } 58% { transform: translateY(-6px) scale(1.04, .96); } }
  @keyframes patchwork-fizz { 0% { opacity: 0; transform: translateY(10px) scale(.4); } 25% { opacity: 1; transform: none; } 80% { opacity: 1; transform: translateY(-8px); } 100% { opacity: 0; transform: translateY(-12px); } }
  @keyframes patchwork-blush { 0%, 55% { opacity: .45; transform: none; } 70%, 100% { opacity: .95; } }

  ${S}.k-yeast[data-state="success"] .y-body { animation: patchwork-puff 1s var(--ease-out) infinite; }
  ${S}.k-yeast[data-state="success"] .burst { animation: patchwork-pop-out 1s var(--ease-out) infinite; }
  ${S} .burst.p2 { animation-delay: .15s !important; } ${S} .burst.p3 { animation-delay: .3s !important; } ${S} .burst.p4 { animation-delay: .45s !important; }
  @keyframes patchwork-puff { 0%, 100% { transform: none; } 35% { transform: scale(1.07) translateY(-2px); } 60% { transform: scale(.98, 1.02); } }
  @keyframes patchwork-pop-out { 0% { opacity: 0; transform: scale(.4); } 30% { opacity: 1; } 100% { opacity: 0; transform: translateY(-10px) scale(1.3); } }

  ${S}.k-yeast[data-state="error"] .y-body { transform: scale(1.06, .9); animation: patchwork-strain .2s linear infinite; }
  ${S}.k-yeast[data-state="error"] .y-bud { transform: translate(4px, 4px) scale(.85); animation: patchwork-stuck .5s ease-in-out infinite; }
  ${S}.k-yeast[data-state="error"] .e-open { opacity: 0; }
  ${S}.k-yeast[data-state="error"] .e-strain { opacity: 1; }
  ${S}.k-yeast[data-state="error"] .sad { animation: patchwork-sad 2s ease-out infinite; }
  ${S}.k-yeast[data-state="error"] .pop { animation: patchwork-popped 2s steps(1) infinite; }
  @keyframes patchwork-strain { 0%, 100% { transform: scale(1.06, .9); } 50% { transform: scale(1.06, .9) translateX(.6px); } }
  @keyframes patchwork-stuck { 0%, 100% { transform: translate(4px, 4px) scale(.85); } 50% { transform: translate(5.5px, 4px) scale(.9); } }
  @keyframes patchwork-sad { 0% { opacity: 0; transform: translateY(6px); } 20%, 55% { opacity: 1; transform: none; } 60%, 100% { opacity: 0; } }
  @keyframes patchwork-popped { 0%, 58% { opacity: 0; } 60%, 78% { opacity: 1; } 80%, 100% { opacity: 0; } }

  ${S}.k-yeast[data-state="sleep"] .y-body { animation: patchwork-breathe 4.5s ease-in-out infinite; }
  ${S}.k-yeast[data-state="sleep"] .slowbub { animation: patchwork-bubble 4s ease-in infinite; }

  /* ═══ 3. LabsBackery · Test Kitchen Chefs ═══ */
  ${S} .pin-handle, ${S} .oven-handle, ${S} .board-string, ${S} .sack-tie { fill: none; stroke: var(--line); stroke-width: 1px; stroke-linecap: round; }
  ${S} .oven-win { fill: #1a1210; }
  ${S} .oven-glow { fill: var(--alarm); opacity: 0; }
  ${S} .oven-dial { fill: var(--line); }
  ${S} .board-frame { fill: #6e4a2c; stroke: var(--line); stroke-width: .9px; }
  ${S} .board-face { fill: #1d2620; }
  ${S} .tally { fill: none; stroke: var(--line); stroke-width: 1.2px; stroke-linecap: round; }
  ${S} .tray-base { fill: #bcb4a6; stroke: var(--line); stroke-width: .6px; }
  ${S} .cake { fill: #1d2b38; stroke: var(--line); stroke-width: .5px; }
  ${S} .cake.fresh { fill: #00d26a; }
  ${S} .puff { fill: none; stroke: var(--muted); stroke-width: 1.4px; stroke-linecap: round; stroke-dasharray: 3 2; }
  ${S} .ding-ray { fill: none; stroke: var(--amber); stroke-width: 1.3px; stroke-linecap: round; }
  ${S} .smoke-cloud { fill: #6b6660; stroke: var(--line); stroke-width: .9px; stroke-dasharray: 2.4 1.8; }
  ${S} .poof-cloud { fill: #f3ece0; stroke: var(--line); stroke-width: .9px; stroke-dasharray: 2.4 1.8; opacity: .96; }
  ${S} .flour { fill: #f6f1e8; }
  ${S} .heart path { fill: var(--alarm); }
  ${S} .chef-in { transform-box: fill-box; transform-origin: 50% 100%; }
  ${S} .hat { transform-box: fill-box; transform-origin: 50% 100%; }
  ${S} .pin { transform-box: fill-box; transform-origin: center; }

  ${S}.k-labs[data-state="idle"] .chef-in { animation: patchwork-bob 1.6s ease-in-out infinite; }
  ${S}.k-labs[data-state="idle"] .chef-crumb .chef-in { animation-delay: -.5s; }
  ${S}.k-labs[data-state="idle"] .chef-pip .chef-in { animation-delay: -1s; }
  ${S}.k-labs[data-state="idle"] .hat { animation: patchwork-hat 2.2s ease-in-out infinite; }
  ${S}.k-labs[data-state="idle"] .pin { animation: patchwork-pin 1.8s ease-in-out infinite; }
  @keyframes patchwork-bob { 50% { transform: translateY(-1.5px); } }
  @keyframes patchwork-hat { 0%, 100% { transform: rotate(-4deg); } 50% { transform: rotate(4deg); } }
  @keyframes patchwork-pin { 0%, 100% { transform: rotate(-8deg) translateX(-1px); } 50% { transform: rotate(8deg) translateX(1px); } }

  ${S}.k-labs[data-state="working"] .tray-in { animation: patchwork-tray-in 3.4s var(--ease-io) infinite; }
  ${S}.k-labs[data-state="working"] .tray-out { animation: patchwork-tray-out 3.4s var(--ease-io) infinite; }
  ${S}.k-labs[data-state="working"] .oven-glow { animation: patchwork-oven-attack 3.4s steps(1) infinite; }
  ${S}.k-labs[data-state="working"] .puff { animation: patchwork-steam 3.4s ease-out infinite; }
  ${S}.k-labs[data-state="working"] .puff.s2 { animation-delay: .15s; }
  ${S}.k-labs[data-state="working"] .ding { animation: patchwork-ding 3.4s steps(1) infinite; }
  ${S}.k-labs[data-state="working"] .chef-in { animation: patchwork-startle 3.4s ease-out infinite; }
  @keyframes patchwork-tray-in { 0%, 8% { opacity: 1; transform: none; } 24% { opacity: 1; transform: translate(26px, 0); } 26%, 100% { opacity: 0; transform: translate(26px, 0); } }
  @keyframes patchwork-tray-out { 0%, 62% { opacity: 0; transform: translate(26px, 0); } 64% { opacity: 1; transform: translate(26px, 0); } 80%, 96% { opacity: 1; transform: none; } 100% { opacity: 0; } }
  @keyframes patchwork-oven-attack { 0%, 25% { opacity: 0; } 26%, 30% { opacity: .9; } 32% { opacity: .2; } 34%, 56% { opacity: .9; } 58%, 100% { opacity: 0; } }
  @keyframes patchwork-steam { 0%, 30% { opacity: 0; transform: none; } 36% { opacity: .9; } 60% { opacity: 0; transform: translateY(-7px); } 100% { opacity: 0; } }
  @keyframes patchwork-ding { 0%, 60% { opacity: 0; } 62%, 68% { opacity: 1; } 70%, 72% { opacity: 0; } 74%, 78% { opacity: 1; } 80%, 100% { opacity: 0; } }
  @keyframes patchwork-startle { 0%, 28%, 40%, 82%, 92%, 100% { transform: none; } 32% { transform: translateY(-3px); } 86% { transform: translateY(-3px); } }

  ${S}.k-labs[data-state="quirk"] .poof { animation: patchwork-poof 3.4s ease-out 1 both; }
  ${S}.k-labs[data-state="quirk"] .flour { animation: patchwork-flour 3.4s steps(1) 1 both; }
  ${S}.k-labs[data-state="quirk"] .t4, ${S}.k-labs[data-state="quirk"] .t5 { animation: patchwork-tally 3.4s steps(1) 1 both; }
  ${S}.k-labs[data-state="quirk"] .chef-in { animation: patchwork-tada 3.4s var(--ease-out) 1 both; }
  ${S}.k-labs[data-state="quirk"] .m-o { opacity: 0; }
  ${S}.k-labs[data-state="quirk"] .m-big { opacity: 1; }
  @keyframes patchwork-poof { 0%, 6% { opacity: 0; transform: scale(.7); } 12%, 28% { opacity: 1; transform: none; } 36%, 100% { opacity: 0; transform: scale(1.1); } }
  @keyframes patchwork-flour { 0%, 27% { opacity: 0; } 28%, 100% { opacity: 1; } }
  @keyframes patchwork-tally { 0%, 59% { opacity: 0; } 60%, 100% { opacity: 1; } }
  @keyframes patchwork-tada { 0%, 62%, 76%, 100% { transform: none; } 68% { transform: translateY(-5px); } }

  ${S}.k-labs[data-state="success"] .chef-in { animation: patchwork-hop .8s var(--ease-out) 2; }
  ${S}.k-labs[data-state="success"] .chef-crumb .chef-in { animation-delay: .1s; }
  ${S}.k-labs[data-state="success"] .chef-pip .chef-in { animation-delay: .2s; }
  ${S}.k-labs[data-state="success"] .tray-up { animation: patchwork-bob .8s ease-in-out infinite; }
  ${S}.k-labs[data-state="success"] .heart { animation: patchwork-heart .8s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
  @keyframes patchwork-heart { 50% { transform: scale(1.25); } }

  ${S}.k-labs[data-state="error"] .oven-glow { opacity: .85; }
  ${S}.k-labs[data-state="error"] .bigsmoke { animation: patchwork-bigsmoke 1.6s ease-out infinite; transform-box: fill-box; transform-origin: 50% 100%; }
  ${S}.k-labs[data-state="error"] .hat { animation: patchwork-hat-fly 1.8s var(--ease-out) infinite; }
  ${S}.k-labs[data-state="error"] .chef-crumb .hat { animation-delay: .15s; }
  ${S}.k-labs[data-state="error"] .chef-pip .hat { animation-delay: .3s; }
  ${S}.k-labs[data-state="error"] .chef-in { animation: patchwork-shiver .14s linear infinite; }
  ${S}.k-labs[data-state="error"] .e-open { opacity: 0; }
  ${S}.k-labs[data-state="error"] .e-x { opacity: 1; }
  @keyframes patchwork-bigsmoke { 0% { opacity: .5; transform: scale(.8); } 50% { opacity: 1; transform: scale(1.05) translateY(-3px); } 100% { opacity: 0; transform: scale(1.15) translateY(-8px); } }
  @keyframes patchwork-hat-fly { 0%, 100% { transform: none; } 30% { transform: translateY(-12px) rotate(-20deg); } 55% { transform: translateY(-14px) rotate(15deg); } 80% { transform: translateY(-4px) rotate(-6deg); } }

  ${S}.k-labs[data-state="sleep"] .hat { transform: translateY(4px) rotate(10deg); }
  ${S}.k-labs[data-state="sleep"] .chef-crumb .hat { transform: translateY(4px) rotate(-8deg); }
  ${S}.k-labs[data-state="sleep"] .chef-in { animation: patchwork-breathe 3.6s ease-in-out infinite; }

  /* ═══ 4. bestvpsforme · Hermit Crab ═══ */
  ${S} .spiral, ${S} .spiral-s { fill: none; stroke: var(--line); stroke-width: 1px; stroke-dasharray: 2.4 1.8; stroke-linecap: round; opacity: .8; }
  ${S} .led-g { fill: #00d26a; } ${S} .led-a { fill: var(--amber); }
  ${S} .stalk-line, ${S} .arm, ${S} .legs path { fill: none; stroke: #e89d88; stroke-width: 2.6px; stroke-linecap: round; }
  ${S} .jaw { fill: none; stroke: #e89d88; stroke-width: 2.4px; stroke-linecap: round; transform-origin: 45.6px 97.6px; }
  ${S} .mark-x { fill: none; stroke: var(--alarm); stroke-width: 1.8px; stroke-linecap: round; }
  ${S} .mark-ok { fill: none; stroke: #00d26a; stroke-width: 2px; stroke-linecap: round; stroke-linejoin: round; }
  ${S} .tag-card { fill: var(--line); stroke: #15120f; stroke-width: .5px; }
  ${S} .tag-string { fill: none; stroke: var(--line); stroke-width: .8px; }
  ${S} .tag-txt { fill: #15120f; font: 800 7px ui-monospace, monospace; }
  ${S} .q { fill: var(--alarm); font: 800 10px ui-monospace, monospace; }
  ${S} .e-shut-s { fill: none; stroke: var(--line); stroke-width: 1.2px; stroke-linecap: round; }
  ${S} .stalk-l { transform-origin: 59.5px 97px; } ${S} .stalk-r { transform-origin: 67.5px 97px; }
  ${S} .claw-l { transform-origin: 53px 105px; }
  ${S} .shell { transform-origin: 84px 115px; }
  ${S} .crab { transform-origin: 64px 112px; }

  ${S}.k-bvp[data-state="idle"] .stalk-l { animation: patchwork-stalk 3s ease-in-out infinite; }
  ${S}.k-bvp[data-state="idle"] .stalk-r { animation: patchwork-stalk 3s ease-in-out -1.4s infinite; }
  ${S}.k-bvp[data-state="idle"] .jaw { animation: patchwork-click 3s ease-in-out infinite; }
  ${S}.k-bvp[data-state="idle"] .shell { animation: patchwork-breathe 3.4s ease-in-out infinite; }
  @keyframes patchwork-stalk { 0%, 100% { transform: rotate(-6deg); } 50% { transform: rotate(7deg); } }
  @keyframes patchwork-click { 0%, 60%, 70%, 80%, 100% { transform: none; } 65%, 75% { transform: rotate(18deg); } }

  ${S}.k-bvp[data-state="working"] .stalk-l, ${S}.k-bvp[data-state="working"] .stalk-r { transform: rotate(16deg); }
  ${S}.k-bvp[data-state="working"] .claw-l { animation: patchwork-point 3s ease-in-out infinite; }
  ${S}.k-bvp[data-state="working"] .crab { animation: patchwork-scuttle 3s ease-in-out infinite; }
  ${S}.k-bvp[data-state="working"] .mark-x { animation: patchwork-mark-x 3s steps(1) infinite; }
  ${S}.k-bvp[data-state="working"] .cand .mark-ok { animation: patchwork-mark-ok 3s var(--ease-out) infinite; transform-box: fill-box; transform-origin: center; }
  @keyframes patchwork-point { 0%, 100% { transform: none; } 20%, 45% { transform: rotate(-25deg); } 60%, 85% { transform: rotate(-35deg); } }
  @keyframes patchwork-scuttle { 0%, 100% { transform: none; } 50% { transform: translateX(3px); } }
  @keyframes patchwork-mark-x { 0%, 24% { opacity: 0; } 25%, 96% { opacity: 1; } 97%, 100% { opacity: 0; } }
  @keyframes patchwork-mark-ok { 0%, 54% { opacity: 0; transform: scale(.4); } 62% { opacity: 1; transform: scale(1.2); } 68%, 96% { opacity: 1; transform: none; } 100% { opacity: 0; } }

  ${S}.k-bvp[data-state="quirk"] .crab { animation: patchwork-hide 3s var(--ease-io) 1 both; }
  ${S}.k-bvp[data-state="quirk"] .peek { animation: patchwork-peek 3s var(--ease-out) 1 both; }
  ${S}.k-bvp[data-state="quirk"] .tag { animation: patchwork-tag 3s steps(1) 1 both; }
  ${S}.k-bvp[data-state="quirk"] .crab .e-open { animation: patchwork-squint-off 3s steps(1) 1 both; }
  ${S}.k-bvp[data-state="quirk"] .crab .e-strain { animation: patchwork-squint-on 3s steps(1) 1 both; }
  @keyframes patchwork-hide { 0%, 8% { opacity: 1; transform: none; } 22%, 58% { opacity: 0; transform: translate(14px, -2px) scale(.45); } 70%, 100% { opacity: 1; transform: none; } }
  @keyframes patchwork-peek { 0%, 36% { opacity: 0; transform: translate(3px, 6px); } 42%, 56% { opacity: 1; transform: none; } 62%, 100% { opacity: 0; transform: translate(3px, 6px); } }
  @keyframes patchwork-tag { 0%, 69% { opacity: 0; } 70%, 100% { opacity: 1; } }
  @keyframes patchwork-squint-off { 0%, 72% { opacity: 1; } 73%, 100% { opacity: 0; } }
  @keyframes patchwork-squint-on { 0%, 72% { opacity: 0; } 73%, 100% { opacity: 1; } }

  ${S}.k-bvp[data-state="success"] .crab { animation: patchwork-dance .5s ease-in-out infinite; }
  ${S}.k-bvp[data-state="success"] .claw-l { transform: rotate(45deg); }
  ${S}.k-bvp[data-state="success"] .ok-big { animation: patchwork-heart .6s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
  @keyframes patchwork-dance { 0%, 100% { transform: translateX(-3px); } 50% { transform: translateX(3px) translateY(-1px); } }

  ${S}.k-bvp[data-state="error"] .shell { transform: scale(.86, 1.07); animation: patchwork-squeeze .3s ease-in-out infinite; }
  ${S}.k-bvp[data-state="error"] .crab { transform: scale(.94, 1.04); }
  ${S}.k-bvp[data-state="error"] .e-open { opacity: 0; }
  ${S}.k-bvp[data-state="error"] .e-spiral { opacity: 1; animation: patchwork-spin 1s linear infinite; }
  ${S}.k-bvp[data-state="error"] .q1 { animation: patchwork-tink 1.2s steps(1) infinite; }
  ${S}.k-bvp[data-state="error"] .q2 { animation: patchwork-tink 1.2s steps(1) .3s infinite; }
  @keyframes patchwork-squeeze { 50% { transform: scale(.84, 1.09); } }
  @keyframes patchwork-spin { to { transform: rotate(360deg); } }

  ${S}.k-bvp[data-state="sleep"] .shell { animation: patchwork-breathe 4.5s ease-in-out infinite; }

  /* ═══ 5. Twarga Cloud · Quilted Lamb ═══ */
  ${S} .spool-thread { fill: var(--blue); }
  ${S} .spool-lines { fill: none; stroke: #0b3d66; stroke-width: .6px; }
  ${S} .thread { fill: none; stroke: var(--blue); stroke-width: 1.4px; stroke-linecap: round; }
  ${S} .pulse { fill: #9fdcff; }
  ${S} .tangle { fill: none; stroke: var(--alarm); stroke-width: 1.4px; stroke-linecap: round; }
  ${S} .curl { fill: none; stroke: var(--line); stroke-width: 1.1px; stroke-linecap: round; }
  ${S} .brow { fill: none; stroke: var(--line); stroke-width: 1.2px; stroke-linecap: round; }
  ${S} .sweat { fill: #9fdcff; }
  ${S} .bolt { fill: none; stroke: var(--amber); stroke-width: 1.8px; stroke-linecap: round; stroke-linejoin: round; }
  ${S} .raincloud { fill: #57606b; stroke: var(--line); stroke-width: .8px; stroke-dasharray: 2.2 1.6; }
  ${S} .drop { fill: none; stroke: var(--blue); stroke-width: 1.3px; stroke-linecap: round; }
  ${S} .rb { fill: none; stroke-width: 3.2px; stroke-dasharray: 3 1.4; }
  ${S} .rb1 { stroke: var(--amber); } ${S} .rb2 { stroke: var(--green); } ${S} .rb3 { stroke: var(--violet); } ${S} .rb4 { stroke: var(--blue); }
  ${S} .sh-body { fill: var(--line); } ${S} .sh-head { fill: #2a2433; }
  ${S} .float { transform-origin: 80px 70px; }

  ${S}.k-cloud[data-state="idle"] .float { animation: patchwork-float 3.2s ease-in-out infinite; }
  @keyframes patchwork-float { 50% { transform: translateY(-2.5px); } }

  ${S}.k-cloud[data-state="working"] .float { transform: translateY(-14px); animation: patchwork-rise 2.4s var(--ease-io) infinite; }
  ${S}.k-cloud[data-state="working"] .pulse { animation: patchwork-pulse .9s linear infinite; }
  ${S}.k-cloud[data-state="working"] .pulse.p2 { animation-delay: .45s; }
  @keyframes patchwork-rise { 0%, 100% { transform: none; } 30%, 80% { transform: translateY(-14px); } }
  @keyframes patchwork-pulse { 0% { transform: none; opacity: 0; } 15% { opacity: 1; } 100% { transform: translateY(-36px); opacity: 0; } }

  ${S}.k-cloud[data-state="quirk"] .rain { animation: patchwork-rain 3s steps(1) 1 both; }
  ${S}.k-cloud[data-state="quirk"] .drop { animation: patchwork-drop .5s linear infinite; }
  ${S}.k-cloud[data-state="quirk"] .drop.d2 { animation-delay: .17s; } ${S}.k-cloud[data-state="quirk"] .drop.d3 { animation-delay: .34s; }
  ${S}.k-cloud[data-state="quirk"] .float { animation: patchwork-wet-shake 3s ease-in-out 1 both; }
  ${S}.k-cloud[data-state="quirk"] .chefhat { animation: patchwork-hat-pop 3s var(--ease-out) 1 both; transform-box: fill-box; transform-origin: 50% 100%; }
  @keyframes patchwork-rain { 0%, 44% { opacity: 1; } 46%, 100% { opacity: 0; } }
  @keyframes patchwork-drop { 0% { transform: none; opacity: 1; } 100% { transform: translateY(8px); opacity: 0; } }
  @keyframes patchwork-wet-shake { 0%, 44%, 64%, 100% { transform: none; } 48% { transform: rotate(-6deg); } 52% { transform: rotate(6deg); } 56% { transform: rotate(-5deg); } 60% { transform: rotate(4deg); } }
  @keyframes patchwork-hat-pop { 0%, 64% { opacity: 0; transform: scale(.3); } 72% { opacity: 1; transform: scale(1.15); } 78%, 100% { opacity: 1; transform: none; } }

  ${S}.k-cloud[data-state="success"] .float { animation: patchwork-loop 1.6s ease-in-out infinite; }
  ${S}.k-cloud[data-state="success"] .rainbow { animation: patchwork-rainbow 1.6s ease-out 1 both; }
  @keyframes patchwork-loop { 0%, 100% { transform: none; } 25% { transform: translate(8px, -6px) rotate(8deg); } 50% { transform: translate(0, -12px); } 75% { transform: translate(-8px, -6px) rotate(-8deg); } }
  @keyframes patchwork-rainbow { 0% { opacity: 0; } 30%, 100% { opacity: 1; } }

  ${S}.k-cloud[data-state="error"] .f-cloud { fill: #4d535c; }
  ${S}.k-cloud[data-state="error"] .float { animation: patchwork-shiver .16s linear infinite; }
  ${S}.k-cloud[data-state="error"] .bolt { animation: patchwork-tink 1s steps(1) infinite; }

  ${S}.k-cloud[data-state="sleep"] .float { transform: translateY(36px); }
  ${S}.k-cloud[data-state="sleep"] .sh1 { animation: patchwork-sheep 2.8s var(--ease-io) infinite; }
  ${S}.k-cloud[data-state="sleep"] .sh2 { animation: patchwork-sheep 2.8s var(--ease-io) 1.4s infinite both; }
  @keyframes patchwork-sheep { 0% { opacity: 0; transform: none; } 15% { opacity: 1; } 50% { transform: translate(24px, -10px); } 85% { opacity: 1; } 100% { opacity: 0; transform: translate(48px, 0); } }

  /* ═══ 6. dododada · Teaching Dodo ═══ */
  ${S} .f-dodo { fill: #c98b9b; } ${S} .f-dodo-dark { fill: #a96e80; } ${S} .f-belly-d { fill: #f0d9cc; }
  ${S} .f-beak { fill: #f2c14e; } ${S} .f-tuft { fill: #e9aabd; }
  ${S} .f-rose { fill: #ff6fae; } ${S} .f-rose-dark { fill: #c8457f; }
  ${S} .f-egg { fill: #f3ece0; } ${S} .f-chick-a { fill: #f2c14e; } ${S} .f-chick-b { fill: #7fd3b0; }
  ${S} .f-page { fill: #f3ece0; } ${S} .f-cover { fill: #8a3a52; } ${S} .f-grad { fill: #2b2630; }
  ${S} .f-beak + .pw-seam, ${S} .f-egg + .pw-seam, ${S} .f-page + .pw-seam, ${S} .f-chick-a + .pw-seam, ${S} .f-chick-b + .pw-seam { stroke: #7a5a3a; }
  ${S} .beak-tip { fill: #c9842a; }
  ${S} .nostril { fill: #8a5a18; opacity: .8; }
  ${S}.k-dodo .pw-mouth > * { stroke: #3a2616; }
  ${S}.k-dodo .m-o, ${S}.k-dodo .m-big { fill: #2a1710; }
  ${S} .d-lens { fill: rgba(239, 227, 200, .07); stroke: var(--line); stroke-width: .9px; }
  ${S} .d-temple { fill: none; stroke: var(--line); stroke-width: .9px; stroke-linecap: round; }
  ${S} .egg-spot { fill: #e58aa8; }
  ${S} .egg-crack { fill: none; stroke: #7a5a46; stroke-width: .9px; stroke-linecap: round; stroke-linejoin: round; opacity: 0; }
  ${S} .egg-shell { fill: #f3ece0; stroke: #9a8a76; stroke-width: .8px; stroke-dasharray: 2 1.4; stroke-linejoin: round; opacity: 0; }
  ${S} .chick-beak { fill: #e9863b; }
  ${S} .chick-tuft { fill: none; stroke: #7a5a3a; stroke-width: 1px; stroke-linecap: round; }
  ${S} .easel-leg { fill: none; stroke: #c39a63; stroke-width: 2px; stroke-linecap: round; }
  ${S} .board-tray { fill: #c39a63; stroke: var(--line); stroke-width: .7px; }
  ${S} .chalk { fill: none; stroke: var(--line); stroke-width: 1.2px; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 1; opacity: .6; }
  ${S} .chalk-ok { fill: none; stroke: #00d26a; stroke-width: 1.9px; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 1; opacity: 0; }
  ${S} .chalk-scribble { fill: none; stroke: var(--alarm); stroke-width: 1.3px; stroke-linecap: round; stroke-linejoin: round; }
  ${S} .chalk-stick { fill: none; stroke: #f6f1e8; stroke-width: 2.4px; stroke-linecap: round; }
  ${S} .book-lines { fill: none; stroke: #9a8a76; stroke-width: .7px; stroke-linecap: round; }
  ${S} .bulb-glow { fill: var(--amber); opacity: .2; }
  ${S} .bulb-glass { fill: rgba(242, 193, 78, .45); stroke: var(--line); stroke-width: .9px; stroke-linejoin: round; }
  ${S} .bulb-base { fill: none; stroke: var(--line); stroke-width: 1.2px; stroke-linecap: round; }
  ${S} .bulb-ray { fill: none; stroke: var(--amber); stroke-width: 1.3px; stroke-linecap: round; }
  ${S} .mortar-tassel { fill: none; stroke: #ff6fae; stroke-width: 1.1px; stroke-linecap: round; }
  ${S} .mortar-dot { fill: #ff6fae; }
  ${S} .d-all { transform-origin: 68px 118px; }
  ${S} .d-head { transform-origin: 68px 78px; }
  ${S} .d-glasses { transform-origin: 68px 61.5px; }
  ${S} .d-tuft { transform-origin: 68px 51px; }
  ${S} .d-wing-l { transform-origin: 46px 91px; } ${S} .d-wing-r { transform-origin: 90px 91px; }
  ${S} .d-tail { transform-origin: 91px 98px; }
  ${S} .egg, ${S} .chick { transform-box: fill-box; transform-origin: 50% 100%; }
  ${S} .bulb, ${S} .mortar-in, ${S} .dust-in, ${S} .feather { transform-box: fill-box; transform-origin: center; }

  ${S}.k-dodo[data-state="idle"] .d-all { animation: patchwork-breathe 3.8s ease-in-out infinite; }
  ${S}.k-dodo[data-state="idle"] .d-head { animation: patchwork-dd-tilt 7s ease-in-out infinite; }
  ${S}.k-dodo[data-state="idle"] .d-tuft { animation: patchwork-dd-tuft 2.6s ease-in-out infinite; }
  ${S}.k-dodo[data-state="idle"] .d-wing-r { animation: patchwork-dd-sway 3.8s ease-in-out infinite; }
  ${S}.k-dodo[data-state="idle"] .d-wing-l { animation: patchwork-dd-sway 3.8s ease-in-out -1.9s infinite reverse; }
  ${S}.k-dodo[data-state="idle"] .d-tail { animation: patchwork-dd-wag 3s ease-in-out infinite; }
  ${S}.k-dodo[data-state="idle"] .egg-a { animation: patchwork-dd-rock 4.6s ease-in-out infinite; }
  ${S}.k-dodo[data-state="idle"] .egg-b { animation: patchwork-dd-rock 4.6s ease-in-out -2.3s infinite; }
  @keyframes patchwork-dd-tilt { 0%, 100% { transform: none; } 30% { transform: rotate(-5deg); } 62% { transform: rotate(4deg); } }
  @keyframes patchwork-dd-tuft { 0%, 100% { transform: rotate(-4deg); } 50% { transform: rotate(6deg); } }
  @keyframes patchwork-dd-sway { 0%, 100% { transform: rotate(-2deg); } 50% { transform: rotate(3deg); } }
  @keyframes patchwork-dd-wag { 0%, 100% { transform: none; } 50% { transform: rotate(5deg); } }
  @keyframes patchwork-dd-rock { 0%, 70%, 100% { transform: none; } 76% { transform: rotate(-5deg); } 82% { transform: rotate(5deg); } 88% { transform: rotate(-3deg); } 94% { transform: rotate(2deg); } }

  ${S}.k-dodo[data-state="working"] .d-wing-r { animation: patchwork-dd-point 4.4s var(--ease-io) infinite; }
  ${S}.k-dodo[data-state="working"] .d-head { animation: patchwork-dd-lean 4.4s var(--ease-io) infinite; }
  ${S}.k-dodo[data-state="working"] .d-tuft { animation: patchwork-dd-tuft .9s ease-in-out infinite; }
  ${S}.k-dodo[data-state="working"] .d-all { animation: patchwork-dd-bob 1.1s ease-in-out infinite; }
  ${S}.k-dodo[data-state="working"] .c1 { animation: patchwork-dd-draw1 4.4s linear infinite; }
  ${S}.k-dodo[data-state="working"] .c2 { animation: patchwork-dd-draw2 4.4s linear infinite; }
  ${S}.k-dodo[data-state="working"] .c3 { animation: patchwork-dd-draw3 4.4s linear infinite; }
  ${S}.k-dodo[data-state="working"] .c4 { animation: patchwork-dd-draw4 4.4s linear infinite; }
  ${S}.k-dodo[data-state="working"] .c5 { animation: patchwork-dd-draw5 4.4s linear infinite; }
  ${S}.k-dodo[data-state="working"] .egg-a { animation: patchwork-dd-egg-a 4.4s ease-in-out infinite; }
  ${S}.k-dodo[data-state="working"] .egg-b { animation: patchwork-dd-egg-b 4.4s ease-in-out infinite; }
  ${S}.k-dodo[data-state="working"] .egg-a .egg-crack { animation: patchwork-dd-crack-a 4.4s linear infinite; }
  ${S}.k-dodo[data-state="working"] .egg-b .egg-crack { animation: patchwork-dd-crack-b 4.4s linear infinite; }
  ${S}.k-dodo[data-state="working"] .chick-wa { animation: patchwork-dd-hatch-a 4.4s ease-out infinite; }
  ${S}.k-dodo[data-state="working"] .chick-wb { animation: patchwork-dd-hatch-b 4.4s ease-out infinite; }
  ${S}.k-dodo[data-state="working"] .shell-a { animation: patchwork-dd-shell-a 4.4s linear infinite; }
  ${S}.k-dodo[data-state="working"] .shell-b { animation: patchwork-dd-shell-b 4.4s linear infinite; }
  @keyframes patchwork-dd-point { 0%, 5% { transform: none; } 12% { transform: rotate(-78deg); } 20% { transform: rotate(-72deg); } 26% { transform: rotate(-80deg); } 33% { transform: rotate(-72deg); } 40% { transform: rotate(-80deg); } 48% { transform: rotate(-72deg); } 56% { transform: rotate(-80deg); } 62% { transform: rotate(-80deg); } 70% { transform: rotate(-72deg); } 80%, 88% { transform: rotate(-78deg); } 95%, 100% { transform: none; } }
  @keyframes patchwork-dd-lean { 0%, 5% { transform: none; } 12%, 88% { transform: rotate(5deg) translateX(1px); } 95%, 100% { transform: none; } }
  @keyframes patchwork-dd-bob { 50% { transform: translateY(-1px); } }
  @keyframes patchwork-dd-draw1 { 0%, 8% { stroke-dashoffset: 1; opacity: .95; } 24%, 94% { stroke-dashoffset: 0; opacity: .95; } 99% { stroke-dashoffset: 0; opacity: 0; } 100% { stroke-dashoffset: 1; opacity: 0; } }
  @keyframes patchwork-dd-draw2 { 0%, 24% { stroke-dashoffset: 1; opacity: .95; } 38%, 94% { stroke-dashoffset: 0; opacity: .95; } 99% { stroke-dashoffset: 0; opacity: 0; } 100% { stroke-dashoffset: 1; opacity: 0; } }
  @keyframes patchwork-dd-draw3 { 0%, 38% { stroke-dashoffset: 1; opacity: .95; } 48%, 94% { stroke-dashoffset: 0; opacity: .95; } 99% { stroke-dashoffset: 0; opacity: 0; } 100% { stroke-dashoffset: 1; opacity: 0; } }
  @keyframes patchwork-dd-draw4 { 0%, 48% { stroke-dashoffset: 1; opacity: .95; } 68%, 94% { stroke-dashoffset: 0; opacity: .95; } 99% { stroke-dashoffset: 0; opacity: 0; } 100% { stroke-dashoffset: 1; opacity: 0; } }
  @keyframes patchwork-dd-draw5 { 0%, 68% { stroke-dashoffset: 1; opacity: .95; } 80%, 94% { stroke-dashoffset: 0; opacity: .95; } 99% { stroke-dashoffset: 0; opacity: 0; } 100% { stroke-dashoffset: 1; opacity: 0; } }
  @keyframes patchwork-dd-egg-a { 0%, 5% { opacity: 1; transform: none; } 8% { transform: rotate(-7deg); } 10% { transform: rotate(7deg); } 12% { transform: rotate(-7deg); } 14% { transform: rotate(6deg); } 16% { transform: rotate(-4deg); } 18% { opacity: 1; transform: scale(1.08, .94); } 19%, 94% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
  @keyframes patchwork-dd-egg-b { 0%, 43% { opacity: 1; transform: none; } 46% { transform: rotate(-7deg); } 48% { transform: rotate(7deg); } 50% { transform: rotate(-7deg); } 52% { transform: rotate(6deg); } 54% { transform: rotate(-4deg); } 56% { opacity: 1; transform: scale(1.08, .94); } 57%, 94% { opacity: 0; transform: scale(.6); } 100% { opacity: 1; transform: none; } }
  @keyframes patchwork-dd-crack-a { 0%, 9% { opacity: 0; } 10%, 19% { opacity: 1; } 20%, 100% { opacity: 0; } }
  @keyframes patchwork-dd-crack-b { 0%, 47% { opacity: 0; } 48%, 57% { opacity: 1; } 58%, 100% { opacity: 0; } }
  @keyframes patchwork-dd-hatch-a { 0%, 17% { opacity: 0; transform: scale(.3); } 20% { opacity: 1; transform: scale(1.15, .88); } 24% { transform: scale(.95, 1.06); } 27% { transform: none; } 30% { transform: translateY(-5px); } 33% { transform: none; } 36% { transform: translateY(-5px); } 39% { transform: rotate(9deg); } 48% { transform: none; } 70% { transform: none; } 73% { transform: translateY(-5px); } 76% { transform: none; } 94% { opacity: 1; } 99%, 100% { opacity: 0; transform: none; } }
  @keyframes patchwork-dd-hatch-b { 0%, 57% { opacity: 0; transform: scale(.3); } 60% { opacity: 1; transform: scale(1.15, .88); } 64% { transform: scale(.95, 1.06); } 67% { transform: none; } 70% { transform: none; } 73% { transform: translateY(-5px); } 76% { transform: none; } 94% { opacity: 1; } 99%, 100% { opacity: 0; transform: none; } }
  @keyframes patchwork-dd-shell-a { 0%, 19% { opacity: 0; } 20%, 94% { opacity: 1; } 99%, 100% { opacity: 0; } }
  @keyframes patchwork-dd-shell-b { 0%, 58% { opacity: 0; } 59%, 94% { opacity: 1; } 99%, 100% { opacity: 0; } }

  ${S}.k-dodo[data-state="quirk"] .d-all { animation: patchwork-dd-jump 3s ease-in-out 1 both; }
  ${S}.k-dodo[data-state="quirk"] .d-wing-l { animation: patchwork-dd-flap-l 3s ease-in-out 1 both; }
  ${S}.k-dodo[data-state="quirk"] .d-wing-r { animation: patchwork-dd-flap-r 3s ease-in-out 1 both; }
  ${S}.k-dodo[data-state="quirk"] .d-head { animation: patchwork-dd-dizzy 3s ease-in-out 1 both; }
  ${S}.k-dodo[data-state="quirk"] .d-tuft { animation: patchwork-dd-tuft .3s ease-in-out 8; }
  ${S}.k-dodo[data-state="quirk"] .feather { animation: patchwork-dd-feather 3s linear 1 both; }
  ${S}.k-dodo[data-state="quirk"] .dust-in { animation: patchwork-dd-dust 3s ease-out 1 both; }
  ${S}.k-dodo[data-state="quirk"] .egg { animation: patchwork-dd-jolt 3s ease-out 1 both; }
  @keyframes patchwork-dd-jump { 0%, 6% { transform: none; } 11% { transform: scale(1.05, .92); } 18% { transform: translateY(-9px); } 26% { transform: translateY(-13px); } 34% { transform: translateY(-9px); } 42% { transform: translateY(-13px); } 52% { transform: translateY(-8px); } 61% { transform: scale(1.07, .9); } 66% { transform: scale(.99, 1.02); } 72%, 100% { transform: none; } }
  @keyframes patchwork-dd-flap-l { 0%, 8% { transform: none; } 14% { transform: rotate(70deg); } 18% { transform: rotate(18deg); } 22% { transform: rotate(70deg); } 26% { transform: rotate(18deg); } 30% { transform: rotate(70deg); } 34% { transform: rotate(18deg); } 38% { transform: rotate(70deg); } 42% { transform: rotate(18deg); } 46% { transform: rotate(70deg); } 52% { transform: rotate(40deg); } 62% { transform: rotate(6deg); } 76%, 86% { transform: rotate(34deg); } 94%, 100% { transform: none; } }
  @keyframes patchwork-dd-flap-r { 0%, 8% { transform: none; } 14% { transform: rotate(-70deg); } 18% { transform: rotate(-18deg); } 22% { transform: rotate(-70deg); } 26% { transform: rotate(-18deg); } 30% { transform: rotate(-70deg); } 34% { transform: rotate(-18deg); } 38% { transform: rotate(-70deg); } 42% { transform: rotate(-18deg); } 46% { transform: rotate(-70deg); } 52% { transform: rotate(-40deg); } 62% { transform: rotate(-6deg); } 76%, 86% { transform: rotate(-34deg); } 94%, 100% { transform: none; } }
  @keyframes patchwork-dd-dizzy { 0%, 60% { transform: none; } 66% { transform: rotate(-6deg); } 74% { transform: rotate(5deg); } 82% { transform: rotate(-3deg); } 90%, 100% { transform: none; } }
  @keyframes patchwork-dd-feather { 0%, 18% { opacity: 0; transform: none; } 22% { opacity: 1; transform: none; } 38% { opacity: 1; transform: translate(7px, 9px) rotate(30deg); } 54% { opacity: 1; transform: translate(-4px, 21px) rotate(-35deg); } 70% { opacity: 1; transform: translate(6px, 31px) rotate(35deg); } 86%, 100% { opacity: 1; transform: translate(-2px, 38px) rotate(-10deg); } }
  @keyframes patchwork-dd-dust { 0%, 60% { opacity: 0; transform: scale(.4); } 64% { opacity: 1; transform: scale(.8); } 80% { opacity: .8; transform: scale(1.3) translateY(-2px); } 94%, 100% { opacity: 0; transform: scale(1.6) translateY(-3px); } }
  @keyframes patchwork-dd-jolt { 0%, 58% { transform: none; } 62% { transform: translateY(-3px); } 68%, 100% { transform: none; } }

  ${S}.k-dodo[data-state="success"] .d-all { animation: patchwork-hop .8s var(--ease-out) infinite; }
  ${S}.k-dodo[data-state="success"] .d-wing-l { transform: rotate(52deg); animation: patchwork-dd-cheer-l .4s ease-in-out infinite alternate; }
  ${S}.k-dodo[data-state="success"] .d-wing-r { transform: rotate(-52deg); animation: patchwork-dd-cheer-r .4s ease-in-out infinite alternate; }
  ${S}.k-dodo[data-state="success"] .d-tuft { animation: patchwork-dd-tuft .5s ease-in-out infinite; }
  ${S}.k-dodo[data-state="success"] .bulb { animation: patchwork-dd-bulb 1.6s ease-out infinite; }
  ${S}.k-dodo[data-state="success"] .bulb-glow { animation: patchwork-dd-glow .8s ease-in-out infinite alternate; }
  ${S}.k-dodo[data-state="success"] .chalk { opacity: .95; }
  ${S}.k-dodo[data-state="success"] .chalk-ok { animation: patchwork-dd-ok 1.6s ease-out infinite; }
  ${S}.k-dodo[data-state="success"] .chick-1 { animation: patchwork-dd-cheep .7s ease-out infinite; }
  ${S}.k-dodo[data-state="success"] .chick-2 { animation: patchwork-dd-cheep .7s ease-out .25s infinite; }
  ${S}.k-dodo[data-state="success"] .mortar-in { animation: patchwork-dd-toss 1.6s ease-in-out infinite; }
  @keyframes patchwork-dd-cheer-l { from { transform: rotate(40deg); } to { transform: rotate(64deg); } }
  @keyframes patchwork-dd-cheer-r { from { transform: rotate(-40deg); } to { transform: rotate(-64deg); } }
  @keyframes patchwork-dd-bulb { 0% { opacity: 0; transform: scale(.3); } 18% { opacity: 1; transform: scale(1.2); } 28%, 100% { opacity: 1; transform: none; } }
  @keyframes patchwork-dd-glow { from { opacity: .12; } to { opacity: .32; } }
  @keyframes patchwork-dd-ok { 0% { opacity: 0; stroke-dashoffset: 1; } 15% { opacity: 1; stroke-dashoffset: 1; } 45%, 100% { opacity: 1; stroke-dashoffset: 0; } }
  @keyframes patchwork-dd-cheep { 0%, 100% { transform: none; } 35% { transform: translateY(-6px) scale(.97, 1.04); } 60% { transform: scale(1.04, .96); } }
  @keyframes patchwork-dd-toss { 0% { transform: translateY(0) rotate(0); } 45% { transform: translateY(-18px) rotate(200deg); } 85%, 100% { transform: translateY(0) rotate(360deg); } }

  ${S}.k-dodo[data-state="error"] .d-all { animation: patchwork-shiver .14s linear infinite; }
  ${S}.k-dodo[data-state="error"] .e-open { opacity: 0; }
  ${S}.k-dodo[data-state="error"] .e-strain { opacity: 1; }
  ${S}.k-dodo[data-state="error"] .d-glasses { transform: rotate(-7deg) translate(0, 1px); }
  ${S}.k-dodo[data-state="error"] .d-wing-l { transform: rotate(48deg); }
  ${S}.k-dodo[data-state="error"] .d-wing-r { transform: rotate(-48deg); }
  ${S}.k-dodo[data-state="error"] .d-tuft { animation: patchwork-dd-frazzle .22s ease-in-out infinite alternate; }
  ${S}.k-dodo[data-state="error"] .chalk { opacity: .22; }
  ${S}.k-dodo[data-state="error"] .sweat { animation: patchwork-sad 2s ease-out infinite; }
  ${S}.k-dodo[data-state="error"] .q1 { animation: patchwork-dd-q 1.2s steps(1) infinite; }
  ${S}.k-dodo[data-state="error"] .q2 { animation: patchwork-dd-q 1.2s steps(1) .4s infinite; }
  ${S}.k-dodo[data-state="error"] .egg { animation: patchwork-shiver .16s linear infinite; }
  @keyframes patchwork-dd-frazzle { from { transform: rotate(-14deg); } to { transform: rotate(14deg); } }
  @keyframes patchwork-dd-q { 0%, 59% { opacity: 1; } 60%, 100% { opacity: 0; } }

  ${S}.k-dodo[data-state="sleep"] .d-all { animation: patchwork-dd-doze 4.6s ease-in-out infinite; }
  ${S}.k-dodo[data-state="sleep"] .d-head { transform: rotate(9deg) translate(1.5px, 3px); }
  ${S}.k-dodo[data-state="sleep"] .d-glasses { opacity: 0; }
  ${S}.k-dodo[data-state="sleep"] .d-tuft { transform: rotate(-15deg); }
  ${S}.k-dodo[data-state="sleep"] .d-wing-l { transform: rotate(-5deg); }
  ${S}.k-dodo[data-state="sleep"] .d-wing-r { transform: rotate(5deg); }
  ${S}.k-dodo[data-state="sleep"] .chick { animation: patchwork-dd-chick-doze 4.6s ease-in-out infinite; }
  ${S}.k-dodo[data-state="sleep"] .chick-2 { animation-delay: -2.3s; }
  @keyframes patchwork-dd-doze { 0%, 100% { transform: translateY(2px) scale(1, .97); } 50% { transform: translateY(2px) scale(1.012, .985); } }
  @keyframes patchwork-dd-chick-doze { 0%, 100% { transform: none; } 50% { transform: scale(1.03, 1.05); } }

  @media (prefers-reduced-motion: reduce) {
    ${S}.k-cloud[data-state="success"] .rainbow { opacity: 1; }
    ${S}.k-labs[data-state="quirk"] .flour, ${S}.k-labs[data-state="quirk"] .t4 { opacity: 1; }
    ${S}.k-labs[data-state="quirk"] .poof { opacity: 0; }
    ${S}.k-bvp[data-state="working"] .mark-x, ${S}.k-bvp[data-state="working"] .cand .mark-ok { opacity: 1; }
    ${S}.k-bvp[data-state="quirk"] .tag { opacity: 1; }
    ${S}.k-yeast[data-state="working"] .yb { opacity: 1; }
    ${S}.k-dodo[data-state="working"] .egg { opacity: 0; }
    ${S}.k-dodo[data-state="working"] .egg-shell { opacity: 1; }
    ${S}.k-dodo[data-state="success"] .chalk-ok { opacity: 1; }
  }
`,
  });
})();

export default patchwork;
