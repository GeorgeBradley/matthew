// sw.js

const CACHE_NAME = 'matthew-site-cache-v1';
const urlsToCache = [
  '/', // Cache the root for offline access
  '/index.html',
  '/details.html',
  '/shareable.css',
  '/styles.css',
  '/scripts.js',
  '/feature-project.js',
  '/Header.png',
  // Add any other essential assets or images here
];

// Install event – pre-caches core assets.
self.addEventListener('install', event => {
  console.log('[ServiceWorker] Install');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate event – cleans up old caches.
self.addEventListener('activate', event => {
  console.log('[ServiceWorker] Activate');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[ServiceWorker] Removing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event – serve from cache first, then from network.
self.addEventListener('fetch', event => {
  // Only intercept GET requests.
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(response => {
      // Return cached response if found.
      if (response) {
        return response;
      }
      // Otherwise, fetch from the network.
      const fetchRequest = event.request.clone();
      return fetch(fetchRequest)
        .then(networkResponse => {
          // Check if we received a valid response.
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }
          // Clone the response and store it in the cache.
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
          return networkResponse;
        })
        .catch(() => {
          // Optionally, return a fallback asset if fetch fails.
        });
    })
  );
});
