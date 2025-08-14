// Import Workbox modules (these will be bundled by next-pwa)
import { clientsClaim } from 'workbox-core';
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst, CacheFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

// Let SW take control immediately
clientsClaim();
self.skipWaiting();

// ✅ Required by next-pwa to inject precached files
precacheAndRoute(self.__WB_MANIFEST || []);

// --- Offline caching rules ---

// HTML, JS, CSS (App Shell)
registerRoute(
  ({ request }) =>
    request.destination === 'document' ||
    request.destination === 'script' ||
    request.destination === 'style',
  new NetworkFirst({
    cacheName: 'app-shell',
    plugins: [new ExpirationPlugin({ maxEntries: 50 })],
  })
);

// Images
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images',
    plugins: [new ExpirationPlugin({ maxEntries: 50 })],
  })
);

self.addEventListener('install', (event) => {
  console.log('📦 [SW] Install event fired');
  self.skipWaiting(); // Force new SW to take over immediately
});

self.addEventListener('activate', (event) => {
  console.log('🚀 [SW] Activate event fired');
  event.waitUntil(self.clients.claim()); // Claim control of all clients immediately
});

self.addEventListener('push', (event) => {
  console.log('📩 [SW] Push event fired:', event.data ? event.data.text() : '(no payload)');
  
  const payload = event.data ? event.data.json() : {};
  
  event.waitUntil(
    self.registration.showNotification(payload.title || 'Notification', {
      body: payload.body || 'No message body',
      icon: payload.icon || '/icons/icon-192x192.png',
      badge: payload.badge || '/icons/badge.png',
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  console.log('👆 [SW] Notification click event fired');
  event.notification.close();
  event.waitUntil(
    clients.openWindow(payload.url || '/')
  );
});
