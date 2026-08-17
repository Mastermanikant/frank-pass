// FrankPass Service Worker v3.2.2 (100% Offline-First)
const CACHE_NAME = 'frankpass-v3.2.2';
const CACHED_URLS = [
    '/',
    '/index.html',
    '/install.html',
    '/pro.html',
    '/docs.html',
    '/faq.html',
    '/about-us.html',
    '/legal.html',
    '/get-started.html',
    '/style.css',
    '/frankpass-utils.js',
    '/footer.js',
    '/frankpass-core.js',
    '/crypto-worker.js',
    '/platforms.js',
    '/translations.js',
    '/country-data.js',
    '/country-dropdown.js',
    '/manifest.json'
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
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request).catch(() => {
                return caches.match('/') || caches.match('/index.html');
            })
        );
        return;
    }

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }
            return fetch(event.request).catch(() => {
                return caches.match('/');
            });
        })
    );
});
