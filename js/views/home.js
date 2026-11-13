// Vista de inicio: menú principal.
// Cada vista es una función que devuelve un string HTML. El router lo inserta en <main>.

import { categories, getPhrase } from '../data/phrases.js';
import { favoriteIds } from '../favorites.js';
import { phraseItem } from './components.js';

function favoritesSection() {
  const phrases = favoriteIds()
    .map(id => getPhrase(id)?.phrase) // ?. por si una favorita ya no existe en los datos
    .filter(Boolean);
  if (phrases.length === 0) return '';

  return `
    <h2 class="section-title">⭐ Favoritas</h2>
    <ul class="phrase-list">${phrases.map(phraseItem).join('')}</ul>
  `;
}

export function homeView() {
  const phraseCards = categories.map(c => `
    <a class="card" href="#/frases/${c.id}">
      <span class="icon">${c.icon}</span>
      <span class="title">${c.name}</span>
      <span class="sub">${c.phrases.length} frases</span>
    </a>
  `).join('');

  return `
    ${favoritesSection()}

    <h2 class="section-title">Frases</h2>
    <div class="grid">${phraseCards}</div>

    <h2 class="section-title">Practicar</h2>
    <div class="grid">
      <a class="card disabled"><span class="icon">あ</span><span class="title">Kana</span><span class="sub">Próximamente</span></a>
      <a class="card disabled"><span class="icon">¥</span><span class="title">Números y precios</span><span class="sub">Próximamente</span></a>
      <a class="card disabled"><span class="icon">🧠</span><span class="title">Quiz</span><span class="sub">Próximamente</span></a>
    </div>
  `;
}
