// Vista de inicio: buscador, emergencia, favoritas y menú principal.
// Cada vista es una función que devuelve un string HTML. El router lo inserta en <main>.

import { categories, getPhrase } from '../data/phrases.js';
import { favoriteIds } from '../favorites.js';
import { searchPhrases } from '../search.js';
import { phraseItem } from './components.js';
import { escapeHtml } from '../utils.js';

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

// La llama app.js con cada tecla en el buscador
export function searchResults(query) {
  if (!query.trim()) return '';
  const results = searchPhrases(query);
  return results.length
    ? `<ul class="phrase-list">${results.map(phraseItem).join('')}</ul>`
    : `<p class="hint">Sin resultados para "${escapeHtml(query)}".</p>`;
}

export function homeView() {
  const phraseCards = categories.map(c => `
    <a class="card" href="#/frases/${c.id}">
      <span class="icon">${c.icon}</span>
      <span class="title">${c.name}</span>
      <span class="sub">${c.phrases.length} frases</span>
    </a>
  `).join('');

  // Mientras hay texto en el buscador, el CSS oculta .home-sections (ver :has en styles.css)
  return `
    <input type="search" class="search" data-search
           placeholder="🔎 Buscar frase (español, romaji o japonés)" aria-label="Buscar frase">
    <div id="search-results"></div>

    <div class="home-sections">
      <a class="sos-link" href="#/emergencia">🆘 Ficha de emergencia <small>110 · 119 · tu hotel · alergias</small></a>

      ${favoritesSection()}

      <h2 class="section-title">Frases</h2>
      <div class="grid">${phraseCards}</div>

      <h2 class="section-title">Practicar</h2>
      <div class="grid">
        <a class="card" href="#/kana/hiragana"><span class="icon">あ</span><span class="title">Kana</span><span class="sub">Hiragana y katakana</span></a>
        <a class="card" href="#/numeros"><span class="icon">¥</span><span class="title">Números y precios</span><span class="sub">Con conversor</span></a>
        <a class="card" href="#/quiz"><span class="icon">🧠</span><span class="title">Quiz</span><span class="sub">Repaso espaciado</span></a>
        <a class="card" href="#/mis-datos"><span class="icon">✎</span><span class="title">Mis datos</span><span class="sub">Hotel, alergias…</span></a>
      </div>
    </div>
  `;
}
