// Piezas de HTML reutilizadas por varias vistas.

import { isFavorite } from '../favorites.js';
import { fillPhrase } from '../slots.js';

// Una fila de frase: texto (toca para "mostrar"), estrella y altavoz.
export function phraseItem(phrase) {
  const p = fillPhrase(phrase); // rellena el hueco, si lo tiene
  const fav = isFavorite(p.id);
  return `
    <li class="phrase">
      <a class="text" href="#/mostrar/${p.id}">
        <div class="jp" lang="ja">${p.jp}</div>
        <div class="romaji">${p.romaji}</div>
        <div class="es">${p.es}</div>
        ${p.slot ? '<div class="slot-badge">✎ cambiable</div>' : ''}
      </a>
      <div class="actions">
        <button class="fav-btn ${fav ? 'on' : ''}" data-fav="${p.id}"
                aria-pressed="${fav}" aria-label="Favorita">★</button>
        <button class="speak-btn" data-speak="${p.jp}" aria-label="Escuchar">🔊</button>
      </div>
    </li>
  `;
}
