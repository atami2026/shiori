/*
 * 熱海旅行2026 しおり 自動テスト
 *   使い方: python3 -m http.server 8765 &   （リポジトリ直下で）
 *           node tests/e2e.js [スクショ保存先]
 *   playwright が必要（npm i -g playwright など）
 */
const { chromium } = require("playwright");
const BASE = process.env.BASE_URL || "http://localhost:8765/";
const SHOTS = process.argv[2] || "";
const ROUTES = ["home", "transport", "hotel", "facilities", "banquet"];

const fails = [];
let passes = 0;
function check(ok, msg) { if (ok) passes++; else fails.push(msg); }

// 参加者向け画面に出してはいけない文字（金額・見本画像の架空情報）
const FORBIDDEN = [
  /[0-9０-９,，]+\s*円/, /￥|¥/, /料金|合計|1人あたり|往復の目安|予算/,
  /090-1234-5678/, /0557-81-1234/, /田中/, /西口/, /ビュッフェ/,
  /仮案|第1候補|購入済み|予約済み|未確定|確定/, /幹事から|情報更新日|現地の案内を優先|乗換え案内図|緊急連絡先/, /持ち物チェック|緊急連絡先|お知らせ/
];

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const pg = await ctx.newPage();
  const errors = [];
  pg.on("pageerror", (e) => errors.push(e.message));
  pg.on("console", (m) => { if (m.type() === "error" && !/Failed to load resource|ERR_/.test(m.text())) errors.push(m.text()); });
  const go = async (hash, q = "") => { await pg.goto(BASE + q + "#/" + hash); await pg.waitForTimeout(250); };

  // 1. 各画面：表示・禁止文字・横はみ出し・タブの現在地
  for (const r of ROUTES) {
    await go(r);
    const txt = await pg.evaluate(() => document.body.innerText);
    check(txt.length > 200, `${r}: 内容が表示されない`);
    for (const re of FORBIDDEN) check(!re.test(txt), `${r}: 禁止表記 ${re}`);
    check(await pg.locator(`.tabbar a[aria-current="page"][href="#/${r}"]`).count() === 1, `${r}: 下部ナビの現在地が違う`);
    if (SHOTS) await pg.screenshot({ path: `${SHOTS}/${r}.png`, fullPage: true });
  }

  // 2. 画面幅ごとの横はみ出し
  for (const w of [320, 360, 390, 430]) {
    await pg.setViewportSize({ width: w, height: 800 });
    for (const r of ROUTES) {
      await go(r);
      const sw = await pg.evaluate(() => document.documentElement.scrollWidth);
      check(sw <= w, `${r}@${w}px: 横にはみ出し ${sw}`);
    }
  }
  await pg.setViewportSize({ width: 390, height: 844 });

  // 3. 正しい情報が出ているか
  await go("home");
  let t = await pg.evaluate(() => document.body.innerText);
  // 上部は「旅行名」と「日付」だけ（18名・キャッチコピーは出さない）。高さは狭く
  for (const r of ROUTES) {
    await go(r);
    const ht = await pg.evaluate(() => ({ t: document.querySelector("#hero").innerText.replace(/\s+/g, " ").trim(), h: Math.round(document.querySelector("#hero").getBoundingClientRect().height) }));
    check(ht.t === "熱海旅行2026 10/23(金)–10/24(土)", `${r}: 上部の文字が違う: ${ht.t}`);
    check(ht.h <= 160, `${r}: 上部の高さが広い: ${ht.h}px`);
  }
  // 上部の画像・文字は全ページで同じ高さ・同じ位置
  const heroPos = [];
  for (const r of ROUTES) {
    await go(r);
    heroPos.push(await pg.evaluate(() => { const h = document.querySelector("#hero").getBoundingClientRect(), t = document.querySelector("#hero h1").getBoundingClientRect(); return [Math.round(h.height), Math.round(t.top), Math.round(t.left)].join(","); }));
  }
  check(new Set(heroPos).size === 1, "上部の画像・文字の位置がページごとに違う: " + heroPos.join(" / "));
  await go("home");
  for (const r of ["home", "transport"]) {
    await go(r);
    check(await pg.locator("#view .card-head").count() === 0 && !(await pg.evaluate(() => document.querySelector("#view").innerText)).includes("旅程"), `${r}: 「旅程」の見出しが残っている`);
  }
  await go("home");
  // 上部の文字は中央、日付の前のカレンダーマークは出さない
  check(await pg.locator("#hero .meta svg").count() === 0, "上部: 日付の前のカレンダーマークが残っている");
  check(await pg.evaluate(() => getComputedStyle(document.querySelector("#hero .hero-text")).textAlign === "center" && getComputedStyle(document.querySelector("#hero .meta")).justifyContent === "center"), "上部: 文字が中央になっていない");
  // 「出発まで あと○日」の表示は出さない
  check(!(await pg.evaluate(() => document.body.innerText)).includes("出発まで") && await pg.locator(".countdown").count() === 0, "「出発まで あと○日」の表示が残っている");
  // 各ページ上部の画像：熱海の夜景写真（イラストではない）
  for (const r of ROUTES) {
    await go(r);
    check(await pg.locator("#hero img.hero-photo").count() === 1 && await pg.locator("#hero svg.hero-art").count() === 0, `${r}: 上部の画像が夜景写真になっていない`);
  }
  await go("home");
  for (const s of ["10/23(金)–10/24(土)", "11:50", "12:20", "はこね25号", "13:33", "14:11", "15:00", "19:50", "20:15"]) check(t.includes(s), `home: 「${s}」がない`);
  // 下のメニュー：「1日目」「2日目」。予定ページには2日目の内容を出さない
  check(JSON.stringify(await pg.evaluate(() => [...document.querySelectorAll("#tabbar a")].map((a) => a.innerText.trim()))) === JSON.stringify(["1日目", "2日目", "ホテル", "施設", "宴会"]), "下のメニューの名前が違う");
  check(await pg.locator(".day-tabs").count() === 0 && !t.includes("チェックアウト") && !t.includes("自由解散") && !t.includes("熱海駅地図"), "1日目のページに2日目の内容が残っている");
  await go("transport");
  t = await pg.evaluate(() => document.querySelector(".timeline").innerText);
  check(!t.includes("新宿駅東口に集合") && !t.includes("宴会 開始"), "2日目のページに1日目の内容が出ている");
  for (const s of ["7:00", "朝食（〜9:00）", "別館1階 麗峰", "10:50", "ホテルロビー集合", "11:00", "チェックアウト", "自由解散", "交通費を渡すので、帰宅・観光継続どちらでもOK"]) check(t.includes(s), `2日目: 「${s}」がない`);
  check(t.indexOf("10:50") > t.indexOf("7:00") && t.indexOf("10:50") < t.indexOf("11:00"), "2日目: 10:50の並び順が違う");
  // 自由解散の下：熱海駅地図・時刻表リンク
  const dl = await pg.evaluate(() => [...document.querySelectorAll(".day-links a")].map((a) => ({ t: a.innerText.trim(), h: a.getAttribute("href"), tg: a.target, rel: a.rel })));
  check(dl.length === 3 && dl[0].t === "熱海駅地図" && dl[1].t.split(/\n/)[0].trim() === "熱海→小田原(時刻表)" && dl[1].t.includes("JR東海道線の乗車券") && dl[2].t.split(/\n/)[0].trim() === "小田原→新宿(時刻表)" && dl[2].t.includes("小田急の乗車券 ＋ ロマンスカー特急券（2つとも必要）"), "2日目: 地図・時刻表リンクの並びが違う: " + JSON.stringify(dl.map((x) => x.t)));
  check(dl.length === 3 && /query=熱海駅$/.test(dl[0].h), "2日目: 熱海駅地図のリンク先が違う");
  check(dl.length === 3 && dl[1].h.startsWith("https://www.navitime.co.jp/transfer/searchlist?") && dl[1].h.includes("orvStationName=%E7%86%B1%E6%B5%B7") && dl[1].h.includes("dnvStationName=%E5%B0%8F%E7%94%B0%E5%8E%9F") && dl[1].h.includes("year=2026&month=10&day=24&hour=11&minute=0"), "2日目: 熱海→小田原の時刻表リンクが違う");
  check(dl.length === 3 && dl[2].h === "https://www.odakyu.jp/romancecar/", "2日目: 小田原→新宿のロマンスカーのリンクが違う");
  check(dl.every((x) => x.tg === "_blank" && /noopener/.test(x.rel)), "2日目: リンクが別タブ/noopenerでない");
  check(await pg.locator('.day-way a.inlink[href="https://www.odakyu-travel.co.jp/departure/odawara/index.html"][target="_blank"][rel*="noopener"]').count() === 1, "2日目: 購入窓口の行き方に小田急旅行センターのリンクがない");
  check((await pg.evaluate(() => document.querySelector(".day-way").compareDocumentPosition(document.querySelector(".day-links ~ .say")) & 4)) !== 0, "2日目: 「購入窓口の行き方」が伝え方の枠より上にない");
  const dayCard = await pg.evaluate(() => document.querySelector(".card").innerText);
  for (const x of ["購入窓口の行き方", "エスカレーターを上がり、JR改札を出たら左に進む。小田急線の改札口の正面に「小田急旅行センター", "窓口・駅員さんにはこう伝えましょう", "小田原から新宿まで、ロマンスカーの特急券と乗車券をください。", "改札には「乗車券」だけ入れる。号車・座席は特急券で確認", "ロマンスカーは「乗車券」と「特急券」の両方がないと乗れません。", "切符を買うときに領収書をもらって、なくさず持っておいてください。", "帰りの案内（10/24）", "10/24(土) 11:00チェックアウト後は自由解散です。", "交通費を渡すので、帰りの切符は各自で購入してください。チケット代は事前にお渡しします。領収書はなくさず持っておいてください。"]) check(dayCard.includes(x), `2日目: 「${x}」がない`);
  // 1日目：新宿駅東口（クリックで画像、Googleマップへのリンク）
  await go("home");
  t = await pg.evaluate(() => document.querySelector(".timeline").innerText);
  for (const s of ["新宿駅東口に集合(画像有)", "熱海ニューフジヤホテル(Googleマップ)", "呑食処 えんじゅ(Googleマップ)", "Googleマップで見る", "ロマンスカーはこね25号 新宿発(乗車券だけ改札に入れる)", "号車・座席は特急券で確認"]) check(t.includes(s), `1日目: 「${s}」がない`);
  check(await pg.locator('a.sublink[href="https://maps.app.goo.gl/d1rKatw3uLTHDhho6?g_st=ac"][target="_blank"]').count() === 1, "1日目: Googleマップのリンクがない");
  const iTi = (x) => t.indexOf(x);
  check(iTi("宴会 開始") > 0 && iTi("22:50") > iTi("宴会 開始") && iTi("宴会 終了") > iTi("22:50") && t.lastIndexOf("自由行動") > iTi("宴会 終了"), "1日目: 宴会 開始 → 22:50 宴会 終了 → 自由行動 の並びが違う");
  check(await pg.locator('.timeline a.tl[href="https://maps.app.goo.gl/EBtd6uszDCZstAdp9"][target="_blank"][rel*="noopener"]').count() === 1, "1日目: ホテルチェックインがGoogleマップ（共有リンク）に飛ばない");
  check(await pg.evaluate(() => getComputedStyle(document.querySelector('[data-pop] .t')).color) !== "rgb(31, 95, 191)", "1日目: 「画像有」の文字が青色のまま（元の色に戻す指示）");
  check(await pg.locator('.timeline a.tl[href="https://maps.app.goo.gl/Lg2KSqTPoxktcysi6"][target="_blank"][rel*="noopener"]').count() === 1, "1日目: 宴会開始がえんじゅのGoogleマップ（共有リンク）に飛ばない");
  await pg.click('[data-pop="shinjuku"] .t');
  await pg.waitForTimeout(400);
  check(await pg.locator("#modal").isVisible() && await pg.locator("#modal img.popup-img").count() === 1, "新宿駅東口の画像がポップアップしない");
  const pc = await pg.evaluate(() => { const r = document.querySelector("#modal .sheet-modal").getBoundingClientRect(); return { dx: Math.abs((r.left + r.right) / 2 - innerWidth / 2), dy: Math.abs((r.top + r.bottom) / 2 - innerHeight / 2) }; });
  check(pc.dx <= 2 && pc.dy <= 2, `新宿駅東口の画像が画面の真ん中に出ていない（横${Math.round(pc.dx)}px・縦${Math.round(pc.dy)}pxずれ）`);
  await pg.goBack(); await pg.waitForTimeout(250);
  check(await pg.locator("#modal").isHidden(), "戻るで新宿駅東口の画像が閉じない");
  // 「Googleマップで見る」を押しても画像は開かない（実際の遷移はここでは止める）
  await pg.evaluate(() => document.querySelector("a.sublink").addEventListener("click", (e) => e.preventDefault(), { once: true }));
  await pg.click("a.sublink"); await pg.waitForTimeout(250);
  check(await pg.locator("#modal").isHidden(), "「Googleマップで見る」で画像まで開いてしまう");

  await go("hotel");
  t = await pg.evaluate(() => document.body.innerText);
  check(await pg.evaluate(() => { const sm = document.querySelector(".hotel-links .smoke"), mp = document.querySelector(".hotel-links .maplink"); return !!sm && sm.innerText.trim() === "喫煙所は1階" && sm.getBoundingClientRect().right <= mp.getBoundingClientRect().left && mp.getBoundingClientRect().right > sm.getBoundingClientRect().right; }), "ホテル: 左に「喫煙所は1階」・右に「ホテルマップ」になっていない");
  check(await pg.locator('.page-title a.maplink[href="https://maps.app.goo.gl/EBtd6uszDCZstAdp9"][target="_blank"]').count() === 1 && (await pg.locator(".page-title a.maplink").innerText()).includes("ホテルマップ"), "ホテル: 「ホテルマップ」のリンクがない");

  for (const s of ["【アネックス館】和室12畳 × 3部屋", "客室の一例", "15:00", "11:00", "7:00〜9:00"]) check(t.includes(s), `hotel: 「${s}」がない`);
  check(!/12畳＋6畳|二間/.test(t), "hotel: 別タイプの客室表記が混入");
  await pg.click('[data-htab="onsen"]');
  check(await pg.locator(".grid-fac .card").count() === 3, "温泉が3件でない");
  t = await pg.evaluate(() => document.querySelector(".grid-fac").innerText);
  for (const s of ["大浴場", "本館　地下2階", "14:00〜24:00", "展望露天風呂", "本館　11階", "家康の湯", "別館　3階（アネックス）", "15:00〜24:00", "翌5:00〜10:00"]) check(t.includes(s), `温泉: 「${s}」がない`);
  await pg.click('[data-of="別館"]');
  check(await pg.locator(".grid-fac .card").count() === 1, "温泉の別館絞り込みが効かない");

  await go("facilities");
  check(await pg.locator(".grid-fac .card").count() === 11, "館内施設が11件でない");
  t = await pg.evaluate(() => document.querySelector(".grid-fac").innerText);
  const fac = [["共用カラオケ", "本館　地下2階", "13:00〜24:00"], ["個室カラオケ", "要予約", "13:00〜23:50（50分枠）"], ["卓球", "別館　1階", "翌8:00〜11:00"],
    ["ゲームコーナー", "別館　3階", "13:00〜22:00"], ["麻雀ルーム", "本館　地下2階"], ["漫画コーナー", "本館　11階"], ["売店", "本館　1階", "12:30〜20:00"], ["朝食", "別館　1階 麗峰", "7:00〜9:00"],
    ["フロント", "本館　1階 ロビー"], ["浴衣コーナー", "本館　1階 ロビー"], ["アメニティコーナー", "本館 1階（浴衣コーナー前）", "アネックス館 1階（エレベーター前）", "お部屋にはご用意がありません"]];
  fac.forEach((a) => a.forEach((s) => check(t.includes(s), `施設: 「${s}」がない`)));
  check(!/プール/.test(t), "施設: プールが掲載されている");
  await pg.click('[data-ff="別館"]');
  check(await pg.locator(".grid-fac .card").count() === 4, "施設の別館絞り込みが効かない");

  await go("banquet");
  t = await pg.evaluate(() => document.body.innerText);
  check(await pg.locator(".facts div").first().locator("svg").count() === 0 && (await pg.locator(".facts div").count()) === 3, "宴会: 日時の上のカレンダーマークが残っている");
  check(await pg.locator(".venue-hero img.venue-photo").count() === 1 && await pg.locator(".venue-hero svg").count() === 0, "宴会: 上部がお店の外観写真になっていない（イラストが残っている）");
  for (const s of ["えんじゅ", "20:15", "18名", "飲み放題付き", "0557-55-7517", "静岡県熱海市中央町3-14", "19:50"]) check(t.includes(s), `宴会: 「${s}」がない`);
  check(await pg.locator('a[href="tel:0557557517"]').count() >= 1, "宴会: 電話のタップ発信リンクがない");
  check(!t.includes("ホテルからの道順") && !t.includes("地図はイメージです") && t.includes("（Googleマップ）") && t.includes("タップでGoogleマップ"), "宴会: 道順・地図カードの文言が違う");
  check(await pg.locator(".mapcard img.map-photo").count() === 1 && await pg.locator(".mapcard svg.map").count() === 0, "宴会: 地図カードがお店の写真になっていない");

  await go("transport");
  t = await pg.evaluate(() => document.body.innerText);
  check(t.includes("帰りの切符は各自で購入してください。チケット代は事前にお渡しします。領収書はなくさず持っておいてください。"), "交通: 帰りの案内文がない");
  check(t.includes("11:00チェックアウト後は自由解散"), "交通: 自由解散の案内がない");
  for (const s2 of ["乗車券", "特急券", "小田原から新宿まで、ロマンスカーの特急券と乗車券をください。", "領収書"]) check(t.includes(s2), `交通: 帰りの切符ガイド「${s2}」がない`);

  // 4. リンク：内部リンクは実在画面、外部リンクは別タブ＋noopener、電話は tel:
  const links = new Map();
  for (const r of ROUTES) {
    await go(r);
    if (r === "hotel") {
      await pg.click('[data-htab="room"]');
      const roomLs = await pg.evaluate(() => [...document.querySelectorAll("a[href]")].map((a) => ({ href: a.getAttribute("href"), target: a.target, rel: a.rel })));
      roomLs.forEach((l) => links.set(l.href, l));
    }
    if (r === "hotel") { await pg.click('[data-htab="onsen"]'); await pg.click('[data-of="すべて"]'); }
    if (r === "facilities") await pg.click('[data-ff="すべて"]');
    const ls = await pg.evaluate(() => [...document.querySelectorAll("a[href]")].map((a) => ({ href: a.getAttribute("href"), target: a.target, rel: a.rel })));
    ls.forEach((l) => links.set(l.href, l));
  }
  for (const [href, l] of links) {
    if (href.startsWith("#/")) check(ROUTES.includes(href.slice(2)), `内部リンク先がない: ${href}`);
    else if (href.startsWith("tel:")) check(/^tel:[0-9]+$/.test(href), `電話リンクの形式: ${href}`);
    else {
      check(/^https:\/\//.test(href), `httpsでない: ${href}`);
      check(l.target === "_blank" && /noopener/.test(l.rel), `外部リンクが別タブ/noopenerでない: ${href}`);
    }
  }
  const mustLinks = [
    "https://www.google.com/maps/search/?api=1&query=熱海ニューフジヤホテル",
    "https://www.google.com/maps/search/?api=1&query=呑食処えんじゅ+熱海",
    "https://www.google.com/maps/dir/?api=1&origin=熱海ニューフジヤホテル&destination=呑食処えんじゅ+熱海&travelmode=walking",
    "https://www.itoenhotel.com/atami_newfujiyahotel/hotspring/",
    "https://www.itoenhotel.com/atami_newfujiyahotel/facilities/",
    "https://www.itoenhotel.com/atami_newfujiyahotel/cuisine/",
    "tel:0557557517"
  ];
  mustLinks.forEach((h) => check(links.has(h), `必要なリンクがない: ${h}`));

  // 6. 2日目（旧「交通」ページ）：予定の2日目と同じ内容。古い交通の案内は出さない
  await go("transport");
  t = await pg.evaluate(() => document.querySelector("#view").innerText);
  check(t.includes("特急券と乗車券をください") && t.includes("帰りの案内（10/24）"), "2日目: 帰りの切符・帰りの案内がない");
  for (const s of ["ロマンスカーで帰る場合の切符", "帰りの切符について", "小田原でJRに乗換", "時刻・経路の確認", "JR東日本 公式", "新宿 → 小田原 → 熱海"]) check(!t.includes(s), `2日目: 削除したはずの「${s}」が残っている`);
  await go("hotel");
  check(!(await pg.evaluate(() => document.body.innerText)).includes("公式の客室紹介"), "ホテル: 客室紹介リンクが残っている");

  // 削除した画面・案内が出ないこと（乗換え案内図・案内ページ）
  await go("transport");
  check(await pg.locator("button.route-btn").count() === 0, "交通: 乗換え案内図が残っている");
  check(await pg.locator(".tabbar a").count() === 5, "下のメニューが5つでない");
  await go("info");
  check(pg.url().endsWith("#/info") && (await pg.evaluate(() => document.body.innerText)).includes("新宿駅東口に集合"), "案内（info）のURLがトップ（1日目）に戻らない");

  // 7. 写真：公式写真を表示（読めない写真は公式ページへのリンクに切り替え）
  await go("facilities");
  await pg.click('[data-ff="すべて"]'); await pg.waitForTimeout(2500);
  const fImg = await pg.locator(".photo img").count(), fLink = await pg.locator("a.photo.placeholder").count();
  check(fImg + fLink === 11, `施設の写真欄が11件でない img=${fImg} link=${fLink}`);
  check(fImg === 11, `施設の写真が11枚そろっていない（フロント・浴衣・アメニティ・朝食・麻雀・漫画・売店を含む） img=${fImg}`);

  // 7b. 施設の写真は施設ごとに区切る：朝食は7枚、他の施設の写真と混ざらない
  await go("facilities");
  await pg.click('[data-ff="すべて"]'); await pg.waitForTimeout(800);
  check((await pg.locator(".grid-fac .card", { has: pg.locator("h3", { hasText: "朝食" }) }).locator(".ph-count").innerText()) === "写真 7枚", "朝食: 写真枚数の表示が違う");
  await pg.locator(".grid-fac .card", { has: pg.locator("h3", { hasText: "朝食" }) }).locator("button.photo").click();
  await pg.waitForTimeout(300);
  check((await pg.locator("#lightbox .count").innerText()) === "1 / 7", "朝食: 拡大が1/7でない");
  await pg.keyboard.press("ArrowRight");
  check((await pg.locator("#lightbox .count").innerText()) === "2 / 7", "朝食: 次の写真が2/7でない");
  await pg.keyboard.press("ArrowLeft"); await pg.keyboard.press("ArrowLeft");
  check((await pg.locator("#lightbox .count").innerText()) === "7 / 7", "朝食: 最初から戻ると7/7（朝食の中で一周）にならない");
  check((await pg.locator("#lightbox .lb-cap").innerText()).includes("朝食"), "朝食: 拡大の説明が朝食でない");
  await pg.goBack(); await pg.waitForTimeout(250);
  check(await pg.locator("#lightbox").isHidden(), "朝食: 戻るで拡大が閉じない");
  await pg.locator(".grid-fac .card", { has: pg.locator("h3", { hasText: "共用カラオケ" }) }).locator("button.photo").click();
  await pg.waitForTimeout(300);
  check((await pg.locator("#lightbox .count").innerText()) === "1 / 1" && await pg.locator("#lightbox .next").count() === 0, "共用カラオケ: 他の施設の写真が混ざっている");
  await pg.goBack(); await pg.waitForTimeout(250);

  // 8. 写真の拡大表示（?photos=on）：読み込めた場合は拡大・切替・戻る、読めない場合は公式リンクに差し替え
  await go("hotel", "?photos=on");
  await pg.click('[data-htab="onsen"]');
  await pg.waitForTimeout(2500);
  const imgs = await pg.locator(".photo img").count();
  const ph = await pg.locator("a.photo.placeholder").count();
  check(imgs + ph === 3, `温泉写真の表示数が違う img=${imgs} link=${ph}`);
  if (imgs > 0) {
    await pg.locator("[data-lb]").first().click();
    check(await pg.locator("#lightbox").isVisible(), "写真が拡大しない");
    await pg.goBack(); await pg.waitForTimeout(200);
    check(await pg.locator("#lightbox").isHidden(), "戻るで写真の拡大が閉じない");
  }
  // 拡大表示そのものの動作（ネット環境に関係なく確認するため、テスト用の画像に差し替え）
  await go("hotel", "?photos=on");
  await pg.route(/\.(jpg|jpeg)$/, (route) => route.fulfill({ status: 200, contentType: "image/svg+xml",
    body: '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="#4a6fa5"/></svg>' }));
  await pg.reload(); await pg.waitForTimeout(300);
  // 客室：和室12畳の2枚（1/2、2/2）
  check((await pg.locator(".photo img").count()) === 1 && (await pg.locator(".ph-count").innerText()) === "写真 2枚", "客室: 写真2枚の表示が違う");
  await pg.locator("[data-lb]").first().click();
  check((await pg.locator("#lightbox .count").innerText()) === "1 / 2", "客室: 拡大が1/2でない");
  await pg.locator("#lightbox .next").click();
  check((await pg.locator("#lightbox .count").innerText()) === "2 / 2", "客室: 次の写真が2/2でない");
  check(await pg.locator('#lightbox a[href="https://www.itoenhotel.com/atami_newfujiyahotel/gallery/"]').count() === 1, "客室: 出典がフォトギャラリーでない");
  await pg.keyboard.press("Escape"); await pg.waitForTimeout(200);
  await pg.click('[data-htab="onsen"]'); await pg.waitForTimeout(300);
  await pg.locator("[data-lb]").first().click();
  check(await pg.locator("#lightbox").isVisible(), "拡大表示が開かない");
  // 温泉は1か所1枚：3か所の写真が混ざらない
  check((await pg.locator("#lightbox .count").innerText()) === "1 / 1" && await pg.locator("#lightbox .next").count() === 0, "温泉: 別の温泉の写真が混ざっている");
  check(await pg.locator('#lightbox a[href^="https://www.itoenhotel.com/"]').count() === 1, "拡大表示に出典リンクがない");
  if (SHOTS) await pg.screenshot({ path: `${SHOTS}/lightbox.png` });
  await pg.keyboard.press("Escape"); await pg.waitForTimeout(200);
  check(await pg.locator("#lightbox").isHidden(), "Escで拡大が閉じない");
  await pg.unroute(/\.(jpg|jpeg)$/);

  // 9. 写真が読めないときは公式リンクに差し替わる
  // （同じサイトの画像はオフライン用の仕組みが通信を横取りして失敗させられないため、仕組みを止めた別画面で確かめる）
  {
    const ctx2 = await browser.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: "block" });
    const pg2 = await ctx2.newPage();
    await pg2.route(/\.(jpg|jpeg)$/, (route) => route.abort());
    await pg2.goto(BASE + "?photos=on#/facilities"); await pg2.waitForTimeout(500);
    await pg2.click('[data-ff="すべて"]');
    await pg2.evaluate(() => document.querySelectorAll(".photo img").forEach((i) => { i.loading = "eager"; })); // 画面の外の写真も読み込ませる
    await pg2.waitForTimeout(1500);
    check(await pg2.locator(".photo img").count() === 0 && await pg2.locator("a.photo.placeholder").count() === 11, "読めない写真が公式リンクに差し替わらない");
    await ctx2.close();
  }

  // 10. 画像の代替テキスト
  check(await pg.evaluate(() => [...document.images].every((i) => i.alt)), "altのない画像がある");

  // 11. オフライン：一度開いたあとは電波がなくても表示できる
  await go("home");
  await pg.evaluate(() => navigator.serviceWorker.ready);
  await pg.reload(); await pg.waitForTimeout(500);
  await ctx.setOffline(true);
  await pg.reload(); await pg.waitForTimeout(500);
  check((await pg.evaluate(() => document.body.innerText)).includes("ホテルチェックイン"), "オフラインで表示できない");
  await ctx.setOffline(false);

  // 12. LINE共有用の情報
  const og = await pg.evaluate(() => [...document.querySelectorAll('meta[property^="og:"]')].map((m) => m.getAttribute("property") + "=" + m.content));
  check(og.some((x) => /^og:image=https:\/\//.test(x)), "og:image が絶対URLでない");
  check(og.some((x) => x.startsWith("og:title=")), "og:title がない");

  check(errors.length === 0, "スクリプトエラー: " + errors.join(" / "));
  await browser.close();

  console.log(`合格 ${passes} 件 / 不合格 ${fails.length} 件`);
  fails.forEach((f) => console.log("  ✗ " + f));
  process.exit(fails.length ? 1 : 0);
})();
