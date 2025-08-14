// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true
});

module.exports = withPWA({
  reactStrictMode: true
});


/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig


// // --- Push Notifications ---
// self.addEventListener('push', (event) => {
//   if (!event.data) return;
//   let data;
//   try {
//     data = event.data.json();
//   } catch (e) {
//     data = { title: 'Notification', body: event.data.text() };
//   }

//   const options = {
//     body: data.body || '',
//     icon: data.icon || '/icons/icon-192x192.png',
//     image: data.image || undefined,
//     badge: data.badge || '/icons/icon-192x192.png',
//     data: { url: data.url || '/' },
//   };

//   event.waitUntil(
//     self.registration.showNotification(data.title || 'Notification', options)
//   );
// });

// // --- Notification Click ---
// self.addEventListener('notificationclick', (event) => {
//   event.notification.close();
//   event.waitUntil(
//     clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
//       for (const client of clientList) {
//         if (client.url === event.notification.data.url && 'focus' in client) {
//           return client.focus();
//         }
//       }
//       if (clients.openWindow) {
//         return clients.openWindow(event.notification.data.url);
//       }
//     })
//   );
// });
