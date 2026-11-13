# AGENTS.md

Instrucciones para agentes de IA (Claude Code, Codex, Copilot, Cursor…) que trabajen en este repositorio.
Qué hace la app: [README.md](README.md). Estado y próximas ideas: [ROADMAP.md](ROADMAP.md).

## Cómo trabajar con el dueño del proyecto
- Está **aprendiendo**: explica en **español** cada parte mientras la construyes (qué hace, por qué así).
- Haz cambios por fases pequeñas y probables, y actualiza `ROADMAP.md` (y `README.md` si cambia una función).
- Commits solo cuando lo pida. Termina los mensajes de commit con la línea de co-autoría que use tu herramienta.

## Arquitectura (no cambiar sin hablarlo)
- HTML + CSS + **JavaScript puro con módulos ES**. Sin frameworks, sin npm, sin paso de build.
- **Rutas relativas** siempre (`./js/...`, `href="css/..."`): la app vive en `/Nihonjin-to-shite/` en GitHub Pages.
- Router por hash (`#/ruta/param`) en `js/app.js`. Cada vista es una función que devuelve un string HTML.
- Eventos por **delegación** en `app.js` con atributos `data-*`; no añadir listeners por elemento.
- Los datos (`js/data/`) van separados de la lógica. El quiz (`js/decks.js`) se genera a partir de ellos.

## Reglas que rompen cosas si se olvidan
1. **Cualquier cambio en archivos de la app → subir `VERSION` en `sw.js`.** Si no, los celulares siguen con la versión en caché.
2. **Archivo nuevo en `css/`, `js/` o `icons/` → añadirlo a `FILES` en `sw.js`.** Comprobar con `node tools/check-sw.mjs`.
3. **No cambiar los `id`** de frases (`res-01`…) ni el formato de ids de tarjetas: las favoritas y el progreso del quiz se guardan por id.
4. Las frases con hueco usan `{station}`, `{place}` o `{allergen}` en `jp`, `romaji` **y** `es`; mostrarlas siempre con `fillPhrase()`.
5. Las respuestas con `next` deben apuntar a ids que existan.

## Seguridad
- **Nunca subir credenciales**: tokens, claves de API, contraseñas, `.env`, claves privadas. El repositorio es **público** y el historial de git es permanente: borrar el secreto en un commit posterior no lo elimina.
- La app **no necesita ningún secreto**: es estática y no llama a APIs. Si alguna función lo pidiera, se replantea; no se incrusta la clave en el código.
- El hook `.githooks/pre-commit` ejecuta `tools/check-secrets.mjs` y `tools/check-sw.mjs`. **No usar `git commit --no-verify`** para saltárselo. Ante un falso positivo, añadir `secret-scan: ignore` en esa línea y explicarlo.
- **Texto escrito por el usuario → siempre por `escapeHtml()`** (`js/utils.js`) antes de meterlo en HTML. Para copiar texto a un elemento, preferir `textContent`.
- Mantener la **Content Security Policy** de `index.html`: nada de `<script>` inline, `onclick=""`, `eval` ni scripts/CDN externos. Todo se sirve desde el propio dominio.
- **Privacidad**: "Mis datos" (hotel, salud) y el progreso se guardan solo en `localStorage` del celular. No añadir analíticas, rastreadores ni peticiones a terceros, y no poner datos personales reales en el código ni en los commits.

## Comandos
```bash
python -m http.server 8000              # servidor local → http://localhost:8000
node tools/check-sw.mjs                 # lista de archivos del service worker
node tools/check-secrets.mjs --all      # buscar credenciales en todo el repo
python tools/make-icons.py              # regenerar iconos (Pillow + Yu Gothic)
git config core.hooksPath .githooks     # activar los hooks (una vez por clon)
```

## Publicar
Trabajar en la rama `dev`. Publicar = fusionar en `master` (GitHub Pages sirve `master` en la raíz):
```bash
git checkout master && git merge --ff-only dev && git push origin master dev && git checkout dev
```
Antes de publicar: `VERSION` subida en `sw.js` y los dos checks en verde.
