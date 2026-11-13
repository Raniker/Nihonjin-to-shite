// Datos de frases. Separados de la lógica para poder ampliarlos sin tocar código.
// Cada frase tiene un "id" estable: el quiz y las favoritas lo usan para guardar
// tu progreso, así que no lo cambies una vez publicado.
//
// "replies" son respuestas probables de la persona que te atiende.
// En el modo "mostrar" ella toca la que corresponda y tú lees la traducción.

// Pequeño atajo para no repetir { jp: ..., es: ... } cientos de veces
const r = (jp, es) => ({ jp, es });

// Respuestas que aparecen en TODAS las frases
export const commonReplies = [
  r('はい', 'Sí'),
  r('いいえ', 'No'),
  r('少々お待ちください', 'Espere un momento, por favor'),
  r('あちらです', 'Es por allí (te lo señalan)'),
  r('大丈夫です', 'Está bien / No hay problema'),
  r('わかりません', 'No lo sé / No entiendo'),
];

// Respuestas reutilizadas por varias frases de direcciones
const directionReplies = [
  r('まっすぐ行ってください', 'Siga todo recto'),
  r('右に曲がってください', 'Gire a la derecha'),
  r('左に曲がってください', 'Gire a la izquierda'),
  r('近いです', 'Está cerca'),
  r('歩いて5分くらいです', 'Unos 5 minutos caminando'),
  r('一緒に行きましょう', 'Le acompaño'),
];

const emergencyCareReplies = [
  r('救急車を呼びます', 'Voy a llamar a una ambulancia'),
  r('どこが痛いですか？', '¿Dónde le duele?'),
  r('座ってください', 'Siéntese, por favor'),
  r('ここで待ってください', 'Espere aquí'),
];

export const categories = [
  {
    id: 'restaurante',
    name: 'Restaurante',
    icon: '🍜',
    phrases: [
      { id: 'res-01', jp: 'すみません', romaji: 'sumimasen', es: 'Disculpe (para llamar al camarero)', replies: [
        r('はい、どうぞ', 'Sí, dígame'),
      ] },
      { id: 'res-02', jp: '二人です', romaji: 'futari desu', es: 'Somos dos', replies: [
        r('こちらへどうぞ', 'Por aquí, por favor'),
        r('満席です', 'Está lleno'),
        r('予約はありますか？', '¿Tienen reserva?'),
        r('カウンター席でもいいですか？', '¿Les parece bien en la barra?'),
        r('喫煙席と禁煙席、どちらがいいですか？', '¿Zona de fumadores o de no fumadores?'),
      ] },
      { id: 'res-03', jp: 'メニューをください', romaji: 'menyū o kudasai', es: 'El menú, por favor', replies: [
        r('英語のメニューがあります', 'Hay menú en inglés'),
        r('英語のメニューはありません', 'No hay menú en inglés'),
        r('あちらの券売機で食券を買ってください', 'Compre el ticket de comida en esa máquina'),
        r('タブレットで注文してください', 'Haga el pedido en la tablet'),
      ] },
      { id: 'res-04', jp: 'おすすめは何ですか？', romaji: 'osusume wa nan desu ka?', es: '¿Qué me recomienda?', replies: [
        r('これがおすすめです', 'Le recomiendo esto (te lo señalan)'),
        r('一番人気はこれです', 'Lo más popular es esto'),
        r('今日のおすすめはこちらです', 'La recomendación de hoy es esta'),
      ] },
      { id: 'res-05', jp: 'これをください', romaji: 'kore o kudasai', es: 'Esto, por favor', replies: [
        r('かしこまりました', 'Entendido'),
        r('売り切れです', 'Está agotado'),
        r('大盛りにしますか？', '¿Quiere ración grande?'),
        r('お飲み物はいかがですか？', '¿Quiere algo de beber?'),
        r('ご注文は以上でよろしいですか？', '¿Eso es todo?'),
      ] },
      { id: 'res-06', jp: '水をください', romaji: 'mizu o kudasai', es: 'Agua, por favor', replies: [
        r('かしこまりました', 'Entendido'),
        r('お水はセルフサービスです', 'El agua es autoservicio'),
      ] },
      { id: 'res-07', jp: 'えびアレルギーがあります', romaji: 'ebi arerugī ga arimasu', es: 'Soy alérgico/a a las gambas', replies: [
        r('これには入っています', 'Esto la contiene'),
        r('これには入っていません', 'Esto no la contiene'),
        r('確認します', 'Lo compruebo'),
        r('対応できません', 'No podemos adaptarlo'),
      ] },
      { id: 'res-08', jp: '美味しいです', romaji: 'oishii desu', es: 'Está delicioso', replies: [
        r('ありがとうございます', 'Gracias'),
      ] },
      { id: 'res-09', jp: 'お会計をお願いします', romaji: 'okaikei o onegai shimasu', es: 'La cuenta, por favor', replies: [
        r('レジでお願いします', 'Pague en la caja, por favor'),
        r('現金のみです', 'Solo efectivo'),
        r('カードも使えます', 'También se puede con tarjeta'),
        r('お会計はご一緒ですか？', '¿Pagan todo junto?'),
      ] },
      { id: 'res-10', jp: 'ごちそうさまでした', romaji: 'gochisōsama deshita', es: 'Gracias por la comida (al terminar)', replies: [
        r('ありがとうございました', 'Gracias a usted'),
        r('またお越しください', 'Vuelva pronto'),
      ] },
    ],
  },
  {
    id: 'tren',
    name: 'Tren',
    icon: '🚄',
    phrases: [
      { id: 'tre-01', jp: '切符はどこで買えますか？', romaji: 'kippu wa doko de kaemasu ka?', es: '¿Dónde puedo comprar billetes?', replies: [
        r('あちらの券売機で買えます', 'En esas máquinas expendedoras'),
        r('みどりの窓口で買えます', 'En la ventanilla "Midori no madoguchi"'),
        r('交通系ICカードが使えます', 'Puede usar una tarjeta IC (Suica, etc.)'),
      ] },
      { id: 'tre-02', jp: '京都まで一枚ください', romaji: 'Kyōto made ichimai kudasai', es: 'Un billete a Kioto, por favor', replies: [
        r('指定席ですか、自由席ですか？', '¿Asiento reservado o no reservado?'),
        r('片道ですか、往復ですか？', '¿Ida o ida y vuelta?'),
        r('窓側と通路側、どちらがいいですか？', '¿Ventanilla o pasillo?'),
        r('何時の電車ですか？', '¿Para el tren de qué hora?'),
        r('満席です', 'Está lleno'),
      ] },
      { id: 'tre-03', jp: 'この電車は東京に行きますか？', romaji: 'kono densha wa Tōkyō ni ikimasu ka?', es: '¿Este tren va a Tokio?', replies: [
        r('はい、行きます', 'Sí, va'),
        r('いいえ、行きません', 'No, no va'),
        r('次の電車です', 'Es el siguiente tren'),
        r('反対側のホームです', 'Es el andén de enfrente'),
        r('乗り換えが必要です', 'Necesita hacer transbordo'),
      ] },
      { id: 'tre-04', jp: '何番線ですか？', romaji: 'nanbansen desu ka?', es: '¿Qué andén es?', replies: [
        r('階段を上がってください', 'Suba las escaleras'),
        r('階段を下りてください', 'Baje las escaleras'),
        r('案内板を見てください', 'Mire el panel informativo'),
      ] },
      { id: 'tre-05', jp: '次の駅は何ですか？', romaji: 'tsugi no eki wa nan desu ka?', es: '¿Cuál es la próxima estación?', replies: [
        r('次で降りてください', 'Bájese en la próxima'),
        r('まだです', 'Todavía no'),
      ] },
      { id: 'tre-06', jp: '乗り換えはどこですか？', romaji: 'norikae wa doko desu ka?', es: '¿Dónde hago transbordo?', replies: [
        r('次の駅で乗り換えてください', 'Haga transbordo en la próxima estación'),
        r('乗り換えは必要ありません', 'No necesita hacer transbordo'),
      ] },
    ],
  },
  {
    id: 'hotel',
    name: 'Hotel',
    icon: '🏨',
    phrases: [
      { id: 'hot-01', jp: '予約しています', romaji: 'yoyaku shite imasu', es: 'Tengo una reserva', replies: [
        r('お名前をお願いします', 'Su nombre, por favor'),
        r('パスポートを見せてください', 'Muéstreme su pasaporte, por favor'),
        r('こちらにご記入ください', 'Rellene esto, por favor'),
        r('ご予約が見つかりません', 'No encuentro su reserva'),
      ] },
      { id: 'hot-02', jp: 'チェックインをお願いします', romaji: 'chekku-in o onegai shimasu', es: 'El check-in, por favor', replies: [
        r('パスポートを見せてください', 'Muéstreme su pasaporte, por favor'),
        r('チェックインは15時からです', 'El check-in es a partir de las 15:00'),
        r('お荷物をお預かりしましょうか？', '¿Le guardamos el equipaje?'),
      ] },
      { id: 'hot-03', jp: 'チェックアウトは何時ですか？', romaji: 'chekku-auto wa nanji desu ka?', es: '¿A qué hora es el check-out?', replies: [
        r('10時です', 'A las 10:00'),
        r('11時です', 'A las 11:00'),
        r('12時です', 'A las 12:00'),
      ] },
      { id: 'hot-04', jp: '朝食は何時からですか？', romaji: 'chōshoku wa nanji kara desu ka?', es: '¿Desde qué hora es el desayuno?', replies: [
        r('6時半からです', 'Desde las 6:30'),
        r('7時からです', 'Desde las 7:00'),
        r('会場は2階です', 'Es en la 2.ª planta'),
        r('朝食は付いていません', 'El desayuno no está incluido'),
      ] },
      { id: 'hot-05', jp: '荷物を預かってもらえますか？', romaji: 'nimotsu o azukatte moraemasu ka?', es: '¿Me pueden guardar el equipaje?', replies: [
        r('はい、お預かりします', 'Sí, se lo guardamos'),
        r('何時ごろ戻られますか？', '¿A qué hora volverá más o menos?'),
        r('コインロッカーをご利用ください', 'Use las taquillas de monedas'),
      ] },
      { id: 'hot-06', jp: 'Wi-Fiのパスワードは何ですか？', romaji: 'waifai no pasuwādo wa nan desu ka?', es: '¿Cuál es la contraseña del Wi-Fi?', replies: [
        r('こちらに書いてあります', 'Está escrita aquí'),
        r('パスワードは不要です', 'No hace falta contraseña'),
      ] },
    ],
  },
  {
    id: 'tiendas',
    name: 'Tiendas',
    icon: '🛍️',
    phrases: [
      { id: 'tie-01', jp: 'いくらですか？', romaji: 'ikura desu ka?', es: '¿Cuánto cuesta?', replies: [
        r('電卓でお見せします', 'Se lo muestro en la calculadora'),
        r('値段はここに書いてあります', 'El precio está escrito aquí'),
        r('税込みです', 'Impuestos incluidos'),
        r('税抜きです', 'Sin impuestos'),
      ] },
      { id: 'tie-02', jp: '見ているだけです', romaji: 'mite iru dake desu', es: 'Solo estoy mirando', replies: [
        r('ごゆっくりどうぞ', 'Tómese su tiempo'),
      ] },
      { id: 'tie-03', jp: '試着してもいいですか？', romaji: 'shichaku shite mo ii desu ka?', es: '¿Me lo puedo probar?', replies: [
        r('はい、どうぞ', 'Sí, adelante'),
        r('試着室はあちらです', 'El probador está allí'),
        r('試着はできません', 'No se puede probar'),
      ] },
      { id: 'tie-04', jp: 'カードで払えますか？', romaji: 'kādo de haraemasu ka?', es: '¿Puedo pagar con tarjeta?', replies: [
        r('はい、使えます', 'Sí, se puede'),
        r('現金のみです', 'Solo efectivo'),
        r('暗証番号を入力してください', 'Introduzca su PIN'),
        r('一括払いでよろしいですか？', '¿En un solo pago?'),
      ] },
      { id: 'tie-05', jp: '免税できますか？', romaji: 'menzei dekimasu ka?', es: '¿Puedo comprarlo libre de impuestos?', replies: [
        r('パスポートを見せてください', 'Muéstreme su pasaporte, por favor'),
        r('免税カウンターはあちらです', 'El mostrador tax-free está allí'),
        r('免税の対象外です', 'No es elegible para tax-free'),
      ] },
      { id: 'tie-06', jp: '袋はいりません', romaji: 'fukuro wa irimasen', es: 'No necesito bolsa', replies: [
        r('かしこまりました', 'Entendido'),
        r('レシートはいりますか？', '¿Quiere el recibo?'),
      ] },
    ],
  },
  {
    id: 'direcciones',
    name: 'Direcciones',
    icon: '🧭',
    phrases: [
      { id: 'dir-01', jp: '駅はどこですか？', romaji: 'eki wa doko desu ka?', es: '¿Dónde está la estación?', replies: directionReplies },
      { id: 'dir-02', jp: 'トイレはどこですか？', romaji: 'toire wa doko desu ka?', es: '¿Dónde está el baño?', replies: directionReplies },
      { id: 'dir-03', jp: '地図で教えてもらえますか？', romaji: 'chizu de oshiete moraemasu ka?', es: '¿Me lo puede mostrar en el mapa?', replies: [
        r('ここです', 'Es aquí (te lo señalan)'),
        r('今ここにいます', 'Usted está aquí'),
        ...directionReplies, // "..." copia los elementos del otro array
      ] },
      { id: 'dir-04', jp: '遠いですか？', romaji: 'tōi desu ka?', es: '¿Está lejos?', replies: [
        r('近いです', 'Está cerca'),
        r('遠いです', 'Está lejos'),
        r('歩いて5分くらいです', 'Unos 5 minutos caminando'),
        r('タクシーがいいです', 'Mejor vaya en taxi'),
        r('電車で行ってください', 'Vaya en tren'),
      ] },
      { id: 'dir-05', jp: '右', romaji: 'migi', es: 'Derecha' },
      { id: 'dir-06', jp: '左', romaji: 'hidari', es: 'Izquierda' },
      { id: 'dir-07', jp: 'まっすぐ', romaji: 'massugu', es: 'Todo recto' },
    ],
  },
  {
    id: 'emergencias',
    name: 'Emergencias',
    icon: '🚨',
    phrases: [
      { id: 'eme-01', jp: '助けて！', romaji: 'tasukete!', es: '¡Ayuda!', replies: [
        r('どうしましたか？', '¿Qué le pasa?'),
        r('大丈夫ですか？', '¿Está bien?'),
        r('警察を呼びます', 'Voy a llamar a la policía'),
        ...emergencyCareReplies,
      ] },
      { id: 'eme-02', jp: '警察を呼んでください', romaji: 'keisatsu o yonde kudasai', es: 'Llame a la policía, por favor', replies: [
        r('警察を呼びます', 'Voy a llamar a la policía'),
        r('交番はあちらです', 'El puesto de policía (kōban) está allí'),
        r('どうしましたか？', '¿Qué le pasa?'),
      ] },
      { id: 'eme-03', jp: '救急車を呼んでください', romaji: 'kyūkyūsha o yonde kudasai', es: 'Llame a una ambulancia, por favor', replies: emergencyCareReplies },
      { id: 'eme-04', jp: '病院はどこですか？', romaji: 'byōin wa doko desu ka?', es: '¿Dónde está el hospital?', replies: [
        r('近くにあります', 'Hay uno cerca'),
        r('タクシーで行ってください', 'Vaya en taxi'),
        r('救急車を呼びましょうか？', '¿Llamo a una ambulancia?'),
      ] },
      { id: 'eme-05', jp: '気分が悪いです', romaji: 'kibun ga warui desu', es: 'Me encuentro mal', replies: [
        r('救急車を呼びましょうか？', '¿Llamo a una ambulancia?'),
        r('薬を持っていますか？', '¿Tiene medicinas?'),
        ...emergencyCareReplies,
      ] },
      { id: 'eme-06', jp: '財布をなくしました', romaji: 'saifu o nakushimashita', es: 'He perdido la cartera', replies: [
        r('どこでなくしましたか？', '¿Dónde la perdió?'),
        r('交番に行ってください', 'Vaya al puesto de policía (kōban)'),
        r('一緒に探しましょう', 'Busquémosla juntos'),
      ] },
      { id: 'eme-07', jp: 'スペイン語を話せる人はいますか？', romaji: 'supein-go o hanaseru hito wa imasu ka?', es: '¿Hay alguien que hable español?', replies: [
        r('いません', 'No hay nadie'),
        r('英語なら話せます', 'Hablo inglés'),
        r('翻訳アプリを使いましょう', 'Usemos una app de traducción'),
      ] },
    ],
  },
];

export function getCategory(id) {
  return categories.find(c => c.id === id);
}

// Busca una frase por id en todas las categorías. Devuelve { phrase, category } o null.
export function getPhrase(id) {
  for (const category of categories) {
    const phrase = category.phrases.find(p => p.id === id);
    if (phrase) return { phrase, category };
  }
  return null;
}
