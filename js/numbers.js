// Conversión de números a japonés (kanji, kana y romaji).
// En vez de escribir a mano cada número, aplicamos las reglas del idioma.
//
// Reglas:
//  1. Se lee cifra por cifra con su "unidad": 3.500 = 3×千 + 5×百 → 三千五百
//  2. Un 1 delante de 十, 百 o 千 no se dice: 100 = 百 (no 一百)
//  3. Se agrupa de 4 en 4 cifras: 万 = 10.000 → 20.000 = 二万 (2 × 10.000)
//  4. Algunas combinaciones cambian de sonido (ver IRREGULAR)

// Índice = dígito → [kanji, kana, romaji]
const DIGITS = [
  null,
  ['一', 'いち', 'ichi'],
  ['二', 'に', 'ni'],
  ['三', 'さん', 'san'],
  ['四', 'よん', 'yon'],
  ['五', 'ご', 'go'],
  ['六', 'ろく', 'roku'],
  ['七', 'なな', 'nana'],
  ['八', 'はち', 'hachi'],
  ['九', 'きゅう', 'kyū'],
];

// Unidades dentro de un grupo de 4 cifras, de mayor a menor
const UNITS = [
  [1000, '千', 'せん', 'sen'],
  [100, '百', 'ひゃく', 'hyaku'],
  [10, '十', 'じゅう', 'jū'],
];

// "dígito-unidad" → [kana, romaji] cuando el sonido cambia
const IRREGULAR = {
  '3-100': ['さんびゃく', 'sanbyaku'],
  '6-100': ['ろっぴゃく', 'roppyaku'],
  '8-100': ['はっぴゃく', 'happyaku'],
  '3-1000': ['さんぜん', 'sanzen'],
  '8-1000': ['はっせん', 'hassen'],
};

// 1..9999 → lista de "palabras" { kanji, kana, romaji }
function belowTenThousand(n) {
  const words = [];

  for (const [value, kanji, kana, romaji] of UNITS) {
    const d = Math.floor(n / value) % 10; // la cifra en esa posición
    if (d === 0) continue;

    const irregular = IRREGULAR[`${d}-${value}`];
    if (d === 1) {
      words.push({ kanji, kana, romaji });                 // regla 2
    } else if (irregular) {
      words.push({ kanji: DIGITS[d][0] + kanji, kana: irregular[0], romaji: irregular[1] });
    } else {
      words.push({
        kanji: DIGITS[d][0] + kanji,
        kana: DIGITS[d][1] + kana,
        romaji: DIGITS[d][2] + romaji,
      });
    }
  }

  const units = n % 10;
  if (units) {
    const [kanji, kana, romaji] = DIGITS[units];
    words.push({ kanji, kana, romaji });
  }
  return words;
}

export const MAX_NUMBER = 99_999_999;

// 0..99.999.999 → { kanji, kana, romaji } (o null si está fuera de rango)
export function readNumber(n) {
  if (!Number.isInteger(n) || n < 0 || n > MAX_NUMBER) return null;
  if (n === 0) return { kanji: '零', kana: 'ゼロ', romaji: 'zero' };

  const man = Math.floor(n / 10_000); // cuántos "diez miles"
  const rest = n % 10_000;
  const words = [];

  if (man > 0) {
    // El grupo alto se lee igual que un número normal y se le pega 万 al final
    const high = belowTenThousand(man);
    const last = high.pop();
    high.push({ kanji: last.kanji + '万', kana: last.kana + 'まん', romaji: last.romaji + 'man' });
    words.push(...high);
  }
  words.push(...belowTenThousand(rest));

  return {
    kanji: words.map(w => w.kanji).join(''),
    kana: words.map(w => w.kana).join(''),
    romaji: words.map(w => w.romaji).join(' '),
  };
}

// Precio en yenes. Detalle: si termina en 4, se dice "yo" en vez de "yon": 4円 = よえん
export function readPrice(n) {
  const r = readNumber(n);
  if (!r) return null;

  let { kana, romaji } = r;
  if (n % 10 === 4) {
    kana = kana.replace(/よん$/, 'よ');
    romaji = romaji.replace(/yon$/, 'yo');
  }
  return {
    digits: n.toLocaleString('ja-JP') + '円',
    kanji: r.kanji + '円',
    kana: kana + 'えん',
    romaji: romaji + ' en',
  };
}
