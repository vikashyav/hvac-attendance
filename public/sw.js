self.addEventListener('push', (event) => {
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data?.icon || "/c-logo.png",
      image: data.image,   // Large banner image (Chrome/Edge only)
      badge: '/thermopharm-logo.png', // Optional small monochrome badge
      data: { url: data.url }
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
