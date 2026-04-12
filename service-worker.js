// FrankPass Service Worker v2.3.1
const CACHE_NAME = 'frankpass-v2.3.1';
const CACHED_URLS = [
    '/',
    '/about-us',
    '/contact-us',
    '/faq',
    '/guide',
    '/legal',
    '/meet-the-founder-MasterManikant',
    '/support-us',
    '/why-stateless',
    '/style.css',
    '/script.js',
    '/frankpass-utils.js',
    '/footer.js',
    '/frankpass-core.js',
    '/crypto-worker.js',
    '/platforms.js',
    '/particles.js',
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
    // For navigation requests that fail, return the root '/' (index.html)
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request).catch(() => {
                return caches.match('/');
            })
        );
        return;
    }

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }
            return fetch(event.request).then((networkResponse) => {
                // Cache successful responses for core assets if needed
                if (networkResponse && networkResponse.status === 200) {
                    // (Optional) add dynamic caching here if desired
                }
                return networkResponse;
            }).catch(() => {
                // Return cached index for failed file fetches if it makes sense, 
                // but usually handled by navigate check above for pages.
                return caches.match('/');
            });
        })
    );
});


