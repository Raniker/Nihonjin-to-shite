// Tablas de kana: #/kana/hiragana o #/kana/katakana

import { kanaGroups, kanaTips } from '../data/kana.js';

const SCRIPTS = {
  hiragana: { label: 'Hiragana', sample: 'あ', note: 'Para palabras japonesas y partes gramaticales.' },
  katakana: { label: 'Katakana', sample: 'ア', note: 'Para palabras extranjeras: menús, tiendas, nombres. ¡Muy útil en el viaje!' },
};

export function kanaView(script = 'hiragana') {
  if (!SCRIPTS[script]) script = 'hiragana';

  const tabs = Object.entries(SCRIPTS).map(([id, s]) => `
    <a class="tab ${id === script ? 'active' : ''}" href="#/kana/${id}">${s.sample} ${s.label}</a>
  `).join('');

  const groups = kanaGroups.map(g => {
    const cells = g.cells.map(c => c
      ? `<button class="kana-cell" data-speak="${c[script]}">
           <span class="k-char" lang="ja">${c[script]}</span>
           <span class="k-romaji">${c.romaji}</span>
         </button>`
      : `<span class="kana-cell empty"></span>`
    ).join('');
    // --cols es una variable CSS "local": la rejilla la lee para saber cuántas columnas usar
    return `
      <h2 class="section-title">${g.title}</h2>
      <div class="kana-grid" style="--cols: ${g.cols}">${cells}</div>
    `;
  }).join('');

  const tips = kanaTips.map(t => `
    <li class="tip">
      <div class="tip-rule">${t.rule}</div>
      <button class="tip-word" data-speak="${t.word}">
        <span lang="ja">${t.word}</span> · <em>${t.romaji}</em> · ${t.es} 🔊
      </button>
    </li>
  `).join('');

  return `
    <a class="back" href="#/">← Inicio</a>
    <h1>Kana</h1>
    <div class="tabs">${tabs}</div>
    <p class="hint">${SCRIPTS[script].note} Toca un carácter para escucharlo.</p>

    <!-- Sin JavaScript: el CSS usa :has() para ocultar el romaji cuando está marcado -->
    <label class="toggle"><input type="checkbox" id="hide-romaji"> Ocultar romaji (para practicar)</label>

    ${groups}

    <h2 class="section-title">Trucos de lectura</h2>
    <ul class="tips">${tips}</ul>
  `;
}
