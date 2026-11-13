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

export const slotOptions = { station: stations, place: places, allergen: allergens };
