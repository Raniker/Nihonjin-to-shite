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

## ⏳ Fase 4 — PWA instalable y offline
- [ ] `manifest.json` + iconos
- [ ] Service worker con caché de todos los archivos
- [ ] Probar la instalación en Android

## ⏳ Fase 5 — Publicación
- [ ] Desplegar en GitHub Pages (HTTPS, necesario para el service worker)

## 💡 Ideas pendientes
- [ ] **Frases con hueco**: 「＿＿まで一枚ください」 con lista de estaciones, 「＿＿アレルギーがあります」 con tus alergias
- [ ] **Ficha de emergencia**: 警察 110 · 救急 119, dirección del hotel en japonés, alergias y medicinas
- [ ] **Buscador** de frases
- [ ] **Mantener la pantalla encendida** en modo mostrar (Wake Lock API)
- [ ] Revisar las respuestas genéricas (horarios del hotel, alergias) con los datos reales del viaje

## 💡 Al final — Conversación encadenada
Después de la respuesta del japonés, sugerir cómo contestarle. Cada respuesta enlazaría a tus posibles frases siguientes, y así se formaría un árbol de conversación. Se deja para el final porque lo complejo es escribir y revisar todo ese contenido.
