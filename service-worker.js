// FrankPass Service Worker v2.3.0
const CACHE_NAME = 'frankpass-v2.3.0';
const CACHED_URLS = [
    './',
    './about-us',
    './contact-us',
    './faq',
    './guide',
    './legal',
    './meet-the-founder-MasterManikant',
    './support-us',
    './why-stateless',
    './style.css',
    './script.js',
    './frankpass-utils.js',
    './footer.js',
    './frankpass-core.js',
    './crypto-worker.js',
    './platforms.js',
    './particles.js',
    './translations.js',
    './country-data.js',
    './country-dropdown.js',
    './manifest.json'
];

// Install: Cache all core assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(CACHED_URLS);
        })
    );
    self.skipWaiting();
});

// Activate: Clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        })
    );
    self.clients.claim();
});

// Fetch: Serve from cache first, then network (offline-first strategy)
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }
            return fetch(event.request).then((networkResponse) => {
                // Cache new successful responses dynamically
                if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return networkResponse;
            }).catch(() => {
                // If both cache and network fail, return the cached index
                return caches.match('./');
            });
        })
    );
});


