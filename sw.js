/*
 * オフライン対応（電波が弱い場所でも前回見た内容を表示）
 * いつもネットを優先し、つながらないときだけ保存済みの内容を使います。
 * そのため幹事が data/trip.js を更新すると、次に開いたときに反映されます。
 */
var CACHE = "atami2026-v2";
var CORE = [
  "./", "./index.html", "./assets/style.css", "./assets/app.js", "./data/trip.js",
  "./manifest.webmanifest", "./assets/icons/icon.svg", "./assets/icons/icon-192.png", "./assets/shinjuku-east.jpg"
];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(CORE); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener("fetch", function (e) {
  var req = e.request;
  // 自分のサイトのファイルだけを扱う（ホテル写真など外部の画像は保存しない）
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(
    fetch(req).then(function (res) {
      if (res.ok) { var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put(req, copy); }); }
      return res;
    }).catch(function () {
      return caches.match(req, { ignoreSearch: true }).then(function (hit) { return hit || caches.match("./index.html"); });
    })
  );
});
