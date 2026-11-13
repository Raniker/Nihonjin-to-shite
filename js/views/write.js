// Practicar escritura de kana: #/escribir/hiragana o #/escribir/katakana
//
// Novedad: esta vista necesita algo DESPUÉS de insertarse en la página
// (medir el canvas y escuchar el dedo). Para eso exportamos writeView.mount,
// que el router llama justo después de pintar (ver render() en app.js).
//
// Diseño: todos los controles y la nota van ENCIMA del lienzo, para no tener
// que hacer scroll mientras dibujas con el dedo.

import { kanaGroups } from '../data/kana.js';
import { drawGlyph, drawStrokes, scoreDrawing } from '../writing.js';
import { speak } from '../speech.js';
import { loadJSON, saveJSON } from '../storage.js';

const SCRIPTS = { hiragana: 'あ Hiragana', katakana: 'ア Katakana' };

// Solo kana de un carácter (básicos y con tenten); los combinados (きゃ) son dos
const writable = () => kanaGroups.slice(0, 2).flatMap(g => g.cells).filter(Boolean);

let state = null; // { script, kana, strokes, guide, result, lastScore }

// Si la nota es baja, enseñamos el modelo unos segundos y borramos para reintentar
const PASS = 0.65;         // nota mínima para "¡Muy bien!" y para poder pasar al siguiente
const REVIEW_MS = 2500;    // cuánto tiempo se ve el modelo antes de borrar
let retryTimer = null;

// La guía es un "vistazo": se ve unos segundos y desaparece, para escribir de memoria
const GUIDE_MS = 2000;
let guideTimer = null;

// Opción "Con guía": la guía aparece sola al empezar cada kana. Se recuerda en el celular.
const AUTO_GUIDE_KEY = 'writeAutoGuide';
let autoGuide = loadJSON(AUTO_GUIDE_KEY, false);

function pickKana(previous) {
  const options = writable().filter(k => k !== previous);
  return options[Math.floor(Math.random() * options.length)];
}

export function writeView(script = 'hiragana') {
  if (!SCRIPTS[script]) script = 'hiragana';
  if (!state || state.script !== script) {
    state = { script, kana: pickKana(), strokes: [], guide: false, result: null, lastScore: null };
  }

  const tabs = Object.entries(SCRIPTS).map(([id, label]) => `
    <a class="tab ${id === script ? 'active' : ''}" href="#/escribir/${id}">${label}</a>
  `).join('');

  return `
    <a class="back" href="#/kana/${script}">← Kana</a>
    <div class="tabs">${tabs}</div>

    <!-- Barra superior: qué escribir (izquierda) y la nota (derecha) -->
    <div class="write-bar">
      <div class="write-target">
        <span>Escribe</span>
        <strong class="write-romaji">${state.kana.romaji}</strong>
        <button class="speak-btn small" data-speak="${state.kana[script]}" aria-label="Escuchar">🔊</button>
      </div>
      <div id="write-result" class="write-badge" aria-live="polite"></div>
    </div>

    <div class="write-actions">
      <button class="btn" data-write-clear>🧽 Borrar</button>
      <button class="btn" data-guide-toggle aria-pressed="false">👁 Ver guía</button>
      <!-- Dos botones en el mismo sitio: se muestra uno u otro según el estado -->
      <button class="btn primary" data-write-check>Comprobar</button>
      <button class="btn primary" data-write-next hidden>Siguiente →</button>
    </div>

    <!-- Dos lienzos apilados: la guía/modelo debajo y tu dibujo encima -->
    <div class="pad">
      <canvas class="pad-guide"></canvas>
      <canvas class="pad-draw" aria-label="Zona para dibujar"></canvas>
    </div>
    <label class="toggle write-option">
      <input type="checkbox" data-auto-guide ${autoGuide ? 'checked' : ''}>
      Con guía: mostrarla unos segundos al empezar cada kana
    </label>
    <p class="hint write-hint">La comprobación compara la forma, no el orden de los trazos.</p>
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
  // Si volvemos a esta pantalla con un repaso o una guía a medias, los terminamos ya
  if (retryTimer) finishReview();
  hideGuide();

  let current = null;
  drawCanvas.addEventListener('pointerdown', (e) => {
    // ¿Empiezas a dibujar mientras se ve el modelo? No esperamos: borramos ya
    if (retryTimer) finishReview();
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
  if (autoGuide && state.result === null) showGuide();
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

// Actualiza la nota de la barra y qué botón principal se ve
function showResult() {
  const badge = document.getElementById('write-result');
  const checked = state.result !== null;
  const passed = checked && state.result >= PASS;
  const checkBtn = document.querySelector('[data-write-check]');
  // "Siguiente" solo aparece al aprobar: hay que practicar hasta llegar al mínimo
  checkBtn.hidden = passed;
  checkBtn.disabled = checked && !passed; // mientras se ve el modelo, no se puede volver a comprobar
  document.querySelector('[data-write-next]').hidden = !passed;

  if (!checked) {
    // Tras un repaso automático recordamos la nota del intento anterior
    if (state.lastScore !== null) {
      badge.className = 'write-badge last';
      badge.innerHTML = `<strong>✏️ ${Math.round(state.lastScore * 100)}%</strong><small>Inténtalo de nuevo</small>`;
    } else {
      badge.className = 'write-badge';
      badge.innerHTML = '';
    }
    return;
  }
  const pct = Math.round(state.result * 100);
  // Umbrales elegidos con la calibración de writing.js
  const [icon, text, cls] = state.result >= PASS ? ['✅', '¡Muy bien!', 'ok']
    : state.result >= 0.35 ? ['👍', 'Casi: mira el modelo', 'mid']
    : ['✏️', 'Mira el modelo', 'ko'];
  badge.className = `write-badge ${cls}`;
  badge.innerHTML = `<strong>${icon} ${pct}%</strong><small>${text}</small>`;
}

// Fin del repaso: borra tu dibujo y quita el modelo para que lo intentes otra vez
function finishReview() {
  clearTimeout(retryTimer);
  retryTimer = null;
  if (!drawCanvas?.isConnected) return; // ya no estamos en esta pantalla
  state.lastScore = state.result;
  state.strokes = [];
  state.result = null;
  redrawGuide();
  redrawStrokes();
  showResult();
}

function cancelReview() {
  clearTimeout(retryTimer);
  retryTimer = null;
}

// ---------- Acciones (las llama app.js) ----------

export function clearWriting() {
  cancelReview();
  state.strokes = [];
  state.result = null;
  state.lastScore = null;
  redrawGuide();
  redrawStrokes();
  showResult();
}

export function checkWriting() {
  if (!state.strokes.length || retryTimer) return;
  state.result = scoreDrawing(state.strokes, state.kana[state.script]);
  redrawGuide(); // muestra el modelo en rojo encima de tu dibujo
  showResult();
  speak(state.kana[state.script]);
  // Nota baja: dejamos ver el modelo unos segundos y luego borramos para reintentar
  if (state.result < PASS) retryTimer = setTimeout(finishReview, REVIEW_MS);
}

export function nextWriting() {
  // Protección también en la lógica, no solo ocultando el botón:
  // sin nota suficiente no se avanza, se llame como se llame a esta función.
  if (state.result === null || state.result < PASS) return;
  cancelReview();
  hideGuide(); // la guía del kana anterior no debe verse en el nuevo
  state.kana = pickKana(state.kana);
  document.querySelector('.write-romaji').textContent = state.kana.romaji;
  document.querySelector('.write-target [data-speak]').dataset.speak = state.kana[state.script];
  clearWriting();
  if (autoGuide) showGuide(); // modo "Con guía": vistazo al empezar el kana nuevo
}

export function setAutoGuide(on) {
  autoGuide = on;
  saveJSON(AUTO_GUIDE_KEY, on);
  if (on && state.result === null) showGuide(); // al activarla, la vemos ya
}

// Muestra la guía GUIDE_MS milisegundos. Si se pulsa otra vez, el tiempo vuelve a empezar.
export function showGuide() {
  clearTimeout(guideTimer);
  setGuide(true);
  guideTimer = setTimeout(hideGuide, GUIDE_MS);
}

function hideGuide() {
  clearTimeout(guideTimer);
  guideTimer = null;
  setGuide(false);
}

function setGuide(on) {
  state.guide = on;
  const btn = document.querySelector('[data-guide-toggle]');
  if (!btn?.isConnected) return; // ya no estamos en esta pantalla
  btn.classList.toggle('on', on);
  btn.setAttribute('aria-pressed', on);
  redrawGuide();
}
