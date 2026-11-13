// Comprueba que la lista FILES de sw.js coincide con los archivos reales.
// Uso (desde la raíz del proyecto):  node tools/check-sw.mjs
//
// - Si falta un archivo en la lista, esa parte de la app no funcionará offline.
// - Si la lista tiene un archivo que no existe, la instalación del service worker
//   falla entera (cache.addAll es "todo o nada").

import { readFileSync, readdirSync } from 'node:fs';

const listed = [...readFileSync('sw.js', 'utf8').matchAll(/'\.\/([^']*)'/g)]
  .map(m => m[1])
  .filter(Boolean); // quita './' (la raíz)

const walk = dir => readdirSync(dir, { withFileTypes: true }).flatMap(e =>
  e.isDirectory() ? walk(`${dir}/${e.name}`) : [`${dir}/${e.name}`]);

const real = ['index.html', 'manifest.json', ...['css', 'js', 'icons'].flatMap(walk)];

const missing = real.filter(f => !listed.includes(f));
const extra = listed.filter(f => !real.includes(f));

if (missing.length) console.log('❌ Faltan en sw.js:', missing);
if (extra.length) console.log('❌ En sw.js pero no existen:', extra);
if (!missing.length && !extra.length) console.log(`✅ sw.js lista los ${listed.length + 1} archivos correctamente`);
process.exitCode = missing.length || extra.length ? 1 : 0;
