/**
 * XpenseFlow Service Worker v3
 * Essential for the 'Add to Home Screen' prompt.
 */

const CACHE_NAME = 'xpenseflow-offline-v3';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Required fetch event handler for Chrome installability.
  // We prioritize network for Firestore and dynamic assets.
  if (event.request.mode === 'navigate' || event.request.url.includes('googleapis.com')) {
    return;
  }
  
  // Basic strategy: Network only (Satisfies PWA check without interfering with dev env)
  event.respondWith(fetch(event.request).catch(() => {
    // Optional: Return offline fallback here
  }));
});
