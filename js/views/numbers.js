// Números y precios: #/numeros

import { readNumber, readPrice, MAX_NUMBER } from '../numbers.js';
import { people, tickets, things, times, days } from '../data/slots.js';

// Tarjetas de un contador (reutiliza el estilo de .num-cell)
function counterCells(list) {
  return list.map(c => `
    <button class="num-cell ${c.irregular ? 'irregular' : ''}" data-speak="${c.kana}">
      <span class="n-kanji" lang="ja">${c.jp}</span>
      <span class="n-kana" lang="ja">${c.kana}</span>
      <span class="n-romaji">${c.romaji}</span>
    </button>
  `).join('');
}

function countersSection() {
  const wholeHours = times.filter(t => !t.id.endsWith('h')); // sin las "y media"
  return `
    <h2 class="section-title">Contadores</h2>
    <div class="explain">
      En japonés el número cambia según <strong>qué cuentas</strong>: personas (人), objetos planos
      como entradas o billetes (枚), cosas en general (つ) u horas (時). Los de borde rojo son irregulares.
    </div>
    <h3 class="sub-title">Personas · 人 <small>"Mesa para dos" → 二人です</small></h3>
    <div class="num-grid">${counterCells(people)}</div>
    <h3 class="sub-title">Cosas · つ <small>"Deme dos de esto" → 二つください</small></h3>
    <div class="num-grid">${counterCells(things)}</div>
    <h3 class="sub-title">Entradas y billetes · 枚</h3>
    <div class="num-grid">${counterCells(tickets)}</div>
    <h3 class="sub-title">Horas · 時 <small>"y media" = 半 (han): 7時半</small></h3>
    <div class="num-grid">${counterCells(wholeHours)}</div>
    <h3 class="sub-title">Días y semanas · 日間 / 週間 <small>En inmigración: "¿Cuántos días se queda?"</small></h3>
    <div class="num-grid">${counterCells(days)}</div>
  `;
}

// Números de referencia. "irregular" marca los que cambian de sonido.
const BASICS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const BIG = [
  { n: 11 }, { n: 20 }, { n: 100 }, { n: 300, irregular: true },
  { n: 600, irregular: true }, { n: 800, irregular: true }, { n: 1000 },
  { n: 3000, irregular: true }, { n: 8000, irregular: true }, { n: 10000 },
];

function numberCell({ n, irregular = false }) {
  const r = readNumber(n);
  return `
    <button class="num-cell ${irregular ? 'irregular' : ''}" data-speak="${r.kana}">
      <span class="n-digit">${n.toLocaleString('es-ES')}</span>
      <span class="n-kanji" lang="ja">${r.kanji}</span>
      <span class="n-kana" lang="ja">${r.kana}</span>
      <span class="n-romaji">${r.romaji}</span>
    </button>
  `;
}

// HTML del resultado del conversor; app.js lo vuelve a llamar al escribir
export function priceOutput(value) {
  const p = readPrice(Number(value));
  if (value === '' || !p) {
    return `<p class="hint">Escribe un número entero entre 0 y ${MAX_NUMBER.toLocaleString('es-ES')}.</p>`;
  }
  return `
    <div class="price-text">
      <div class="p-digits">${p.digits}</div>
      <div class="p-kanji" lang="ja">${p.kanji}</div>
      <div class="p-kana" lang="ja">${p.kana}</div>
      <div class="p-romaji">${p.romaji}</div>
    </div>
    <button class="speak-btn" data-speak="${p.kana}" aria-label="Escuchar">🔊</button>
  `;
}

// Precio aleatorio realista: entre 100 y 30.000 yenes
export function randomPrice() {
  return Math.floor(100 + Math.random() * 29_900);
}

export function numbersView() {
  const start = 3500;
  return `
    <a class="back" href="#/">← Inicio</a>
    <h1>Números y precios</h1>

    <div class="explain">
      Los números se construyen como una suma: <strong>3.500 = 3×千 + 5×百 → 三千五百</strong>.
      Ojo: se agrupan de <strong>4 en 4 cifras</strong>. 万 (<em>man</em>) = 10.000,
      así que 20.000 es 二万 ("dos diez-miles"), no "veinte mil".
    </div>

    <h2 class="section-title">Del 0 al 10</h2>
    <div class="num-grid">${BASICS.map(n => numberCell({ n })).join('')}</div>
    <p class="hint">4 y 7 también se dicen <em>shi</em> y <em>shichi</em>, pero en precios casi siempre oirás <em>yon</em> y <em>nana</em>.</p>

    <h2 class="section-title">Decenas, centenas y miles</h2>
    <div class="num-grid">${BIG.map(numberCell).join('')}</div>
    <p class="hint">Los de borde rojo son irregulares: el sonido cambia.</p>

    ${countersSection()}

    <h2 class="section-title">Conversor de precios</h2>
    <div class="price-tool">
      <div class="price-input-row">
        <input type="number" inputmode="numeric" min="0" max="${MAX_NUMBER}"
               value="${start}" data-price-input aria-label="Precio en yenes">
        <button class="btn" data-random-price>🎲 Al azar</button>
      </div>
      <div id="price-out" class="price-out">${priceOutput(String(start))}</div>
    </div>
  `;
}
