// 요가 TTC 수업 노트: 설치형 앱용 캐시
// 항상 새 내용을 먼저 받아 오고, 인터넷이 없을 때만 저장해 둔 것을 보여 줌
const CACHE = "ttc-notes-v7";
const FILES = ["./", "./index.html", "./manifest.webmanifest", "./img/logo.png", "./img/icon-192.png", "./img/icon-512.png", "./img/apple-touch-icon.png"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request).then(r => {
      if (r && (r.ok || r.type === "opaque")) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
      return r;
    }).catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || (e.request.mode === "navigate" ? caches.match("./index.html") : Response.error())))
  );
});
