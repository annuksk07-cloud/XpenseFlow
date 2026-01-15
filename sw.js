/**
 * XpenseFlow Service Worker v8
 * Professional structure for 100% PWA install rate on HTTPS.
 */

const CACHE_NAME = 'xpenseflow-static-v8';

// Install event: trigger skipWaiting to ensure the new SW activates immediately
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // We can pre-cache essential local assets if needed
      return cache.addAll(['./', './index.html']);
    }).then(() => self.skipWaiting())
  );
});

// Activate event: claim all clients
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Fetch event: mandatory for PWA "Install" button to appear in Chrome
self.addEventListener('fetch', (event) => {
  // Pass-through handler
  // For a financial app, we generally want fresh data, but a fetch listener is a PWA requirement.
  event.respondWith(
    fetch(event.request).catch(() => {
      // Fallback for offline mode if resources are cached
      return caches.match(event.request);
    })
  );
});