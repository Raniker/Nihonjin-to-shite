// Mazos del quiz: convierten los datos que ya tenemos (frases, kana, números)
// en tarjetas de pregunta. No duplicamos contenido: si añades una frase,
// aparece sola en el quiz.
//
// Forma de una tarjeta:
//   id           identificador estable (lo usa el SRS para guardar el progreso)
//   ask          instrucción: "¿Qué significa?"
//   question     texto de la pregunta ('' = pregunta solo de audio)
//   questionLang 'ja' o 'es'
//   audio        texto japonés a pronunciar (opcional)
//   autoplay     si suena al mostrar la pregunta
//   answer       respuesta correcta (texto de la opción)
//   answerLang   idioma de la respuesta
//   answerSub    línea pequeña bajo la opción (p. ej. romaji)
//   group        las opciones incorrectas salen de tarjetas del mismo grupo
//   explain      texto extra al mostrar la solución

import { categories, commonReplies } from './data/phrases.js';
import { kanaGroups } from './data/kana.js';
import { readNumber, readPrice } from './numbers.js';
import { fillPhrase } from './slots.js';

function phraseCards() {
  // fillPhrase: las frases con hueco salen con el valor elegido (p. ej. tu estación)
  return categories.flatMap(cat => cat.phrases.map(fillPhrase).flatMap(p => [
    // Japonés → español (comprender)
    {
      id: `fr:${p.id}:ja`, ask: '¿Qué significa?',
      question: p.jp, questionLang: 'ja', audio: p.jp, autoplay: true,
      answer: p.es, answerLang: 'es', group: 'fr-es', explain: p.romaji,
    },
    // Español → japonés (expresarse)
    {
      id: `fr:${p.id}:es`, ask: '¿Cómo se dice en japonés?',
      question: p.es, questionLang: 'es', audio: p.jp, autoplay: false,
      answer: p.jp, answerLang: 'ja', answerSub: p.romaji, group: 'fr-ja',
    },
  ]));
}

// Comprensión: entender lo que TE DICEN. Reutiliza todas las respuestas de las frases.
// Muchas se repiten (las de direcciones, "かしこまりました"...): un Map por texto
// japonés se queda con una sola de cada.
function replyCards() {
  const unique = new Map();
  const all = [...commonReplies, ...categories.flatMap(c => c.phrases.flatMap(p => p.replies ?? []))];
  for (const reply of all) {
    if (!unique.has(reply.jp)) unique.set(reply.jp, reply);
  }
  return [...unique.values()].map(reply => ({
    // El id es el propio texto: si algún día cambias la frase, cuenta como tarjeta nueva
    id: `resp:${reply.jp}`, ask: '¿Qué te están diciendo?',
    question: reply.jp, questionLang: 'ja', audio: reply.jp, autoplay: true,
    answer: reply.es, answerLang: 'es', group: 'reply-es',
  }));
}

function kanaCards(script) {
  return kanaGroups
    .flatMap(g => g.cells)
    .filter(Boolean) // quita los huecos (null)
    .map(c => ({
      // El id usa el carácter, no el romaji: じ y ぢ se leen ambos "ji"
      id: `kana:${c[script]}`, ask: '¿Cómo se lee?',
      question: c[script], questionLang: 'ja', audio: c[script], autoplay: false,
      answer: c.romaji, answerLang: 'es', group: 'kana',
    }));
}

const NUMBERS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 20, 40, 70, 90, 100, 300, 600, 800, 1000, 3000, 8000, 10000];
const PRICES = [150, 480, 980, 1500, 3500, 8800, 19800, 30000];

function numberCards() {
  const fmt = n => n.toLocaleString('es-ES');
  const numbers = NUMBERS.flatMap(n => {
    const r = readNumber(n);
    return [
      // Ver el número → elegir cómo se lee
      {
        id: `num:${n}:read`, ask: '¿Cómo se lee?',
        question: fmt(n), questionLang: 'es', audio: r.kana, autoplay: false,
        answer: r.kana, answerLang: 'ja', answerSub: r.romaji, group: 'num-read',
      },
      // Oír el número → elegir cuál es
      {
        id: `num:${n}:listen`, ask: '¿Qué número oyes?',
        question: '', audio: r.kana, autoplay: true,
        answer: fmt(n), answerLang: 'es', group: 'num-listen', explain: `${r.kana} · ${r.romaji}`,
      },
    ];
  });

  // Precios: lo más útil en el viaje es entender lo que te dicen en caja
  const prices = PRICES.map(n => {
    const p = readPrice(n);
    return {
      id: `precio:${n}`, ask: '¿Qué precio oyes?',
      question: '', audio: p.kana, autoplay: true,
      answer: p.digits, answerLang: 'es', group: 'price', explain: `${p.kana} · ${p.romaji}`,
    };
  });

  return [...numbers, ...prices];
}

export const decks = [
  { id: 'frases', name: 'Frases', icon: '💬', cards: phraseCards },
  { id: 'respuestas', name: 'Entender respuestas', icon: '👂', cards: replyCards },
  { id: 'hiragana', name: 'Hiragana', icon: 'あ', cards: () => kanaCards('hiragana') },
  { id: 'katakana', name: 'Katakana', icon: 'ア', cards: () => kanaCards('katakana') },
  { id: 'numeros', name: 'Números y precios', icon: '¥', cards: numberCards },
];

export function getDeck(id) {
  return decks.find(d => d.id === id);
}
