// Escenas guiadas: #/escenas (lista) y #/escenas/<id> (practicar una).
//
// Se avanza línea a línea, como un chat, y cada línea empieza "tapada":
//   - Lo que dicen ELLOS se ve en japonés (y suena): ¿lo entiendes? → toca para ver el español.
//   - Lo que dices TÚ se ve en español: ¿cómo lo dirías? → toca para ver el japonés.

import { scenes, getScene } from '../data/scenes.js';
import { getPhrase } from '../data/phrases.js';
import { fillPhrase } from '../slots.js';
import { speak } from '../speech.js';

let state = null; // { scene, shown: cuántas líneas se ven, revealed: Set de líneas destapadas }

// Convierte un paso de los datos en una línea uniforme { who, jp, romaji, es }
function lineOf(step) {
  if (step.they) return { who: 'they', jp: step.they[0], es: step.they[1] };
  const p = typeof step.me === 'string' ? fillPhrase(getPhrase(step.me).phrase) : step.me;
  return { who: 'me', jp: p.jp, romaji: p.romaji, es: p.es };
}

export function scenesView(sceneId) {
  if (!sceneId) return scenesList();
  const scene = getScene(sceneId);
  if (!scene) return `<p>Escena no encontrada. <a href="#/escenas">Volver</a></p>`;
  state = { scene, shown: 1, revealed: new Set() };
  autoplay();
  return renderScene();
}

function scenesList() {
  const cards = scenes.map(s => `
    <a class="card" href="#/escenas/${s.id}">
      <span class="icon">${s.icon}</span>
      <span class="title">${s.name}</span>
      <span class="sub">${s.steps.length} líneas</span>
    </a>
  `).join('');
  return `
    <a class="back" href="#/">← Inicio</a>
    <h1>🎭 Escenas</h1>
    <div class="explain">
      Practica una conversación completa. Lo que te dicen aparece en japonés: intenta entenderlo
      antes de tocar. Lo que dices tú aparece en español: intenta decirlo en voz alta antes de tocar.
    </div>
    <h2 class="section-title">Elige una escena</h2>
    <div class="grid">${cards}</div>
  `;
}

function bubble(line, i) {
  const open = state.revealed.has(i);
  if (line.who === 'they') {
    return `
      <div class="bubble they">
        <div class="b-main" lang="ja">${line.jp}</div>
        ${open ? `<div class="b-sub">${line.es}</div>`
               : `<button class="b-reveal" data-scene-reveal="${i}">¿Qué te dicen? Toca para ver</button>`}
        <button class="b-speak" data-speak="${line.jp}" aria-label="Escuchar">🔊</button>
      </div>`;
  }
  return `
    <div class="bubble me">
      <div class="b-main">${line.es}</div>
      ${open ? `<div class="b-jp" lang="ja">${line.jp}</div><div class="b-sub">${line.romaji}</div>
                <button class="b-speak" data-speak="${line.jp}" aria-label="Escuchar">🔊</button>`
             : `<button class="b-reveal" data-scene-reveal="${i}">¿Cómo lo dices? Toca para ver</button>`}
    </div>`;
}

function renderScene() {
  const { scene, shown } = state;
  const lines = scene.steps.slice(0, shown).map(lineOf);
  const done = shown >= scene.steps.length;
  return `
    <a class="back" href="#/escenas">← Escenas</a>
    <h1>${scene.icon} ${scene.name}</h1>
    <div class="chat">${lines.map(bubble).join('')}</div>
    <div class="scene-actions">
      ${done
        ? `<p class="scene-done">🎉 ¡Escena completa!</p>
           <button class="btn primary" data-scene-restart>Repetir</button>`
        : `<button class="btn primary" data-scene-next>Siguiente ▶</button>`}
    </div>
  `;
}

function rerender() {
  document.getElementById('app').innerHTML = renderScene();
}

// Si la última línea visible es de ellos, suena sola (como en la vida real)
function autoplay() {
  const line = lineOf(state.scene.steps[state.shown - 1]);
  if (line.who === 'they') speak(line.jp);
}

// ---------- Acciones (las llama app.js) ----------

export function revealLine(i) {
  state.revealed.add(i);
  const line = lineOf(state.scene.steps[i]);
  if (line.who === 'me') speak(line.jp); // al destapar tu frase, oyes cómo se dice
  rerender();
}

export function nextLine() {
  state.shown++;
  autoplay();
  rerender();
  // Bajamos hasta el final para ver la nueva línea
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

export function restartScene() {
  state = { scene: state.scene, shown: 1, revealed: new Set() };
  autoplay();
  rerender();
  window.scrollTo(0, 0);
}
