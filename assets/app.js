(function () {
  "use strict";

  var T = window.TRIP;
  try {
    var qp = new URLSearchParams(location.search).get("photos");
    if (qp === "on") T.photoMode = "embed";
    if (qp === "off") T.photoMode = "link";
  } catch (e) {}

  /* ---------- アイコン（線画SVG） ---------- */
  var P = {
    calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 9.5h17M8 3v4M16 3v4M7.5 13h2M11 13h2M14.5 13h2M7.5 16.5h2M11 16.5h2"/>',
    pin: '<path d="M12 21s-6.5-6.2-6.5-11.2a6.5 6.5 0 0 1 13 0C18.5 14.8 12 21 12 21z"/><circle cx="12" cy="9.8" r="2.4"/>',
    bag: '<rect x="3.5" y="7.5" width="17" height="12.5" rx="2.2"/><path d="M8.5 7.5V5.5a1.5 1.5 0 0 1 1.5-1.5h4a1.5 1.5 0 0 1 1.5 1.5v2M8.5 7.5v12.5M15.5 7.5v12.5"/>',
    info: '<circle cx="12" cy="12" r="8.8"/><path d="M12 10.8v5.4M12 7.6v.2"/>',
    train: '<rect x="5.5" y="3.5" width="13" height="14" rx="3"/><path d="M5.5 10.5h13M9 14.3h.01M15 14.3h.01M8.5 17.5 6.5 20.5M15.5 17.5l2 3M9 6.5h6"/>',
    hotel: '<path d="M4 20.5V5.5a1.5 1.5 0 0 1 1.5-1.5h9A1.5 1.5 0 0 1 16 5.5v15M16 10h3a1 1 0 0 1 1 1v9.5M2.5 20.5h19M7.5 7.5h1.5M11 7.5h1.5M7.5 11h1.5M11 11h1.5M7.5 14.5h1.5M11 14.5h1.5M9 20.5v-3h2v3"/>',
    spa: '<path d="M4 14.5c0 3 3.6 5.5 8 5.5s8-2.5 8-5.5H4z"/><path d="M8.5 11c-1-1.3 1-2.2 0-3.6M12 11c-1-1.3 1-2.2 0-3.6M15.5 11c-1-1.3 1-2.2 0-3.6"/>',
    dining: '<path d="M7 3.5v6.5a2 2 0 0 0 2 2v8.5M5 3.5v5M9 3.5v5M7 12v8.5M17 20.5v-17c-2.2.6-3.5 3-3.5 6.4V13h3.5"/>',
    bell: '<path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 2H4.5l1.5-2zM10 20.5a2 2 0 0 0 4 0"/>',
    people: '<circle cx="12" cy="8" r="3"/><path d="M6 19.5c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5"/><circle cx="5.3" cy="10" r="2.1"/><circle cx="18.7" cy="10" r="2.1"/><path d="M2 18.5c0-2.1 1.3-3.6 3.3-4M22 18.5c0-2.1-1.3-3.6-3.3-4"/>',
    swap: '<path d="M4 8.5h15l-3.5-3.5M20 15.5H5l3.5 3.5"/>',
    walk: '<circle cx="13" cy="4.5" r="1.8"/><path d="M10.5 21l2-6.5 2.8 2.6v3.9M9 11.5l1.7-3.5 3.3-.5 2 3.5 2.5 1M10.7 8 8 9.5l-1.2 3.3M12.5 14.5l1-4.5"/>',
    bed: '<path d="M3 18.5V6M3 14h18v4.5M21 14v-2.5A2.5 2.5 0 0 0 18.5 9H11v5"/><circle cx="7" cy="11" r="1.8"/>',
    breakfast: '<path d="M4 11h13v1.5a6.5 6.5 0 0 1-13 0V11zM17 12h1.5a2.5 2.5 0 0 1 0 5h-2M7.5 4c-.8 1.2.8 2 0 3.5M10.5 4c-.8 1.2.8 2 0 3.5M13.5 4c-.8 1.2.8 2 0 3.5M3 21h15"/>',
    flag: '<path d="M5.5 21V3.5M5.5 4h11l-2 3.5 2 3.5h-11"/>',
    phone: '<path d="M6.6 3.6 9 3.5l1.6 4-2 1.4a11 11 0 0 0 6.5 6.5l1.4-2 4 1.6-.1 2.4a2 2 0 0 1-2.2 1.9A16.5 16.5 0 0 1 4.7 5.8a2 2 0 0 1 1.9-2.2z"/>',
    chevron: '<path d="M9 5.5 15.5 12 9 18.5"/>',
    back: '<path d="M15 5.5 8.5 12l6.5 6.5"/>',
    ext: '<path d="M14 4.5h5.5V10M19.5 4.5 11 13M17 14v4.5a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 4 18.5v-10A1.5 1.5 0 0 1 5.5 7H10"/>',
    check: '<path d="M5 12.5 10 17.5 19.5 7"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>',
    zoom: '<circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5 5M8 10.5h5M10.5 8v5"/>',
    camera: '<path d="M4 8.5A1.5 1.5 0 0 1 5.5 7h2.3l1.5-2h5.4l1.5 2h2.3A1.5 1.5 0 0 1 20 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5v-9z"/><circle cx="12" cy="13" r="3.4"/>',
    ticket: '<path d="M3.5 7.5h17v3a1.8 1.8 0 0 0 0 3.5v3h-17v-3a1.8 1.8 0 0 0 0-3.5v-3z"/><path d="M14 7.5v9" stroke-dasharray="1.5 2"/>',
    receipt: '<path d="M6 3.5h12v17l-2-1.3-2 1.3-2-1.3-2 1.3-2-1.3-2 1.3v-17z"/><path d="M9 8h6M9 11.5h6M9 15h4"/>',
    memo: '<rect x="5" y="3.5" width="14" height="17" rx="2"/><path d="M8.5 8.5h7M8.5 12h7M8.5 15.5h4"/>',
    alarm: '<path d="M7 18.5v-5a5 5 0 0 1 10 0v5M5 18.5h14v2H5zM12 3v2M4.5 6l1.4 1.4M19.5 6l-1.4 1.4"/>',
    mic: '<rect x="9" y="3.5" width="6" height="11" rx="3"/><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3M8.5 21h7"/>',
    pingpong: '<circle cx="10" cy="10" r="6"/><path d="M14.2 14.2 20 20M18.5 6.5h.01"/>',
    game: '<rect x="3" y="7.5" width="18" height="10" rx="5"/><path d="M7.5 11v3M6 12.5h3M15.5 11.5h.01M17.5 13.5h.01"/>',
    mahjong: '<rect x="4.5" y="3.5" width="10" height="13.5" rx="1.5"/><path d="M9.5 17v3.5h10V7H14.5"/><path d="M7.5 8h4M9.5 6v6"/>',
    book: '<path d="M12 6.5c-2-1.6-4.6-2-7.5-1.5v13c2.9-.5 5.5-.1 7.5 1.5 2-1.6 4.6-2 7.5-1.5V5c-2.9-.5-5.5-.1-7.5 1.5zM12 6.5v13"/>',
    shop: '<path d="M4 9.5 5.5 4h13L20 9.5M4 9.5a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0 2.7 2.7 0 0 0 5.3 0M5 11.5v9h14v-9M10 20.5v-5h4v5"/>',
    beer: '<path d="M6 7.5h9.5v13H6zM15.5 10h2a1.5 1.5 0 0 1 1.5 1.5v4a1.5 1.5 0 0 1-1.5 1.5h-2M6 7.5a2.3 2.3 0 0 1 2.3-3 3 3 0 0 1 5 .2A2.2 2.2 0 0 1 15.5 7.5"/><path d="M9 11v6.5M12.5 11v6.5"/>',
    station: '<path d="M4 9.5 12 4l8 5.5M6 9.5v10M18 9.5v10M4 20h16M9.5 20v-5.5h5V20"/>',
    reset: '<path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3M4.5 4v4.5H9"/>'
  };
  function ic(name, cls) {
    return '<svg class="' + (cls || "") + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (P[name] || P.info) + "</svg>";
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function ext(url, inner, cls) {
    return '<a class="' + (cls || "") + '" href="' + esc(url) + '" target="_blank" rel="noopener noreferrer">' + inner + "</a>";
  }
  function telHref(n) { return "tel:" + String(n).replace(/[^0-9+]/g, ""); }

  /* ---------- ヒーロー（各ページ上部の熱海の夜景写真） ---------- */
  function heroArt() {
    return T.heroPhoto ? '<img class="hero-art hero-photo" src="' + esc(T.heroPhoto) + '" alt="熱海の夜景">' : "";
  }

  function todayIso() {
    var d = new Date();
    return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2);
  }
  function nextIndex(day) {
    if (day.iso !== todayIso()) return -1;
    var now = new Date(), m = now.getHours() * 60 + now.getMinutes();
    for (var i = 0; i < day.items.length; i++) {
      var t = day.items[i].time; if (!t) continue;
      var p = t.split(":"); if (+p[0] * 60 + +p[1] >= m) return i;
    }
    return -1;
  }

  function renderHero(compact) {
    var h = document.getElementById("hero");
    h.className = "hero"; // 全ページ同じ高さ・同じ位置
    h.innerHTML = heroArt() +
      '<div class="hero-text">' +
      '<h1>' + esc(T.title) + '<span class="yr">' + esc(T.year) + "</span></h1>" +
      '<div class="meta"><span>' + esc(T.dateLabel) + "</span></div></div>";
  }

  /* ---------- 写真 ---------- */
  var gallery = []; // 現在の画面の写真一覧（拡大用）

  function photoBlock(p) {
    // p: {src, caption, source, sourceName, icon}
    if (T.photoMode === "embed" && p.src) {
      var idx = gallery.push(p) - 1;
      (p.more || []).forEach(function (m) {
        gallery.push({ src: m, caption: p.caption, label: p.label, source: p.source, sourceName: p.sourceName, group: p.group });
      });
      var cnt = p.more && p.more.length ? '<span class="ph-count">写真 ' + (p.more.length + 1) + "枚</span>" : "";
      return '<button type="button" class="photo" data-lb="' + idx + '" aria-label="' + esc(p.caption) + 'の写真を拡大">' +
        '<span class="skeleton"></span>' +
        '<img src="' + esc(p.src) + '" alt="' + esc(p.caption) + '" loading="lazy" decoding="async" referrerpolicy="no-referrer" data-fallback="' + esc(p.source) + '">' +
        (p.label ? '<span class="ph-label">' + esc(p.label) + "</span>" : "") + cnt +
        '<span class="zoom">' + ic("zoom") + "</span></button>";
    }
    return ext(p.source,
      "<div>" + '<div class="ph-ico">' + ic(p.icon || "camera") + "</div>" +
      "<b>" + esc(p.caption) + "</b>" +
      "<span>公式ページで写真を見る " + ic("ext") + "</span>" +
      "<small>" + (p.src ? "写真の掲載許可を確認中のため、公式ページへ移動して表示します" : "このしおりには写真を載せていません") + "</small></div>",
      "photo placeholder");
  }

  function bindPhotos(root) {
    root.querySelectorAll(".photo img").forEach(function (img) {
      function done() { var sk = img.parentNode.querySelector(".skeleton"); if (sk) sk.remove(); }
      img.addEventListener("load", done);
      img.addEventListener("error", function () {
        // 画像が出ないとき：公式ページへの代替リンクに差し替える
        var btn = img.closest(".photo");
        var src = img.getAttribute("data-fallback");
        var a = document.createElement("a");
        a.className = "photo placeholder";
        a.href = src; a.target = "_blank"; a.rel = "noopener noreferrer";
        a.innerHTML = '<div><div class="ph-ico">' + ic("camera") + "</div><b>写真を読み込めませんでした</b><span>公式ページで写真を見る " + ic("ext") + "</span></div>";
        btn.replaceWith(a);
      });
      if (img.complete && img.naturalWidth) done();
      // 読み込みの失敗が、この処理より先に終わっていた場合も代替リンクにする
      if (img.complete && !img.naturalWidth && img.getAttribute("src")) img.dispatchEvent(new Event("error"));
    });
    root.querySelectorAll("[data-lb]").forEach(function (b) {
      b.addEventListener("click", function () { openLightbox(+b.getAttribute("data-lb")); });
    });
  }

  /* ---------- ライトボックス ---------- */
  var lb = document.getElementById("lightbox");
  var lbIndex = 0, lbOpen = false, lastFocus = null, lbList = []; // lbList: いま開いている写真の並び（同じ施設の写真だけ）

  function drawLightbox() {
    var p = gallery[lbList[lbIndex]];
    lb.innerHTML =
      '<div class="lb-top"><span class="count">' + (lbIndex + 1) + " / " + lbList.length + "</span>" +
      '<button type="button" class="iconbtn" data-close aria-label="閉じる">' + ic("close") + "</button></div>" +
      '<div class="lb-stage">' +
      '<img src="' + esc(p.src) + '" alt="' + esc(p.caption) + '" referrerpolicy="no-referrer">' +
      (lbList.length > 1 ? '<button type="button" class="iconbtn prev" aria-label="前の写真">' + ic("back") + '</button><button type="button" class="iconbtn next" aria-label="次の写真">' + ic("chevron") + "</button>" : "") +
      "</div>" +
      '<div class="lb-cap"><b>' + esc(p.caption) + "</b>" + (p.label ? esc(p.label) + "<br>" : "") +
      "出典：" + ext(p.source, esc(p.sourceName || "公式ページ") + " ↗") + "</div>";
    lb.querySelector("[data-close]").onclick = function () { history.back(); };
    var pv = lb.querySelector(".prev"), nx = lb.querySelector(".next");
    if (pv) pv.onclick = function () { step(-1); };
    if (nx) nx.onclick = function () { step(1); };
    lb.querySelector(".lb-stage img").onerror = function () {
      lb.querySelector(".lb-stage").innerHTML = '<div class="lb-err">写真を読み込めませんでした。<br>' + ext(p.source, "公式ページで見る ↗") + "</div>";
    };
  }
  function step(d) { lbIndex = (lbIndex + d + lbList.length) % lbList.length; drawLightbox(); }
  function openLightbox(i) {
    lastFocus = document.activeElement;
    var grp = gallery[i].group || "";
    lbList = [];
    gallery.forEach(function (g, k) { if ((g.group || "") === grp) lbList.push(k); });
    lbIndex = lbList.indexOf(i); drawLightbox();
    lb.hidden = false; lbOpen = true; document.body.style.overflow = "hidden";
    history.pushState({ overlay: "lb" }, "");
    lb.querySelector("[data-close]").focus();
  }
  function closeOverlays() {
    lb.hidden = true; lbOpen = false;
    modal.hidden = true;
    document.body.style.overflow = "";
    if (lastFocus) { try { lastFocus.focus(); } catch (e) {} }
  }
  var touchX = null;
  lb.addEventListener("touchstart", function (e) { touchX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", function (e) {
    if (touchX == null) return;
    var dx = e.changedTouches[0].clientX - touchX; touchX = null;
    if (Math.abs(dx) > 50 && lbList.length > 1) step(dx < 0 ? 1 : -1);
  });
  document.addEventListener("keydown", function (e) {
    if (lbOpen) {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    }
    if (e.key === "Escape" && (lbOpen || !modal.hidden)) history.back();
  });

  /* ---------- モーダル（乗換図の拡大） ---------- */
  var modal = document.getElementById("modal");
  function openModal(title, html) {
    lastFocus = document.activeElement;
    modal.innerHTML = '<div class="sheet-modal"><div class="mh"><h2>' + esc(title) + '</h2><button type="button" class="iconbtn" data-close aria-label="閉じる">' + ic("close") + "</button></div>" + html + "</div>";
    modal.hidden = false; document.body.style.overflow = "hidden";
    modal.setAttribute("aria-label", title);
    modal.querySelector("[data-close]").onclick = function () { history.back(); };
    modal.onclick = function (e) { if (e.target === modal) history.back(); };
    history.pushState({ overlay: "modal" }, "");
    modal.querySelector("[data-close]").focus();
  }
  window.addEventListener("popstate", function () { if (lbOpen || !modal.hidden) closeOverlays(); });

  /* ---------- 共通パーツ ---------- */
  var ROUTES = [
    { id: "home", label: "1日目", icon: "calendar" },
    { id: "transport", label: "2日目", icon: "train" },
    { id: "hotel", label: "ホテル", icon: "hotel" },
    { id: "facilities", label: "施設", icon: "spa" },
    { id: "banquet", label: "宴会", icon: "dining" }
  ];
  function renderTabbar(cur) {
    document.getElementById("tabbar").innerHTML = ROUTES.map(function (r) {
      return '<a href="#/' + r.id + '"' + (r.id === cur ? ' aria-current="page"' : "") + ">" + ic(r.icon) + "<span>" + r.label + "</span></a>";
    }).join("");
  }
  function pageTitle(icon, title, sub, extra) {
    return '<div class="page-title"><div class="badge-ico">' + ic(icon) + "</div><div><h2" + (title.length > 9 ? ' class="long"' : "") + ">" + esc(title) + "</h2>" + (sub ? "<p>" + esc(sub) + "</p>" : "") + (extra || "") + "</div></div>";
  }
  function tlItem(it, i, nx) {
    var sub = it.sub ? '<br><span class="s">' + (it.subUrl ? ext(it.subUrl, esc(it.sub) + " " + ic("ext"), "sublink") : esc(it.sub).replace(/\n/g, "<br>")) + "</span>" : "";
    var inner = (i === nx ? '<span class="now-tag">次の予定</span>' : "") + '<span class="time">' + esc(it.time) + "</span>" +
      '<span class="dot' + (it.time ? "" : " hollow") + '"></span>' +
      '<span class="circle-ico">' + ic(it.icon) + "</span>" +
      '<span class="body"><span class="t">' + (it.popup ? esc(it.title.slice(0, -1)) + '<span class="nowrap-end">' + esc(it.title.slice(-1)) + ic("ext") + "</span>" : esc(it.title)) + "</span>" + sub + "</span>";
    var box;
    if (it.hotelMap) box = ext(T.hotel.shareMapUrl, inner, "tl");
    else if (it.banquetMap) box = ext(T.banquet.shareMapUrl, inner, "tl");
    else if (it.link) box = '<a class="tl" href="#/' + it.link + '">' + inner + "</a>";
    else if (it.popup) box = '<div class="tl popup-tl" data-pop="' + esc(it.popup) + '" role="button" tabindex="0" aria-label="' + esc(it.title) + 'の写真を開く">' + inner + "</div>";
    else box = '<div class="tl">' + inner + "</div>";
    return "<li" + (i === nx ? ' class="is-next"' : "") + ">" + box + "</li>";
  }
  function timeline(items, day) {
    var nx = day ? nextIndex(day) : -1;
    return '<ol class="timeline">' + items.map(function (it, i) { return tlItem(it, i, nx); }).join("") + "</ol>";
  }
  // 「|」の位置だけで折り返す（単語の途中で切れないようにする）
  function phrases(text) { return text.split("|").map(function (p) { return '<span class="ph">' + esc(p) + "</span>"; }).join("<wbr>"); }
  function dayLinks(d) {
    if (!d.links || !d.links.length) return "";
    var g = d.guide;
    return '<div class="rows day-links">' + d.links.map(function (l) {
      return ext(l.url, '<span class="circle-ico sm">' + ic(l.icon) + '</span><span class="v"><b>' + esc(l.label) + "</b>" + (l.sub ? "<br>" + esc(l.sub) : "") + "</span>" + ic("ext", "chev"));
    }).join("") + "</div>" + (g ?
      (g.way ? '<div class="day-way"><b>' + esc(g.way.title) + "</b><p>" + esc(g.way.before) + ext(g.way.url, esc(g.way.link) + " " + ic("ext"), "inlink") + esc(g.way.after) + "</p></div>" : "") +
      '<div class="say"><span class="lbl">窓口・駅員さんにはこう伝えましょう</span><p>「' + phrases(g.say) + "」</p>" + (g.sayNote ? '<p class="say-note">' + phrases(g.sayNote) + "</p>" : "") + "</div>" +
      '<ul class="ul day-notes">' + g.notes.map(function (n) { return "<li>" + esc(n) + "</li>"; }).join("") + "</ul>" : "") +
      (d.showReturnInfo ? '<div class="day-return"><h3>帰りの案内（10/24）</h3><div class="prose">' + T.transport.returnInfo.map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("") + "</div></div>" : "");
  }
  function bindPopups(root) {
    root.querySelectorAll("[data-pop]").forEach(function (el) {
      function open(e) {
        if (e.target.closest && e.target.closest("a")) return; // 中のリンクは別扱い
        var p = (T.popups || {})[el.getAttribute("data-pop")];
        if (!p) return;
        openModal(p.title, '<img class="popup-img" src="' + esc(p.src) + '" alt="' + esc(p.alt || p.title) + '">');
      }
      el.addEventListener("click", open);
      el.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(e); } });
    });
  }
  function hoursHtml(h) { if (!h || !h.length) return ""; return '<div class="hours">' + h.map(function (x) { return "<span>" + esc(x) + "</span>"; }).join("") + "</div>"; }
  function foot() { return ""; }

  /* ---------- 画面：予定（トップ） ---------- */
  // 下のメニュー「1日目」「2日目」：どちらも同じ作りで、日ごとの予定を出す
  function viewDay(n) {
    var d = T.schedule[n];
    return '<section class="card">' +
      timeline(d.items, d) + dayLinks(d) + "</section>" + foot();
  }
  function viewHome() { return viewDay(0); }
  function viewTransport() { return viewDay(1); }

  /* ---------- 画面：ホテル（客室／温泉） ---------- */
  var hotelTab = "room", onsenFilter = "すべて";
  function viewHotel() {
    var H = T.hotel;
    var tabs = '<div class="day-tabs" role="tablist" style="padding:0 0 12px">' +
      [["room", "客室", "アネックス館"], ["onsen", "温泉", "3か所"]].map(function (t) {
        return '<button type="button" class="seg" role="tab" aria-selected="' + (hotelTab === t[0]) + '" data-htab="' + t[0] + '">' + t[1] + "<small>" + t[2] + "</small></button>";
      }).join("") + "</div>";
    var body;
    if (hotelTab === "room") {
      body = '<section class="card">' +
        photoBlock({ src: H.roomPhoto.photos[0], more: H.roomPhoto.photos.slice(1), group: "room", caption: H.roomPhoto.caption, label: "客室の一例", source: H.roomPhoto.source, sourceName: H.roomPhoto.sourceName, icon: "bed" }) +
        '<div class="photo-body"><h3>' + esc(H.room) + " × " + H.roomCount + "部屋</h3>" +
        '<div class="where">写真は「客室の一例」です。実際のお部屋と異なる場合があります。</div></div>' +
        '<div class="hotel-facts"><div><small>チェックイン</small><b>' + esc(H.checkin) + "</b></div><div><small>チェックアウト</small><b>" + esc(H.checkout) + "</b></div><div><small>朝食</small><b>7:00〜9:00</b></div></div>" +
        '<div class="rows" style="margin-top:6px">' +
        ext(H.mapUrl, '<span class="circle-ico sm">' + ic("pin") + '</span><span class="k">住所</span><span class="v">' + esc(H.address) + "</span>" + ic("chevron", "chev")) +
        ext(H.galleryUrl, '<span class="circle-ico sm">' + ic("camera") + '</span><span class="k">写真</span><span class="v">ホテルの写真をまとめて見る（公式）</span>' + ic("chevron", "chev")) +
        "</div></section>";
    } else {
      var O = T.onsen;
      var list = O.items.filter(function (o) { return onsenFilter === "すべて" || o.building === onsenFilter; });
      body = '<div class="chips" role="group" aria-label="館で絞り込み">' + ["別館", "本館", "すべて"].map(function (b) {
        return '<button type="button" class="chip" aria-pressed="' + (onsenFilter === b) + '" data-of="' + b + '">' + (b === "別館" ? "アネックス館" : b === "すべて" ? "全て" : b) + "</button>";
      }).join("") + "</div>" +
        '<div class="grid-fac">' + list.map(function (o) {
          return '<section class="card">' +
            photoBlock({ src: o.photo, group: "onsen-" + o.name, caption: o.name + "（" + o.building + " " + o.floor + "）", label: o.building + " " + o.floor, source: O.sourceUrl, sourceName: "公式 温泉ページ", icon: "spa" }) +
            '<div class="photo-body"><h3>' + esc(o.name) + '</h3><div class="where">' + esc(o.building) + "　" + esc(o.floor) + "</div>" +
            hoursHtml(o.hours) + (o.note ? '<p class="note">※ ' + esc(o.note) + "</p>" : "") +
            ext(O.sourceUrl, "公式ページ " + ic("ext"), "src") + "</div></section>";
        }).join("") + "</div>";
    }
    return pageTitle("hotel", H.name, "チェックイン" + H.checkin + "・アウト翌" + H.checkout, '<div class="hotel-links"><span class="smoke">喫煙所は1階</span>' + ext(H.shareMapUrl, ic("pin") + "ホテルマップ " + ic("ext"), "maplink") + "</div>") + tabs + body + foot();
  }
  function bindHotel(root) {
    root.querySelectorAll("[data-htab]").forEach(function (b) { b.addEventListener("click", function () { hotelTab = b.getAttribute("data-htab"); render(true); }); });
    root.querySelectorAll("[data-of]").forEach(function (b) { b.addEventListener("click", function () { onsenFilter = b.getAttribute("data-of"); render(true); }); });
  }

  /* ---------- 画面：館内施設 ---------- */
  var facFilter = "すべて";
  function viewFacilities() {
    var F = T.facilities;
    var list = F.items.filter(function (f) { return facFilter === "すべて" || f.building === facFilter || (f.buildings && f.buildings.indexOf(facFilter) >= 0); });
    return pageTitle("spa", "館内施設", "熱海ニューフジヤホテル") +
      '<div class="chips" role="group" aria-label="館で絞り込み">' + ["別館", "本館", "すべて"].map(function (b) {
        return '<button type="button" class="chip" aria-pressed="' + (facFilter === b) + '" data-ff="' + b + '">' + (b === "別館" ? "アネックス館" : b === "すべて" ? "全て" : b) + "</button>";
      }).join("") + "</div>" +
      '<div class="grid-fac">' + list.map(function (f) {
        var src = f.sourceUrl || F.sourceUrl;
        return '<section class="card">' +
          photoBlock({ src: (f.photos && f.photos[0]) || f.photo, more: f.photos ? f.photos.slice(1) : [], group: "fac-" + f.name, caption: f.name + (f.building ? "（" + f.building + " " + f.floor + "）" : ""), label: f.label || (f.building ? f.building + " " + f.floor : ""), source: src, sourceName: f.sourceName || "公式 館内施設ページ", icon: f.icon }) +
          '<div class="photo-body"><h3>' + esc(f.name) + "</h3>" +
          '<div class="where">' + esc((f.building ? f.building + "　" : "") + f.floor) + (f.reserve ? "　・" + esc(f.reserve) : "") + "</div>" +
          hoursHtml(f.hours) + (f.note ? '<p class="note">※ ' + esc(f.note) + "</p>" : "") +
          ext(src, (f.sourceName || "公式ページ") + " " + ic("ext"), "src") + "</div></section>";
      }).join("") + "</div>" + foot();
  }
  function bindFacilities(root) {
    root.querySelectorAll("[data-ff]").forEach(function (b) { b.addEventListener("click", function () { facFilter = b.getAttribute("data-ff"); render(true); }); });
  }

  /* ---------- 画面：宴会 ---------- */
  function viewBanquet() {
    var B = T.banquet;
    return '<div class="backbar"><a href="#/home">' + ic("back") + '戻る</a><div class="c"><h2>宴会</h2><small>' + esc(B.prefix + " " + B.name) + "</small></div><span></span></div>" +
      '<section class="card" style="overflow:visible;padding-bottom:12px">' +
      '<div class="venue-hero"><img class="venue-photo" src="' + esc(B.photo) + '" alt="呑食処 えんじゅの外観"></div>' +
      '<div class="venue-name">' + ext(B.tabelogUrl, '<span class="gico">' + ic("dining") + "</span><span><small>" + esc(B.prefix) + "</small><strong>" + esc(B.name) + "</strong></span>" + ic("chevron", "chev"), "top") +
      '<div class="facts">' +
      "<div>" + esc(B.date) + "<br>" + esc(B.time) + "</div>" +
      "<div>" + ic("people") + esc(B.people) + "名</div>" +
      "<div>" + ic("beer") + "飲み放題付き</div>" +
      "</div></div></section>" +

      '<section class="card rows">' +
      '<a href="' + telHref(B.tel) + '"><span class="circle-ico sm">' + ic("phone") + '</span><span class="k">電話</span><span class="v">' + esc(B.tel) + "</span>" + ic("chevron", "chev") + "</a>" +
      ext(B.mapUrl, '<span class="circle-ico sm">' + ic("pin") + '</span><span class="k">住所</span><span class="v">' + esc(B.address) + "</span>" + ic("chevron", "chev")) +
      ext(B.walkUrl, '<span class="circle-ico sm">' + ic("walk") + '</span><span class="k">徒歩</span><span class="v">（Googleマップ）</span>' + ic("chevron", "chev")) +
      "</section>" +

      ext(B.mapUrl,
        '<img class="map-photo" src="' + esc(B.photo) + '" alt="呑食処 えんじゅの外観">' +
        '<span class="cap">タップでGoogleマップ</span><span class="go">' + ic("chevron") + "</span>", "mapcard") +

      '<div class="memo-card"><span class="circle-ico">' + ic("memo") + "</span><div><b>集合 " + esc(B.meet.time) + " " + esc(B.meet.place) + "</b><p>" + esc(B.meet.note) + "</p></div></div>" +
      '<div class="memo-card"><span class="circle-ico">' + ic("dining") + "</span><div><b>" + esc(B.date + " " + B.time) + " 開始</b><p>" + esc(B.people) + "名・" + esc(B.course) + "</p></div></div>" +
      foot();
  }

  /* ---------- ルーター ---------- */
  var VIEWS = {
    home: [viewHome, null],
    transport: [viewTransport, null],
    hotel: [viewHotel, bindHotel],
    facilities: [viewFacilities, bindFacilities],
    banquet: [viewBanquet, null]
  };
  function current() {
    var id = (location.hash.replace(/^#\/?/, "").split("?")[0]) || "home";
    if (id === "onsen") { hotelTab = "onsen"; id = "hotel"; }
    return VIEWS[id] ? id : "home";
  }
  var lastId = null;
  function render(keepScroll) {
    var id = current();
    var y = window.scrollY;
    gallery = [];
    if (id !== lastId) renderHero(id !== "home");
    renderTabbar(id);
    var root = document.getElementById("view");
    root.innerHTML = VIEWS[id][0]();
    bindPhotos(root);
    bindPopups(root);
    if (VIEWS[id][1]) VIEWS[id][1](root);
    document.title = (ROUTES.filter(function (r) { return r.id === id; })[0].label) + "｜熱海旅行2026 しおり";
    if (keepScroll && id === lastId) window.scrollTo(0, y);
    else if (lastId !== null) { window.scrollTo(0, 0); root.focus({ preventScroll: true }); }
    lastId = id;
  }
  window.addEventListener("hashchange", function () { closeOverlays(); render(); });
  render();

  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    window.addEventListener("load", function () { navigator.serviceWorker.register("sw.js").catch(function () {}); });
  }
})();
