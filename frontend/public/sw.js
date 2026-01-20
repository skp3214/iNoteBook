const CACHE_VERSION = 'v2.1.4'; 
const CACHE_NAME = `inotebook-${CACHE_VERSION}`;
const DATA_CACHE_NAME = `inotebook-data-${CACHE_VERSION}`;

const urlsToCache = [
  '/',
  '/index.html',
  '/static/js/main.7494a57f.js',   
  '/static/css/main.25769c16.css',
  '/manifest.json',
  '/inotebookicon.png'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
      .catch(function(error) {
        console.error('Cache addAll failed:', error);
      })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName.startsWith('inotebook-') && 
              cacheName !== CACHE_NAME && 
              cacheName !== DATA_CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  if (!event.request.url.startsWith('http')) return;

  const requestUrl = new URL(event.request.url);

  // API requests: Network first, fallback to cache
  if (requestUrl.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then(function(response) {
          if (response.status === 200 && event.request.method === 'GET') {
            const responseClone = response.clone();
            // Use requestIdleCallback for non-critical caching
            if ('requestIdleCallback' in self) {
              self.requestIdleCallback(() => {
                caches.open(DATA_CACHE_NAME).then(cache => cache.put(event.request, responseClone));
              });
            } else {
              caches.open(DATA_CACHE_NAME).then(cache => cache.put(event.request, responseClone));
            }
          }
          return response;
        })
        .catch(async function() {
          return caches.match(event.request)
            .then(cached => cached || new Response(JSON.stringify({
              success: false,
              message: 'You are offline'
            }), {
              status: 503,
              headers: { 'Content-Type': 'application/json' }
            }));
        })
    );
    return;
  }

  // Static assets & HTML: Cache first, fallback to network
  event.respondWith(
    caches.match(event.request)
      .then(function(cachedResponse) {
        // Return cached version if exists
        if (cachedResponse) {
          return cachedResponse;
        }

        // Otherwise fetch from network
        return fetch(event.request)
          .then(function(response) {
            if (response.status === 200 && event.request.method === 'GET') {
              const responseToCache = response.clone();

              // Don't cache external domains or huge files
              if (requestUrl.origin === location.origin) {
                // Use requestIdleCallback for non-critical caching
                if ('requestIdleCallback' in self) {
                  self.requestIdleCallback(() => {
                    caches.open(CACHE_NAME).then(cache => {
                      cache.put(event.request, responseToCache);
                    });
                  });
                } else {
                  caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, responseToCache);
                  });
                }
              }
            }
            return response;
          })
          .catch(function() {
            // If both cache and network fail, try to return cached index.html
            if (event.request.destination === 'document') {
              return caches.match('/');
            }
            return new Response('Offline', { status: 503 });
          });
      })
  );
});

// Message handling
self.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Network status broadcast
['online', 'offline'].forEach(status => {
  self.addEventListener(status, () => {
    self.clients.matchAll().then(clients => {
      clients.forEach(client => client.postMessage({
        type: 'NETWORK_STATUS_UPDATE',
        isOnline: status === 'online'
      }));
    });
  });
});