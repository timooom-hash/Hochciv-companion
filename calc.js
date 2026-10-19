/* Hochzeivilization · Einkommen – die Rechnung.

   Dieselben Regeln wie incomeBreakdown() in js/engine.js des digitalen Spiels (v86):
   · Felder: Anzahl × Ertrag je Feld, je Geländeart.
   · Bevölkerung: Anzahl × Ertrag je Bevölkerung. Mit Bürokratie zählt die Bevölkerung der
     Hauptstadt (eigener Zähler `cap`) ein zweites Mal – nur beim Ertrag, nicht beim
     Bevölkerungsanteil und nicht bei der Ökologie.
   · Ökologie: +1 auf alle drei Erträge je 2 Bevölkerung des ganzen Reichs, einmal abgerundet.
   · Handelsrouten: +1 auf alle drei je Stadt über Straße, +2 je Stadt über Eisenbahn.
   · Sonstiges: freie Zeile (Seemacht, Wallfahrt, Beutezüge, Ereignisse …).
   · Gentechnik: +1 Nahrung je 4 Wissenschaft der fertigen Summe, abgerundet.
   · Bürokratie verdoppelt Handelsrouten, Ökologie und Gentechnik. Die Felder um die
     Hauptstadt tragen die Spieler selbst ein zweites Mal ein.
   Erträge sind immer [Wissenschaft, Nahrung, Münzen]. */
'use strict';

const TERRAINS = [
  { k: 'G', glyph: '🌿', color: '#adba7c', base: [0, 1, 0] },   // Grasland
  { k: 'W', glyph: '🌲', color: '#708a58', base: [0, 0, 1] },   // Wald
  { k: 'B', glyph: '⛰️', color: '#aa967e', base: [1, 0, 1] },   // Gebirge
  { k: 'F', glyph: '💧', color: '#70a0ba', base: [0, 1, 1] },   // Fluss
  { k: 'M', glyph: '🌊', color: '#96bac6', base: [0, 0, 1] },   // Meer
  { k: 'I', glyph: '🏝️', color: '#d0c48a', base: [1, 1, 1] },   // Insel
];
const POP_BASE = [1, -1, 1];          // je Bevölkerung: +1 Wissenschaft, −1 Nahrung, +1 Münze
const ROAD_BONUS = 1;                 // Handelsroute über Straße, je Stadt
const RAIL_BONUS = 2;                 // Handelsroute über durchgehende Eisenbahn, je Stadt
const ECO_POP = 2;                    // Ökologie: je so viel Bevölkerung +1
const GENE_SCI = 4;                   // Gentechnik: je so viel Wissenschaft +1 Nahrung

function newPlayer() {
  const n = {}, y = {};
  for (const t of TERRAINS) { n[t.k] = 0; y[t.k] = t.base.slice(); }
  y.P = POP_BASE.slice();
  return {
    n, y,
    pop: 1,            // jede Hauptstadt startet mit 1 Bevölkerung
    cap: 0,            // davon in der Hauptstadt (nur mit Bürokratie wirksam)
    road: 0, rail: 0,  // Städte mit Handelsroute
    other: [0, 0, 0],
    power: 0,
    eco: false, gen: false, buro: false,
    steel: false, tanks: false,
  };
}

/* Fehlende oder kaputte Felder eines gespeicherten Spielers mit Vorgaben auffüllen. */
function repairPlayer(raw) {
  const p = newPlayer();
  if (!raw || typeof raw !== 'object') return p;
  const int = (v, d) => Number.isFinite(v) ? Math.trunc(v) : d;
  for (const t of TERRAINS) {
    if (raw.n) p.n[t.k] = Math.max(0, int(raw.n[t.k], 0));
    if (raw.y && Array.isArray(raw.y[t.k])) p.y[t.k] = [0, 1, 2].map(i => int(raw.y[t.k][i], t.base[i]));
  }
  if (raw.y && Array.isArray(raw.y.P)) p.y.P = [0, 1, 2].map(i => int(raw.y.P[i], POP_BASE[i]));
  p.pop = Math.max(0, int(raw.pop, 1));
  p.cap = Math.min(p.pop, Math.max(0, int(raw.cap, 0)));
  p.road = Math.max(0, int(raw.road, 0));
  p.rail = Math.max(0, int(raw.rail, 0));
  if (Array.isArray(raw.other)) p.other = [0, 1, 2].map(i => int(raw.other[i], 0));
  p.power = Math.max(0, int(raw.power, 0));
  for (const k of ['eco', 'gen', 'buro', 'steel', 'tanks']) p[k] = raw[k] === true;
  return p;
}

function income(p) {
  const mul = p.buro ? 2 : 1;
  const tiles = [0, 0, 0];
  for (const t of TERRAINS)
    for (let i = 0; i < 3; i++) tiles[i] += p.n[t.k] * p.y[t.k][i];
  const capTwice = p.buro ? Math.min(p.cap, p.pop) : 0;
  const pop = p.y.P.map(v => v * (p.pop + capTwice));
  const eco = p.eco ? Math.floor(p.pop / ECO_POP) * mul : 0;
  const trade = (p.road * ROAD_BONUS + p.rail * RAIL_BONUS) * mul;
  const sub = [0, 1, 2].map(i => tiles[i] + pop[i] + eco + trade + p.other[i]);
  const gen = p.gen ? Math.max(0, Math.floor(sub[0] / GENE_SCI)) * mul : 0;
  return { tiles, pop, eco, trade, gen, mul, total: [sub[0], sub[1] + gen, sub[2]] };
}

/* Machtverlust zu Zugbeginn: die Hälfte, mit Stahl ein Drittel, mit Panzern ein Viertel –
   jeweils aufgerundet (beginTurn in js/engine.js). */
function powerDivisor(p) { return p.tanks ? 4 : p.steel ? 3 : 2; }
function powerLoss(p) { return Math.ceil(p.power / powerDivisor(p)); }

if (typeof module !== 'undefined') {
  module.exports = { TERRAINS, POP_BASE, newPlayer, repairPlayer, income, powerLoss, powerDivisor };
}
