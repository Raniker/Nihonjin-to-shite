// Utilidades generales.

// Convierte texto en HTML seguro: & < > " ' pasan a ser entidades.
// Hasta ahora todo el texto venía de nuestros datos. Con "Mis datos" el texto
// lo escribe el usuario: si escribe "<b>" o unas comillas, sin esto romperíamos
// el HTML (y en una web con datos de otros sería un agujero de seguridad: XSS).
export function escapeHtml(text) {
  const entities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return String(text).replace(/[&<>"']/g, c => entities[c]);
}

// Baraja un array (algoritmo Fisher-Yates) y devuelve una copia.
// Recorre de atrás hacia delante intercambiando cada elemento con uno al azar
// de los anteriores: todas las ordenaciones son igual de probables.
export function shuffle(array) {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]; // intercambio con desestructuración
  }
  return a;
}
