// Define the cache name with versioning
const CACHE_NAME = 'torquetrend-cache-v2';
const assetsToCache = [
    '/',
    '/index.html',
    '/styles.css',
    '/scripts.js',
    '/particles.json',
    '/manifest.json',
    '/f1.mp4.jpg',
    '/lithium-mine.jpg',
    '/waymo.jpg',
    '/car-charging.jpg',
    // Add other assets as needed
];

// Install event: caching files
self.addEventListener('install', event => {
    // Force the waiting service worker to become the active service worker
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(assetsToCache);
            })
            .catch(error => {
                console.error('Failed to open cache:', error);
            })
    );
});

// Activate event: cleaning up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cache => {
                        if (cache !== CACHE_NAME) {
                            console.log('Deleting old cache:', cache);
                            return caches.delete(cache);
                        }
                    })
                );
            })
            .then(() => {
                // Ensure that the service worker takes control of the clients immediately
                return self.clients.claim();
            })
            .catch(error => {
                console.error('Failed to activate service worker:', error);
            })
    );
});

// Fetch event: serve cached content when offline
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return the cached response if found
                if (response) {
                    return response;
                }
                // Clone the request to fetch and cache it
                const fetchRequest = event.request.clone();
                return fetch(fetchRequest)
                    .then(networkResponse => {
                        // Check if we received a valid response
                        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                            return networkResponse;
                        }
                        // Clone the response to cache it
                        const responseToCache = networkResponse.clone();
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });
                        return networkResponse;
                    })
                    .catch(error => {
                        console.error('Fetching failed:', error);
                        // Optionally, return a fallback page or image
                    });
            })
    );
});
