/* Hochzeivilization · Einkommen – Oberfläche. Die Rechnung steht in calc.js. */
'use strict';
(function () {
  const APP_VERSION = 'v1';
  const KEY = 'hzv-einkommen.state';          // eigener Schlüssel – das Spiel nutzt „hochciv.*"
  const GAME_LANG_KEY = 'hochciv.lang';        // Sprachwahl des Spiels, falls auf demselben Gerät
  const INK = '#2a2721', PARCHMENT = '#e4dbbe';

  const SEATS = [
    { id: 'blue', color: '#2b5a87' },
    { id: 'green', color: '#3b6a3a' },
    { id: 'red', color: '#9b3428' },
    { id: 'black', color: '#272420' },
  ];
  const SEAT = {};
  SEATS.forEach(s => { SEAT[s.id] = s; });
  const ICON = ['🔬', '🌾', '🪙'];
  const POWER_ICON = '⚔︎', POP_ICON = '👥';
  const ROW_HEX = {
    P: ['👥', '#c8b98a'], cap: ['🏛️', '#c8b98a'],
    road: ['🛤️', '#c8a86a'], rail: ['🚂', '#c8a86a'],
  };

  /* ---------------------------------------------------------------- Texte */
  const STR = {
    de: {
      title: 'Einkommen',
      sub: 'Begleiter zu Hochzeivilization',
      seat: { blue: 'Blau', green: 'Grün', red: 'Rot', black: 'Schwarz' },
      who: 'Wer spielt mit?',
      whoHint: 'Sechseck antippen, um eine Farbe dazuzunehmen oder wegzulassen. Namen sind freiwillig.',
      seatToggle: s => `${s} spielt mit`,
      nameOf: s => `Name für ${s}`,
      minTwo: 'Es spielen mindestens zwei Farben.',
      language: 'Sprache',
      awake: 'Bildschirm anlassen',
      awakeHint: 'Das Gerät geht während des Spiels nicht in den Ruhezustand.',
      start: 'Spiel starten', resume: 'Zurück zum Spiel',
      newGame: 'Neues Spiel', newGameArmed: 'Nochmal tippen: alles auf Anfang',
      newGameHint: 'Setzt Felder, Erträge, Macht und Häkchen aller Farben zurück. Namen bleiben.',
      version: v => `Version ${v}`,
      menu: 'Menü',
      back: 'Zurück zum Tisch',
      y: ['Wissenschaft', 'Nahrung', 'Münzen'],
      power: 'Macht', pop: 'Bevölkerung',
      popOf: (a, b) => `${a} von ${b}`,
      pct: n => `${n} %`,
      terrain: { G: 'Grasland', W: 'Wald', B: 'Gebirge', F: 'Fluss', M: 'Meer', I: 'Insel' },
      tiles: 'Felder und Bevölkerung', tilesHint: 'Ertrag je Feld antippen, um ihn zu ändern.',
      buroTiles: 'Mit Bürokratie die Felder um die Hauptstadt ein zweites Mal eintragen.',
      perTile: 'Ertrag je Feld',
      perPop: 'Ertrag je Bevölkerung',
      capital: 'Hauptstadt',
      capitalHint: 'Bevölkerung dort, Ertrag doppelt',
      trade: 'Handelsrouten', tradeX2: '×2 durch Bürokratie',
      road: 'über Straße', rail: 'über Eisenbahn',
      perCity: n => `+${n} ${ICON.join('')} je Stadt`,
      techs: 'Technologien',
      eco: 'Ökologie', ecoDesc: `+1 ${ICON.join('')} je 2 Bevölkerung, abgerundet`,
      gen: 'Gentechnik', genDesc: '+1 Nahrung je 4 Wissenschaft, abgerundet',
      buro: 'Bürokratie', buroDesc: 'verdoppelt Handelsrouten, Ökologie und Gentechnik',
      other: 'Sonstiges', otherHint: 'Für alles, was die Zeilen oben nicht abdecken: Seemacht, Wallfahrt, Beutezüge, Ereignisse.',
      powerHint: {
        2: 'Zu Zugbeginn geht die Hälfte verloren, aufgerundet.',
        3: 'Mit Stahl geht zu Zugbeginn ein Drittel verloren, aufgerundet.',
        4: 'Mit Panzern geht zu Zugbeginn ein Viertel verloren, aufgerundet.',
      },
      turn: n => `Zugbeginn: −${n} Macht`,
      turnNone: 'Zugbeginn: keine Macht zu verlieren',
      steel: 'Stahl', steelDesc: 'Machtverlust nur ein Drittel',
      tanks: 'Panzer', tanksDesc: 'Machtverlust nur ein Viertel',
      powerToast: (a, b) => `Macht ${a} → ${b}`,
      undo: 'Rückgängig',
      sumHead: 'Ertrag nächster Zug',
      sum: 'Summe',
      bd: { tiles: 'Felder', pop: 'Bevölkerung', eco: 'Ökologie', trade: 'Handelsrouten', other: 'Sonstiges', gen: 'Gentechnik' },
      inclCap: 'Hauptstadt doppelt gezählt',
      baseIs: 'Grundwert',
      resetBase: 'Auf Grundwert',
      more: s => `${s}: eins mehr`,
      less: s => `${s}: eins weniger`,
      editYield: s => `Ertrag ändern: ${s}`,
      quad: (name, y, power, share) =>
        `${name}: ${y[0]} Wissenschaft, ${y[1]} Nahrung, ${y[2]} Münzen, Macht ${power}, ${share} der Bevölkerung`,
    },
    en: {
      title: 'Income',
      sub: 'Companion to Hochzeivilization',
      seat: { blue: 'Blue', green: 'Green', red: 'Red', black: 'Black' },
      who: 'Who is playing?',
      whoHint: 'Tap a hexagon to add or leave out a colour. Names are optional.',
      seatToggle: s => `${s} is playing`,
      nameOf: s => `Name for ${s}`,
      minTwo: 'At least two colours have to play.',
      language: 'Language',
      awake: 'Keep screen on',
      awakeHint: 'The device does not go to sleep during the game.',
      start: 'Start game', resume: 'Back to the game',
      newGame: 'New game', newGameArmed: 'Tap again to reset everything',
      newGameHint: 'Resets tiles, yields, power and checkboxes for every colour. Names stay.',
      version: v => `Version ${v}`,
      menu: 'Menu',
      back: 'Back to the table',
      y: ['Science', 'Food', 'Coins'],
      power: 'Power', pop: 'Population',
      popOf: (a, b) => `${a} of ${b}`,
      pct: n => `${n}%`,
      terrain: { G: 'Grassland', W: 'Forest', B: 'Mountains', F: 'River', M: 'Sea', I: 'Island' },
      tiles: 'Tiles and population', tilesHint: 'Tap the yield per tile to change it.',
      buroTiles: 'With Bureaucracy, enter the tiles around the capital a second time.',
      perTile: 'Yield per tile',
      perPop: 'Yield per population',
      capital: 'Capital',
      capitalHint: 'population there, yield counted twice',
      trade: 'Trade routes', tradeX2: '×2 from Bureaucracy',
      road: 'by road', rail: 'by railway',
      perCity: n => `+${n} ${ICON.join('')} per city`,
      techs: 'Technologies',
      eco: 'Ecology', ecoDesc: `+1 ${ICON.join('')} per 2 population, rounded down`,
      gen: 'Genetic engineering', genDesc: '+1 food per 4 science, rounded down',
      buro: 'Bureaucracy', buroDesc: 'doubles trade routes, ecology and genetic engineering',
      other: 'Other', otherHint: 'For anything the rows above don’t cover: sea power, pilgrimage, raids, events.',
      powerHint: {
        2: 'At the start of your turn you lose half, rounded up.',
        3: 'With Steel you lose a third at the start of your turn, rounded up.',
        4: 'With Tanks you lose a quarter at the start of your turn, rounded up.',
      },
      turn: n => `Turn start: −${n} power`,
      turnNone: 'Turn start: no power to lose',
      steel: 'Steel', steelDesc: 'power loss only a third',
      tanks: 'Tanks', tanksDesc: 'power loss only a quarter',
      powerToast: (a, b) => `Power ${a} → ${b}`,
      undo: 'Undo',
      sumHead: 'Yield next turn',
      sum: 'Total',
      bd: { tiles: 'Tiles', pop: 'Population', eco: 'Ecology', trade: 'Trade routes', other: 'Other', gen: 'Genetic engineering' },
      inclCap: 'capital counted twice',
      baseIs: 'Base',
      resetBase: 'Reset to base',
      more: s => `${s}: one more`,
      less: s => `${s}: one less`,
      editYield: s => `Change yield: ${s}`,
      quad: (name, y, power, share) =>
        `${name}: ${y[0]} science, ${y[1]} food, ${y[2]} coins, power ${power}, ${share} of the population`,
    },
  };

  /* ---------------------------------------------------------------- Zustand */
  function freshState(lang) {
    const st = { v: 1, lang, awake: true, started: false, on: {}, names: {}, p: {} };
    for (const s of SEATS) { st.on[s.id] = true; st.names[s.id] = ''; st.p[s.id] = newPlayer(); }
    return st;
  }
  function detectLang() {
    try {
      const g = (localStorage.getItem(GAME_LANG_KEY) || '').replace(/"/g, '');
      if (g === 'de' || g === 'en') return g;
    } catch (e) { /* kein Speicher */ }
    return /^de\b/i.test(navigator.language || '') ? 'de' : 'en';
  }
  function loadState() {
    let raw = null;
    try { raw = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { raw = null; }
    const st = freshState(raw && (raw.lang === 'de' || raw.lang === 'en') ? raw.lang : detectLang());
    if (!raw || typeof raw !== 'object') return st;
    st.awake = raw.awake !== false;
    st.started = raw.started === true;
    for (const s of SEATS) {
      if (raw.on && typeof raw.on[s.id] === 'boolean') st.on[s.id] = raw.on[s.id];
      if (raw.names && typeof raw.names[s.id] === 'string') st.names[s.id] = raw.names[s.id].slice(0, 24);
      if (raw.p && raw.p[s.id]) st.p[s.id] = repairPlayer(raw.p[s.id]);
    }
    if (SEATS.filter(s => st.on[s.id]).length < 2) SEATS.forEach(s => { st.on[s.id] = true; });
    return st;
  }

  let S = loadState();
  let L = STR[S.lang];
  let openSeat = null;      // Farbe des offenen Reichsblatts
  let editKey = null;       // Zeile, deren Ertrag gerade bearbeitet wird
  const layers = [];        // Ebenen über dem Tisch, für die Zurück-Geste

  let saveTimer = 0;
  function save() { clearTimeout(saveTimer); saveTimer = setTimeout(flush, 120); }
  function flush() {
    clearTimeout(saveTimer);
    try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* privater Modus: nichts zu machen */ }
  }

  /* ---------------------------------------------------------------- Helfer */
  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const fmt = n => (n < 0 ? '−' + (-n) : String(n));
  const plus = n => (n > 0 ? '+' + n : fmt(n));
  const activeIds = () => SEATS.map(s => s.id).filter(id => S.on[id]);
  const seatName = id => (S.names[id] || '').trim() || L.seat[id];
  const worldPop = () => activeIds().reduce((a, id) => a + S.p[id].pop, 0);
  const shareOf = id => { const w = worldPop(); return w ? S.p[id].pop / w : null; };
  const pctText = f => (f == null ? '–' : L.pct(Math.round(f * 100)));
  const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const insetOf = r => `inset(${r.top}px ${innerWidth - r.right}px ${innerHeight - r.bottom}px ${r.left}px)`;
  function setTheme(c) {
    const m = document.querySelector('meta[name="theme-color"]');
    if (m) m.setAttribute('content', c);
  }

  function getv(p, path) {
    let o = p;
    for (const k of path.split('.')) o = o[k];
    return o;
  }
  function setv(p, path, v) {
    const ks = path.split('.');
    let o = p;
    for (let i = 0; i < ks.length - 1; i++) o = o[ks[i]];
    o[ks[ks.length - 1]] = v;
  }
  function limits(path, p) {
    if (path.startsWith('n.')) return [0, 99];
    if (path.startsWith('y.')) return [-9, 99];
    if (path.startsWith('other.')) return [-99, 999];
    switch (path) {
      case 'pop': return [0, 999];
      case 'cap': return [0, p.pop];
      case 'power': return [0, 999];
      default: return [0, 99];          // road, rail
    }
  }

  const SVG_MINUS = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 12h12"/></svg>';
  const SVG_PLUS = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 6v12M6 12h12"/></svg>';
  const SVG_BACK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>';
  const SVG_HUB = `<svg viewBox="0 0 58 66" aria-hidden="true">
    <polygon points="29,2 56,17.5 56,48.5 29,64 2,48.5 2,17.5" fill="#f5efdf" stroke="#2a2721" stroke-width="2.5"/>
    <path d="M19 25h20M19 33h20M19 41h20" fill="none" stroke="#2a2721" stroke-width="3" stroke-linecap="round"/></svg>`;

  /* ---------------------------------------------------------------- Tisch */
  /* Lage eines Feldes: welche Seiten am Bildschirmrand liegen (Sicherheitsabstände), ob es
     rechtsbündig steht, und wo das Sechseck in der Mitte hineinragt (hr/hl/hb: dort Platz
     lassen, ht: der Name oben darf nicht bis zur Mitte laufen). */
  function edgesFor(n, i) {
    const land = innerWidth > innerHeight;
    if (n === 2) return land
      ? { t: 1, b: 1, l: i === 0, r: i === 1, right: i === 1 }
      : { t: i === 0, b: i === 1, l: 1, r: 1, hb: i === 0, ht: i === 1 };
    if (n === 3 && i === 2) return { b: 1, l: 1, r: 1, ht: 1, span: 1 };
    return { t: i < 2, b: i >= 2, l: i % 2 === 0, r: i % 2 === 1, right: i % 2 === 1, hr: i % 2 === 0, hl: i % 2 === 1 };
  }
  function quadHTML(id, i, n) {
    const e = edgesFor(n, i);
    const cls = ['quad', e.t && 'e-t', e.b && 'e-b', e.l && 'e-l', e.r && 'e-r', e.right && 'right',
      e.hr && 'hr', e.hl && 'hl', e.hb && 'hb', e.ht && 'ht', e.span && 'span'].filter(Boolean).join(' ');
    const ys = [0, 1, 2].map(k => `<span class="q-y"><span class="q-ic" aria-hidden="true">${ICON[k]}</span><span class="q-num" data-q="y${k}"></span></span>`).join('');
    return `<button type="button" class="${cls}" data-seat="${id}" style="--seat:${SEAT[id].color}">
      <span class="q-in">
        <span class="q-name" data-q="name"></span>
        <span class="q-yields">${ys}</span>
        <span class="q-foot">
          <span class="q-stat"><span class="q-ic" aria-hidden="true">${POWER_ICON}</span><span data-q="power"></span></span>
          <span class="q-stat"><span class="q-ic" aria-hidden="true">${POP_ICON}</span><span data-q="share"></span><small data-q="popof"></small></span>
        </span>
        <span class="q-bar" aria-hidden="true"><span data-q="bar"></span></span>
      </span>
    </button>`;
  }
  function sizeTable() {
    const n = activeIds().length, land = innerWidth > innerHeight, t = $('table');
    t.style.setProperty('--qw', (n === 2 && !land ? innerWidth : innerWidth / 2) + 'px');
    t.style.setProperty('--qh', (n === 2 && land ? innerHeight : innerHeight / 2) + 'px');
  }
  function renderTable() {
    const ids = activeIds(), t = $('table');
    t.dataset.n = ids.length;
    sizeTable();
    t.innerHTML = ids.map((id, i) => quadHTML(id, i, ids.length)).join('');
    $('hub').setAttribute('aria-label', L.menu);
    updateTable();
  }
  function updateTable() {
    const w = worldPop();
    for (const q of $('table').querySelectorAll('.quad')) {
      const id = q.dataset.seat, p = S.p[id], tot = income(p).total;
      const share = w ? p.pop / w : null;
      const put = (k, v) => { const el = q.querySelector(`[data-q="${k}"]`); if (el.textContent !== v) el.textContent = v; };
      put('name', seatName(id));
      tot.forEach((v, k) => put('y' + k, fmt(v)));
      put('power', String(p.power));
      put('share', pctText(share));
      put('popof', w ? L.popOf(p.pop, w) : '');
      q.querySelector('[data-q="bar"]').style.width = share == null ? '0' : (share * 100).toFixed(1) + '%';
      q.setAttribute('aria-label', L.quad(seatName(id), tot.map(fmt), p.power, pctText(share)));
    }
  }

  /* ---------------------------------------------------------------- Reichsblatt */
  function stepper(path, label, size) {
    return `<div class="stp${size ? ' ' + size : ''}">
      <button type="button" class="stp-b" data-step="${path}" data-d="-1" aria-label="${esc(L.less(label))}">${SVG_MINUS}</button>
      <output class="stp-v" data-v="${path}"></output>
      <button type="button" class="stp-b" data-step="${path}" data-d="1" aria-label="${esc(L.more(label))}">${SVG_PLUS}</button>
    </div>`;
  }
  const hex = (glyph, color) => `<span class="hex" style="--c:${color}" aria-hidden="true">${glyph}</span>`;
  function chipsHTML(y) {
    return y.map((v, i) => (v
      ? `<span class="chip"><i aria-hidden="true">${ICON[i]}</i>${fmt(v)}</span>`
      : '<span class="chip zero" aria-hidden="true">·</span>')).join('');
  }
  /* Zeile mit Ertrag je Einheit (antippen → ändern) und Anzahl */
  function unitRow(k, name, glyph, color, countPath, editTitle, base) {
    const ed = [0, 1, 2].map(i => `<div class="ye"><span class="ye-l"><span aria-hidden="true">${ICON[i]}</span> ${L.y[i]}</span>${stepper(`y.${k}.${i}`, `${name}, ${L.y[i]}`, 'sm')}</div>`).join('');
    return `<div class="row" data-row="${k}">
      ${hex(glyph, color)}
      <div class="r-main">
        <span class="r-name">${esc(name)}</span>
        <button type="button" class="chips" data-edit="${k}" aria-expanded="false"><span class="chip-set" data-chips="${k}"></span><span class="pen" aria-hidden="true">✎</span></button>
      </div>
      ${stepper(countPath, name)}
      <div class="yedit" data-yedit="${k}" hidden>
        <p class="ye-title">${esc(editTitle)}</p>
        ${ed}
        <div class="ye-foot"><span>${L.baseIs}<span class="chip-set">${chipsHTML(base)}</span></span>
          <button type="button" class="link-btn" data-act="base" data-k="${k}">${L.resetBase}</button></div>
      </div>
    </div>`;
  }
  function plainRow(glyph, color, name, sub, path, label) {
    return `<div class="row">${hex(glyph, color)}
      <div class="r-main"><span class="r-name">${name}</span>${sub}</div>
      ${stepper(path, label)}</div>`;
  }
  function toggle(key, title, desc, gainKey) {
    return `<label class="tog"><input type="checkbox" data-toggle="${key}">
      <span class="tog-t"><b>${title}</b><small>${desc}</small></span>
      <span class="gain"${gainKey ? ` data-v="${gainKey}"` : ''}></span></label>`;
  }
  function bdRow(k, label, showKey) {
    return `<div class="bd-row"${showKey ? ` data-show="${showKey}"` : ''}><span>${label}<small data-v="note.${k}"></small></span>
      ${[0, 1, 2].map(i => `<span class="v" data-v="bd.${k}.${i}"></span>`).join('')}</div>`;
  }
  function sheetHTML(id) {
    const tiles = TERRAINS.map(t => unitRow(t.k, L.terrain[t.k], t.glyph, t.color, 'n.' + t.k, L.perTile, t.base)).join('');
    const [cg, cc] = ROW_HEX.cap, [rg, rc] = ROW_HEX.road, [lg, lc] = ROW_HEX.rail;
    const trio = [0, 1, 2].map(i => `<div class="ye"><span class="ye-l"><span aria-hidden="true">${ICON[i]}</span> ${L.y[i]}</span>${stepper('other.' + i, `${L.other}, ${L.y[i]}`, 'sm')}</div>`).join('');
    return `<div class="sh-in">
    <header class="sh-head">
      <button type="button" class="sh-back" data-act="back" aria-label="${esc(L.back)}">${SVG_BACK}</button>
      <h2 class="sh-name">${esc(seatName(id))}</h2>
      <div class="sh-tot">${[0, 1, 2].map(i => `<div class="tot"><span class="tot-ic" aria-hidden="true">${ICON[i]}</span><span class="tot-num" data-v="t${i}"></span><span class="vh">${L.y[i]}</span></div>`).join('')}</div>
      <div class="sh-side">
        <span><span class="side-ic" aria-hidden="true">${POWER_ICON}</span><span data-v="power"></span><span class="vh"> ${L.power}</span></span>
        <span><span class="side-ic" aria-hidden="true">${POP_ICON}</span><span data-v="share"></span><span class="vh"> ${L.pop}</span></span>
      </div>
    </header>
    <div class="sh-body"><div class="sh-col">
      <div class="col-a">
        <section class="sec">
          <div class="sec-h"><h3>${L.tiles}</h3></div>
          <p class="note">${L.tilesHint}</p>
          <p class="note" data-show="buro">${L.buroTiles}</p>
          <div class="ledger">${tiles}
            ${unitRow('P', L.pop, ROW_HEX.P[0], ROW_HEX.P[1], 'pop', L.perPop, POP_BASE).replace('class="row"', 'class="row pop-row"')}
            <div class="row" data-show="buro">${hex(cg, cc)}
              <div class="r-main"><span class="r-name">${L.capital}</span><span class="r-sub">${L.capitalHint}</span></div>
              ${stepper('cap', L.capital)}</div>
          </div>
        </section>
        <section class="sec">
          <div class="sec-h"><h3>${L.trade}</h3><small data-show="buro">${L.tradeX2}</small></div>
          <div class="ledger">
            ${plainRow(rg, rc, L.road, `<span class="r-sub">${L.perCity(1)}</span>`, 'road', `${L.trade} ${L.road}`)}
            ${plainRow(lg, lc, L.rail, `<span class="r-sub">${L.perCity(2)}</span>`, 'rail', `${L.trade} ${L.rail}`)}
          </div>
        </section>
      </div>
      <div class="col-b">
        <section class="sec">
          <div class="sec-h"><h3>${L.techs}</h3></div>
          <div class="ledger">
            ${toggle('eco', L.eco, L.ecoDesc, 'gain.eco')}
            ${toggle('gen', L.gen, L.genDesc, 'gain.gen')}
            ${toggle('buro', L.buro, L.buroDesc, 'gain.buro')}
          </div>
        </section>
        <section class="sec">
          <div class="sec-h"><h3>${L.other}</h3></div>
          <p class="note">${L.otherHint}</p>
          <div class="ledger trio">${trio}</div>
        </section>
        <section class="sec">
          <div class="sec-h"><h3>${L.power}</h3></div>
          <div class="ledger">
            <div class="power-row">${stepper('power', L.power, 'lg')}</div>
            <div class="turn-wrap"><button type="button" class="turn" data-act="turn"><span data-v="turn"></span></button>
              <p class="turn-hint" data-v="powerHint"></p></div>
            ${toggle('steel', L.steel, L.steelDesc)}
            ${toggle('tanks', L.tanks, L.tanksDesc)}
          </div>
        </section>
        <section class="sec">
          <div class="sec-h"><h3>${L.sumHead}</h3></div>
          <div class="ledger bd">
            <div class="bd-row bd-head"><span></span>${ICON.map((c, i) => `<span class="v" role="img" aria-label="${L.y[i]}">${c}</span>`).join('')}</div>
            ${bdRow('tiles', L.bd.tiles)}
            ${bdRow('pop', L.bd.pop)}
            ${bdRow('eco', L.bd.eco, 'eco')}
            ${bdRow('trade', L.bd.trade, 'trade')}
            ${bdRow('other', L.bd.other, 'other')}
            ${bdRow('gen', L.bd.gen, 'gen')}
            <div class="bd-row bd-sum"><span>${L.sum}</span>${[0, 1, 2].map(i => `<span class="v" data-v="t${i}"></span>`).join('')}</div>
          </div>
        </section>
      </div>
    </div></div>
    </div>`;
  }

  function shown(key, p, c) {
    switch (key) {
      case 'buro': return p.buro;
      case 'eco': return p.eco;
      case 'gen': return p.gen;
      case 'trade': return c.trade !== 0;
      case 'other': return p.other.some(v => v !== 0);
      default: return true;
    }
  }
  function valueFor(key, p, c, id) {
    if (/^t\d$/.test(key)) return fmt(c.total[+key[1]]);
    if (key.startsWith('bd.')) {
      const [, k, s] = key.split('.'), i = +s;
      const v = k === 'tiles' ? c.tiles[i] : k === 'pop' ? c.pop[i] : k === 'eco' ? c.eco
        : k === 'trade' ? c.trade : k === 'other' ? p.other[i] : k === 'gen' && i === 1 ? c.gen : 0;
      return v ? fmt(v) : '·';
    }
    switch (key) {
      case 'share': return pctText(shareOf(id));
      case 'gain.eco': return p.eco ? `${plus(c.eco)} ${ICON.join('')}` : '';
      case 'gain.gen': return p.gen ? `${plus(c.gen)} ${ICON[1]}` : '';
      case 'gain.buro': return p.buro ? '×2' : '';
      case 'powerHint': return L.powerHint[powerDivisor(p)];
      case 'turn': { const n = powerLoss(p); return n ? L.turn(n) : L.turnNone; }
      case 'note.pop': return p.buro && p.cap ? L.inclCap : '';
      case 'note.eco': case 'note.trade': case 'note.gen': return p.buro ? '×2' : '';
      case 'note.tiles': case 'note.other': return '';
      default: return fmt(getv(p, key));
    }
  }
  function refreshSheet() {
    if (!openSeat) return;
    const id = openSeat, p = S.p[id], c = income(p), root = $('sheet');
    root.querySelectorAll('[data-v]').forEach(el => {
      const v = valueFor(el.dataset.v, p, c, id);
      if (el.textContent !== v) el.textContent = v;
      if (el.classList.contains('v')) el.classList.toggle('zero', v === '·');
    });
    root.querySelectorAll('[data-chips]').forEach(el => {
      const k = el.dataset.chips, y = p.y[k], html = chipsHTML(y);
      if (el.dataset.h !== html) { el.innerHTML = html; el.dataset.h = html; }
      const name = k === 'P' ? L.pop : L.terrain[k];
      el.parentNode.setAttribute('aria-label', `${L.editYield(name)} (${y.map((v, i) => `${fmt(v)} ${L.y[i]}`).join(', ')})`);
    });
    root.querySelectorAll('[data-show]').forEach(el => { el.hidden = !shown(el.dataset.show, p, c); });
    root.querySelectorAll('[data-step]').forEach(b => {
      const [lo, hi] = limits(b.dataset.step, p), v = getv(p, b.dataset.step);
      b.disabled = +b.dataset.d < 0 ? v <= lo : v >= hi;
    });
    root.querySelectorAll('input[data-toggle]').forEach(inp => { inp.checked = !!p[inp.dataset.toggle]; });
    const turn = root.querySelector('[data-act="turn"]');
    if (turn) turn.disabled = !powerLoss(p);
  }

  let closeTimer = 0;
  function openSheet(id, fromEl) {
    clearTimeout(closeTimer);
    openSeat = id; editKey = null;
    const sh = $('sheet');
    sh.classList.remove('closing');
    sh.style.setProperty('--seat', SEAT[id].color);
    sh.innerHTML = sheetHTML(id);
    refreshSheet();
    sh.hidden = false;
    if (!reduced() && fromEl) {
      sh.classList.add('opening');
      sh.style.transition = 'none';
      sh.style.clipPath = insetOf(fromEl.getBoundingClientRect());
      void sh.offsetWidth;
      sh.style.transition = '';
      requestAnimationFrame(() => {
        sh.classList.remove('opening');
        sh.style.clipPath = 'inset(0px 0px 0px 0px)';
      });
    } else sh.style.clipPath = '';
    pushLayer('sheet');
    setTheme(SEAT[id].color);
    sh.querySelector('.sh-back').focus({ preventScroll: true });
  }
  function closeSheet() {
    const sh = $('sheet'), id = openSeat;
    if (!id) return;
    openSeat = null; editKey = null;
    flush();
    updateTable();
    setTheme(INK);
    const q = $('table').querySelector(`.quad[data-seat="${id}"]`);
    const finish = () => {
      clearTimeout(closeTimer);
      if (openSeat) return;                       // inzwischen schon wieder geöffnet
      sh.hidden = true; sh.classList.remove('closing'); sh.style.clipPath = ''; sh.innerHTML = '';
      if (q) q.focus({ preventScroll: true });
    };
    if (reduced() || !q) return finish();
    sh.classList.add('closing');
    sh.style.clipPath = insetOf(q.getBoundingClientRect());
    closeTimer = setTimeout(finish, 380);
  }
  function toggleEdit(k) {
    const root = $('sheet'), next = editKey === k ? null : k;
    root.querySelectorAll('[data-yedit]').forEach(el => { el.hidden = el.dataset.yedit !== next; });
    root.querySelectorAll('[data-edit]').forEach(b => b.setAttribute('aria-expanded', String(b.dataset.edit === next)));
    editKey = next;
    if (next) {
      const ed = root.querySelector(`[data-yedit="${next}"]`);
      ed.scrollIntoView({ block: 'nearest', behavior: reduced() ? 'auto' : 'smooth' });
    }
  }
  function resetBase(k) {
    const p = S.p[openSeat];
    p.y[k] = (k === 'P' ? POP_BASE : TERRAINS.find(t => t.k === k).base).slice();
    save(); refreshSheet();
  }
  function turnStart() {
    const id = openSeat, p = S.p[id], loss = powerLoss(p);
    if (!loss) return;
    const before = p.power;
    p.power -= loss;
    save(); refreshSheet(); updateTable();
    toast(L.powerToast(before, p.power), () => {
      S.p[id].power = before;
      save(); refreshSheet(); updateTable();
    });
  }

  /* Zähler: Tippen = ±1, Halten = laufend. Der Schritt fällt erst beim Loslassen (click),
     damit ein Wisch zum Scrollen, der auf einem Knopf beginnt, nichts verändert. */
  function applyStep(btn) {
    const p = S.p[openSeat];
    if (!p || !btn.isConnected) return false;
    const path = btn.dataset.step, [lo, hi] = limits(path, p), cur = getv(p, path);
    const nv = Math.max(lo, Math.min(hi, cur + +btn.dataset.d));
    if (nv === cur) return false;
    setv(p, path, nv);
    if (path === 'pop' && p.cap > p.pop) p.cap = p.pop;
    save(); refreshSheet();
    return true;
  }
  let hold = null, swallow = null;
  function endHold() {
    if (!hold) return;
    clearTimeout(hold.timer); clearTimeout(hold.rep);
    if (hold.fired) swallow = hold.btn;     // der click nach dem Halten zählt nicht noch einmal
    hold = null;
  }
  document.addEventListener('pointerdown', e => {
    swallow = null;
    const btn = e.target.closest('[data-step]');
    if (!btn || btn.disabled || e.button > 0) return;
    endHold();
    const h = hold = { btn, x: e.clientX, y: e.clientY, fired: false, timer: 0, rep: 0 };
    h.timer = setTimeout(() => {
      if (hold !== h) return;
      h.fired = true;
      let n = 0;
      const tick = () => {
        if (hold !== h) return;
        if (!applyStep(h.btn)) return endHold();
        n++;
        h.rep = setTimeout(tick, n < 6 ? 140 : n < 20 ? 75 : 40);
      };
      tick();
    }, 450);
  });
  window.addEventListener('pointermove', e => {
    if (hold && !hold.fired && Math.hypot(e.clientX - hold.x, e.clientY - hold.y) > 10) endHold();
  }, { passive: true });
  window.addEventListener('pointerup', endHold);
  window.addEventListener('pointercancel', () => { if (hold) hold.fired = false; endHold(); });
  document.addEventListener('contextmenu', e => { if (e.target.closest('[data-step], .quad, #hub')) e.preventDefault(); });

  /* ---------------------------------------------------------------- Aufbau */
  function seatHex(on) {
    return `<svg viewBox="0 0 50 56" aria-hidden="true">
      <polygon points="25,2.5 47.5,15.25 47.5,40.75 25,53.5 2.5,40.75 2.5,15.25" fill="${on ? 'var(--seat)' : 'transparent'}" stroke="var(--seat)" stroke-width="3" stroke-dasharray="${on ? 'none' : '5 4'}"/>
      ${on ? '<path d="M15.5 28.5l6.5 6.5 12.5-13" fill="none" stroke="#f7f1e1" stroke-width="3.8" stroke-linecap="round" stroke-linejoin="round"/>' : ''}</svg>`;
  }
  function renderSetup() {
    const n = activeIds().length;
    const seats = SEATS.map(s => {
      const on = S.on[s.id];
      return `<div class="seat${on ? '' : ' off'}" style="--seat:${s.color}">
        <button type="button" class="seat-sw" data-seat-toggle="${s.id}" role="switch" aria-checked="${on}" aria-label="${esc(L.seatToggle(L.seat[s.id]))}">${seatHex(on)}</button>
        <input type="text" data-name="${s.id}" value="${esc(S.names[s.id])}" placeholder="${esc(L.seat[s.id])}" aria-label="${esc(L.nameOf(L.seat[s.id]))}"
          maxlength="24" autocomplete="off" autocapitalize="words" spellcheck="false" enterkeyhint="done">
      </div>`;
    }).join('');
    $('setup').innerHTML = `<div class="band" aria-hidden="true"></div>
    <div class="su">
      <h1>${L.title}</h1>
      <p class="sub">${L.sub}</p>
      <h2>${L.who}</h2>
      <p class="hint">${L.whoHint}</p>
      ${seats}
      <p class="warn-text" data-min hidden>${L.minTwo}</p>
      <h2>${L.language}</h2>
      <div class="seg" role="group" aria-label="${L.language}">
        <button type="button" data-lang="de" aria-pressed="${S.lang === 'de'}" lang="de">Deutsch</button>
        <button type="button" data-lang="en" aria-pressed="${S.lang === 'en'}" lang="en">English</button>
      </div>
      <label class="check"><input type="checkbox" data-awake${S.awake ? ' checked' : ''}>
        <span><b>${L.awake}</b><small>${L.awakeHint}</small></span></label>
      <div class="actions">
        <button type="button" class="btn primary" data-act="go"${n < 2 ? ' disabled' : ''}>${S.started ? L.resume : L.start}</button>
        ${S.started ? `<button type="button" class="btn warn" data-act="new">${L.newGame}</button><p class="hint">${L.newGameHint}</p>` : ''}
      </div>
      <p class="foot">${L.version(APP_VERSION)}</p>
    </div>`;
  }
  function openSetup() {
    renderSetup();
    const su = $('setup');
    su.hidden = false; su.scrollTop = 0;
    pushLayer('setup');
    setTheme(PARCHMENT);
  }
  function closeSetup() {
    $('setup').hidden = true;
    renderTable();
    setTheme(INK);
    wake();
  }
  function leaveSetup() {
    if (layers[layers.length - 1] === 'setup') { history.back(); return; }
    S.started = true; flush();             // erster Start: der Aufbau liegt unter keiner Ebene
    closeSetup();
  }
  function toggleSeat(id) {
    if (S.on[id] && activeIds().length <= 2) {
      const w = $('setup').querySelector('[data-min]');
      w.hidden = false;
      clearTimeout(toggleSeat.t); toggleSeat.t = setTimeout(() => { w.hidden = true; }, 3500);
      return;
    }
    S.on[id] = !S.on[id];
    save();
    const y = $('setup').scrollTop;
    renderSetup();
    $('setup').scrollTop = y;
  }
  let armTimer = 0;
  function newGameTap(btn) {
    if (!btn.classList.contains('armed')) {
      btn.classList.add('armed'); btn.textContent = L.newGameArmed;
      clearTimeout(armTimer);
      armTimer = setTimeout(() => { btn.classList.remove('armed'); btn.textContent = L.newGame; }, 4000);
      return;
    }
    clearTimeout(armTimer);
    for (const s of SEATS) S.p[s.id] = newPlayer();
    S.started = true;
    flush();
    leaveSetup();
  }
  function setLang(lang) {
    if (lang === S.lang) return;
    S.lang = lang; L = STR[lang];
    document.documentElement.lang = lang;
    save();
    const y = $('setup').scrollTop;
    renderSetup(); renderTable();
    $('setup').scrollTop = y;
  }

  /* ---------------------------------------------------------------- Meldung */
  let toastTimer = 0, undoFn = null;
  function toast(msg, undo) {
    const t = $('toast');
    t.innerHTML = `<span>${esc(msg)}</span>${undo ? `<button type="button" data-act="undo">${esc(L.undo)}</button>` : ''}`;
    undoFn = undo || null;
    t.hidden = false;
    requestAnimationFrame(() => t.classList.add('show'));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(hideToast, 6000);
  }
  function hideToast() {
    const t = $('toast');
    t.classList.remove('show');
    undoFn = null;
    setTimeout(() => { if (!t.classList.contains('show')) t.hidden = true; }, 220);
  }

  /* ---------------------------------------------------------------- Ebenen und Zurück */
  function pushLayer(name) {
    layers.push(name);
    history.pushState({ layer: name }, '');
  }
  window.addEventListener('popstate', () => {
    const top = layers.pop();
    if (top === 'sheet') closeSheet();
    else if (top === 'setup') closeSetup();
  });

  /* ---------------------------------------------------------------- Ereignisse */
  document.addEventListener('click', e => {
    const step = e.target.closest('[data-step]');
    if (step) {
      if (swallow === step) { swallow = null; return; }
      applyStep(step);
      return;
    }
    const quad = e.target.closest('.quad');
    if (quad) return openSheet(quad.dataset.seat, quad);
    if (e.target.closest('#hub')) return openSetup();
    const edit = e.target.closest('[data-edit]');
    if (edit) return toggleEdit(edit.dataset.edit);
    const st = e.target.closest('[data-seat-toggle]');
    if (st) return toggleSeat(st.dataset.seatToggle);
    const lang = e.target.closest('[data-lang]');
    if (lang) return setLang(lang.dataset.lang);
    const act = e.target.closest('[data-act]');
    if (!act) return;
    switch (act.dataset.act) {
      case 'back': if (layers[layers.length - 1] === 'sheet') history.back(); else closeSheet(); break;
      case 'base': resetBase(act.dataset.k); break;
      case 'turn': turnStart(); break;
      case 'undo': { const f = undoFn; hideToast(); if (f) f(); break; }
      case 'go': leaveSetup(); break;
      case 'new': newGameTap(act); break;
    }
  });
  document.addEventListener('change', e => {
    const tg = e.target.closest('input[data-toggle]');
    if (tg && openSeat) { S.p[openSeat][tg.dataset.toggle] = tg.checked; save(); refreshSheet(); return; }
    if (e.target.matches('input[data-awake]')) {
      S.awake = e.target.checked; save();
      if (S.awake) wake(); else sleep();
    }
  });
  document.addEventListener('input', e => {
    const nm = e.target.closest('input[data-name]');
    if (nm) { S.names[nm.dataset.name] = nm.value.slice(0, 24); save(); }
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Enter' && e.target.matches('input[data-name]')) e.target.blur();
    if (e.key === 'Escape' && layers.length) history.back();
  });

  let resizeTimer = 0, lastLand = innerWidth > innerHeight;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const land = innerWidth > innerHeight;
      if (land !== lastLand) { lastLand = land; renderTable(); } else sizeTable();
    }, 80);
  });

  /* ---------------------------------------------------------------- Bildschirm wach halten */
  let lock = null;
  async function wake() {
    if (!S.awake || lock || document.visibilityState !== 'visible' || !navigator.wakeLock) return;
    try {
      lock = await navigator.wakeLock.request('screen');
      lock.addEventListener('release', () => { lock = null; });
    } catch (e) { lock = null; }
  }
  function sleep() { if (lock) { lock.release().catch(() => {}); lock = null; } }
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') wake(); else flush();
  });
  window.addEventListener('pagehide', flush);
  document.addEventListener('pointerup', () => { if (S.awake && !lock) wake(); }, { passive: true });

  /* ---------------------------------------------------------------- Offline */
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js')
        .then(() => navigator.serviceWorker.ready)
        .then(reg => { if (reg.active) reg.active.postMessage('heal'); })
        .catch(() => { /* ohne Service Worker läuft die App trotzdem, nur nicht offline */ });
    });
  }

  /* ---------------------------------------------------------------- Start */
  document.documentElement.lang = S.lang;
  $('hub').innerHTML = SVG_HUB;
  history.replaceState({ layer: 'base' }, '');
  renderTable();
  if (!S.started) {
    renderSetup();
    $('setup').hidden = false;
    setTheme(PARCHMENT);
  } else setTheme(INK);
  wake();
})();
