// public/sw.js
self.addEventListener('push', e => {
    const data = e.data.json();
    const { title, body } = data;

    const options = {
        body: body,
        icon: '/icons/192.png', // PWA 아이콘 경로
        vibrate: [200, 100, 200],
    };

    e.waitUntil(
        self.registration.showNotification(title, options)
    );
});