// Service Worker for PWA functionality and performance optimization
const CACHE_NAME = 'maintenance-service-v2';
const STATIC_CACHE = 'static-v2';
const DYNAMIC_CACHE = 'dynamic-v2';
const RUNTIME_CACHE = 'runtime-v2';

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/fonts/inter-v12-latin-700.woff2',
  '/fonts/lato-v23-latin-regular.woff2',
  '/fonts/roboto-mono-v23-latin-regular.woff2',
  '/styles/global.css',
  '/images/og-default.jpg',
  '/images/hero-dashboard.webp',
  '/favicon.svg',
  '/favicon.png',
  '/apple-touch-icon.png',
  '/site.webmanifest'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] Static assets cached');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Failed to cache static assets:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && 
                cacheName !== DYNAMIC_CACHE && 
                cacheName !== RUNTIME_CACHE) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Old caches deleted');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip external requests (except for specific domains)
  if (url.origin !== location.origin && 
      !url.hostname.includes('googletagmanager.com') &&
      !url.hostname.includes('google-analytics.com') &&
      !url.hostname.includes('fonts.googleapis.com') &&
      !url.hostname.includes('fonts.gstatic.com')) {
    return;
  }
  
  // Handle different request types
  if (url.pathname.includes('/fonts/')) {
    // Cache fonts with network first strategy
    event.respondWith(networkFirst(request, STATIC_CACHE));
  } else if (url.pathname.includes('/images/') || 
             url.pathname.includes('/_astro/')) {
    // Cache images and assets with stale while revalidate
    event.respondWith(staleWhileRevalidate(request, RUNTIME_CACHE));
  } else if (url.pathname.includes('/api/')) {
    // Cache API responses with network first strategy
    event.respondWith(networkFirst(request, DYNAMIC_CACHE, 5 * 60 * 1000)); // 5 minutes
  } else if (request.mode === 'navigate') {
    // Cache HTML pages with network first strategy
    event.respondWith(networkFirst(request, DYNAMIC_CACHE, 10 * 60 * 1000)); // 10 minutes
  } else {
    // Cache other static assets with cache first strategy
    event.respondWith(cacheFirst(request, STATIC_CACHE));
  }
});

// Network first strategy
async function networkFirst(request, cacheName, maxAge = 24 * 60 * 60 * 1000) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  // Check if cached response is still valid
  if (cachedResponse) {
    const dateHeader = cachedResponse.headers.get('date');
    if (dateHeader) {
      const cachedTime = new Date(dateHeader).getTime();
      const now = Date.now();
      if (now - cachedTime < maxAge) {
        return cachedResponse;
      }
    }
  }
  
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Fallback to cache if network fails
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/') || new Response('Offline', { 
        status: 503, 
        statusText: 'Service Unavailable' 
      });
    }
    
    throw error;
  }
}

// Cache first strategy
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    throw error;
  }
}

// Stale while revalidate strategy
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  // Always try to update from network
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  });
  
  // Return cached version immediately if available
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Otherwise wait for network
  return fetchPromise;
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Handle background sync tasks
  console.log('[SW] Background sync triggered');
  
  // Get all pending requests from IndexedDB
  // and retry them when network is available
  // This would be implemented with IndexedDB
}

// Push notifications
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body,
      icon: '/images/icon-192x192.png',
      badge: '/images/badge-72x72.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      },
      actions: [
        {
          action: 'explore',
          title: 'Explore this new world',
          icon: '/images/checkmark.png'
        },
        {
          action: 'close',
          title: 'Close notification',
          icon: '/images/xmark.png'
        }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Periodic background sync
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'content-sync') {
    event.waitUntil(doContentSync());
  }
});

async function doContentSync() {
  // Sync content in the background
  console.log('[SW] Periodic background sync triggered');
  
  // This would fetch updated content and cache it
  // Implementation depends on specific requirements
}

// Cleanup old caches periodically
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Performance monitoring
self.addEventListener('fetch', (event) => {
  // Log performance metrics
  const start = Date.now();
  
  event.respondWith(
    (async () => {
      const response = await fetch(event.request);
      const end = Date.now();
      
      // Log slow requests
      if (end - start > 1000) {
        console.warn(`[SW] Slow request: ${event.request.url} took ${end - start}ms`);
      }
      
      return response;
    })()
  );
});