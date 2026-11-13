// Service worker: un script que el navegador ejecuta aparte de la página
// y que se interpone entre la app y la red. Aquí lo usamos para guardar
// todos los archivos en una caché y servirlos sin conexión.
//
// ⚠️ IMPORTANTE: cada vez que cambies cualquier archivo de la app, sube VERSION.
// Así el navegador detecta un sw.js distinto, descarga todo de nuevo
// y borra la caché vieja.

const VERSION = 'v2';
const CACHE = `nihongo-${VERSION}`;

// Todos los archivos que necesita la app para funcionar offline.
// Las rutas son relativas a sw.js, así funciona igual en localhost y en GitHub Pages.
// Si añades un archivo nuevo, agrégalo aquí.
const FILES = [
  './',
  './index.html',
  './manifest.json',
  './css/styles.css',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './js/app.js',
  './js/pwa.js',
  './js/speech.js',
  './js/storage.js',
  './js/favorites.js',
  './js/srs.js',
  './js/decks.js',
  './js/utils.js',
  './js/numbers.js',
  './js/profile.js',
  './js/slots.js',
  './js/search.js',
  './js/wakelock.js',
  './js/data/phrases.js',
  './js/data/kana.js',
  './js/data/slots.js',
  './js/data/medical.js',
  './js/views/components.js',
  './js/views/home.js',
  './js/views/phrases.js',
  './js/views/show.js',
  './js/views/kana.js',
  './js/views/numbers.js',
  './js/views/quiz.js',
  './js/views/emergency.js',
  './js/views/profile.js',
];

// 1. INSTALL: se dispara cuando el navegador encuentra un sw.js nuevo.
//    Descargamos y guardamos todos los archivos. addAll es "todo o nada":
//    si falla uno, la instalación falla y se sigue usando la versión anterior.
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES)));
});

// 2. ACTIVATE: la versión nueva toma el control. Borramos las cachés viejas.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim()) // controlar ya las pestañas abiertas
  );
});

// 3. FETCH: cada petición de la app pasa por aquí.
//    Estrategia "cache first": si está en caché, se sirve desde ahí (instantáneo
//    y offline); si no, se pide a la red.
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  if (new URL(request.url).origin !== self.location.origin) return; // solo lo nuestro

  // Abrir la app (navegación) → siempre index.html, el router hace el resto
  if (request.mode === 'navigate') {
    event.respondWith(caches.match('./index.html').then(r => r || fetch(request)));
    return;
  }

  event.respondWith(caches.match(request).then(r => r || fetch(request)));
});

// La página nos pide activar la versión nueva (botón "Actualizar")
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
