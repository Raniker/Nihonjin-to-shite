// Escenas: conversaciones completas para practicar de principio a fin.
//
// Cada paso es uno de estos:
//   { me: 'id-de-frase' }            tú dices una frase existente (con su audio, romaji…)
//   { me: { jp, romaji, es } }       tú dices algo que no está en las frases
//   { they: ['japonés', 'español'] } la otra persona te dice algo
//
// Reutilizar los ids de las frases hace que, si mejoras una frase, mejore también aquí.

export const scenes = [
  {
    id: 'restaurante',
    name: 'Cenar en un restaurante',
    icon: '🍜',
    steps: [
      { they: ['いらっしゃいませ！何名様ですか？', '¡Bienvenido! ¿Cuántas personas son?'] },
      { me: 'res-02' },
      { they: ['こちらへどうぞ', 'Por aquí, por favor'] },
      { me: 'res-03' },
      { they: ['英語のメニューがあります', 'Hay menú en inglés'] },
      { me: 'res-04' },
      { they: ['一番人気はこれです', 'Lo más popular es esto'] },
      { me: 'res-05' },
      { they: ['お飲み物はいかがですか？', '¿Quiere algo de beber?'] },
      { me: 'res-06' },
      { they: ['かしこまりました', 'Entendido'] },
      { me: 'res-09' },
      { they: ['レジでお願いします', 'Pague en la caja, por favor'] },
      { me: 'res-10' },
      { they: ['ありがとうございました', 'Gracias a usted'] },
    ],
  },
  {
    id: 'hotel',
    name: 'Llegar al hotel',
    icon: '🏨',
    steps: [
      { they: ['いらっしゃいませ', 'Bienvenido'] },
      { me: 'hot-01' },
      { they: ['お名前をお願いします', 'Su nombre, por favor'] },
      { me: { jp: '（名前）です', romaji: '(nombre) desu', es: 'Soy (tu apellido)' } },
      { they: ['パスポートを見せてください', 'Muéstreme su pasaporte, por favor'] },
      { me: { jp: 'はい、どうぞ', romaji: 'hai, dōzo', es: 'Sí, aquí tiene' } },
      { they: ['こちらにご記入ください', 'Rellene esto, por favor'] },
      { me: 'con-05' },
      { they: ['お部屋は5階です。朝食は7時からです', 'Su habitación está en la 5.ª planta. El desayuno es desde las 7:00'] },
      { me: 'hot-06' },
      { they: ['こちらに書いてあります', 'Está escrita aquí'] },
      { me: 'con-07' },
    ],
  },
  {
    id: 'tren',
    name: 'Comprar un billete de tren',
    icon: '🚄',
    steps: [
      { me: 'tre-02' },
      { they: ['指定席ですか、自由席ですか？', '¿Asiento reservado o no reservado?'] },
      { me: 'con-12' },
      { they: ['片道ですか、往復ですか？', '¿Ida o ida y vuelta?'] },
      { me: 'con-14' },
      { they: ['窓側と通路側、どちらがいいですか？', '¿Ventanilla o pasillo?'] },
      { me: 'con-10' },
      { they: ['13,320円です', 'Son 13.320 yenes'] },
      { me: 'con-16' },
      { they: ['8番線です', 'Es el andén 8'] },
      { me: 'con-07' },
    ],
  },
  {
    id: 'farmacia',
    name: 'Comprar medicina',
    icon: '💊',
    steps: [
      { me: 'far-01' },
      { they: ['症状を教えてください', 'Dígame qué síntomas tiene'] },
      { me: 'far-02' },
      { they: ['喉も痛いですか？', '¿También le duele la garganta?'] },
      { me: { jp: 'はい、少し', romaji: 'hai, sukoshi', es: 'Sí, un poco' } },
      { they: ['この薬がいいです', 'Le va bien esta medicina'] },
      { me: 'far-07' },
      { they: ['1日3回、食後に飲んでください', '3 veces al día, después de comer'] },
      { me: 'far-08' },
      { they: ['少し眠くなります', 'Da un poco de sueño'] },
      { me: 'con-09' },
      { they: ['1,200円です', 'Son 1.200 yenes'] },
      { me: 'con-07' },
    ],
  },
  {
    id: 'taxi',
    name: 'Tomar un taxi',
    icon: '🚕',
    steps: [
      { me: 'tax-01' },
      { they: ['わかりました。シートベルトをお願いします', 'Entendido. Abróchese el cinturón, por favor'] },
      { me: 'con-05' },
      { they: ['着きました', 'Hemos llegado'] },
      { me: 'tie-01' },
      { they: ['2,400円です', 'Son 2.400 yenes'] },
      { me: 'con-16' },
      { they: ['ありがとうございました', 'Gracias a usted'] },
      { me: 'con-07' },
    ],
  },
];

export function getScene(id) {
  return scenes.find(s => s.id === id);
}
