/* நாட்காட்டி வடிவமைப்பாளர் – Service Worker
   - ஆப் கோப்புகள்: முதல் முறை ஏற்றியதும் ஆஃப்லைனில் இயங்கும்
   - Google Fonts: ஒருமுறை ஏற்றியதும் cache-ல் சேமிக்கப்படும்
   கோப்புகளை மாற்றினால் VERSION எண்ணை உயர்த்தவும் (v1 → v2). */
const VERSION = "v1";
const APP_CACHE = "kalendar-app-" + VERSION;
const FONT_CACHE = "kalendar-fonts-" + VERSION;

const APP_FILES = [
  "./",
  "index.html",
  "manifest.json",
  "privacy-policy.html",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/icon-maskable-512.png",
  "icons/apple-touch-icon.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(APP_CACHE).then((cache) =>
      // ஏதேனும் ஒரு கோப்பு இல்லாவிட்டாலும் install தோல்வியடையாது
      Promise.all(APP_FILES.map((url) => cache.add(url).catch(() => {})))
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((k) => k.startsWith("kalendar-") && k !== APP_CACHE && k !== FONT_CACHE)
          .map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Google Fonts: CSS → stale-while-revalidate, எழுத்துரு கோப்புகள் → cache-first
  if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
    event.respondWith(
      caches.open(FONT_CACHE).then(async (cache) => {
        const cached = await cache.match(req);
        const network = fetch(req).then((res) => {
          if (res && (res.ok || res.type === "opaque")) cache.put(req, res.clone());
          return res;
        }).catch(() => cached);
        return cached || network;
      })
    );
    return;
  }

  // வேறு தளங்களின் கோரிக்கைகளைத் தொடாதே
  if (url.origin !== self.location.origin) return;

  // பக்கம் திறக்கும்போது: network முதலில், இல்லையெனில் cache (புதிய பதிப்பு உடனே கிடைக்கும்)
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(APP_CACHE).then((c) => c.put(req, copy));
        return res;
      }).catch(async () => {
        const cache = await caches.open(APP_CACHE);
        const path = url.pathname.endsWith("privacy-policy.html") ? "privacy-policy.html" : "index.html";
        return (await cache.match(req)) || (await cache.match(path)) || (await cache.match("./"));
      })
    );
    return;
  }

  // மற்ற கோப்புகள்: cache-first
  event.respondWith(
    caches.match(req).then((cached) => cached || fetch(req).then((res) => {
      if (res && res.ok) {
        const copy = res.clone();
        caches.open(APP_CACHE).then((c) => c.put(req, copy));
      }
      return res;
    }))
  );
});
