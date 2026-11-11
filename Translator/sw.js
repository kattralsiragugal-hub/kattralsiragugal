/* Live Translator – service worker
   பயன்பாட்டுக் கோப்புகளை மட்டும் சேமிக்கும். மொழிபெயர்ப்பு, ntfy.sh, எழுத்துரு கோரிக்கைகள்
   எப்போதும் நேரடியாக இணையத்துக்குச் செல்லும் (சேமிக்கப்படாது).
   கோப்புகளை மாற்றியபின் VERSION எண்ணை உயர்த்தவும் (எ.கா. tmr-v2). */
const VERSION = "tmr-v1";
const PAGE = "translator-two-phones.html";
const SHELL = [
  "./", PAGE, "privacy.html", "manifest.json",
  "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png",
  "icons/apple-touch-icon.png", "icons/favicon-48.png", "icons/icon.svg"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(VERSION)
      .then((c) => Promise.all(SHELL.map((u) => c.add(u).catch(() => {}))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  if (req.mode === "navigate") {
    /* பக்கம்: முதலில் இணையம், இல்லையெனில் சேமித்த நகல் */
    e.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(VERSION).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req, { ignoreSearch: true }).then((m) => m || caches.match(PAGE)))
    );
    return;
  }

  /* படங்கள், manifest: சேமித்ததை உடனே காட்டி, பின்னணியில் புதுப்பிக்கும் */
  e.respondWith(
    caches.match(req).then((cached) => {
      const fresh = fetch(req)
        .then((res) => {
          if (res.ok) { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); }
          return res;
        })
        .catch(() => cached);
      return cached || fresh;
    })
  );
});
