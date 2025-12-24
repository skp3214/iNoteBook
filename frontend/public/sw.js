// Update version whenever you make changes to force cache refresh
const CACHE_VERSION = 'v2.0.4';
const CACHE_NAME = `inotebook-${CACHE_VERSION}`;
const DATA_CACHE_NAME = `inotebook-data-${CACHE_VERSION}`;

// Only cache essential offline assets
const urlsToCache = [
  '/manifest.json',
  '/inotebookicon.png'
];

// Install event
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

// Activate event - Clean up old caches
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          // Delete all old caches that don't match current version
          if (cacheName.startsWith('inotebook-') && 
              cacheName !== CACHE_NAME && 
              cacheName !== DATA_CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event
self.addEventListener('fetch', function(event) {
  // Skip chrome-extension and other unsupported schemes
  if (!event.request.url.startsWith('http')) {
    return;
  }

  const requestUrl = new URL(event.request.url);
  
  // Handle API requests - Network first, cache fallback
  if (requestUrl.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then(function(response) {
          // Cache API GET requests for offline access
          if (response.status === 200 && event.request.method === 'GET') {
            const responseClone = response.clone();
            caches.open(DATA_CACHE_NAME).then(function(cache) {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(function() {
          // If network fails, try cache
          return caches.match(event.request)
            .then(function(cachedResponse) {
              if (cachedResponse) {
                return cachedResponse;
              }
              // Return offline response
              return new Response(JSON.stringify({
                success: false,
                message: 'Offline - data not available in cache'
              }), {
                status: 503,
                statusText: 'Service Unavailable',
                headers: { 'Content-Type': 'application/json' }
              });
            });
        })
    );
  } else {
    // Handle static assets - NETWORK FIRST for development, cache as fallback
    event.respondWith(
      fetch(event.request)
        .then(function(response) {
          // Only cache successful responses
          if (response && response.status === 200) {
            // Don't cache HTML files in production to ensure updates
            const isHtml = event.request.destination === 'document' || 
                          event.request.url.endsWith('.html') ||
                          requestUrl.pathname === '/';
            
            if (!isHtml) {
              // Cache non-HTML static assets
              const responseToCache = response.clone();
              caches.open(CACHE_NAME).then(function(cache) {
                cache.put(event.request, responseToCache);
              });
            }
          }
          return response;
        })
        .catch(function() {
          // If network fails, try cache
          return caches.match(event.request)
            .then(function(cachedResponse) {
              if (cachedResponse) {
                return cachedResponse;
              }
              // For document requests, try to return cached index
              if (event.request.destination === 'document') {
                return caches.match('/');
              }
            });
        })
    );
  }
});

// Listen for messages from the main thread
self.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Network status change detection
self.addEventListener('online', function() {
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: 'NETWORK_STATUS_UPDATE',
        isOnline: true
      });
    });
  });
});

self.addEventListener('offline', function() {
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: 'NETWORK_STATUS_UPDATE',
        isOnline: false
      });
    });
  });
});
