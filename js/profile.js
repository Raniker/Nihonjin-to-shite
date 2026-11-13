// "Mis datos": información personal para la ficha de emergencia y las frases con hueco.
// Se guarda SOLO en el celular (localStorage); nunca sale del dispositivo.

import { loadJSON, saveJSON } from './storage.js';

const KEY = 'profile';

const EMPTY = {
  hotelName: '',
  hotelAddress: '',
  hotelPhone: '',
  allergies: [],      // ids de data/slots.js → allergens
  conditions: [],     // ids de data/medical.js → conditions
  medications: '',
  bloodType: '',
  emergencyContact: '',
  embassyPhone: '',
};

// { ...EMPTY, ...guardado }: si en el futuro añadimos un campo nuevo,
// los perfiles guardados antes lo reciben con su valor vacío.
let profile = { ...EMPTY, ...loadJSON(KEY, {}) };

export function getProfile() {
  return profile;
}

export function saveProfile(data) {
  profile = { ...EMPTY, ...data };
  saveJSON(KEY, profile);
}

export function hasProfileData() {
  return Object.entries(profile).some(([, v]) => (Array.isArray(v) ? v.length > 0 : v !== ''));
}
