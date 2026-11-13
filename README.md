# 日本語 de viaje — Nihonjin to shite

PWA para aprender japonés básico de cara a un viaje de turismo y para usarla **como herramienta de comunicación** durante el viaje. Pensada para el celular Android.

> Estado: en desarrollo. Ver [ROADMAP.md](ROADMAP.md) para lo hecho, lo que está en curso y lo pendiente.

## Funciones

### Frases por categoría
Restaurante 🍜, Tren 🚄, Hotel 🏨, Tiendas 🛍️, Direcciones 🧭 y Emergencias 🚨: 42 frases, cada una con japonés, romaji y traducción al español.

### Audio en japonés
El botón 🔊 pronuncia la frase con la voz japonesa del sistema mediante la Web Speech API. No descarga ningún archivo de audio.

Si no suena en japonés, en Android ve a **Ajustes → Sistema → Idioma → Salida de texto a voz → Google → Instalar datos de voz → Japonés**.

### Modo "mostrar" con respuestas
Toca una frase para verla en grande y enseñársela a quien te atiende. Debajo aparecen **respuestas probables en japonés**: la otra persona toca la suya y tú ves la traducción al español en un panel destacado.
- Cada frase tiene sus respuestas propias, y siempre aparecen también las comunes (sí, no, espere un momento, es por allí…).
- Tiene un botón de pantalla completa (⛶).
- El botón Atrás de Android vuelve a la lista.

### Favoritas ⭐
Marca las frases que más usas y aparecerán al principio de la pantalla de inicio. Se guardan en el celular (`localStorage`).

## Ejecutar en local

Los módulos ES no funcionan abriendo `index.html` con doble clic. Hace falta un servidor:

```bash
python -m http.server 8000
```

- **En el PC:** http://localhost:8000
- **En el celular (mismo Wi-Fi):** `http://<IP-del-PC>:8000`. En Windows, el firewall tiene que permitir conexiones entrantes al puerto 8000 para el perfil de red que estés usando.

## Tecnología

HTML, CSS y JavaScript puro con módulos ES. No usa frameworks ni paso de build: GitHub Pages sirve los archivos tal cual.

```
index.html             página única (SPA)
css/styles.css         estilos, tema claro/oscuro automático
js/app.js              router por hash (#/...) y eventos globales
js/speech.js           síntesis de voz (Web Speech API)
js/favorites.js        favoritas en localStorage
js/data/phrases.js     frases y respuestas (solo datos)
js/views/              una función por pantalla que devuelve HTML
```

### Añadir o editar frases
Solo hay que tocar [js/data/phrases.js](js/data/phrases.js). Cada frase tiene esta forma:

```js
{ id: 'res-04', jp: 'おすすめは何ですか？', romaji: 'osusume wa nan desu ka?', es: '¿Qué me recomienda?',
  replies: [ r('これがおすすめです', 'Le recomiendo esto') ] }
```

No cambies el `id` de una frase que ya existe: las favoritas y el quiz lo usan para guardar tu progreso.
