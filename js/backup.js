// Copia de seguridad: exportar e importar los datos guardados en el celular.
// localStorage se pierde si cambias de celular, desinstalas la app o borras
// los datos de Chrome. Con esto puedes guardar un archivo .json y recuperarlo.

import { loadJSON, saveJSON } from './storage.js';

const APP_ID = 'nihongo-de-viaje';
const FORMAT_VERSION = 1;

// Qué se guarda y qué tipo debe tener cada dato (para validar al importar)
const KEYS = {
  profile: 'object',   // Mis datos
  srs: 'object',       // progreso del quiz
  favorites: 'array',  // favoritas
  slots: 'object',     // valores elegidos en las frases con hueco
};

const typeOf = value => (Array.isArray(value) ? 'array' : value === null ? 'null' : typeof value);

// Descarga un archivo .json con todo
export function exportBackup() {
  const data = {};
  for (const key of Object.keys(KEYS)) {
    const value = loadJSON(key, null);
    if (value !== null) data[key] = value;
  }
  const backup = { app: APP_ID, format: FORMAT_VERSION, exportedAt: new Date().toISOString(), data };

  // Blob = un "archivo en memoria". createObjectURL le da una URL temporal,
  // y un <a download> la descarga como archivo (en Android va a "Descargas").
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `nihongo-copia-${backup.exportedAt.slice(0, 10)}.json`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000); // liberamos la memoria
}

// Lee y valida un archivo. Devuelve los datos o lanza un Error con un mensaje claro.
// NUNCA hay que confiar en un archivo que viene de fuera: comprobamos que es
// nuestro formato y que cada dato tiene el tipo esperado antes de guardar nada.
export async function readBackup(file) {
  if (file.size > 5 * 1024 * 1024) throw new Error('El archivo es demasiado grande.');

  let backup;
  try {
    backup = JSON.parse(await file.text());
  } catch {
    throw new Error('El archivo no es un JSON válido.');
  }
  if (backup?.app !== APP_ID || typeOf(backup.data) !== 'object') {
    throw new Error('Este archivo no es una copia de seguridad de esta app.');
  }
  if (backup.format > FORMAT_VERSION) {
    throw new Error('La copia es de una versión más nueva de la app. Actualiza la app primero.');
  }

  // Solo aceptamos las claves conocidas, con su tipo correcto. Lo demás se ignora.
  const clean = {};
  for (const [key, type] of Object.entries(KEYS)) {
    if (key in backup.data) {
      if (typeOf(backup.data[key]) !== type) throw new Error(`Dato "${key}" con formato incorrecto.`);
      clean[key] = backup.data[key];
    }
  }
  return { data: clean, exportedAt: backup.exportedAt };
}

export function applyBackup(data) {
  for (const [key, value] of Object.entries(data)) saveJSON(key, value);
}
