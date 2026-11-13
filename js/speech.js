// Módulo de audio: envuelve la Web Speech API (speechSynthesis).
// El navegador usa las voces instaladas en el sistema; en Android vienen
// del motor "Google Text-to-speech".

let japaneseVoice = null;

function pickVoice() {
  const voices = speechSynthesis.getVoices();
  // Algunos Android reportan "ja_JP" en vez de "ja-JP", por eso normalizamos
  japaneseVoice =
    voices.find(v => v.lang.replace('_', '-') === 'ja-JP') ||
    voices.find(v => v.lang.toLowerCase().startsWith('ja')) ||
    null;
}

// Las voces se cargan de forma asíncrona: la primera llamada a getVoices()
// suele devolver [] y luego se dispara "voiceschanged".
if ('speechSynthesis' in window) {
  pickVoice();
  speechSynthesis.addEventListener('voiceschanged', pickVoice);
}

export function canSpeak() {
  return 'speechSynthesis' in window;
}

export function hasJapaneseVoice() {
  return japaneseVoice !== null;
}

export function speak(text, rate = 0.85) {
  if (!canSpeak()) return;
  speechSynthesis.cancel(); // corta lo que estuviera sonando
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ja-JP';            // aunque no haya voz elegida, indica el idioma
  if (japaneseVoice) utterance.voice = japaneseVoice;
  utterance.rate = rate;               // un poco más lento que lo normal para aprender
  speechSynthesis.speak(utterance);
}
