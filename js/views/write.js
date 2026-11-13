// Practicar escritura de kana: #/escribir/hiragana o #/escribir/katakana
//
// Novedad: esta vista necesita algo DESPUÉS de insertarse en la página
// (medir el canvas y escuchar el dedo). Para eso exportamos writeView.mount,
// que el router llama justo después de pintar (ver render() en app.js).

import { kanaGroups } from '../data/kana.js';
import { drawGlyph, drawStrokes, scoreDrawing } from '../writing.js';
import { speak } from '../speech.js';

const SCRIPTS = { hiragana: 'Hiragana', katakana: 'Katakana' };

// Solo kana de un carácter (básicos y con tenten); los combinados (きゃ) son dos
const writable = () => kanaGroups.slice(0, 2).flatMap(g => g.cells).filter(Boolean);

let state = null; // { script, kana, strokes, guide, result }

function pickKana(previous) {
  const options = writable().filter(k => k !== previous);
  return options[Math.floor(Math.random() * options.length)];
}

export function writeView(script = 'hiragana') {
  if (!SCRIPTS[script]) script = 'hiragana';
  if (!state || state.script !== script) {
    state = { script, kana: pickKana(), strokes: [], guide: false, result: null };
  }

  const tabs = Object.entries(SCRIPTS).map(([id, label]) => `
    <a class="tab ${id === script ? 'active' : ''}" href="#/escribir/${id}">${label}</a>
  `).join('');

  return `
    <a class="back" href="#/kana/${script}">← Kana</a>
    <h1>✍️ Escribir</h1>
    <div class="tabs">${tabs}</div>

    <div class="write-target">
      <span>Escribe <strong class="write-romaji">${state.kana.romaji}</strong></span>
      <button class="speak-btn" data-speak="${state.kana[script]}" aria-label="Escuchar">🔊</button>
    </div>

    <!-- Dos lienzos apilados: la guía/modelo debajo y tu dibujo encima -->
    <div class="pad">
      <canvas class="pad-guide"></canvas>
      <canvas class="pad-draw" aria-label="Zona para dibujar"></canvas>
    </div>

    <label class="toggle"><input type="checkbox" data-guide ${state.guide ? 'checked' : ''}> Mostrar guía para calcar</label>

    <div class="write-actions">
      <button class="btn" data-write-clear>🧽 Borrar</button>
      <button class="btn primary" data-write-check>Comprobar</button>
    </div>
    <div id="write-result" class="write-result"></div>
    <p class="hint">La comprobación compara la forma, no el orden de los trazos.</p>
  `;
}

// ---------- Después de pintar: preparar los lienzos ----------

let drawCanvas = null;
let guideCanvas = null;

writeView.mount = () => {
  drawCanvas = document.querySelector('.pad-draw');
  guideCanvas = document.querySelector('.pad-guide');

  // Resolución real = tamaño en pantalla × densidad de píxeles del móvil
  // (devicePixelRatio suele ser 2 o 3). Si no, el trazo se vería borroso.
  const size = Math.round(drawCanvas.getBoundingClientRect().width * devicePixelRatio);
  for (const c of [drawCanvas, guideCanvas]) c.width = c.height = size;

  // Convierte la posición del dedo (píxeles de pantalla) a coordenadas 0..1
  const point = (e) => {
    const rect = drawCanvas.getBoundingClientRect();
    return { x: (e.clientX - rect.left) / rect.width, y: (e.clientY - rect.top) / rect.height };
  };

  // Pointer Events: un solo API para dedo, lápiz y ratón.
  // Aquí sí ponemos listeners en el propio elemento: necesitamos seguir
  // el movimiento continuo de un elemento concreto, no clics sueltos.
  let current = null;
  drawCanvas.addEventListener('pointerdown', (e) => {
    drawCanvas.setPointerCapture(e.pointerId); // seguir el dedo aunque salga del canvas
    current = [point(e)];
    state.strokes.push(current);
    redrawStrokes();
  });
  drawCanvas.addEventListener('pointermove', (e) => {
    if (!current) return;
    current.push(point(e));
    redrawStrokes();
  });
  const end = () => { current = null; };
  drawCanvas.addEventListener('pointerup', end);
  drawCanvas.addEventListener('pointercancel', end);

  redrawGuide();
  redrawStrokes();
  showResult();
};

function redrawStrokes() {
  const ctx = drawCanvas.getContext('2d');
  ctx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
  const ink = getComputedStyle(document.body).color; // color del texto: sirve en tema claro y oscuro
  drawStrokes(ctx, state.strokes, drawCanvas.width, drawCanvas.width * 0.045, ink);
}

function redrawGuide() {
  const ctx = guideCanvas.getContext('2d');
  const size = guideCanvas.width;
  ctx.clearRect(0, 0, size, size);

  // Cuadrícula de práctica, como en los cuadernos japoneses
  ctx.strokeStyle = 'rgba(128, 128, 128, .25)';
  ctx.lineWidth = Math.max(1, size / 300);
  ctx.setLineDash([size / 40, size / 40]);
  ctx.beginPath();
  ctx.moveTo(size / 2, 0); ctx.lineTo(size / 2, size);
  ctx.moveTo(0, size / 2); ctx.lineTo(size, size / 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // Tras comprobar se ve el modelo en rojo; con "guía" se ve en gris para calcar
  if (state.result !== null) drawGlyph(ctx, state.kana[state.script], size, { color: 'rgba(192, 57, 43, .35)' });
  else if (state.guide) drawGlyph(ctx, state.kana[state.script], size, { color: 'rgba(128, 128, 128, .25)' });
}

function showResult() {
  const box = document.getElementById('write-result');
  if (state.result === null) { box.innerHTML = ''; return; }
  const pct = Math.round(state.result * 100);
  // Umbrales elegidos con la calibración de writing.js
  const [icon, text] = state.result >= 0.6 ? ['✅', '¡Muy bien!']
    : state.result >= 0.35 ? ['👍', 'Casi: compara con el modelo en rojo']
    : ['✏️', 'Inténtalo otra vez'];
  box.innerHTML = `
    <div class="feedback ${state.result >= 0.35 ? 'ok' : 'ko'}">
      <strong>${icon} ${text} · ${pct}%</strong>
      <button class="btn primary" data-write-next>Siguiente →</button>
    </div>
  `;
}

// ---------- Acciones (las llama app.js) ----------

export function clearWriting() {
  state.strokes = [];
  state.result = null;
  redrawGuide();
  redrawStrokes();
  showResult();
}

export function checkWriting() {
  if (!state.strokes.length) return;
  state.result = scoreDrawing(state.strokes, state.kana[state.script]);
  redrawGuide();
  showResult();
  speak(state.kana[state.script]);
}

export function nextWriting() {
  state.kana = pickKana(state.kana);
  state.strokes = [];
  state.result = null;
  document.querySelector('.write-romaji').textContent = state.kana.romaji;
  document.querySelector('.write-target [data-speak]').dataset.speak = state.kana[state.script];
  clearWriting();
}

export function toggleGuide(on) {
  state.guide = on;
  redrawGuide();
}
