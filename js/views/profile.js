// Formulario "Mis datos": #/mis-datos
// Sin botón "Guardar": app.js guarda en cada cambio (evento "input").

import { getProfile, saveProfile } from '../profile.js';
import { allergens } from '../data/slots.js';
import { conditions, bloodTypes } from '../data/medical.js';
import { escapeHtml } from '../utils.js';

function checkboxes(name, list, selected) {
  return list.map(item => `
    <label class="check">
      <input type="checkbox" name="${name}" value="${item.id}" ${selected.includes(item.id) ? 'checked' : ''}>
      ${item.name} <span lang="ja">${item.jp}</span>
    </label>
  `).join('');
}

export function profileView() {
  const p = getProfile();
  const e = escapeHtml; // los valores van dentro de value="...": hay que escapar las comillas

  return `
    <a class="back" href="#/emergencia">← Ficha de emergencia</a>
    <h1>✎ Mis datos</h1>
    <p class="hint">Se guardan solo en este celular y se usan en la ficha de emergencia
      y en la frase de alergias. Se guarda automáticamente.</p>

    <form id="profile-form" class="form" autocomplete="off">
      <fieldset>
        <legend>🏨 Alojamiento</legend>
        <label>Nombre<input name="hotelName" value="${e(p.hotelName)}"></label>
        <label>Dirección en japonés
          <textarea name="hotelAddress" rows="3" lang="ja"
            placeholder="Cópiala de la confirmación de la reserva">${e(p.hotelAddress)}</textarea>
        </label>
        <label>Teléfono<input name="hotelPhone" type="tel" value="${e(p.hotelPhone)}"></label>
      </fieldset>

      <fieldset>
        <legend>⚠️ Alergias</legend>
        ${checkboxes('allergies', allergens, p.allergies)}
      </fieldset>

      <fieldset>
        <legend>🩺 Salud</legend>
        ${checkboxes('conditions', conditions, p.conditions)}
        <label>Medicamentos que tomas<input name="medications" value="${e(p.medications)}"
          placeholder="Nombre del principio activo, p. ej. insulina"></label>
        <label>Grupo sanguíneo
          <select name="bloodType">
            <option value="">—</option>
            ${bloodTypes.map(t => `<option ${t === p.bloodType ? 'selected' : ''}>${t}</option>`).join('')}
          </select>
        </label>
      </fieldset>

      <fieldset>
        <legend>📞 Contactos</legend>
        <label>Contacto de emergencia<input name="emergencyContact" value="${e(p.emergencyContact)}"
          placeholder="Nombre y teléfono con prefijo internacional"></label>
        <label>Teléfono de tu embajada en Japón<input name="embassyPhone" type="tel" value="${e(p.embassyPhone)}"></label>
      </fieldset>
    </form>
    <p id="saved" class="saved" hidden>✓ Guardado</p>
  `;
}

// FormData lee todos los campos del formulario de una vez.
// getAll() devuelve todos los valores marcados de un grupo de checkboxes.
export function saveProfileForm(form) {
  const data = new FormData(form);
  saveProfile({
    ...Object.fromEntries(data), // campos de texto: { hotelName: '...', ... }
    allergies: data.getAll('allergies'),
    conditions: data.getAll('conditions'),
  });
  document.getElementById('saved').hidden = false;
}
