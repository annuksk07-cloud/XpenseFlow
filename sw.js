/**
 * XpenseFlow Service Worker v7
 * Professional standard for PWA installation on Vercel/HTTPS.
 */

self.addEventListener('install', (event) => {
  // Take control immediately
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Claim all clients to start processing fetch events without refresh
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Mandatory fetch handler to satisfy PWA criteria.
  // We prioritize network for real-time finance data but satisfy the "Install" requirement.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        // Fallback or offline logic here if needed
        return caches.match('/');
      })
    );
    return;
  }

  // Pass-through for all other requests
  event.respondWith(fetch(event.request));
});