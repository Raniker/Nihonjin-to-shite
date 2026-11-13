// Modo "mostrar": la frase en grande para enseñarla, y abajo las respuestas
// en japonés para que la otra persona toque la suya.
// Al tocar una respuesta, se ve su traducción y frases para contestar (conversación encadenada).

import { getPhrase, commonReplies } from '../data/phrases.js';
import { slotOptions } from '../data/slots.js';
import { fillPhrase, slotValue } from '../slots.js';

function replyButton(reply) {
  // La traducción va oculta dentro del botón; showAnswer la copia al panel al tocarlo.
  // data-next guarda los ids de las frases para contestar, separados por comas.
  return `
    <button class="reply" data-reply data-next="${reply.next.join(',')}">
      <span class="r-jp" lang="ja">${reply.jp}</span>
      <span class="r-es">${reply.es}</span>
    </button>
  `;
}

// Selector del hueco: <select> usa el selector nativo de Android, cómodo con listas largas
function slotPicker(phrase) {
  if (!phrase.slot) return '';
  const current = slotValue(phrase.slot).id;
  const options = slotOptions[phrase.slot].map(o => `
    <option value="${o.id}" ${o.id === current ? 'selected' : ''}>${o.name ?? o.es} · ${o.jp}</option>
  `).join('');
  return `
    <label class="slot-picker">
      <span>✎ Cambiar:</span>
      <select data-slot="${phrase.slot}">${options}</select>
    </label>
  `;
}

export function showView(phraseId) {
  const found = getPhrase(phraseId);
  if (!found) return `<p>Frase no encontrada. <a href="#/">Volver</a></p>`;
  const phrase = fillPhrase(found.phrase);
  const { category } = found;

  const specific = (phrase.replies ?? []).map(replyButton).join('');
  const common = commonReplies.map(replyButton).join('');

  // El botón de pantalla completa solo aparece si el navegador lo permite
  const fullscreenBtn = document.fullscreenEnabled
    ? `<button class="icon-btn" data-fullscreen aria-label="Pantalla completa">⛶</button>`
    : '';

  return `
    <div class="show-top">
      <button class="link-btn" data-back="#/frases/${category.id}">← Volver</button>
      <div class="show-tools">
        ${fullscreenBtn}
        <button class="speak-btn" data-speak="${phrase.jp}" aria-label="Escuchar">🔊</button>
      </div>
    </div>

    <p class="show-jp" lang="ja">${phrase.jp}</p>
    <p class="show-me">${phrase.romaji} · ${phrase.es}</p>
    ${slotPicker(phrase)}

    <!-- Panel con la respuesta elegida; oculto hasta que tocan una -->
    <div id="answer" class="answer" hidden>
      <div class="a-label">Te responde:</div>
      <div class="a-es"></div>
      <div class="a-jp" lang="ja"></div>
      <div class="a-next"></div>
    </div>

    <h2 class="replies-title" lang="ja">
      お返事をタップしてください
      <span lang="es">Que la otra persona toque su respuesta</span>
    </h2>
    <div class="replies">
      ${specific}
      ${specific ? '<hr class="replies-sep">' : ''}
      ${common}
    </div>
  `;
}

// La llama app.js al tocar una respuesta
export function showAnswer(reply) {
  document.querySelectorAll('.reply.selected').forEach(el => el.classList.remove('selected'));
  reply.classList.add('selected');

  const answer = document.getElementById('answer');
  // textContent (no innerHTML): inserta texto plano, nunca interpreta HTML
  answer.querySelector('.a-es').textContent = reply.querySelector('.r-es').textContent;
  answer.querySelector('.a-jp').textContent = reply.querySelector('.r-jp').textContent;

  // Conversación encadenada: enlaces a las frases con las que puedes contestar
  const nextIds = reply.dataset.next ? reply.dataset.next.split(',') : [];
  const links = nextIds
    .map(id => getPhrase(id))
    .filter(Boolean)
    .map(({ phrase }) => {
      const p = fillPhrase(phrase);
      return `<a class="followup" href="#/mostrar/${p.id}"><span lang="ja">${p.jp}</span><small>${p.es}</small></a>`;
    }).join('');
  answer.querySelector('.a-next').innerHTML = links
    ? `<div class="a-next-title">Puedes contestar:</div>${links}`
    : '';

  answer.hidden = false;
}
