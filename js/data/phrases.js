// Datos de frases. Separados de la lógica para poder ampliarlos sin tocar código.
// Cada frase tiene un "id" estable: el quiz y las favoritas lo usan para guardar
// tu progreso, así que no lo cambies una vez publicado.
//
// Campos de una frase:
//   jp, romaji, es  el texto (puede llevar un hueco como {station}, ver "slot")
//   slot            (opcional) qué lista rellena el hueco: station, place o allergen
//   replies         respuestas probables de la persona que te atiende.
//                   En el modo "mostrar" ella toca una y tú lees la traducción.
//
// Cada respuesta puede tener "next": ids de frases con las que TÚ puedes contestar.
// Así se encadena la conversación: frase → respuesta → tu frase → respuesta…

// Atajo: r(japonés, español, [ids para contestar])
const r = (jp, es, next = []) => ({ jp, es, next });

// Respuestas que aparecen en TODAS las frases
export const commonReplies = [
  r('はい', 'Sí'),
  r('いいえ', 'No'),
  r('少々お待ちください', 'Espere un momento, por favor', ['con-20']),
  r('あちらです', 'Es por allí (te lo señalan)', ['con-07']),
  r('大丈夫です', 'Está bien / No hay problema', ['con-07']),
  r('わかりません', 'No lo sé / No entiendo', ['con-08']),
];

// Respuestas reutilizadas por varias frases de direcciones
const directionReplies = [
  r('まっすぐ行ってください', 'Siga todo recto', ['con-07']),
  r('右に曲がってください', 'Gire a la derecha', ['con-07']),
  r('左に曲がってください', 'Gire a la izquierda', ['con-07']),
  r('近いです', 'Está cerca', ['con-07']),
  r('歩いて5分くらいです', 'Unos 5 minutos caminando', ['con-07']),
  r('遠いです', 'Está lejos', ['con-26']),
  r('一緒に行きましょう', 'Le acompaño', ['con-07']),
];

// "¿Tiene X?" en la farmacia
const pharmacyReplies = [
  r('こちらです', 'Aquí lo tiene', ['con-09', 'far-07']),
  r('症状を教えてください', 'Dígame qué síntomas tiene', ['far-02', 'far-03', 'con-23', 'con-24']),
  r('ありません', 'No tenemos', ['con-07']),
  r('処方箋が必要です', 'Necesita receta médica', ['eme-04']),
];

const emergencyCareReplies = [
  r('救急車を呼びます', 'Voy a llamar a una ambulancia', ['con-07']),
  r('どこが痛いですか？', '¿Dónde le duele?', ['con-23', 'con-24', 'con-30']),
  r('座ってください', 'Siéntese, por favor'),
  r('ここで待ってください', 'Espere aquí', ['con-05']),
];

export const categories = [
  {
    id: 'aeropuerto',
    name: 'Aeropuerto',
    icon: '✈️',
    phrases: [
      // --- Al llegar: inmigración y aduana ---
      { id: 'aer-05', jp: '観光です', romaji: 'kankō desu', es: 'Vengo por turismo', replies: [
        r('何日滞在しますか？', '¿Cuántos días se queda?', ['aer-06']),
        r('どこに泊まりますか？', '¿Dónde se aloja?', ['aer-07']),
        r('帰りの航空券はありますか？', '¿Tiene billete de vuelta?', ['con-01', 'con-33']),
      ] },
      { id: 'aer-06', slot: 'days', jp: '{days}です', romaji: '{days} desu', es: 'Me quedo {days}', replies: [
        r('どこに泊まりますか？', '¿Dónde se aloja?', ['aer-07']),
        r('指紋と顔写真を撮ります', 'Le tomamos las huellas y una foto', ['con-05']),
      ] },
      { id: 'aer-07', jp: 'ホテルに泊まります', romaji: 'hoteru ni tomarimasu', es: 'Me alojo en un hotel', replies: [
        r('ホテルの名前は何ですか？', '¿Cómo se llama el hotel?', ['con-08']),
        r('こちらに書いてください', 'Escríbalo aquí, por favor', ['con-05']),
      ] },
      { id: 'aer-08', jp: '申告するものはありません', romaji: 'shinkoku suru mono wa arimasen', es: 'No tengo nada que declarar', replies: [
        r('どうぞ', 'Adelante', ['con-07']),
        r('スーツケースを開けてください', 'Abra la maleta, por favor', ['con-05']),
      ] },
      { id: 'aer-09', jp: '荷物が出てきません', romaji: 'nimotsu ga dete kimasen', es: 'Mi equipaje no ha salido', replies: [
        r('手荷物引換証を見せてください', 'Muéstreme el resguardo del equipaje', ['con-05']),
        r('あちらのカウンターへどうぞ', 'Vaya a ese mostrador, por favor', ['con-07']),
        r('ホテルに届けます', 'Se lo enviaremos al hotel', ['con-07']),
      ] },
      { id: 'aer-10', jp: '市内へはどう行けばいいですか？', romaji: 'shinai e wa dō ikeba ii desu ka?', es: '¿Cómo voy al centro de la ciudad?', replies: [
        r('電車が一番速いです', 'El tren es lo más rápido', ['tre-01']),
        r('リムジンバスがあります', 'Hay autobús al centro (limousine bus)', ['dir-08']),
        r('タクシーは高いです', 'El taxi es caro', ['con-05']),
      ] },
      { id: 'aer-11', jp: 'SIMカードはどこで買えますか？', romaji: 'shimu kādo wa doko de kaemasu ka?', es: '¿Dónde puedo comprar una tarjeta SIM?', replies: [
        r('あちらのカウンターです', 'En ese mostrador', ['con-07']),
        r('自動販売機があります', 'Hay una máquina expendedora', ['con-07']),
      ] },
      { id: 'aer-12', jp: 'ポケットWi-Fiを予約しています', romaji: 'poketto waifai o yoyaku shite imasu', es: 'Tengo reservado un pocket Wi-Fi', replies: [
        r('お名前をお願いします', 'Su nombre, por favor', ['con-08']),
        r('パスポートを見せてください', 'Muéstreme su pasaporte, por favor', ['con-05']),
      ] },
      // --- Al salir: facturar y embarcar ---
      { id: 'aer-01', jp: 'チェックインカウンターはどこですか？', romaji: 'chekku-in kauntā wa doko desu ka?', es: '¿Dónde está el mostrador de facturación?', replies: directionReplies },
      { id: 'aer-02', jp: '荷物を預けたいです', romaji: 'nimotsu o azuketai desu', es: 'Quiero facturar el equipaje', replies: [
        r('パスポートをお願いします', 'Su pasaporte, por favor', ['con-05']),
        r('お荷物は何個ですか？', '¿Cuántas maletas tiene?', ['con-08']),
        r('重量オーバーです', 'Tiene exceso de peso', ['tie-01']),
        r('窓側と通路側、どちらがいいですか？', '¿Ventanilla o pasillo?', ['con-10', 'con-11']),
      ] },
      { id: 'aer-03', jp: '搭乗口はどこですか？', romaji: 'tōjōguchi wa doko desu ka?', es: '¿Dónde está la puerta de embarque?', replies: directionReplies },
      { id: 'aer-04', jp: 'この便は遅れていますか？', romaji: 'kono bin wa okurete imasu ka?', es: '¿Este vuelo va con retraso?', replies: [
        r('定刻です', 'Sale a su hora', ['con-07']),
        r('30分遅れています', 'Va con 30 minutos de retraso', ['con-05']),
        r('欠航です', 'Está cancelado', ['aer-13']),
      ] },
      { id: 'aer-13', jp: '次の便に変更できますか？', romaji: 'tsugi no bin ni henkō dekimasu ka?', es: '¿Puedo cambiar al siguiente vuelo?', replies: [
        r('空席があります', 'Hay plazas libres', ['con-01']),
        r('満席です', 'Está lleno', ['con-05']),
        r('あちらのカウンターでお願いします', 'Hágalo en ese mostrador, por favor', ['con-07']),
      ] },
    ],
  },
  {
    id: 'restaurante',
    name: 'Restaurante',
    icon: '🍜',
    phrases: [
      { id: 'res-01', jp: 'すみません', romaji: 'sumimasen', es: 'Disculpe (para llamar al camarero)', replies: [
        r('はい、どうぞ', 'Sí, dígame', ['res-03', 'res-05', 'res-06', 'res-09']),
      ] },
      { id: 'res-02', slot: 'people', jp: '{people}です', romaji: '{people} desu', es: 'Mesa para {people}', replies: [
        r('こちらへどうぞ', 'Por aquí, por favor'),
        r('満席です', 'Está lleno', ['con-20', 'con-21']),
        r('予約はありますか？', '¿Tienen reserva?', ['con-19']),
        r('カウンター席でもいいですか？', '¿Les parece bien en la barra?', ['con-01', 'con-02']),
        r('喫煙席と禁煙席、どちらがいいですか？', '¿Zona de fumadores o de no fumadores?', ['con-29']),
      ] },
      { id: 'res-03', jp: 'メニューをください', romaji: 'menyū o kudasai', es: 'El menú, por favor', replies: [
        r('英語のメニューがあります', 'Hay menú en inglés', ['con-01']),
        r('英語のメニューはありません', 'No hay menú en inglés', ['res-04']),
        r('あちらの券売機で食券を買ってください', 'Compre el ticket de comida en esa máquina', ['con-22']),
        r('タブレットで注文してください', 'Haga el pedido en la tablet', ['con-05']),
      ] },
      { id: 'res-04', jp: 'おすすめは何ですか？', romaji: 'osusume wa nan desu ka?', es: '¿Qué me recomienda?', replies: [
        r('これがおすすめです', 'Le recomiendo esto (te lo señalan)', ['res-05']),
        r('一番人気はこれです', 'Lo más popular es esto', ['res-05']),
        r('今日のおすすめはこちらです', 'La recomendación de hoy es esta', ['res-05']),
      ] },
      { id: 'res-05', jp: 'これをください', romaji: 'kore o kudasai', es: 'Esto, por favor', replies: [
        r('かしこまりました', 'Entendido'),
        r('売り切れです', 'Está agotado', ['res-04']),
        r('大盛りにしますか？', '¿Quiere ración grande?', ['con-01', 'con-25']),
        r('お飲み物はいかがですか？', '¿Quiere algo de beber?', ['res-06', 'con-02']),
        r('ご注文は以上でよろしいですか？', '¿Eso es todo?', ['con-05']),
      ] },
      { id: 'res-11', slot: 'things', jp: 'これを{things}ください', romaji: 'kore o {things} kudasai', es: 'Deme {things} de esto, por favor', replies: [
        r('かしこまりました', 'Entendido'),
        r('売り切れです', 'Está agotado', ['res-04']),
        r('お飲み物はいかがですか？', '¿Quiere algo de beber?', ['res-06', 'con-02']),
      ] },
      { id: 'res-12', slot: 'time', jp: '{time}に予約できますか？', romaji: '{time} ni yoyaku dekimasu ka?', es: '¿Puedo reservar para {time}?', replies: [
        r('はい、何名様ですか？', 'Sí, ¿cuántas personas?', ['res-02']),
        r('その時間は満席です', 'A esa hora está lleno', ['con-21']),
        r('お名前をお願いします', 'Su nombre, por favor', ['con-08']),
      ] },
      { id: 'res-06', jp: '水をください', romaji: 'mizu o kudasai', es: 'Agua, por favor', replies: [
        r('かしこまりました', 'Entendido'),
        r('お水はセルフサービスです', 'El agua es autoservicio', ['con-07']),
      ] },
      { id: 'res-07', slot: 'allergen', jp: '{allergen}アレルギーがあります', romaji: '{allergen} arerugī ga arimasu', es: 'Tengo alergia {allergen}', replies: [
        r('これには入っています', 'Esto la contiene', ['res-04']),
        r('これには入っていません', 'Esto no la contiene', ['res-05']),
        r('確認します', 'Lo compruebo', ['con-20']),
        r('対応できません', 'No podemos adaptarlo', ['con-07']),
      ] },
      { id: 'res-08', jp: '美味しいです', romaji: 'oishii desu', es: 'Está delicioso', replies: [
        r('ありがとうございます', 'Gracias'),
      ] },
      { id: 'res-09', jp: 'お会計をお願いします', romaji: 'okaikei o onegai shimasu', es: 'La cuenta, por favor', replies: [
        r('レジでお願いします', 'Pague en la caja, por favor', ['con-05']),
        r('現金のみです', 'Solo efectivo', ['con-17']),
        r('カードも使えます', 'También se puede con tarjeta', ['con-16', 'con-17']),
        r('お会計はご一緒ですか？', '¿Pagan todo junto?', ['con-28', 'con-27']),
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
        r('あちらの券売機で買えます', 'En esas máquinas expendedoras', ['con-22']),
        r('みどりの窓口で買えます', 'En la ventanilla "Midori no madoguchi"', ['tre-02']),
        r('交通系ICカードが使えます', 'Puede usar una tarjeta IC (Suica, etc.)', ['con-05']),
      ] },
      { id: 'tre-02', slot: 'station', jp: '{station}まで一枚ください', romaji: '{station} made ichimai kudasai', es: 'Un billete a {station}, por favor', replies: [
        r('指定席ですか、自由席ですか？', '¿Asiento reservado o no reservado?', ['con-12', 'con-13']),
        r('片道ですか、往復ですか？', '¿Ida o ida y vuelta?', ['con-14', 'con-15']),
        r('窓側と通路側、どちらがいいですか？', '¿Ventanilla o pasillo?', ['con-10', 'con-11']),
        r('何時の電車ですか？', '¿Para el tren de qué hora?', ['con-31', 'con-08']),
        r('満席です', 'Está lleno', ['con-13', 'con-32']),
      ] },
      { id: 'tre-03', slot: 'station', jp: 'この電車は{station}に行きますか？', romaji: 'kono densha wa {station} ni ikimasu ka?', es: '¿Este tren va a {station}?', replies: [
        r('はい、行きます', 'Sí, va', ['con-07']),
        r('いいえ、行きません', 'No, no va', ['tre-04']),
        r('次の電車です', 'Es el siguiente tren', ['con-07']),
        r('反対側のホームです', 'Es el andén de enfrente', ['con-07']),
        r('乗り換えが必要です', 'Necesita hacer transbordo', ['tre-06']),
      ] },
      { id: 'tre-04', jp: '何番線ですか？', romaji: 'nanbansen desu ka?', es: '¿Qué andén es?', replies: [
        r('階段を上がってください', 'Suba las escaleras', ['con-07']),
        r('階段を下りてください', 'Baje las escaleras', ['con-07']),
        r('案内板を見てください', 'Mire el panel informativo', ['con-08']),
      ] },
      { id: 'tre-05', jp: '次の駅は何ですか？', romaji: 'tsugi no eki wa nan desu ka?', es: '¿Cuál es la próxima estación?', replies: [
        r('次で降りてください', 'Bájese en la próxima', ['con-07']),
        r('まだです', 'Todavía no', ['con-07']),
      ] },
      { id: 'tre-06', jp: '乗り換えはどこですか？', romaji: 'norikae wa doko desu ka?', es: '¿Dónde hago transbordo?', replies: [
        r('次の駅で乗り換えてください', 'Haga transbordo en la próxima estación', ['con-07']),
        r('乗り換えは必要ありません', 'No necesita hacer transbordo', ['con-07']),
      ] },
    ],
  },
  {
    id: 'taxi',
    name: 'Taxi',
    icon: '🚕',
    phrases: [
      { id: 'tax-01', jp: 'この住所までお願いします', romaji: 'kono jūsho made onegai shimasu', es: 'A esta dirección, por favor (enseñándola)', replies: [
        r('わかりました', 'Entendido', ['con-07']),
        r('少し遠いです', 'Está un poco lejos', ['tax-04']),
        r('住所がわかりません', 'No encuentro esa dirección', ['con-08']),
      ] },
      { id: 'tax-02', slot: 'station', jp: '{station}までお願いします', romaji: '{station} made onegai shimasu', es: 'A {station}, por favor', replies: [
        r('わかりました', 'Entendido', ['con-07']),
        r('高速道路を使いますか？', '¿Vamos por autopista? (cuesta más)', ['con-01', 'con-02']),
      ] },
      { id: 'tax-03', jp: 'ここで止めてください', romaji: 'koko de tomete kudasai', es: 'Pare aquí, por favor', replies: [
        r('ここでいいですか？', '¿Aquí está bien?', ['con-01']),
        r('ここは止められません', 'Aquí no puedo parar', ['con-05']),
      ] },
      { id: 'tax-04', jp: 'いくらぐらいかかりますか？', romaji: 'ikura gurai kakarimasu ka?', es: '¿Cuánto costará más o menos?', replies: [
        r('2000円くらいです', 'Unos 2.000 yenes', ['con-01']),
        r('5000円くらいです', 'Unos 5.000 yenes', ['con-01', 'con-02']),
        r('メーター料金です', 'Lo que marque el taxímetro', ['con-05']),
      ] },
      { id: 'tax-05', jp: '急いでいます', romaji: 'isoide imasu', es: 'Tengo prisa', replies: [
        r('わかりました', 'Entendido', ['con-07']),
        r('渋滞しています', 'Hay atasco', ['con-05']),
      ] },
      { id: 'tax-06', jp: 'トランクを開けてもらえますか？', romaji: 'toranku o akete moraemasu ka?', es: '¿Puede abrir el maletero?', replies: [
        r('はい、どうぞ', 'Sí, adelante', ['con-07']),
      ] },
      { id: 'tax-07', slot: 'time', jp: '{time}にタクシーを呼んでもらえますか？', romaji: '{time} ni takushī o yonde moraemasu ka?', es: '¿Me puede pedir un taxi para {time}?', replies: [
        r('かしこまりました', 'Entendido', ['con-07']),
        r('どちらまでですか？', '¿A dónde va?', ['tax-02', 'tax-01']),
      ] },
    ],
  },
  {
    id: 'hotel',
    name: 'Hotel',
    icon: '🏨',
    phrases: [
      { id: 'hot-01', jp: '予約しています', romaji: 'yoyaku shite imasu', es: 'Tengo una reserva', replies: [
        r('お名前をお願いします', 'Su nombre, por favor', ['con-08']),
        r('パスポートを見せてください', 'Muéstreme su pasaporte, por favor'),
        r('こちらにご記入ください', 'Rellene esto, por favor', ['con-05']),
        r('ご予約が見つかりません', 'No encuentro su reserva', ['con-33']),
      ] },
      { id: 'hot-02', jp: 'チェックインをお願いします', romaji: 'chekku-in o onegai shimasu', es: 'El check-in, por favor', replies: [
        r('パスポートを見せてください', 'Muéstreme su pasaporte, por favor'),
        r('チェックインは15時からです', 'El check-in es a partir de las 15:00', ['hot-05']),
        r('お荷物をお預かりしましょうか？', '¿Le guardamos el equipaje?', ['con-01', 'con-02']),
      ] },
      { id: 'hot-03', jp: 'チェックアウトは何時ですか？', romaji: 'chekku-auto wa nanji desu ka?', es: '¿A qué hora es el check-out?', replies: [
        r('10時です', 'A las 10:00', ['con-07']),
        r('11時です', 'A las 11:00', ['con-07']),
        r('12時です', 'A las 12:00', ['con-07']),
      ] },
      { id: 'hot-04', jp: '朝食は何時からですか？', romaji: 'chōshoku wa nanji kara desu ka?', es: '¿Desde qué hora es el desayuno?', replies: [
        r('6時半からです', 'Desde las 6:30', ['con-07']),
        r('7時からです', 'Desde las 7:00', ['con-07']),
        r('会場は2階です', 'Es en la 2.ª planta', ['con-07']),
        r('朝食は付いていません', 'El desayuno no está incluido', ['con-05']),
      ] },
      { id: 'hot-05', jp: '荷物を預かってもらえますか？', romaji: 'nimotsu o azukatte moraemasu ka?', es: '¿Me pueden guardar el equipaje?', replies: [
        r('はい、お預かりします', 'Sí, se lo guardamos', ['con-07']),
        r('何時ごろ戻られますか？', '¿A qué hora volverá más o menos?', ['con-08']),
        r('コインロッカーをご利用ください', 'Use las taquillas de monedas', ['dir-08']),
      ] },
      { id: 'hot-06', jp: 'Wi-Fiのパスワードは何ですか？', romaji: 'waifai no pasuwādo wa nan desu ka?', es: '¿Cuál es la contraseña del Wi-Fi?', replies: [
        r('こちらに書いてあります', 'Está escrita aquí', ['con-07']),
        r('パスワードは不要です', 'No hace falta contraseña', ['con-07']),
      ] },
    ],
  },
  {
    id: 'tiendas',
    name: 'Tiendas',
    icon: '🛍️',
    phrases: [
      { id: 'tie-01', jp: 'いくらですか？', romaji: 'ikura desu ka?', es: '¿Cuánto cuesta?', replies: [
        r('電卓でお見せします', 'Se lo muestro en la calculadora', ['con-09', 'con-02']),
        r('値段はここに書いてあります', 'El precio está escrito aquí', ['con-09', 'con-02']),
        r('税込みです', 'Impuestos incluidos', ['con-09']),
        r('税抜きです', 'Sin impuestos', ['con-09']),
      ] },
      { id: 'tie-02', jp: '見ているだけです', romaji: 'mite iru dake desu', es: 'Solo estoy mirando', replies: [
        r('ごゆっくりどうぞ', 'Tómese su tiempo', ['con-07']),
      ] },
      { id: 'tie-03', jp: '試着してもいいですか？', romaji: 'shichaku shite mo ii desu ka?', es: '¿Me lo puedo probar?', replies: [
        r('はい、どうぞ', 'Sí, adelante', ['con-07']),
        r('試着室はあちらです', 'El probador está allí', ['con-07']),
        r('試着はできません', 'No se puede probar', ['con-05']),
      ] },
      { id: 'tie-04', jp: 'カードで払えますか？', romaji: 'kādo de haraemasu ka?', es: '¿Puedo pagar con tarjeta?', replies: [
        r('はい、使えます', 'Sí, se puede', ['con-16']),
        r('現金のみです', 'Solo efectivo', ['con-17', 'dir-08']),
        r('暗証番号を入力してください', 'Introduzca su PIN', ['con-05']),
        r('一括払いでよろしいですか？', '¿En un solo pago?', ['con-01']),
      ] },
      { id: 'tie-05', jp: '免税できますか？', romaji: 'menzei dekimasu ka?', es: '¿Puedo comprarlo libre de impuestos?', replies: [
        r('パスポートを見せてください', 'Muéstreme su pasaporte, por favor'),
        r('免税カウンターはあちらです', 'El mostrador tax-free está allí', ['con-07']),
        r('免税の対象外です', 'No es elegible para tax-free', ['con-05']),
      ] },
      { id: 'tie-06', jp: '袋はいりません', romaji: 'fukuro wa irimasen', es: 'No necesito bolsa', replies: [
        r('かしこまりました', 'Entendido'),
        r('レシートはいりますか？', '¿Quiere el recibo?', ['con-18', 'con-02']),
      ] },
    ],
  },
  {
    id: 'farmacia',
    name: 'Farmacia',
    icon: '💊',
    phrases: [
      { id: 'far-01', jp: '風邪薬はありますか？', romaji: 'kazegusuri wa arimasu ka?', es: '¿Tiene medicina para el resfriado?', replies: pharmacyReplies },
      { id: 'far-04', jp: '痛み止めはありますか？', romaji: 'itamidome wa arimasu ka?', es: '¿Tiene analgésicos?', replies: pharmacyReplies },
      { id: 'far-05', jp: '胃薬はありますか？', romaji: 'igusuri wa arimasu ka?', es: '¿Tiene algo para el estómago?', replies: pharmacyReplies },
      { id: 'far-06', jp: '絆創膏はありますか？', romaji: 'bansōkō wa arimasu ka?', es: '¿Tiene tiritas (curitas)?', replies: pharmacyReplies },
      { id: 'far-02', jp: '熱があります', romaji: 'netsu ga arimasu', es: 'Tengo fiebre', replies: [
        r('いつからですか？', '¿Desde cuándo?', ['con-08']),
        r('この薬がいいです', 'Le va bien esta medicina', ['con-09', 'far-07']),
        r('病院に行ってください', 'Vaya al hospital', ['eme-04']),
      ] },
      { id: 'far-03', jp: '喉が痛いです', romaji: 'nodo ga itai desu', es: 'Me duele la garganta', replies: [
        r('この薬がいいです', 'Le va bien esta medicina', ['con-09', 'far-07']),
        r('熱はありますか？', '¿Tiene fiebre?', ['far-02', 'con-02']),
      ] },
      { id: 'far-07', jp: '一日何回飲みますか？', romaji: 'ichinichi nankai nomimasu ka?', es: '¿Cuántas veces al día lo tomo?', replies: [
        r('1日3回です', '3 veces al día', ['con-05']),
        r('1日2回です', '2 veces al día', ['con-05']),
        r('食後に飲んでください', 'Tómelo después de comer', ['con-05']),
        r('1回2錠です', '2 pastillas cada vez', ['con-05']),
      ] },
      { id: 'far-08', jp: '眠くなりますか？', romaji: 'nemuku narimasu ka?', es: '¿Da sueño?', replies: [
        r('眠くなります', 'Sí, da sueño', ['con-05']),
        r('眠くなりません', 'No da sueño', ['con-09']),
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
      { id: 'dir-08', slot: 'place', jp: '{place}はどこですか？', romaji: '{place} wa doko desu ka?', es: '¿Dónde está {place}?', replies: directionReplies },
      { id: 'dir-03', jp: '地図で教えてもらえますか？', romaji: 'chizu de oshiete moraemasu ka?', es: '¿Me lo puede mostrar en el mapa?', replies: [
        r('ここです', 'Es aquí (te lo señalan)', ['con-07']),
        r('今ここにいます', 'Usted está aquí', ['con-05']),
        ...directionReplies, // "..." copia los elementos del otro array
      ] },
      { id: 'dir-04', jp: '遠いですか？', romaji: 'tōi desu ka?', es: '¿Está lejos?', replies: [
        r('近いです', 'Está cerca', ['con-07']),
        r('遠いです', 'Está lejos', ['con-26']),
        r('歩いて5分くらいです', 'Unos 5 minutos caminando', ['con-07']),
        r('タクシーがいいです', 'Mejor vaya en taxi', ['con-26']),
        r('電車で行ってください', 'Vaya en tren', ['dir-01']),
      ] },
      { id: 'dir-05', jp: '右', romaji: 'migi', es: 'Derecha' },
      { id: 'dir-06', jp: '左', romaji: 'hidari', es: 'Izquierda' },
      { id: 'dir-07', jp: 'まっすぐ', romaji: 'massugu', es: 'Todo recto' },
    ],
  },
  {
    id: 'onsen',
    name: 'Onsen',
    icon: '♨️',
    phrases: [
      { id: 'ons-01', jp: 'タオルはありますか？', romaji: 'taoru wa arimasu ka?', es: '¿Hay toallas?', replies: [
        r('無料です', 'Son gratis', ['con-07']),
        r('有料です', 'Son de pago', ['con-01', 'con-02']),
        r('レンタルは200円です', 'El alquiler cuesta 200 yenes', ['con-01', 'con-02']),
      ] },
      { id: 'ons-02', jp: 'タトゥーがありますが、入れますか？', romaji: 'tatū ga arimasu ga, hairemasu ka?', es: 'Tengo tatuajes, ¿puedo entrar?', replies: [
        r('大丈夫です', 'No hay problema', ['con-07']),
        r('シールで隠せば大丈夫です', 'Si lo tapa con un parche, puede entrar', ['con-01']),
        r('申し訳ありませんが、入れません', 'Lo sentimos, no puede entrar', ['ons-03', 'con-05']),
      ] },
      { id: 'ons-03', jp: '貸切風呂はありますか？', romaji: 'kashikiri buro wa arimasu ka?', es: '¿Hay baño privado?', replies: [
        r('あります。予約が必要です', 'Sí. Hace falta reservar', ['con-01']),
        r('ありません', 'No hay', ['con-05']),
      ] },
      { id: 'ons-04', jp: '男湯はどちらですか？', romaji: 'otokoyu wa dochira desu ka?', es: '¿Dónde está el baño de hombres? (男)', replies: [
        r('青いのれんです', 'La cortina azul', ['con-07']),
        r('右です', 'A la derecha', ['con-07']),
        r('左です', 'A la izquierda', ['con-07']),
      ] },
      { id: 'ons-05', jp: '女湯はどちらですか？', romaji: 'onnayu wa dochira desu ka?', es: '¿Dónde está el baño de mujeres? (女)', replies: [
        r('赤いのれんです', 'La cortina roja', ['con-07']),
        r('右です', 'A la derecha', ['con-07']),
        r('左です', 'A la izquierda', ['con-07']),
      ] },
      { id: 'ons-06', jp: '何時まで入れますか？', romaji: 'nanji made hairemasu ka?', es: '¿Hasta qué hora se puede entrar?', replies: [
        r('23時までです', 'Hasta las 23:00', ['con-07']),
        r('24時間入れます', 'Está abierto las 24 horas', ['con-07']),
      ] },
    ],
  },
  {
    id: 'templos',
    name: 'Templos',
    icon: '⛩️',
    phrases: [
      { id: 'tem-01', jp: '拝観料はいくらですか？', romaji: 'haikanryō wa ikura desu ka?', es: '¿Cuánto cuesta la entrada?', replies: [
        r('500円です', '500 yenes', ['con-07']),
        r('無料です', 'Es gratis', ['con-07']),
        r('あちらでお支払いください', 'Pague allí, por favor', ['con-05']),
      ] },
      { id: 'tem-08', slot: 'tickets', jp: 'チケットを{tickets}ください', romaji: 'chiketto o {tickets} kudasai', es: '{tickets}, por favor', replies: [
        r('大人ですか？', '¿Son de adulto?', ['con-01']),
        r('1000円です', '1.000 yenes', ['con-16', 'con-17']),
        r('本日は売り切れです', 'Hoy están agotadas', ['con-05']),
      ] },
      { id: 'tem-02', jp: '写真を撮ってもいいですか？', romaji: 'shashin o totte mo ii desu ka?', es: '¿Puedo hacer fotos?', replies: [
        r('はい、どうぞ', 'Sí, adelante', ['con-07']),
        r('ここは撮影禁止です', 'Aquí está prohibido hacer fotos', ['con-05']),
        r('フラッシュは使わないでください', 'No use el flash', ['con-05']),
      ] },
      { id: 'tem-03', jp: '御朱印をお願いします', romaji: 'goshuin o onegai shimasu', es: 'Un goshuin (sello del templo), por favor', replies: [
        r('御朱印帳はお持ちですか？', '¿Tiene libro de sellos?', ['con-01', 'tem-04']),
        r('500円です', '500 yenes', ['con-07']),
        r('書き置きのみです', 'Solo en hoja suelta', ['con-01']),
        r('少々お待ちください', 'Espere un momento', ['con-20']),
      ] },
      { id: 'tem-04', jp: '御朱印帳をください', romaji: 'goshuinchō o kudasai', es: 'Un libro de sellos, por favor', replies: [
        r('こちらからお選びください', 'Elija uno de estos', ['con-09']),
        r('売り切れです', 'Está agotado', ['con-05']),
      ] },
      { id: 'tem-05', jp: '靴を脱ぎますか？', romaji: 'kutsu o nugimasu ka?', es: '¿Hay que quitarse los zapatos?', replies: [
        r('はい、脱いでください', 'Sí, quíteselos por favor', ['con-05']),
        r('そのままで大丈夫です', 'Puede dejárselos puestos', ['con-07']),
      ] },
      { id: 'tem-06', jp: '何時に閉まりますか？', romaji: 'nanji ni shimarimasu ka?', es: '¿A qué hora cierra?', replies: [
        r('16時半です', 'A las 16:30', ['con-07']),
        r('17時です', 'A las 17:00', ['con-07']),
      ] },
      { id: 'tem-07', jp: 'お守りはどこで買えますか？', romaji: 'omamori wa doko de kaemasu ka?', es: '¿Dónde se compran los amuletos (omamori)?', replies: [
        r('あちらの授与所です', 'En el puesto de allí', ['con-07']),
      ] },
    ],
  },
  {
    id: 'emergencias',
    name: 'Emergencias',
    icon: '🚨',
    phrases: [
      { id: 'eme-01', jp: '助けて！', romaji: 'tasukete!', es: '¡Ayuda!', replies: [
        r('どうしましたか？', '¿Qué le pasa?', ['eme-05', 'eme-06', 'con-23', 'con-24']),
        r('大丈夫ですか？', '¿Está bien?', ['eme-05', 'eme-03']),
        r('警察を呼びます', 'Voy a llamar a la policía', ['con-07']),
        ...emergencyCareReplies,
      ] },
      { id: 'eme-02', jp: '警察を呼んでください', romaji: 'keisatsu o yonde kudasai', es: 'Llame a la policía, por favor', replies: [
        r('警察を呼びます', 'Voy a llamar a la policía', ['con-07']),
        r('交番はあちらです', 'El puesto de policía (kōban) está allí', ['con-22']),
        r('どうしましたか？', '¿Qué le pasa?', ['eme-06']),
      ] },
      { id: 'eme-03', jp: '救急車を呼んでください', romaji: 'kyūkyūsha o yonde kudasai', es: 'Llame a una ambulancia, por favor', replies: emergencyCareReplies },
      { id: 'eme-04', jp: '病院はどこですか？', romaji: 'byōin wa doko desu ka?', es: '¿Dónde está el hospital?', replies: [
        r('近くにあります', 'Hay uno cerca', ['con-22']),
        r('タクシーで行ってください', 'Vaya en taxi', ['con-26']),
        r('救急車を呼びましょうか？', '¿Llamo a una ambulancia?', ['con-01', 'con-02']),
      ] },
      { id: 'eme-05', jp: '気分が悪いです', romaji: 'kibun ga warui desu', es: 'Me encuentro mal', replies: [
        r('救急車を呼びましょうか？', '¿Llamo a una ambulancia?', ['con-01', 'con-02']),
        r('薬を持っていますか？', '¿Tiene medicinas?', ['con-01', 'con-02']),
        ...emergencyCareReplies,
      ] },
      { id: 'eme-06', jp: '財布をなくしました', romaji: 'saifu o nakushimashita', es: 'He perdido la cartera', replies: [
        r('どこでなくしましたか？', '¿Dónde la perdió?', ['con-06', 'con-08']),
        r('交番に行ってください', 'Vaya al puesto de policía (kōban)', ['con-22']),
        r('一緒に探しましょう', 'Busquémosla juntos', ['con-07']),
      ] },
      { id: 'eme-07', jp: 'スペイン語を話せる人はいますか？', romaji: 'supein-go o hanaseru hito wa imasu ka?', es: '¿Hay alguien que hable español?', replies: [
        r('いません', 'No hay nadie', ['con-04']),
        r('英語なら話せます', 'Hablo inglés', ['con-04']),
        r('翻訳アプリを使いましょう', 'Usemos una app de traducción', ['con-01']),
      ] },
    ],
  },
  {
    // Frases cortas para contestar. Las respuestas de arriba enlazan aquí con "next".
    id: 'responder',
    name: 'Responder',
    icon: '🙋',
    phrases: [
      { id: 'con-01', jp: 'はい、お願いします', romaji: 'hai, onegai shimasu', es: 'Sí, por favor' },
      { id: 'con-02', jp: 'いいえ、大丈夫です', romaji: 'iie, daijōbu desu', es: 'No, gracias' },
      { id: 'con-03', jp: 'もう一度お願いします', romaji: 'mō ichido onegai shimasu', es: 'Otra vez, por favor' },
      { id: 'con-04', jp: 'ゆっくり話してください', romaji: 'yukkuri hanashite kudasai', es: 'Hable despacio, por favor' },
      { id: 'con-05', jp: 'わかりました', romaji: 'wakarimashita', es: 'Entendido' },
      { id: 'con-06', jp: 'わかりません', romaji: 'wakarimasen', es: 'No lo sé / No entiendo' },
      { id: 'con-07', jp: 'ありがとうございます', romaji: 'arigatō gozaimasu', es: 'Muchas gracias' },
      { id: 'con-08', jp: '書いてもらえますか？', romaji: 'kaite moraemasu ka?', es: '¿Me lo puede escribir?' },
      { id: 'con-09', jp: 'これにします', romaji: 'kore ni shimasu', es: 'Me llevo esto' },
      { id: 'con-10', jp: '窓側でお願いします', romaji: 'madogawa de onegai shimasu', es: 'Ventanilla, por favor' },
      { id: 'con-11', jp: '通路側でお願いします', romaji: 'tsūrogawa de onegai shimasu', es: 'Pasillo, por favor' },
      { id: 'con-12', jp: '指定席でお願いします', romaji: 'shiteiseki de onegai shimasu', es: 'Asiento reservado, por favor' },
      { id: 'con-13', jp: '自由席でお願いします', romaji: 'jiyūseki de onegai shimasu', es: 'Asiento no reservado, por favor' },
      { id: 'con-14', jp: '片道でお願いします', romaji: 'katamichi de onegai shimasu', es: 'Solo ida, por favor' },
      { id: 'con-15', jp: '往復でお願いします', romaji: 'ōfuku de onegai shimasu', es: 'Ida y vuelta, por favor' },
      { id: 'con-16', jp: 'カードでお願いします', romaji: 'kādo de onegai shimasu', es: 'Con tarjeta, por favor' },
      { id: 'con-17', jp: '現金で払います', romaji: 'genkin de haraimasu', es: 'Pago en efectivo' },
      { id: 'con-18', jp: 'レシートをください', romaji: 'reshīto o kudasai', es: 'El recibo, por favor' },
      { id: 'con-19', jp: '予約していません', romaji: 'yoyaku shite imasen', es: 'No tengo reserva' },
      { id: 'con-20', jp: '待ちます', romaji: 'machimasu', es: 'Espero' },
      { id: 'con-21', jp: 'また来ます', romaji: 'mata kimasu', es: 'Vuelvo más tarde' },
      { id: 'con-22', jp: '一緒に来てもらえますか？', romaji: 'issho ni kite moraemasu ka?', es: '¿Me puede acompañar?' },
      { id: 'con-23', jp: 'お腹が痛いです', romaji: 'onaka ga itai desu', es: 'Me duele el estómago' },
      { id: 'con-24', jp: '頭が痛いです', romaji: 'atama ga itai desu', es: 'Me duele la cabeza' },
      { id: 'con-25', jp: '普通でお願いします', romaji: 'futsū de onegai shimasu', es: 'Tamaño normal, por favor' },
      { id: 'con-26', jp: 'タクシーを呼んでもらえますか？', romaji: 'takushī o yonde moraemasu ka?', es: '¿Me puede llamar un taxi?' },
      { id: 'con-27', jp: '別々でお願いします', romaji: 'betsubetsu de onegai shimasu', es: 'Por separado, por favor' },
      { id: 'con-28', jp: '一緒でお願いします', romaji: 'issho de onegai shimasu', es: 'Todo junto, por favor' },
      { id: 'con-29', jp: '禁煙席でお願いします', romaji: 'kin\'enseki de onegai shimasu', es: 'No fumadores, por favor' },
      { id: 'con-30', jp: 'ここが痛いです', romaji: 'koko ga itai desu', es: 'Me duele aquí (señalando)' },
      { id: 'con-31', jp: '次の電車でお願いします', romaji: 'tsugi no densha de onegai shimasu', es: 'El próximo tren, por favor' },
      { id: 'con-32', jp: '次の電車は空いていますか？', romaji: 'tsugi no densha wa aite imasu ka?', es: '¿Hay sitio en el próximo tren?' },
      { id: 'con-33', jp: 'これが予約の確認です', romaji: 'kore ga yoyaku no kakunin desu', es: 'Esta es la confirmación de la reserva' },
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

export function allPhrases() {
  return categories.flatMap(c => c.phrases);
}
