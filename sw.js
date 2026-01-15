/**
 * XpenseFlow Service Worker v6
 * Optimized for installation and dynamic origin resolution.
 */

const CACHE_NAME = 'xpenseflow-offline-v6';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // REQUIRED: Chrome requires a fetch handler for PWA installability.
  // We bypass cross-origin APIs to ensure Firebase stability.
  if (event.request.url.includes('googleapis.com') || event.request.url.includes('firebase')) {
    return;
  }

  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});