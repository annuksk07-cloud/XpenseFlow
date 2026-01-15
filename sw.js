/**
 * XpenseFlow Service Worker v4
 * Essential for PWA 'Install' prompt triggering.
 */

const CACHE_NAME = 'xpenseflow-offline-v4';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // A non-empty fetch handler is a REQUIRED condition for PWA installability in Chromium.
  // We prioritize the network for all requests to ensure real-time Firestore/Auth updates.
  if (event.request.mode === 'navigate' || event.request.url.includes('googleapis.com')) {
    return;
  }
  
  // Basic 'Network-First' approach with a silent fallback
  event.respondWith(
    fetch(event.request).catch(() => {
      // In a full offline app, you'd serve cached static assets here
      return caches.match(event.request);
    })
  );
});