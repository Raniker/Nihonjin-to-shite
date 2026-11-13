// Tablas de hiragana y katakana.
// Cada fila se escribe como 3 strings separados por espacios (romaji, hiragana, katakana).
// "-" marca un hueco: la fila de "ya" solo tiene ya, yu, yo.

function group(title, cols, rows) {
  const cells = rows.flatMap(([romaji, hira, kata]) => {
    const r = romaji.split(' ');
    const h = hira.split(' ');
    const k = kata.split(' ');
    return r.map((ro, i) => (ro === '-' ? null : { romaji: ro, hiragana: h[i], katakana: k[i] }));
  });
  return { title, cols, cells };
}

export const kanaGroups = [
  group('Básicos', 5, [
    ['a i u e o', 'あ い う え お', 'ア イ ウ エ オ'],
    ['ka ki ku ke ko', 'か き く け こ', 'カ キ ク ケ コ'],
    ['sa shi su se so', 'さ し す せ そ', 'サ シ ス セ ソ'],
    ['ta chi tsu te to', 'た ち つ て と', 'タ チ ツ テ ト'],
    ['na ni nu ne no', 'な に ぬ ね の', 'ナ ニ ヌ ネ ノ'],
    ['ha hi fu he ho', 'は ひ ふ へ ほ', 'ハ ヒ フ ヘ ホ'],
    ['ma mi mu me mo', 'ま み む め も', 'マ ミ ム メ モ'],
    ['ya - yu - yo', 'や - ゆ - よ', 'ヤ - ユ - ヨ'],
    ['ra ri ru re ro', 'ら り る れ ろ', 'ラ リ ル レ ロ'],
    ['wa - - - wo', 'わ - - - を', 'ワ - - - ヲ'],
    ['n - - - -', 'ん - - - -', 'ン - - - -'],
  ]),
  group('Con tenten ゛ y maru ゜', 5, [
    ['ga gi gu ge go', 'が ぎ ぐ げ ご', 'ガ ギ グ ゲ ゴ'],
    ['za ji zu ze zo', 'ざ じ ず ぜ ぞ', 'ザ ジ ズ ゼ ゾ'],
    ['da ji zu de do', 'だ ぢ づ で ど', 'ダ ヂ ヅ デ ド'],
    ['ba bi bu be bo', 'ば び ぶ べ ぼ', 'バ ビ ブ ベ ボ'],
    ['pa pi pu pe po', 'ぱ ぴ ぷ ぺ ぽ', 'パ ピ プ ペ ポ'],
  ]),
  group('Combinados (ゃ ゅ ょ pequeñas)', 3, [
    ['kya kyu kyo', 'きゃ きゅ きょ', 'キャ キュ キョ'],
    ['sha shu sho', 'しゃ しゅ しょ', 'シャ シュ ショ'],
    ['cha chu cho', 'ちゃ ちゅ ちょ', 'チャ チュ チョ'],
    ['nya nyu nyo', 'にゃ にゅ にょ', 'ニャ ニュ ニョ'],
    ['hya hyu hyo', 'ひゃ ひゅ ひょ', 'ヒャ ヒュ ヒョ'],
    ['mya myu myo', 'みゃ みゅ みょ', 'ミャ ミュ ミョ'],
    ['rya ryu ryo', 'りゃ りゅ りょ', 'リャ リュ リョ'],
    ['gya gyu gyo', 'ぎゃ ぎゅ ぎょ', 'ギャ ギュ ギョ'],
    ['ja ju jo', 'じゃ じゅ じょ', 'ジャ ジュ ジョ'],
    ['bya byu byo', 'びゃ びゅ びょ', 'ビャ ビュ ビョ'],
    ['pya pyu pyo', 'ぴゃ ぴゅ ぴょ', 'ピャ ピュ ピョ'],
  ]),
];

// Trucos de lectura con palabras útiles para el viaje
export const kanaTips = [
  { rule: 'ー alarga la vocal anterior (sobre todo en katakana)', word: 'コーヒー', romaji: 'kōhī', es: 'café' },
  { rule: 'ー alarga la vocal anterior', word: 'ビール', romaji: 'bīru', es: 'cerveza' },
  { rule: 'っ / ッ pequeña duplica la consonante siguiente', word: 'きって', romaji: 'kitte', es: 'sello' },
  { rule: 'っ / ッ pequeña duplica la consonante siguiente', word: 'チケット', romaji: 'chiketto', es: 'entrada, ticket' },
  { rule: 'ゃ ゅ ょ pequeñas se funden con la sílaba anterior', word: 'とうきょう', romaji: 'tōkyō', es: 'Tokio' },
  { rule: 'は como partícula se lee "wa"; を se lee "o"', word: 'トイレはどこ', romaji: 'toire wa doko', es: '¿dónde está el baño?' },
];
