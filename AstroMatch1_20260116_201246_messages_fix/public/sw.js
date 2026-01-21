// Service Worker - Disabled during development
// This service worker immediately unregisters itself to prevent caching issues during development

self.addEventListener('install', (event) => {
  // Skip waiting and activate immediately
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Clear all caches
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          console.log('Clearing cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      // Unregister this service worker
      return self.registration.unregister();
    }).then(() => {
      // Force refresh all clients
      return self.clients.matchAll().then((clients) => {
        clients.forEach(client => client.navigate(client.url));
      });
    })
  );
});

