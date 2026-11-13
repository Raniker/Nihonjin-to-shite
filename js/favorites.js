// Favoritas guardadas en localStorage (ver storage.js).

import { loadJSON, saveJSON } from './storage.js';

const KEY = 'favorites';

// Un Set es como un array sin duplicados, con has/add/delete rápidos.
// localStorage solo guarda texto: guardamos el Set como array JSON.
const favorites = new Set(loadJSON(KEY, []));

export function isFavorite(id) {
  return favorites.has(id);
}

export function toggleFavorite(id) {
  if (favorites.has(id)) favorites.delete(id);
  else favorites.add(id);
  saveJSON(KEY, [...favorites]);
}

export function favoriteIds() {
  return [...favorites];
}
