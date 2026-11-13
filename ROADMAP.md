# Roadmap

Estado del proyecto por fases. Actualizado: 2026-11-12.

Leyenda: ✅ hecho · 🚧 en curso · ⏳ pendiente · 💡 idea para más adelante

## ✅ Fase 1 — Esqueleto, frases y audio
- [x] SPA con router por hash (`#/frases/tren`), compatible con GitHub Pages
- [x] 42 frases en 6 categorías (restaurante, tren, hotel, tiendas, direcciones, emergencias)
- [x] Japonés + romaji + español
- [x] Audio con Web Speech API, con aviso si no hay voz japonesa instalada
- [x] Diseño móvil, tema oscuro automático

## ✅ Fase 1.5 — Herramienta de viaje
- [x] Modo "mostrar": frase en grande para enseñarla
- [x] Respuestas tocables en japonés con su traducción (específicas por frase + comunes)
- [x] Pantalla completa
- [x] Favoritas guardadas en `localStorage`

## ✅ Fase 2 — Kana, números y precios
- [x] Tablas de hiragana y katakana con audio (básicos, tenten/maru, combinados)
- [x] Opción para ocultar el romaji y practicar
- [x] Trucos de lectura: ー, っ, ゃゅょ y は/を como partículas
- [x] Números del 0 al 99.999.999 generados por código, con irregulares (300, 600, 800, 3000, 8000)
- [x] Conversor de precios en yenes, con el caso especial 4円 → *yo en*

## ✅ Fase 3 — Quiz con repaso espaciado
- [x] 4 mazos generados desde los datos: frases (japonés↔español), hiragana, katakana, números y precios
- [x] Preguntas de opción múltiple, incluidas preguntas de solo audio (números y precios)
- [x] Sistema Leitner: cajas 0–5 con 1, 2, 4, 8 y 16 días; las falladas se repiten en la ronda
- [x] Rondas de hasta 10 tarjetas con un máximo de 5 nuevas; repaso anticipado si no hay pendientes
- [x] Progreso guardado en `localStorage`, con estadísticas por mazo

## ✅ Fase 4 — PWA instalable y offline
- [x] `manifest.json` + iconos (normal y maskable), generados con `tools/make-icons.py`
- [x] Service worker "cache first" con todos los archivos y versión para actualizar
- [x] Aviso de "Hay una versión nueva" y botón propio de instalar
- [x] `tools/check-sw.mjs` comprueba que la lista de archivos del service worker está completa
- [x] Instalada en Android (Samsung) y probada en modo avión

## ✅ Fase 5 — Publicación
- [x] Publicada en GitHub Pages desde la rama `master`: https://raniker.github.io/Nihonjin-to-shite/
- [x] Flujo: trabajar en `dev` → subir `VERSION` en `sw.js` → `node tools/check-sw.mjs` → fusionar en `master` → push

## ✅ Fase 6 — Herramientas de viaje
- [x] **Mis datos**: hotel, alergias, enfermedades, medicamentos, grupo sanguíneo y contactos (solo en el celular)
- [x] **Ficha de emergencia**: llamar al 110, 119 y a la Japan Visitor Hotline con un toque; tus datos en japonés para enseñar; "lléveme a esta dirección"
- [x] **Frases con hueco**: estación (17), lugar (12) y alergia (12), con selector en el modo mostrar
- [x] **Buscador** en el inicio, sin distinguir tildes ni mayúsculas, que también busca en las opciones de los huecos
- [x] **Pantalla siempre encendida** en el modo mostrar y en la ficha (Wake Lock API)
- [x] **Respuestas con datos reales**: la frase de alergia usa por defecto tu alergia de "Mis datos"

## ✅ Fase 7 — Conversación encadenada
- [x] Nueva categoría "Responder" con 33 frases cortas para contestar
- [x] 142 respuestas enlazan con "Puedes contestar:" → tocar una abre esa frase con sus propias respuestas, y así sigue la conversación
- [x] El botón Atrás recorre la conversación hacia atrás

## ✅ Fase 8 — Más contenido, comprensión y copia de seguridad
- [x] 4 categorías nuevas: Taxi 🚕, Farmacia 💊, Onsen ♨️ y Templos ⛩️ (27 frases con respuestas encadenadas)
- [x] Mazo "Entender respuestas" 👂: 163 respuestas japonesas generadas a partir de las frases
- [x] Copia de seguridad en Mis datos: exportar a `.json` e importar con validación del archivo
- [x] Corrección: los aeropuertos encajan en las frases ("A Narita (aeropuerto)")

## ✅ Fase 9 — Contadores, escritura y escenas
- [x] Frases con hueco de **personas, cosas, entradas y horas** ("Mesa para dos", "a las 7:30", "2 entradas")
- [x] Sección **Contadores** en Números (人, つ, 枚, 時) con las lecturas irregulares destacadas
- [x] **Escribir kana con el dedo**: canvas con Pointer Events, guía para calcar y corrección por distancia al modelo (calibrada en Chrome)
- [x] Controles y nota encima del lienzo (sin scroll); con menos del 60 % se ve el modelo 2,5 s y se borra para reintentar
- [x] "👁 Ver guía" es un vistazo de 2 s; la opción "Con guía" la muestra sola al empezar cada kana (se recuerda)
- [x] **Escenas guiadas** 🎭: 5 conversaciones completas (restaurante, hotel, tren, farmacia, taxi) para destapar línea a línea
- [x] Las vistas pueden definir `mount()` para preparar cosas tras pintarse

## 💡 Ideas para el futuro
- [ ] Orden de trazos al escribir kana (necesita datos de trazos, p. ej. KanjiVG)
- [ ] Más escenas (onsen, templo, tienda, objeto perdido)
- [ ] Modo examen de escenas: elegir tú la respuesta correcta en cada paso
