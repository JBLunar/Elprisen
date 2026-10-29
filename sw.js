// ===== SERVICE WORKER =====
// Kører i baggrunden og sidder mellem appen og internettet

// Versionsnummer: ændr det (v2, v3...) når du vil tvinge en ny cache igennem
const VERSION = 'v3';
const STATIC_CACHE = `elprisen-static-${VERSION}`;
const DATA_CACHE = `elprisen-data-${VERSION}`;

// Alle appens egne filer. "./" = samme mappe som sw.js (virker også på GitHub Pages)
const STATIC_FILES = [
  './',
  './index.html',
  './offline.html',
  './manifest.json',
  './assets/css/style.css',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/favicon-32.png',
  './assets/js/app.js',
  './assets/js/controller/router.js',
  './assets/js/controller/historyController.js',
  './assets/js/controller/settingsController.js',
  './assets/js/model/getCurrentData.js',
  './assets/js/model/priceHelpers.js',
  './assets/js/model/settings.js',
  './assets/js/view/components/navbar.js',
  './assets/js/view/components/pageHeading.js',
  './assets/js/view/components/priceCircle.js',
  './assets/js/view/components/priceList.js',
  './assets/js/view/components/infoText.js',
  './assets/js/view/pages/frontPage.js',
  './assets/js/view/pages/overviewPage.js',
  './assets/js/view/pages/historiePage.js',
  './assets/js/view/pages/settingsPage.js',
  './assets/js/view/pages/notFoundPage.js',
  './assets/js/view/pages/dashboardPage.js',
  './assets/js/controller/notificationController.js',
];

// ----- INSTALL: gem alle filerne i cachen -----
self.addEventListener('install', (event) => {
  // waitUntil: "installationen er ikke færdig, før dette Promise er færdigt"
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(STATIC_FILES))
  );
  // Tag over med det samme i stedet for at vente på at alle faner lukkes
  self.skipWaiting();
});

// ----- ACTIVATE: slet gamle caches fra tidligere versioner -----
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((navne) =>
      Promise.all(
        navne
          // Behold kun de to caches der hører til den nuværende version
          .filter((navn) => navn !== STATIC_CACHE && navn !== DATA_CACHE)
          .map((navn) => caches.delete(navn))
      )
    )
  );
  // Styr de åbne faner med det samme
  self.clients.claim();
});

// ----- FETCH: hver eneste forespørgsel passerer her -----
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Vi cacher kun GET (hentning af ting) – ikke fx formularer der sendes
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // 1) Elpris-API'et → network first, gemmes i data-cachen
  if (url.hostname.includes('elprisenligenu.dk')) {
    event.respondWith(networkFirst(request, DATA_CACHE));
    return;
  }

  // 2) Skrifttyper og ikoner fra andre servere → cache first (de ændrer sig aldrig)
  if (url.origin !== self.location.origin) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // 3) Selve siden (når man åbner appen) → network first, ellers offline-siden
  if (request.mode === 'navigate') {
    event.respondWith(
      networkFirst(request, STATIC_CACHE).then(
        (svar) => svar || caches.match('./offline.html')
      )
    );
    return;
  }

  // 4) Vores egne filer (JS, CSS, ikoner) → network first
  event.respondWith(networkFirst(request, STATIC_CACHE));
});

// Prøv internettet først. Lykkes det, gem en kopi. Fejler det, brug cachen
async function networkFirst(request, cacheNavn) {
  const cache = await caches.open(cacheNavn);
  try {
    const svar = await fetch(request);
    // Gem kun svar der lykkedes (ikke fx 404 for morgendagens priser)
    if (svar.ok) {
      // clone(): et svar kan kun læses én gang – vi laver en kopi til cachen
      cache.put(request, svar.clone());
    }
    return svar;
  } catch (fejl) {
    // Intet internet: find en gemt kopi
    const gemt = await cache.match(request, { ignoreSearch: true });
    // Til sider (navigate) returnerer vi undefined, så offline.html kan tage over
    if (gemt || request.mode === 'navigate') return gemt;
    // Ellers et "503 Service Unavailable"-svar, så appen kan vise en pæn besked
    return new Response('Offline', { status: 503 });
  }
}

// Kig i cachen først. Kun hvis den ikke er der, hent fra internettet og gem den
async function cacheFirst(request) {
  const gemt = await caches.match(request);
  if (gemt) return gemt;

  try {
    const svar = await fetch(request);
    // "opaque" = svar fra en anden server, som vi ikke må kigge ind i, men gerne gemme
    if (svar.ok || svar.type === 'opaque') {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, svar.clone());
    }
    return svar;
  } catch (fejl) {
    return new Response('', { status: 503 });
  }
}

// ----- Klik på en notifikation: åbn appen -----
self.addEventListener('notificationclick', (event) => {
  // Luk selve notifikationen
  event.notification.close();

  event.waitUntil(
    // Find alle åbne faner med appen
    self.clients.matchAll({ type: 'window' }).then((faner) => {
      // Er appen allerede åben? Så skift til den fane
      if (faner.length > 0) return faner[0].focus();
      // Ellers åbn appen i en ny fane/vindue
      return self.clients.openWindow('./');
    })
  );
});