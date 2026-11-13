// Opciones para las frases con hueco.
// Una frase con hueco tiene "slot" (qué lista usa) y un marcador en el texto:
//   { jp: '{station}まで一枚ください', slot: 'station', ... }
// "es" es el texto que se inserta en la frase española; "name" (opcional)
// es la etiqueta para mostrar en listas cuando "es" no sirve sola.

export const stations = [
  { id: 'tokyo', jp: '東京', romaji: 'Tōkyō', es: 'Tokio' },
  { id: 'kyoto', jp: '京都', romaji: 'Kyōto', es: 'Kioto' },
  { id: 'osaka', jp: '大阪', romaji: 'Ōsaka', es: 'Osaka' },
  { id: 'shinjuku', jp: '新宿', romaji: 'Shinjuku', es: 'Shinjuku' },
  { id: 'shibuya', jp: '渋谷', romaji: 'Shibuya', es: 'Shibuya' },
  { id: 'ueno', jp: '上野', romaji: 'Ueno', es: 'Ueno' },
  { id: 'asakusa', jp: '浅草', romaji: 'Asakusa', es: 'Asakusa' },
  { id: 'shinagawa', jp: '品川', romaji: 'Shinagawa', es: 'Shinagawa' },
  { id: 'yokohama', jp: '横浜', romaji: 'Yokohama', es: 'Yokohama' },
  { id: 'nagoya', jp: '名古屋', romaji: 'Nagoya', es: 'Nagoya' },
  { id: 'nara', jp: '奈良', romaji: 'Nara', es: 'Nara' },
  { id: 'hiroshima', jp: '広島', romaji: 'Hiroshima', es: 'Hiroshima' },
  { id: 'kanazawa', jp: '金沢', romaji: 'Kanazawa', es: 'Kanazawa' },
  { id: 'nikko', jp: '日光', romaji: 'Nikkō', es: 'Nikkō' },
  { id: 'narita', jp: '成田空港', romaji: 'Narita kūkō', es: 'Narita (aeropuerto)' },
  { id: 'haneda', jp: '羽田空港', romaji: 'Haneda kūkō', es: 'Haneda (aeropuerto)' },
  { id: 'kansai', jp: '関西空港', romaji: 'Kansai kūkō', es: 'Kansai (aeropuerto)' },
];

export const places = [
  { id: 'hotel', jp: 'ホテル', romaji: 'hoteru', es: 'el hotel' },
  { id: 'subway', jp: '地下鉄の駅', romaji: 'chikatetsu no eki', es: 'la estación de metro' },
  { id: 'konbini', jp: 'コンビニ', romaji: 'konbini', es: 'la tienda 24 h (konbini)' },
  { id: 'atm', jp: 'ATM', romaji: 'ētīemu', es: 'el cajero automático' },
  { id: 'pharmacy', jp: '薬局', romaji: 'yakkyoku', es: 'la farmacia' },
  { id: 'koban', jp: '交番', romaji: 'kōban', es: 'el puesto de policía' },
  { id: 'bus', jp: 'バス停', romaji: 'basutei', es: 'la parada de autobús' },
  { id: 'taxi', jp: 'タクシー乗り場', romaji: 'takushī noriba', es: 'la parada de taxis' },
  { id: 'lockers', jp: 'コインロッカー', romaji: 'koin rokkā', es: 'la consigna (taquillas)' },
  { id: 'exchange', jp: '両替所', romaji: 'ryōgaejo', es: 'la casa de cambio' },
  { id: 'exit', jp: '出口', romaji: 'deguchi', es: 'la salida' },
  { id: 'elevator', jp: 'エレベーター', romaji: 'erebētā', es: 'el ascensor' },
];

// "es" incluye la preposición para que encaje en "Tengo alergia ___"
export const allergens = [
  { id: 'ebi', jp: 'えび', romaji: 'ebi', name: 'Gambas / camarones', es: 'a las gambas (camarones)' },
  { id: 'kani', jp: 'かに', romaji: 'kani', name: 'Cangrejo', es: 'al cangrejo' },
  { id: 'kai', jp: '貝', romaji: 'kai', name: 'Moluscos (almejas, ostras…)', es: 'a los moluscos' },
  { id: 'sakana', jp: '魚', romaji: 'sakana', name: 'Pescado', es: 'al pescado' },
  { id: 'tamago', jp: '卵', romaji: 'tamago', name: 'Huevo', es: 'al huevo' },
  { id: 'nyu', jp: '乳製品', romaji: 'nyūseihin', name: 'Lácteos', es: 'a los lácteos' },
  { id: 'komugi', jp: '小麦', romaji: 'komugi', name: 'Trigo (gluten)', es: 'al trigo' },
  { id: 'soba', jp: 'そば', romaji: 'soba', name: 'Soba (alforfón)', es: 'a la soba (alforfón)' },
  { id: 'peanut', jp: 'ピーナッツ', romaji: 'pīnattsu', name: 'Maní / cacahuete', es: 'al maní (cacahuete)' },
  { id: 'kurumi', jp: 'くるみ', romaji: 'kurumi', name: 'Nueces', es: 'a las nueces' },
  { id: 'goma', jp: 'ごま', romaji: 'goma', name: 'Sésamo', es: 'al sésamo' },
  { id: 'daizu', jp: '大豆', romaji: 'daizu', name: 'Soja', es: 'a la soja' },
];

// ---------- Contadores ----------
// En japonés los números llevan un "contador" según QUÉ cuentas:
//   personas → 人 (nin), objetos planos (entradas, billetes) → 枚 (mai),
//   cosas en general → つ (tsu, con números japoneses nativos).
// Y cada contador tiene sus irregularidades: 1 y 2 personas son "hitori" y "futari".
// "irregular" marca las lecturas que no siguen la regla (para destacarlas).

export const people = [
  { id: '1', jp: '一人', kana: 'ひとり', romaji: 'hitori', es: 'una persona', irregular: true },
  { id: '2', jp: '二人', kana: 'ふたり', romaji: 'futari', es: 'dos', irregular: true },
  { id: '3', jp: '三人', kana: 'さんにん', romaji: 'sannin', es: 'tres' },
  { id: '4', jp: '四人', kana: 'よにん', romaji: 'yonin', es: 'cuatro', irregular: true },
  { id: '5', jp: '五人', kana: 'ごにん', romaji: 'gonin', es: 'cinco' },
  { id: '6', jp: '六人', kana: 'ろくにん', romaji: 'rokunin', es: 'seis' },
];

export const tickets = [
  { id: '1', jp: '一枚', kana: 'いちまい', romaji: 'ichimai', es: '1 entrada' },
  { id: '2', jp: '二枚', kana: 'にまい', romaji: 'nimai', es: '2 entradas' },
  { id: '3', jp: '三枚', kana: 'さんまい', romaji: 'sanmai', es: '3 entradas' },
  { id: '4', jp: '四枚', kana: 'よんまい', romaji: 'yonmai', es: '4 entradas' },
  { id: '5', jp: '五枚', kana: 'ごまい', romaji: 'gomai', es: '5 entradas' },
];

export const things = [
  { id: '1', jp: '一つ', kana: 'ひとつ', romaji: 'hitotsu', es: 'uno', irregular: true },
  { id: '2', jp: '二つ', kana: 'ふたつ', romaji: 'futatsu', es: 'dos', irregular: true },
  { id: '3', jp: '三つ', kana: 'みっつ', romaji: 'mittsu', es: 'tres', irregular: true },
  { id: '4', jp: '四つ', kana: 'よっつ', romaji: 'yottsu', es: 'cuatro', irregular: true },
  { id: '5', jp: '五つ', kana: 'いつつ', romaji: 'itsutsu', es: 'cinco', irregular: true },
];

// Horas: las generamos con código en lugar de escribir 24 entradas a mano.
// Ojo a las irregulares: 4時 = yoji (no yonji), 7時 = shichiji, 9時 = kuji.
const HOUR_KANA = ['いち', 'に', 'さん', 'よ', 'ご', 'ろく', 'しち', 'はち', 'く', 'じゅう', 'じゅういち', 'じゅうに'];
const HOUR_ROMAJI = ['ichi', 'ni', 'san', 'yo', 'go', 'roku', 'shichi', 'hachi', 'ku', 'jū', 'jūichi', 'jūni'];
const IRREGULAR_HOURS = [4, 7, 9];

export const times = HOUR_KANA.flatMap((kana, i) => {
  const h = i + 1;
  const article = h === 1 ? 'la' : 'las'; // "la 1:00" pero "las 2:00"
  const irregular = IRREGULAR_HOURS.includes(h);
  return [
    { id: `${h}`, jp: `${h}時`, kana: `${kana}じ`, romaji: `${HOUR_ROMAJI[i]}ji`, es: `${article} ${h}:00`, irregular },
    // 半 (han) = "y media"
    { id: `${h}h`, jp: `${h}時半`, kana: `${kana}じはん`, romaji: `${HOUR_ROMAJI[i]}ji han`, es: `${article} ${h}:30`, irregular },
  ];
});

export const slotOptions = {
  station: stations, place: places, allergen: allergens,
  people, tickets, things, time: times,
};

// Valor inicial de cada hueco si no has elegido otro (si no está aquí, se usa el primero)
export const slotDefaults = { people: '2', tickets: '2', time: '7' };
