# 日本語 de viaje — Nihonjin to shite

PWA para aprender japonés básico de cara a un viaje de turismo y para usarla **como herramienta de comunicación** durante el viaje. Pensada para el celular Android.

**👉 Abrir la app: https://raniker.github.io/Nihonjin-to-shite/**. En Android, ⋮ → *Instalar app*.

> Consulta [ROADMAP.md](ROADMAP.md) para ver lo hecho y las próximas ideas.

## Funciones

### Frases por categoría
Restaurante 🍜, Tren 🚄, Hotel 🏨, Tiendas 🛍️, Direcciones 🧭, Emergencias 🚨 y Responder 🙋: 76 frases, cada una con japonés, romaji y traducción al español.

Algunas frases tienen un **hueco que puedes cambiar**: "Un billete a ＿＿" (17 estaciones), "¿Dónde está ＿＿?" (farmacia, cajero, consigna…) y "Tengo alergia a ＿＿".

En el inicio hay un **buscador** que no distingue tildes ni mayúsculas.

### Audio en japonés
El botón 🔊 pronuncia la frase con la voz japonesa del sistema mediante la Web Speech API. No descarga ningún archivo de audio.

Si no suena en japonés, en Android ve a **Ajustes → Sistema → Idioma → Salida de texto a voz → Google → Instalar datos de voz → Japonés**.

### Modo "mostrar" con respuestas
Toca una frase para verla en grande y enseñársela a quien te atiende. Debajo aparecen **respuestas probables en japonés**: la otra persona toca la suya y tú ves la traducción al español en un panel destacado.
- Cada frase tiene sus respuestas propias, y siempre aparecen también las comunes (sí, no, espere un momento, es por allí…).
- **Conversación encadenada:** junto a la traducción aparece "Puedes contestar:" con tus posibles respuestas. Al tocar una, se muestra esa frase en grande con sus propias respuestas.
- Tiene un botón de pantalla completa (⛶) y la pantalla no se apaga mientras la enseñas.
- El botón Atrás de Android recorre la conversación hacia atrás.

### Ficha de emergencia 🆘
- Botones para llamar con un toque al **110** (policía), al **119** (ambulancia y bomberos) y a la **Japan Visitor Hotline** (24 h, en inglés).
- Tus datos en japonés, listos para enseñar: dirección del hotel con "lléveme a esta dirección", alergias, enfermedades, medicamentos y grupo sanguíneo.
- Se rellena desde **Mis datos**. Todo se guarda solo en el celular.

### Kana
Tablas de hiragana y katakana (básicos, con tenten/maru y combinados). Toca un carácter para escucharlo. Hay una opción para ocultar el romaji y practicar, y una sección de trucos de lectura con palabras útiles para el viaje.

### Números y precios
Números de referencia con kanji, kana y romaji; los irregulares van destacados. Incluye un **conversor de precios**: escribes `3500` y muestra 3,500円 → 三千五百円 → さんぜんごひゃくえん → *sanzen gohyaku en*, con audio. El botón 🎲 genera precios al azar para practicar.

### Quiz con repaso espaciado 🧠
Cuatro mazos: frases (en los dos sentidos), hiragana, katakana, y números y precios, con preguntas de "¿qué precio oyes?". Funciona con el **sistema Leitner**:
- Si aciertas, la tarjeta vuelve en 1, 2, 4, 8 y luego 16 días.
- Si fallas, se repite en la misma ronda.

Cada ronda junta las tarjetas pendientes con hasta 5 nuevas. El progreso se guarda en el celular.

### Favoritas ⭐
Marca las frases que más usas y aparecerán al principio de la pantalla de inicio. Se guardan en el celular (`localStorage`).

### Instalable y offline 📲
Es una PWA: se puede instalar en la pantalla de inicio y funciona **sin conexión**, porque un service worker guarda todos los archivos en el celular.

Para que el audio también funcione sin conexión, los datos de voz japonesa tienen que estar descargados (ver arriba).

## Ejecutar en local

Los módulos ES no funcionan abriendo `index.html` con doble clic. Hace falta un servidor:

```bash
python -m http.server 8000
```

- **En el PC:** http://localhost:8000
- **En el celular (mismo Wi-Fi):** `http://<IP-del-PC>:8000`. En Windows, el firewall tiene que permitir conexiones entrantes al puerto 8000 para el perfil de red que estés usando.

### Desarrollar con el service worker activo

El service worker sirve los archivos desde la caché, así que **tus cambios no aparecen al recargar** hasta que cambia la versión.
- **Al modificar cualquier archivo**, sube `VERSION` en [sw.js](sw.js). Con eso, la app muestra "Hay una versión nueva".
- **Al añadir un archivo**, agrégalo a `FILES` en `sw.js` y comprueba la lista con `node tools/check-sw.mjs`.
- **En Chrome de escritorio**, puedes activar DevTools → Application → Service workers → *Update on reload* para no depender de la versión mientras desarrollas.

El service worker solo funciona con **HTTPS o `localhost`**. Para probarlo en el celular contra `http://<IP-del-PC>:8000`, abre `chrome://flags/#unsafely-treat-insecure-origin-as-secure` en el Chrome del celular, añade esa URL, activa la opción y reinicia Chrome. Otra vía es GitHub Pages, que ya sirve por HTTPS.

## Seguridad y privacidad

- **Sin secretos en el repositorio.** La app no usa claves ni APIs. El hook `.githooks/pre-commit` cancela cualquier commit que contenga tokens, claves o archivos como `.env`, y `.gitignore` los excluye. Para activar el hook en un clon nuevo: `git config core.hooksPath .githooks`.
- **Content Security Policy:** el navegador solo ejecuta código servido desde el propio dominio de la app.
- **Tus datos no salen del celular.** "Mis datos" y el progreso viven en `localStorage`. No hay analíticas ni peticiones a terceros.
- **Recomendado en GitHub:** Settings → *Code security* → activar *Secret scanning* y *Push protection*. Son gratuitos en repositorios públicos.

Las reglas para agentes de IA que trabajen en el código están en [AGENTS.md](AGENTS.md).

## Tecnología

HTML, CSS y JavaScript puro con módulos ES. No usa frameworks ni paso de build: GitHub Pages sirve los archivos tal cual.

```
index.html             página única (SPA)
manifest.json          datos de la app instalada (nombre, iconos, colores)
sw.js                  service worker: caché offline
icons/                 iconos de la PWA
tools/                 scripts de desarrollo (iconos, comprobar sw.js)
js/pwa.js              registro del service worker, actualizaciones, botón instalar
css/styles.css         estilos, tema claro/oscuro automático
js/app.js              router por hash (#/...) y eventos globales
js/speech.js           síntesis de voz (Web Speech API)
js/storage.js          leer/guardar JSON en localStorage de forma segura
js/favorites.js        favoritas
js/srs.js              repaso espaciado (sistema Leitner)
js/profile.js          "Mis datos" (hotel, alergias, salud)
js/slots.js            frases con hueco: valor elegido y relleno del texto
js/search.js           buscador de frases
js/wakelock.js         mantener la pantalla encendida
js/data/slots.js       opciones de los huecos (estaciones, lugares, alérgenos)
js/data/medical.js     enfermedades y grupos sanguíneos en japonés
js/decks.js            mazos del quiz generados a partir de los datos
js/utils.js            utilidades (barajar)
js/numbers.js          conversión de números y precios a japonés
js/data/phrases.js     frases y respuestas (solo datos)
js/data/kana.js        tablas de hiragana y katakana
js/views/              una función por pantalla que devuelve HTML
```

### Añadir o editar frases
Solo hay que tocar [js/data/phrases.js](js/data/phrases.js). Cada frase tiene esta forma:

```js
{ id: 'res-04', jp: 'おすすめは何ですか？', romaji: 'osusume wa nan desu ka?', es: '¿Qué me recomienda?',
  replies: [ r('これがおすすめです', 'Le recomiendo esto') ] }
```

No cambies el `id` de una frase que ya existe: las favoritas y el quiz lo usan para guardar tu progreso.
