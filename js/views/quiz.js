// Quiz: #/quiz (elegir mazo) y #/quiz/<mazo> (ronda de preguntas).
//
// A diferencia de las otras vistas, el quiz tiene ESTADO: en qué pregunta vas,
// qué respondiste, cuántos aciertos llevas... Lo guardamos en la variable "session".
// Entrar en la ruta empieza una ronda nueva; responder o pasar de pregunta
// actualiza "session" y vuelve a pintar sin pasar por el router.

import { decks, getDeck } from '../decks.js';
import { buildSession, review, deckStats } from '../srs.js';
import { speak } from '../speech.js';
import { shuffle } from '../utils.js';

let session = null;

export function quizView(deckId) {
  if (!deckId) return quizHome();
  const deck = getDeck(deckId);
  if (!deck) return `<p>Mazo no encontrado. <a href="#/quiz">Volver</a></p>`;
  startSession(deck);
  return renderSession();
}

// ---------- Pantalla de mazos ----------

function quizHome() {
  const cards = decks.map(deck => {
    const s = deckStats(deck.cards().map(c => c.id));
    return `
      <a class="card" href="#/quiz/${deck.id}">
        <span class="icon">${deck.icon}</span>
        <span class="title">${deck.name}</span>
        <span class="sub">${s.due ? `<strong class="due">${s.due} para repasar</strong> · ` : ''}${s.fresh} nuevas</span>
        <span class="sub">${s.learned} / ${s.total} dominadas</span>
      </a>
    `;
  }).join('');

  return `
    <a class="back" href="#/">← Inicio</a>
    <h1>🧠 Quiz</h1>
    <div class="explain">
      Repaso espaciado: si aciertas, la tarjeta tarda más en volver (1, 2, 4, 8 y 16 días).
      Si fallas, se repite en la misma ronda. Cada ronda mezcla lo pendiente con hasta 5 tarjetas nuevas.
    </div>
    <h2 class="section-title">Elige un mazo</h2>
    <div class="grid">${cards}</div>
  `;
}

// ---------- Ronda ----------

function startSession(deck) {
  const cards = deck.cards();
  const { queue, early } = buildSession(cards.map(c => c.id));
  session = {
    deck,
    cards,
    byId: new Map(cards.map(c => [c.id, c])), // id → tarjeta, para buscar rápido
    queue: shuffle(queue),
    index: 0,
    answered: null, // { chosen, correct } tras responder
    right: 0,
    wrong: 0,
    early,
  };
  prepareCurrent();
}

// 3 respuestas incorrectas del mismo grupo + la correcta, barajadas
function pickOptions(card, cards) {
  const seen = new Set([card.answer]);
  const distractors = [];
  for (const c of shuffle(cards)) {
    if (c.group !== card.group || seen.has(c.answer)) continue; // sin repetidas
    seen.add(c.answer);
    distractors.push(c);
    if (distractors.length === 3) break;
  }
  return shuffle([card, ...distractors]);
}

function prepareCurrent() {
  const s = session;
  if (s.index >= s.queue.length) return;
  const card = s.byId.get(s.queue[s.index]);
  s.current = { card, options: pickOptions(card, s.cards) };
  if (card.autoplay) speak(card.audio);
}

function rerender() {
  document.getElementById('app').innerHTML = renderSession();
}

function renderSession() {
  const s = session;
  if (s.queue.length === 0) {
    return `<a class="back" href="#/quiz">← Mazos</a><p>Este mazo no tiene tarjetas.</p>`;
  }
  if (s.index >= s.queue.length) return renderSummary();

  const { card, options } = s.current;
  const answered = s.answered;
  const percent = Math.round((s.index / s.queue.length) * 100);

  const prompt = card.question
    ? `<p class="q-text" lang="${card.questionLang}">${card.question}</p>
       ${card.autoplay ? `<button class="speak-btn" data-speak="${card.audio}" aria-label="Escuchar">🔊</button>` : ''}`
    : `<button class="speak-btn big" data-speak="${card.audio}" aria-label="Escuchar otra vez">🔊</button>`;

  const optionsHtml = options.map((o, i) => {
    let cls = 'option';
    if (answered) {
      if (o.answer === card.answer) cls += ' correct';
      else if (i === answered.chosen) cls += ' wrong';
    }
    // disabled tras responder: impide contestar dos veces
    return `
      <button class="${cls}" data-quiz-answer="${i}" ${answered ? 'disabled' : ''}>
        <span lang="${o.answerLang}">${o.answer}</span>
        ${o.answerSub ? `<small>${o.answerSub}</small>` : ''}
      </button>
    `;
  }).join('');

  const feedback = answered ? `
    <div class="feedback ${answered.correct ? 'ok' : 'ko'}">
      <strong>${answered.correct ? '✅ ¡Correcto!' : `❌ Era: <span lang="${card.answerLang}">${card.answer}</span>`}</strong>
      ${card.explain ? `<div class="explain-line">${card.explain}</div>` : ''}
      ${answered.correct ? '' : '<div class="hint">Volverá a salir al final de esta ronda.</div>'}
      <button class="btn primary" data-quiz-next>Siguiente →</button>
    </div>
  ` : '';

  return `
    <a class="back" href="#/quiz">← Mazos</a>
    ${s.early ? '<div class="notice">No tienes nada pendiente: estás adelantando repasos.</div>' : ''}
    <div class="q-progress">
      <span>${s.index + 1} / ${s.queue.length}</span>
      <div class="bar"><div style="width: ${percent}%"></div></div>
    </div>
    <p class="q-ask">${card.ask}</p>
    <div class="q-prompt">${prompt}</div>
    <div class="options">${optionsHtml}</div>
    ${feedback}
  `;
}

function renderSummary() {
  const s = session;
  const total = s.right + s.wrong;
  return `
    <a class="back" href="#/quiz">← Mazos</a>
    <h1>¡Ronda terminada!</h1>
    <p class="summary-score">${s.right} / ${total}</p>
    <p class="hint" style="text-align:center">respuestas correctas (contando las repeticiones)</p>
    <div class="summary-actions">
      <button class="btn primary" data-quiz-restart>Otra ronda</button>
      <a class="btn" href="#/quiz">Elegir otro mazo</a>
    </div>
  `;
}

// ---------- Acciones (las llama app.js desde el listener de clics) ----------

export function answerQuiz(optionIndex) {
  const s = session;
  if (!s || s.answered) return;
  const { card, options } = s.current;

  // Comparamos el texto, no la tarjeta: じ y ぢ son tarjetas distintas con la misma respuesta "ji"
  const correct = options[optionIndex].answer === card.answer;
  review(card.id, correct);

  if (correct) s.right++;
  else {
    s.wrong++;
    s.queue.push(card.id); // la repetimos al final de la ronda
  }
  s.answered = { chosen: optionIndex, correct };

  // Si la pregunta no sonó al principio (p. ej. español → japonés), suena ahora
  if (card.audio && !card.autoplay) speak(card.audio);
  rerender();
}

export function nextQuiz() {
  if (!session) return;
  session.index++;
  session.answered = null;
  prepareCurrent();
  rerender();
  window.scrollTo(0, 0);
}

export function restartQuiz() {
  if (!session) return;
  startSession(session.deck);
  rerender();
}
