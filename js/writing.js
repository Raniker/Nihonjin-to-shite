// Dibujo en <canvas> y puntuación de un kana escrito a mano.
//
// Los trazos se guardan en coordenadas NORMALIZADAS (de 0 a 1), no en píxeles:
// así podemos redibujarlos a cualquier tamaño (la pantalla, o un lienzo pequeño
// para comparar) sin perder nada.
//   strokes = [ [ {x, y}, {x, y}, ... ], [ ... ] ]   ← un array por trazo
//
// ¿Cómo se "corrige"? Comparando con el carácter dibujado por la fuente:
//   - ¿Tu tinta está cerca del carácter? (si no: garabatos o trazos de más)
//   - ¿Todo el carácter está cerca de tu tinta? (si no: te faltan partes)
// Se mide con distancias medias en píxeles. Es una aproximación: compara la
// FORMA, no el orden ni la dirección de los trazos (eso requeriría datos de
// trazos por carácter).

export const FONT = '"Noto Sans JP", "Yu Gothic", "Hiragino Sans", sans-serif';

// Dibuja un carácter centrado en un lienzo cuadrado de lado "size".
// Devuelve su caja (bounding box) en píxeles, la usamos para encajar tu dibujo.
export function drawGlyph(ctx, char, size, { color = '#000', outline = 0 } = {}) {
  ctx.font = `${Math.round(size * 0.8)}px ${FONT}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  // measureText nos dice cuánto sube y baja la letra: con eso la centramos en vertical
  const m = ctx.measureText(char);
  const x = size / 2;
  const y = size / 2 + (m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2;
  ctx.fillStyle = color;
  ctx.fillText(char, x, y);
  if (outline) {
    ctx.lineWidth = outline;
    ctx.lineJoin = 'round';
    ctx.strokeStyle = color;
    ctx.strokeText(char, x, y);
  }
  return {
    left: x - m.actualBoundingBoxLeft,
    right: x + m.actualBoundingBoxRight,
    top: y - m.actualBoundingBoxAscent,
    bottom: y + m.actualBoundingBoxDescent,
  };
}

// Dibuja los trazos escalados a "size" píxeles.
export function drawStrokes(ctx, strokes, size, lineWidth, color = '#000') {
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = 'round';   // extremos redondeados, como un rotulador
  ctx.lineJoin = 'round';
  for (const stroke of strokes) {
    if (stroke.length === 1) { // un toque sin mover el dedo: un punto
      ctx.beginPath();
      ctx.arc(stroke[0].x * size, stroke[0].y * size, lineWidth / 2, 0, Math.PI * 2);
      ctx.fill();
      continue;
    }
    ctx.beginPath();
    ctx.moveTo(stroke[0].x * size, stroke[0].y * size);
    for (const p of stroke.slice(1)) ctx.lineTo(p.x * size, p.y * size);
    ctx.stroke();
  }
}

// ---------- Puntuación ----------

const N = 100; // resolución de la comparación: 100×100 basta y es rápido

// Dibuja algo en un lienzo invisible y devuelve un array de 0/1 (píxel pintado o no)
function mask(draw) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = N;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  draw(ctx);
  const pixels = ctx.getImageData(0, 0, N, N).data; // RGBA: 4 números por píxel
  const result = new Uint8Array(N * N);
  for (let i = 0; i < N * N; i++) result[i] = pixels[i * 4 + 3] > 64 ? 1 : 0; // canal alfa
  return result;
}

// Transformada de distancia: para cada píxel, a qué distancia está el píxel
// pintado más cercano. Algoritmo "chamfer" de dos pasadas: una de arriba-izquierda
// a abajo-derecha y otra al revés, propagando distancias a los vecinos
// (1 en horizontal/vertical, √2 ≈ 1.41 en diagonal).
function distanceMap(m) {
  const d = new Float32Array(N * N);
  for (let i = 0; i < N * N; i++) d[i] = m[i] ? 0 : Infinity;
  const D = Math.SQRT2;
  const relax = (i, j, cost) => { if (d[j] + cost < d[i]) d[i] = d[j] + cost; };
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const i = y * N + x;
    if (x > 0) relax(i, i - 1, 1);
    if (y > 0) {
      relax(i, i - N, 1);
      if (x > 0) relax(i, i - N - 1, D);
      if (x < N - 1) relax(i, i - N + 1, D);
    }
  }
  for (let y = N - 1; y >= 0; y--) for (let x = N - 1; x >= 0; x--) {
    const i = y * N + x;
    if (x < N - 1) relax(i, i + 1, 1);
    if (y < N - 1) {
      relax(i, i + N, 1);
      if (x < N - 1) relax(i, i + N + 1, D);
      if (x > 0) relax(i, i + N - 1, D);
    }
  }
  return d;
}

// Distancia media desde los píxeles pintados de "from" hasta lo pintado en "to"
function meanDistance(from, toDistances) {
  let sum = 0, n = 0;
  for (let i = 0; i < N * N; i++) if (from[i]) { sum += toDistances[i]; n++; }
  return n ? sum / n : Infinity;
}

// Encaja tu dibujo en la caja del carácter modelo: si escribiste pequeño
// o en una esquina, se escala y se centra antes de comparar.
function fitStrokes(strokes, box) {
  const points = strokes.flat();
  const xs = points.map(p => p.x * N);
  const ys = points.map(p => p.y * N);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const w = maxX - minX, h = maxY - minY;
  const bw = box.right - box.left, bh = box.bottom - box.top;
  // Misma escala en los dos ejes (no deformamos el dibujo)
  const scale = Math.min(w > 1 ? bw / w : Infinity, h > 1 ? bh / h : Infinity);
  if (!Number.isFinite(scale)) return strokes; // un solo punto: nada que escalar
  const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2;
  const bx = (box.left + box.right) / 2, by = (box.top + box.bottom) / 2;
  return strokes.map(s => s.map(p => ({
    x: ((p.x * N - cx) * scale + bx) / N,
    y: ((p.y * N - cy) * scale + by) / N,
  })));
}

// Distancias medias (en píxeles de un lienzo de 100×100) entre tu dibujo y el modelo:
//   stray:  cuánto se aleja tu tinta del carácter (garabatos, trazos de más)
//   missed: cuánto se aleja el carácter de tu tinta (partes que faltan)
export function drawingDistances(strokes, char) {
  let box;
  const target = mask(ctx => { box = drawGlyph(ctx, char, N); });
  const user = mask(ctx => drawStrokes(ctx, fitStrokes(strokes, box), N, 4));
  return {
    stray: meanDistance(user, distanceMap(target)),
    missed: meanDistance(target, distanceMap(user)),
  };
}

// Calibración (distancias medidas en Chrome con dibujos simulados):
//   kana correcto con temblor y deformación normal → 0.6 a 1.9
//   garabato → ~3.1 · otro kana distinto → 3.6 o más
// Hasta PERFECT la nota es 100 %; a partir de ZERO_AT es 0 %; en medio, lineal.
const PERFECT = 0.6;
const ZERO_AT = 3.6;

// Devuelve una nota de 0 a 1
export function scoreDrawing(strokes, char) {
  if (!strokes.length) return 0;
  const { stray, missed } = drawingDistances(strokes, char);
  const worst = Math.max(stray, missed); // lo peor de los dos manda
  return Math.min(1, Math.max(0, 1 - (worst - PERFECT) / (ZERO_AT - PERFECT)));
}
