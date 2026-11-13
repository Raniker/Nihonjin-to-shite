// Modo "mostrar": la frase en grande para enseñarla, y abajo las respuestas
// en japonés para que la otra persona toque la suya.

import { getPhrase, commonReplies } from '../data/phrases.js';

function replyButton(reply) {
  // La traducción va oculta dentro del botón; app.js la copia al panel al tocarlo.
  return `
    <button class="reply" data-reply>
      <span class="r-jp" lang="ja">${reply.jp}</span>
      <span class="r-es">${reply.es}</span>
    </button>
  `;
}

export function showView(phraseId) {
  const found = getPhrase(phraseId);
  if (!found) return `<p>Frase no encontrada. <a href="#/">Volver</a></p>`;
  const { phrase, category } = found;

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

    <!-- Panel con la respuesta elegida; oculto hasta que tocan una -->
    <div id="answer" class="answer" hidden>
      <div class="a-label">Te responde:</div>
      <div class="a-es"></div>
      <div class="a-jp" lang="ja"></div>
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
