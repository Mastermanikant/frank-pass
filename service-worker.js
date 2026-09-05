// FrankPass Service Worker v3.6.7 (100% Offline-First with Smart Network-First Sync)
const CACHE_NAME = 'frankpass-v3.6.7';
const CACHED_URLS = [
    '/',
    '/index.html',
    '/install.html',
    '/pro.html',
    '/docs.html',
    '/faq.html',
    '/about-us.html',
    '/founder-mastermanikant.html',
    '/founder-mastermanikant-hindi.html',
    '/about-us-hindi.html',
    '/limitations-and-advantages.html',
    '/limitations-and-advantages-hindi.html',
    '/products.html',
    '/legal.html',
    '/get-started.html',
    '/style.css',
    '/frankpass-config.js',
    '/frankpass-utils.js',
    '/footer.js',
    '/frankpass-core.js',
    '/platforms.js',
    '/country-data.js',
    '/country-dropdown.js',
    '/llms.txt',
    '/icons/favicon.png',
    '/icons/logo-key-64.webp',
    '/icons/icon-192.png',
    '/icons/icon-512.png',
    '/icons/founder-master-manikant-yadav.webp',
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

// Activate: Clean up old caches & claim clients immediately
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

// Fetch: Network-First (with offline Cache Fallback)
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;
    
    // Ignore chrome-extension or external analytics
    if (!event.request.url.startsWith(self.location.origin) && !event.request.url.includes('flagcdn.com')) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then((networkResponse) => {
                if (networkResponse && networkResponse.status === 200) {
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                }
                return networkResponse;
            })
            .catch(() => {
                return caches.match(event.request, { ignoreSearch: true }).then((cachedResponse) => {
                    if (cachedResponse) return cachedResponse;
                    if (event.request.mode === 'navigate') {
                        return caches.match('/', { ignoreSearch: true }).then(res => res || caches.match('/index.html', { ignoreSearch: true }));
                    }
                    return null;
                });
            })
    );
});
