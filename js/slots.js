// Frases con hueco: qué valor está elegido para cada hueco y cómo rellenar el texto.

import { loadJSON, saveJSON } from './storage.js';
import { slotOptions } from './data/slots.js';
import { getProfile } from './profile.js';

const KEY = 'slots';
const chosen = loadJSON(KEY, {}); // { station: 'kyoto', allergen: 'tamago', ... }

// Valor actual de un hueco: el que elegiste, o uno por defecto
export function slotValue(slot) {
  const options = slotOptions[slot];
  // Para alergias, por defecto la primera que marcaste en "Mis datos"
  const fallback = slot === 'allergen' ? getProfile().allergies[0] : undefined;
  const id = chosen[slot] ?? fallback;
  return options.find(o => o.id === id) ?? options[0];
}

export function setSlot(slot, id) {
  chosen[slot] = id;
  saveJSON(KEY, chosen);
}

// Devuelve una copia de la frase con el hueco rellenado.
// Las frases sin hueco se devuelven tal cual.
export function fillPhrase(phrase) {
  if (!phrase.slot) return phrase;
  const value = slotValue(phrase.slot);
  const marker = `{${phrase.slot}}`;
  return {
    ...phrase,
    jp: phrase.jp.replace(marker, value.jp),
    romaji: phrase.romaji.replace(marker, value.romaji),
    es: phrase.es.replace(marker, value.es),
  };
}
