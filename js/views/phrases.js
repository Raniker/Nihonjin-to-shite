// Vista de una categoría de frases.

import { getCategory } from '../data/phrases.js';
import { canSpeak, hasJapaneseVoice } from '../speech.js';
import { phraseItem } from './components.js';

export function phrasesView(categoryId) {
  const category = getCategory(categoryId);
  if (!category) return `<p>Categoría no encontrada. <a href="#/">Volver</a></p>`;

  // Aviso si el móvil no tiene voz japonesa instalada
  const warning = !canSpeak()
    ? `<div class="notice">Tu navegador no soporta síntesis de voz.</div>`
    : !hasJapaneseVoice()
      ? `<div class="notice">No encuentro una voz japonesa. En Android: Ajustes → Idioma → Salida de texto a voz → Google → instala "Japonés".</div>`
      : '';

  return `
    <a class="back" href="#/">← Inicio</a>
    <h1>${category.icon} ${category.name}</h1>
    ${warning}
    <p class="hint">Toca una frase para mostrarla en grande.</p>
    <ul class="phrase-list">${category.phrases.map(phraseItem).join('')}</ul>
  `;
}
