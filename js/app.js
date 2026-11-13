// Punto de entrada: router + listeners globales.

import { homeView, searchResults } from './views/home.js';
import { phrasesView } from './views/phrases.js';
import { showView, showAnswer } from './views/show.js';
import { kanaView } from './views/kana.js';
import { numbersView, priceOutput, randomPrice } from './views/numbers.js';
import { quizView, answerQuiz, nextQuiz, restartQuiz } from './views/quiz.js';
import { emergencyView } from './views/emergency.js';
import { profileView, saveProfileForm } from './views/profile.js';
import { speak } from './speech.js';
import { toggleFavorite, isFavorite } from './favorites.js';
import { setSlot } from './slots.js';
import { keepScreenOn } from './wakelock.js';

// Tabla de rutas: primer segmento del hash → función que genera la vista.
//   #/                     → homeView()
//   #/frases/restaurante   → phrasesView('restaurante')
//   #/mostrar/res-04       → showView('res-04')
//   #/kana/katakana        → kanaView('katakana')
//   #/numeros              → numbersView()
//   #/quiz/hiragana        → quizView('hiragana')
//   #/emergencia           → emergencyView()
//   #/mis-datos            → profileView()
const routes = {
  '': homeView,
  frases: phrasesView,
  mostrar: showView,
  kana: kanaView,
  numeros: numbersView,
  quiz: quizView,
  emergencia: emergencyView,
  'mis-datos': profileView,
};

// Vistas en las que la pantalla no debe apagarse
const KEEP_AWAKE = ['mostrar', 'emergencia'];

const app = document.getElementById('app');

// Cuántas navegaciones hicimos dentro de la app (para el botón "Volver")
let navCount = 0;

function render() {
  // "#/frases/tren" → ["frases", "tren"]
  const [route, ...params] = location.hash.replace(/^#\/?/, '').split('/');
  const view = routes[route] ?? homeView;
  const name = routes[route] ? route || 'inicio' : 'inicio';
  // El CSS usa este atributo, p. ej. para ocultar la barra en modo "mostrar"
  document.body.dataset.view = name;
  app.innerHTML = view(...params);
  keepScreenOn(KEEP_AWAKE.includes(name));
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

// ---------- Clics ----------
// Delegación de eventos: un solo listener para todos los botones,
// presentes y futuros, en lugar de uno por botón.
document.addEventListener('click', (e) => {
  const speakBtn = e.target.closest('[data-speak]');
  if (speakBtn) return speak(speakBtn.dataset.speak);

  const favBtn = e.target.closest('[data-fav]');
  if (favBtn) return toggleFav(favBtn.dataset.fav);

  const reply = e.target.closest('[data-reply]');
  if (reply) return showAnswer(reply);

  const option = e.target.closest('[data-quiz-answer]');
  if (option) return answerQuiz(Number(option.dataset.quizAnswer));
  if (e.target.closest('[data-quiz-next]')) return nextQuiz();
  if (e.target.closest('[data-quiz-restart]')) return restartQuiz();

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
    return;
  }

  if (e.target.closest('[data-random-price]')) {
    const input = document.querySelector('[data-price-input]');
    input.value = randomPrice();
    updatePrice(input);
  }
});

function toggleFav(id) {
  toggleFavorite(id);
  const search = document.querySelector('[data-search]');
  if (document.body.dataset.view === 'inicio' && !search?.value) {
    render(); // en el inicio, re-pintamos para actualizar la sección de favoritas
  } else {
    // En el resto (o con una búsqueda activa) solo cambiamos la estrella,
    // para no perder lo escrito ni la posición.
    const on = isFavorite(id);
    document.querySelectorAll(`[data-fav="${id}"]`).forEach(btn => {
      btn.classList.toggle('on', on);
      btn.setAttribute('aria-pressed', on);
    });
  }
}

// ---------- Escritura en campos ----------
// "input" se dispara con cada tecla (o al marcar una casilla)
document.addEventListener('input', (e) => {
  if (e.target.matches('[data-price-input]')) return updatePrice(e.target);
  if (e.target.matches('[data-search]')) {
    document.getElementById('search-results').innerHTML = searchResults(e.target.value);
    return;
  }
  const form = e.target.closest('#profile-form');
  if (form) saveProfileForm(form);
});

// "change" se dispara al elegir una opción de un <select>
document.addEventListener('change', (e) => {
  if (e.target.matches('[data-slot]')) {
    setSlot(e.target.dataset.slot, e.target.value);
    render(); // la frase cambia: re-pintamos la vista
  }
});

// Pulsar "Enter" en un campo envía el formulario y recargaría la página: lo evitamos
document.addEventListener('submit', (e) => e.preventDefault());

function updatePrice(input) {
  document.getElementById('price-out').innerHTML = priceOutput(input.value);
}
