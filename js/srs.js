// Repaso espaciado con el sistema Leitner (SRS = Spaced Repetition System).
//
// Cada tarjeta vive en una "caja" de 0 a 5:
//   - Si aciertas, sube una caja y tarda más en volver a salir.
//   - Si fallas, vuelve a la caja 0 y sale de nuevo enseguida.
// Las tarjetas que nunca has visto no tienen entrada: son "nuevas".
//
// Lo guardado en localStorage tiene esta forma:
//   { "kana:か": { box: 2, due: 1763000000000 }, ... }
// "due" es la fecha (en milisegundos) a partir de la cual toca repasarla.

import { loadJSON, saveJSON } from './storage.js';

const KEY = 'srs';
const DAY = 24 * 60 * 60 * 1000;

// Días de espera según la caja: índice = número de caja
const INTERVAL_DAYS = [0, 1, 2, 4, 8, 16];
const MAX_BOX = INTERVAL_DAYS.length - 1;
export const LEARNED_BOX = 4; // a partir de aquí la consideramos "dominada"

const progress = loadJSON(KEY, {});

// Registra una respuesta y programa el próximo repaso
export function review(cardId, correct, now = Date.now()) {
  const previousBox = progress[cardId]?.box ?? 0;
  const box = correct ? Math.min(previousBox + 1, MAX_BOX) : 0;
  progress[cardId] = { box, due: now + INTERVAL_DAYS[box] * DAY };
  saveJSON(KEY, progress);
}

// Elige qué tarjetas entran en una ronda:
//   1. Primero las pendientes (due <= ahora), las más atrasadas antes.
//   2. Si queda hueco, algunas nuevas, en el orden de los datos (あいうえお antes que かきくけこ).
//   3. Si no hay nada que hacer, adelanta las próximas en vencer ("early": repaso anticipado).
export function buildSession(cardIds, { size = 10, maxNew = 5, now = Date.now() } = {}) {
  const byDue = (a, b) => progress[a].due - progress[b].due;

  const due = cardIds.filter(id => progress[id] && progress[id].due <= now).sort(byDue);
  const fresh = cardIds.filter(id => !progress[id]);

  const queue = due.slice(0, size);
  queue.push(...fresh.slice(0, Math.min(maxNew, size - queue.length)));
  if (queue.length > 0) return { queue, early: false };

  const upcoming = cardIds.filter(id => progress[id]).sort(byDue).slice(0, size);
  return { queue: upcoming, early: true };
}

// Resumen para la pantalla de mazos
export function deckStats(cardIds, now = Date.now()) {
  const stats = { total: cardIds.length, fresh: 0, due: 0, learned: 0 };
  for (const id of cardIds) {
    const p = progress[id];
    if (!p) stats.fresh++;
    else {
      if (p.due <= now) stats.due++;
      if (p.box >= LEARNED_BOX) stats.learned++;
    }
  }
  return stats;
}
