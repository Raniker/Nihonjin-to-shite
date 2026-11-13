// Piezas de HTML reutilizadas por varias vistas.

import { isFavorite } from '../favorites.js';

// Una fila de frase: texto (toca para "mostrar"), estrella y altavoz.
export function phraseItem(p) {
  const fav = isFavorite(p.id);
  return `
    <li class="phrase">
      <a class="text" href="#/mostrar/${p.id}">
        <div class="jp" lang="ja">${p.jp}</div>
        <div class="romaji">${p.romaji}</div>
        <div class="es">${p.es}</div>
      </a>
      <div class="actions">
        <button class="fav-btn ${fav ? 'on' : ''}" data-fav="${p.id}"
                aria-pressed="${fav}" aria-label="Favorita">★</button>
        <button class="speak-btn" data-speak="${p.jp}" aria-label="Escuchar">🔊</button>
      </div>
    </li>
  `;
}
