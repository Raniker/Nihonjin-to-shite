// Ayudantes para guardar y leer JSON en localStorage de forma segura.
// localStorage puede fallar (modo incógnito, almacenamiento lleno, datos corruptos):
// en ese caso devolvemos el valor por defecto y la app sigue funcionando.

export function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function saveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch { /* sin almacenamiento: los datos duran solo esta sesión */ }
}
