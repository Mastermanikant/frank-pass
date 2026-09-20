// FrankPass Service Worker v4.3.3 (Auto Controller Change & Instant Sync)
const CACHE_NAME = 'frankpass-v4.3.3';
const CACHED_URLS = [
    '/',
    '/index.html',
    '/random-password-generator.html',
    '/pin.html',
    '/comparison-between-frankpass-all-generators-deterministic-random-pin.html',
    '/comparison-between-frankpass-all-generators-deterministic-random-pin-hindi.html',
    '/why-stateless-password-generation-is-the-future.html',
    '/why-stateless-password-generation-is-the-future-hindi.html',
    '/where-password-managers-fail-and-invisible-vault.html',
    '/where-password-managers-fail-and-invisible-vault-hindi.html',
    '/what-makes-a-password-strong-and-passphrase-guide.html',
    '/what-makes-a-password-strong-and-passphrase-guide-hindi.html',
    '/atm-upi-pin-security-guide.html',
    '/atm-upi-pin-security-guide-hindi.html',
    '/frankpass-vs-cloud-password-vaults.html',
    '/frankpass-vs-cloud-password-vaults-hindi.html',
    '/secret-key-guide.html',
    '/secret-key-guide-hindi.html',
    '/get-started.html',
    '/get-started-hindi.html',
    '/install.html',
    '/pro.html',
    '/products.html',
    '/how-frankpass-is-free-without-selling-data.html',
    '/how-frankpass-is-free-without-selling-data-hindi.html',
    '/library.html',
    '/library-hindi.html',
    '/limitations-and-advantages.html',
    '/limitations-and-advantages-hindi.html',
    '/whitepaper.html',
    '/whitepaper-hindi.html',
    '/docs.html',
    '/docs-hindi.html',
    '/extension.html',
    '/extension-hindi.html',
    '/faq.html',
    '/about-us.html',
    '/about-us-hindi.html',
    '/founder-mastermanikant.html',
    '/founder-mastermanikant-hindi.html',
    '/sponsors.html',
    '/legal.html',
    '/ai-prompt-bar.js',
    '/style.css',
    '/frankpass-config.js',
    '/frankpass-utils.js',
    '/footer.js',
    '/frankpass-core.js',
    '/platforms.js',
    '/country-data.js',
    '/country-dropdown.js',
    '/llms.txt',
    '/llms-full.txt',
    '/icons/favicon.png',
    '/icons/logo-key-64.webp',
    '/icons/icon-192.png',
    '/icons/icon-512.png',
    '/icons/icon-512-maskable.png',
    '/icons/founder-master-manikant-yadav.webp',
    '/global_auth_registry.json',
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

// Push Notifications Listener (For Product Launches, Security Tools & Articles)
self.addEventListener('push', (event) => {
    let data = { title: 'FrankPass Update', body: 'New security tool or update available.', url: '/' };
    if (event.data) {
        try {
            data = event.data.json();
        } catch (e) {
            data.body = event.data.text();
        }
    }
    const options = {
        body: data.body,
        icon: '/icons/icon-192.png',
        badge: '/icons/favicon.png',
        data: { url: data.url || '/' },
        vibrate: [100, 50, 100]
    };
    event.waitUntil(
        self.registration.showNotification(data.title || 'FrankPass Update', options)
    );
});

// Notification Click Handler
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const targetUrl = (event.notification.data && event.notification.data.url) ? event.notification.data.url : '/';
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
            for (let client of windowClients) {
                if (client.url === targetUrl && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(targetUrl);
            }
        })
    );
});
