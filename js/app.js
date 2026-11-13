// Punto de entrada: router + listeners globales.

import { homeView } from './views/home.js';
import { phrasesView } from './views/phrases.js';
import { showView } from './views/show.js';
import { speak } from './speech.js';
import { toggleFavorite } from './favorites.js';

// Tabla de rutas: primer segmento del hash → función que genera la vista.
//   #/                     → homeView()
//   #/frases/restaurante   → phrasesView('restaurante')
//   #/mostrar/res-04       → showView('res-04')
const routes = {
  '': homeView,
  frases: phrasesView,
  mostrar: showView,
};

const app = document.getElementById('app');

// Cuántas navegaciones hicimos dentro de la app (para el botón "Volver")
let navCount = 0;

function render() {
  // "#/frases/tren" → ["frases", "tren"]
  const [route, ...params] = location.hash.replace(/^#\/?/, '').split('/');
  const view = routes[route] ?? homeView;
  // El CSS usa este atributo, p. ej. para ocultar la barra en modo "mostrar"
  document.body.dataset.view = route || 'inicio';
  app.innerHTML = view(...params);
}

// El navegador dispara "hashchange" cuando cambia la parte #... de la URL
// (al pulsar un enlace o el botón Atrás de Android). No recarga la página.
window.addEventListener('hashchange', () => {
  navCount++;
  render();
  window.scrollTo(0, 0);
  // Al salir del modo "mostrar", salimos también de pantalla completa
  if (document.fullscreenElement && document.body.dataset.view !== 'mostrar') {
    document.exitFullscreen();
  }
});
render(); // render inicial

// Delegación de eventos: un solo listener para todos los botones,
// presentes y futuros, en lugar de uno por botón.
document.addEventListener('click', (e) => {
  const speakBtn = e.target.closest('[data-speak]');
  if (speakBtn) return speak(speakBtn.dataset.speak);

  const favBtn = e.target.closest('[data-fav]');
  if (favBtn) {
    toggleFavorite(favBtn.dataset.fav);
    return render(); // re-pinta sin mover el scroll
  }

  const reply = e.target.closest('[data-reply]');
  if (reply) return showAnswer(reply);

  const backBtn = e.target.closest('[data-back]');
  if (backBtn) {
    // Si llegamos navegando, retrocedemos en el historial (como el botón Atrás).
    // Si se abrió directamente este enlace, no hay "atrás": vamos a la categoría.
    if (navCount > 0) history.back();
    else location.replace(backBtn.dataset.back);
    return;
  }

  if (e.target.closest('[data-fullscreen]')) {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen().catch(() => {});
  }
});

function showAnswer(reply) {
  document.querySelectorAll('.reply.selected').forEach(el => el.classList.remove('selected'));
  reply.classList.add('selected');

  const answer = document.getElementById('answer');
  // textContent (no innerHTML): inserta texto plano, nunca interpreta HTML
  answer.querySelector('.a-es').textContent = reply.querySelector('.r-es').textContent;
  answer.querySelector('.a-jp').textContent = reply.querySelector('.r-jp').textContent;
  answer.hidden = false;
}
