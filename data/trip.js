/*
 * 熱海旅行2026 しおり 設定データ
 * ------------------------------------------------------------
 * 幹事が編集するのはこのファイルだけです。
 * 日付・時刻・案内文・施設時間・リンク・写真をここで直すと、
 * 次に配信（再デプロイ）したときに全員の画面へ反映されます。
 *
 * ルール
 *  - 料金・金額は書かない（参加者向け画面に一切出さない）
 *  - 参加者の氏名・部屋割り・個人の連絡先は書かない
 *    （「仮案」「確定」「予約済み」などの状況ラベルは載せない）
 */
window.TRIP = {
  updated: "2026-10-20",

  title: "熱海旅行",
  // 各ページ上部の画像（熱海の夜景）
  heroPhoto: "assets/photos/hero.jpg",
  year: "2026",
  dateLabel: "10/23(金)–10/24(土)",
  people: 18,
  catchcopy: "海と温泉で、いい時間を。",

  // 写真の表示方法
  //  "link"  : 写真を直接表示せず、公式ページの該当写真へのリンクカードを出す（権利未確認時の既定）
  //  "embed" : 公式の画像URLを直接表示する（ホテルの掲載許可を確認してから切り替える）
  //  ※ 確認用：URLの末尾に ?photos=on を付けると一時的に "embed" で表示できます
  photoMode: "embed",

  hotel: {
    name: "熱海ニューフジヤホテル",
    address: "静岡県熱海市銀座町1-16",
    room: "【アネックス館】和室12畳",
    roomCount: 3,
    checkin: "15:00",
    checkout: "11:00",
    officialUrl: "https://www.itoenhotel.com/atami_newfujiyahotel/",
    roomsUrl: "https://www.itoenhotel.com/atami_newfujiyahotel/rooms/",
    galleryUrl: "https://www.itoenhotel.com/atami_newfujiyahotel/gallery/",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=熱海ニューフジヤホテル",
    // Googleマップの共有リンク（予定のチェックイン・ホテルページの「ホテルマップ」）
    shareMapUrl: "https://maps.app.goo.gl/EBtd6uszDCZstAdp9",
    roomPhoto: {
      // 公式フォトギャラリーの「和室12畳一例」2枚
      photos: ["assets/photos/room-1.jpg", "assets/photos/room-2.jpg"],
      source: "https://www.itoenhotel.com/atami_newfujiyahotel/gallery/",
      sourceName: "公式 フォトギャラリー「和室12畳一例」",
      caption: "【アネックス館】和室12畳 客室の一例"
    }
  },

  banquet: {
    name: "えんじゅ",
    prefix: "呑食処",
    date: "10/23(金)",
    time: "20:15",
    people: 18,
    course: "飲み放題付きコース",
    address: "静岡県熱海市中央町3-14",
    tel: "0557-55-7517",
    tabelogUrl: "https://tabelog.com/shizuoka/A2205/A220502/22043124/",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=呑食処えんじゅ+熱海",
    // Googleマップの共有リンク（予定の宴会開始）
    shareMapUrl: "https://maps.app.goo.gl/Lg2KSqTPoxktcysi6",
    // 宴会ページの地図カードに出すお店の外観写真
    photo: "assets/photos/enju.jpg",
    walkUrl: "https://www.google.com/maps/dir/?api=1&origin=熱海ニューフジヤホテル&destination=呑食処えんじゅ+熱海&travelmode=walking",
    meet: { time: "19:50", place: "ホテルロビー",
            note: "ロビーに集合して、みんなで歩いてお店へ向かいます。" }
  },

  // クリックで開く画像（schedule の popup で指定）
  popups: {
    shinjuku: { title: "新宿駅東口 集合場所", src: "assets/shinjuku-east.jpg", alt: "新宿駅東口の集合場所の写真" }
  },

  // 1日目・2日目の予定
  schedule: [
    {
      day: "1日目", date: "10/23(金)", iso: "2026-10-23",
      items: [
        { time: "11:50", title: "新宿駅東口に集合(画像有)", sub: "Googleマップで見る", subUrl: "https://maps.app.goo.gl/d1rKatw3uLTHDhho6?g_st=ac", popup: "shinjuku", icon: "people" },
        { time: "12:20", title: "ロマンスカーはこね25号 新宿発(乗車券だけ改札に入れる)", sub: "号車・座席は特急券で確認", icon: "train" },
        { time: "13:33", title: "小田原着", sub: "小田原駅で下車", icon: "train" },
        { time: "13:48", title: "JR東海道線へ乗換", sub: "小田原駅でJRに乗り換え", icon: "swap" },
        { time: "14:11", title: "熱海着", sub: "JR熱海駅に到着", icon: "train" },
        { time: "",      title: "駅周辺を軽く散策", sub: "散策しながらホテルへ", icon: "walk" },
        { time: "15:00", title: "ホテルチェックイン", sub: "熱海ニューフジヤホテル(Googleマップ)", icon: "bed", hotelMap: true },
        { time: "",      title: "自由行動", sub: "温泉・館内施設・街歩きなど", icon: "spa" },
        { time: "19:50", title: "ホテルロビー集合", sub: "みんなで歩いてえんじゅへ", icon: "people" },
        { time: "20:15", title: "宴会 開始", sub: "呑食処 えんじゅ(Googleマップ)", icon: "dining", banquetMap: true },
        { time: "22:15", title: "宴会 終了", sub: "", icon: "dining" },
        { time: "",      title: "自由行動", sub: "熱海は飲み屋街いっぱい\n(・∀・)", icon: "spa" }
      ]
    },
    {
      day: "2日目", date: "10/24(土)", iso: "2026-10-24",
      items: [
        { time: "7:00", title: "朝食（〜9:00）", sub: "別館1階 麗峰", icon: "breakfast" },
        { time: "10:50", title: "ホテルロビー集合", sub: "", icon: "people" },
        { time: "11:00", title: "チェックアウト", sub: "熱海ニューフジヤホテル", icon: "bed" },
        { time: "",      title: "自由解散", sub: "交通費を渡すので、帰宅・観光継続どちらでもOK", icon: "flag" }
      ],
      // 自由解散のあとに出すリンク（地図・時刻表）
      links: [
        { label: "熱海駅地図", icon: "pin", url: "https://www.google.com/maps/search/?api=1&query=熱海駅" },
        { label: "熱海→小田原(時刻表)", sub: "JR東海道線の乗車券", icon: "train", url: "https://www.navitime.co.jp/transfer/searchlist?orvStationCode=00007326&orvStationName=%E7%86%B1%E6%B5%B7&dnvStationCode=00003742&dnvStationName=%E5%B0%8F%E7%94%B0%E5%8E%9F&thrStationCode1=&thrStationName1=&thrStationCode2=&thrStationName2=&thrStationCode3=&thrStationName3=&year=2026&month=10&day=24&hour=11&minute=0&basis=1&sort=4&wspeed=100&airplane=0&sprexprs=0&utrexprs=0&othexprs=0&mtrplbus=0&ferry=0&intercitybus=0&accidentRailCode=&accidentRailName=&freePass=0" },
        { label: "小田原→新宿(時刻表)", sub: "小田急の乗車券 ＋ ロマンスカー特急券（2つとも必要）", icon: "train", url: "https://www.odakyu.jp/romancecar/" }
      ],
      // 「小田原→新宿」の下に出す案内（そのあとに transport.returnInfo の「帰りの案内」を出す）
      showReturnInfo: true,
      guide: {
        // 購入窓口の行き方（「小田急旅行センター」の部分がリンク）
        way: {
          title: "購入窓口の行き方",
          before: "エスカレーターを上がり、JR改札を出たら左に進む。小田急線の改札口の正面に「",
          link: "小田急旅行センター",
          after: "」",
          url: "https://www.odakyu-travel.co.jp/departure/odawara/index.html"
        },
        // 「|」は折り返してよい位置（文字としては出ない）
        say: "小田原から新宿まで、|ロマンスカーの|特急券と乗車券を|ください。",
        sayNote: "改札には「乗車券」だけ入れる。|号車・座席は特急券で確認",
        notes: [
          "ロマンスカーは「乗車券」と「特急券」の両方がないと乗れません。",
          "切符を買うときに領収書をもらって、なくさず持っておいてください。"
        ]
      }
    }
  ],

  transport: {
    // 2日目の「帰りの案内」（予定の2日目ページ＝下のメニューの「2日目」に出す）
    returnInfo: [
      "10/24(土) 11:00チェックアウト後は自由解散です。",
      "交通費を渡すので、帰りの切符は各自で購入してください。領収書はなくさずに、翌営業日に持ってきてください。"
    ]
  },

  // 温泉（building: "本館" / "別館"）
  onsen: {
    sourceUrl: "https://www.itoenhotel.com/atami_newfujiyahotel/hotspring/",
    items: [
      { name: "大浴場", building: "本館", floor: "地下2階",
        hours: ["14:00〜24:00", "翌5:00〜10:00"], note: "毎週月曜は15:00開始",
        photo: "https://www.itoenhotel.com/admin/img/imagecache/1120x840_99be13685781dea156e5319325844580.jpg" },
      { name: "展望露天風呂", building: "本館", floor: "11階",
        hours: ["15:00〜24:00", "翌5:00〜10:00"], note: "強風時は休止あり",
        photo: "https://www.itoenhotel.com/admin/img/imagecache/1120x840_a6d758d0c1fb39daee2a82b701621080.jpg" },
      { name: "家康の湯", building: "別館", floor: "3階（アネックス）",
        hours: ["15:00〜24:00", "翌5:00〜10:00"], note: "月曜は14:00開始",
        photo: "https://www.itoenhotel.com/admin/img/imagecache/1120x840_1d6ff64c232c3fe6d3c6fc80a004d864.jpg" }
    ]
  },

  // 館内施設（reserve: "予約不要" / "要予約" / "" ）
  facilities: {
    sourceUrl: "https://www.itoenhotel.com/atami_newfujiyahotel/facilities/",
    items: [
      { name: "フロント", icon: "bell", building: "本館", floor: "1階 ロビー",
        hours: [], reserve: "",
        photo: "https://www.itoenhotel.com/admin/img/imagecache/600x450_c0ab56e80cd7d70df50a4db38d219b57.jpg" },
      { name: "浴衣コーナー", icon: "spa", building: "本館", floor: "1階 ロビー",
        hours: [], reserve: "",
        note: "お好きなサイズ、お色のものをお選びください。",
        photo: "https://www.itoenhotel.com/admin/img/imagecache/600x450_535a82ca983822a3298db8f560878cff.jpg" },
      // 本館とアネックス館の両方にある（絞り込みはどちらでも出る）
      { name: "アメニティコーナー", icon: "bag", building: "", buildings: ["本館", "別館"], label: "本館・アネックス館 1階",
        floor: "本館 1階（浴衣コーナー前）／アネックス館 1階（エレベーター前）",
        hours: [], reserve: "",
        note: "お部屋にはご用意がありません。歯ブラシ・クシ・カミソリは、必要な数をこちらからお取りください。",
        photo: "https://www.itoenhotel.com/admin/img/imagecache/600x450_972884a8a40eb4bd4bbfd4bf3772e95c.jpg" },
      { name: "朝食", icon: "breakfast", building: "別館", floor: "1階 麗峰",
        hours: ["7:00〜9:00（10/24）"], reserve: "",
        // 朝食の写真（朝食 (1)〜(7)。1枚目が一覧の表紙）
        photos: ["assets/photos/breakfast-1.jpg", "assets/photos/breakfast-2.jpg", "assets/photos/breakfast-3.jpg", "assets/photos/breakfast-4.jpg", "assets/photos/breakfast-5.jpg", "assets/photos/breakfast-6.jpg", "assets/photos/breakfast-7.jpg"],
        sourceUrl: "https://www.itoenhotel.com/atami_newfujiyahotel/cuisine/", sourceName: "公式 料理ページ" },
      { name: "共用カラオケ", icon: "mic", building: "本館", floor: "地下2階",
        hours: ["13:00〜24:00", "翌9:00〜11:00"], reserve: "予約不要",
        photo: "https://www.itoenhotel.com/admin/img/imagecache/600x450_adcc6a3a9f8fba9b3293b929fa7250bc.jpg" },
      { name: "個室カラオケ", icon: "mic", building: "本館", floor: "地下2階",
        hours: ["13:00〜23:50（50分枠）", "翌9:00〜10:50（50分枠）"], reserve: "要予約",
        note: "当日13:00からフロントの台帳で受付。8名以上のグループは最大2枠。",
        photo: "https://www.itoenhotel.com/admin/img/imagecache/600x450_95296718a5960d8d6cbaf39ca53480f2.jpg" },
      { name: "卓球", icon: "pingpong", building: "別館", floor: "1階",
        hours: ["13:00〜24:00", "翌8:00〜11:00"], reserve: "予約不要",
        photo: "https://www.itoenhotel.com/admin/img/imagecache/600x450_e471f602577a85c2e7f67301baa0fcc2.jpg" },
      { name: "ゲームコーナー", icon: "game", building: "別館", floor: "3階",
        hours: ["13:00〜22:00"], reserve: "", note: "変更の場合あり",
        photo: "https://www.itoenhotel.com/admin/img/imagecache/600x450_bfb0e9bae1dd34ce54fab7952f64b0ae.jpg" },
      { name: "麻雀ルーム", icon: "mahjong", building: "本館", floor: "地下2階",
        hours: ["13:00〜24:00", "翌9:00〜11:00"], reserve: "要予約",
        photo: "https://www.itoenhotel.com/admin/img/imagecache/600x450_ad8179f9e7264d0e4d1a070d0d29d80c.jpg" },
      { name: "漫画コーナー", icon: "book", building: "本館", floor: "11階",
        hours: ["13:00〜24:00", "翌9:00〜11:00"], reserve: "予約不要",
        photo: "https://www.itoenhotel.com/admin/img/imagecache/600x450_366f67ccdab5b9b27c8ee5d9960bd813.jpg" },
      { name: "売店", icon: "shop", building: "本館", floor: "1階",
        hours: ["12:30〜20:00", "翌7:45〜11:30"], reserve: "",
        photo: "https://www.itoenhotel.com/admin/img/imagecache/600x450_1ae245202f7366c5cb4d023ddb41fdca.jpg" }
    ]
  },


};
