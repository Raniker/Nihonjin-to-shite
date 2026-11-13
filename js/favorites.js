// Favoritas guardadas en localStorage.
// localStorage es un almacén clave → texto que vive en el navegador del celular
// y sobrevive a cerrar la app. Solo guarda strings, por eso usamos JSON.

const KEY = 'favorites';

function load() {
  // try/catch: localStorage puede fallar (modo incógnito, datos corruptos...)
  try {
    return new Set(JSON.parse(localStorage.getItem(KEY)) ?? []);
  } catch {
    return new Set();
  }
}

// Un Set es como un array sin duplicados, con has/add/delete rápidos
const favorites = load();

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify([...favorites]));
  } catch { /* sin almacenamiento: las favoritas duran solo esta sesión */ }
}

export function isFavorite(id) {
  return favorites.has(id);
}

export function toggleFavorite(id) {
  if (favorites.has(id)) favorites.delete(id);
  else favorites.add(id);
  save();
}

export function favoriteIds() {
  return [...favorites];
}
