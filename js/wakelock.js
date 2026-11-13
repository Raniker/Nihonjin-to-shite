// Mantener la pantalla encendida (Screen Wake Lock API).
// Útil en el modo "mostrar" y en la ficha de emergencia: la otra persona
// está leyendo y no queremos que la pantalla se apague a mitad.
//
// El navegador suelta el bloqueo solo cuando la app pasa a segundo plano,
// por eso lo volvemos a pedir al volver (visibilitychange).
// Solo funciona en HTTPS; en http://IP-local simplemente no hace nada.

let lock = null;
let wanted = false;

export async function keepScreenOn(on) {
  wanted = on;
  if (!('wakeLock' in navigator)) return;
  try {
    if (on && !lock) {
      lock = await navigator.wakeLock.request('screen');
      lock.addEventListener('release', () => { lock = null; });
    } else if (!on && lock) {
      await lock.release();
      lock = null;
    }
  } catch { /* p. ej. batería baja: el sistema puede negarlo */ }
}

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && wanted) keepScreenOn(true);
});
