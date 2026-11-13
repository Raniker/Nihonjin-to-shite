// Buscador de frases.

import { categories } from './data/phrases.js';
import { slotOptions } from './data/slots.js';

// "Estación" → "estacion", "Kyōto" → "kyoto".
// normalize('NFD') separa cada letra de su tilde (ó → o + ◌́),
// y luego borramos las tildes (rango Unicode de "marcas combinables").
// Así "estacion" encuentra "estación" y "kyoto" encuentra "Kyōto".
export function normalize(text) {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

// Texto donde buscar de cada frase. Lo calculamos una sola vez (al primer uso)
// en vez de en cada tecla. Incluye:
//   - el nombre de su categoría: "aeropuerto" encuentra todas las de Aeropuerto
//   - las opciones de los huecos: "farmacia" encuentra "¿Dónde está ＿＿?"
//     aunque ahora mismo tenga elegida otra opción
let index = null;

function buildIndex() {
  return categories.flatMap(category => category.phrases.map(p => {
    const options = p.slot ? slotOptions[p.slot].map(o => `${o.jp} ${o.romaji} ${o.es} ${o.name ?? ''}`) : [];
    return { phrase: p, text: normalize([category.name, p.jp, p.romaji, p.es, ...options].join(' ')) };
  }));
}

export function searchPhrases(query, limit = 30) {
  const q = normalize(query.trim());
  if (!q) return [];
  index ??= buildIndex(); // ??= asigna solo si todavía es null
  return index.filter(entry => entry.text.includes(q)).slice(0, limit).map(entry => entry.phrase);
}
