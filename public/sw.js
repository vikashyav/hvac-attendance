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
  const payload = event.data ? event.data.json() : {};
  event.notification.close();
  event.waitUntil(
    clients.openWindow(payload.url || '/')
  );
});