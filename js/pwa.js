// Registro del service worker, aviso de actualización y botón de instalar.

// ---------- Service worker ----------
//
// Ciclo de vida de una actualización:
//   1. Publicas cambios y subes VERSION en sw.js.
//   2. Al abrir la app, el navegador descarga el sw.js nuevo y lo instala…
//   3. …pero queda "en espera" (waiting): la versión vieja sigue al mando
//      para no mezclar archivos viejos y nuevos en mitad de una sesión.
//   4. Mostramos un aviso. Al pulsar "Actualizar", el nuevo toma el control
//      (skipWaiting) y recargamos la página.

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('./sw.js');

      // Caso: ya había una versión nueva esperando de una visita anterior
      if (registration.waiting && navigator.serviceWorker.controller) {
        showUpdateBanner(registration.waiting);
      }

      // Caso: se encuentra una versión nueva ahora mismo
      registration.addEventListener('updatefound', () => {
        const worker = registration.installing;
        worker.addEventListener('statechange', () => {
          // "controller" existe solo si ya había una versión antes:
          // en la primera instalación no hay nada que actualizar.
          if (worker.state === 'installed' && navigator.serviceWorker.controller) {
            showUpdateBanner(worker);
          }
        });
      });
    } catch (err) {
      console.warn('No se pudo registrar el service worker:', err);
    }
  });

  // Cuando el nuevo service worker toma el control, recargamos (solo si lo pidió el usuario)
  let updateRequested = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (updateRequested) location.reload();
  });

  function showUpdateBanner(worker) {
    const banner = document.createElement('div');
    banner.className = 'update-banner';
    banner.innerHTML = `
      <span>Hay una versión nueva</span>
      <button class="btn primary">Actualizar</button>
    `;
    banner.querySelector('button').addEventListener('click', () => {
      updateRequested = true;
      worker.postMessage('SKIP_WAITING');
    });
    document.body.append(banner);
  }
}

// ---------- Botón "Instalar" ----------
//
// Chrome dispara "beforeinstallprompt" cuando la app cumple los requisitos
// de instalación (manifest + service worker + HTTPS). Guardamos el evento
// y mostramos nuestro propio botón; al pulsarlo, lanzamos el diálogo nativo.

let installPrompt = null;
const installBtn = document.getElementById('install-btn');

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();      // evita el aviso automático de Chrome
  installPrompt = event;
  installBtn.hidden = false;
});

installBtn.addEventListener('click', async () => {
  if (!installPrompt) return;
  installPrompt.prompt();
  await installPrompt.userChoice; // esperamos a que acepte o cancele
  installPrompt = null;
  installBtn.hidden = true;
});

window.addEventListener('appinstalled', () => {
  installBtn.hidden = true;
});
