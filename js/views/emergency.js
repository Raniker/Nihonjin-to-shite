// Ficha de emergencia: #/emergencia
// Pensada para ENSEÑAR: el japonés va grande (para quien te ayuda)
// y el español pequeño (para ti). Los teléfonos son enlaces tel: → tocar = llamar.

import { getProfile, hasProfileData } from '../profile.js';
import { allergens } from '../data/slots.js';
import { conditions, bloodTypeJp } from '../data/medical.js';
import { escapeHtml } from '../utils.js';

// Deja solo dígitos y "+" para el enlace tel:
const telHref = phone => `tel:${phone.replace(/[^\d+]/g, '')}`;

function section(jpTitle, esTitle, body) {
  return `
    <div class="id-section">
      <h2><span lang="ja">${jpTitle}</span> <small>${esTitle}</small></h2>
      ${body}
    </div>
  `;
}

// ids → chips "卵 (Huevo)"
function chips(ids, list) {
  return `<div class="chips">${ids
    .map(id => list.find(item => item.id === id))
    .filter(Boolean)
    .map(item => `<span class="chip"><span lang="ja">${item.jp}</span> <small>${item.name}</small></span>`)
    .join('')}</div>`;
}

export function emergencyView() {
  const p = getProfile();
  const e = escapeHtml; // todo lo que escribió el usuario pasa por aquí

  const sections = [];

  if (p.hotelName || p.hotelAddress) {
    sections.push(section('宿泊先', 'Mi alojamiento', `
      ${p.hotelName ? `<p class="id-big">${e(p.hotelName)}</p>` : ''}
      ${p.hotelAddress ? `<p class="id-address" lang="ja">${e(p.hotelAddress)}</p>` : ''}
      ${p.hotelPhone ? `<a class="id-phone" href="${telHref(p.hotelPhone)}">📞 ${e(p.hotelPhone)}</a>` : ''}
      <p class="id-request"><span lang="ja">この住所まで連れて行ってください。</span>
        <small>Lléveme a esta dirección, por favor.</small></p>
    `));
  }
  if (p.allergies.length) {
    sections.push(section('アレルギー', 'Alergias', chips(p.allergies, allergens)));
  }
  if (p.conditions.length) {
    sections.push(section('持病', 'Enfermedades', chips(p.conditions, conditions)));
  }
  if (p.medications) {
    sections.push(section('服用中の薬', 'Medicamentos que tomo', `<p class="id-big">${e(p.medications)}</p>`));
  }
  if (p.bloodType) {
    sections.push(section('血液型', 'Grupo sanguíneo', `<p class="id-big" lang="ja">${bloodTypeJp(p.bloodType)}</p>`));
  }
  if (p.emergencyContact) {
    sections.push(section('緊急連絡先', 'Contacto de emergencia', `<p class="id-big">${e(p.emergencyContact)}</p>`));
  }

  return `
    <a class="back" href="#/">← Inicio</a>
    <h1>🆘 <span lang="ja">緊急</span> · Emergencia</h1>

    <div class="call-grid">
      <a class="call" href="tel:110">
        <b>110</b><span lang="ja">警察</span><small>Policía</small>
      </a>
      <a class="call" href="tel:119">
        <b>119</b><span lang="ja">救急車・消防</span><small>Ambulancia y bomberos</small>
      </a>
    </div>
    <a class="call-wide" href="tel:+815038162787">
      📞 Japan Visitor Hotline <b>050-3816-2787</b>
      <small>Turismo de Japón (JNTO), 24 h, en inglés</small>
    </a>
    ${p.embassyPhone ? `
      <a class="call-wide" href="${telHref(p.embassyPhone)}">
        🏛️ Mi embajada <b>${e(p.embassyPhone)}</b>
      </a>` : ''}

    <div class="id-card">
      <p class="id-intro"><span lang="ja">私は外国人旅行者です。日本語が話せません。</span>
        <small>Soy turista extranjero/a. No hablo japonés.</small></p>
      ${sections.join('')}
    </div>

    ${hasProfileData()
      ? ''
      : `<div class="notice">Añade tu hotel, alergias y medicinas en <strong>Mis datos</strong> para que aparezcan aquí en japonés.</div>`}
    <a class="btn" href="#/mis-datos">✎ Editar mis datos</a>
    <p class="hint" style="margin-top:12px">La pantalla se mantiene encendida mientras ves esta ficha.</p>
  `;
}
