// workbox-precaching 라이브러리를 import합니다.
import { precacheAndRoute } from 'workbox-precaching';

// VitePWA 플러그인이 이 부분에 캐싱할 파일 목록을 자동으로 주입해줍니다.
// 이를 통해 오프라인에서도 앱이 동작할 수 있습니다.
precacheAndRoute(self.__WB_MANIFEST || []);

// 'push' 이벤트 리스너: 서버로부터 푸시 알림을 받았을 때 실행됩니다.
self.addEventListener('push', event => {
  // 서버가 보낸 데이터를 JSON 형태로 파싱합니다.
  const data = event.data.json();
  console.log('서비스 워커: 푸시 메시지 수신', data);

  const title = data.title || '새로운 알림';
  const options = {
    body: data.body,
    icon: '/icons/192.png', // 알림에 표시될 아이콘
    badge: '/icons/192.png' // 안드로이드 상태바에 표시될 작은 아이콘
  };

  // waitUntil을 사용해 알림 표시 작업이 완료될 때까지 서비스 워커가 활성 상태를 유지하도록 합니다.
  event.waitUntil(self.registration.showNotification(title, options));
});

// 'notificationclick' 이벤트 리스너: 사용자가 알림을 클릭했을 때 실행됩니다.
self.addEventListener('notificationclick', event => {
  // 알림창을 닫습니다.
  event.notification.close();

  // 앱의 특정 페이지를 열거나, 이미 열려있다면 해당 탭으로 포커스를 이동합니다.
  event.waitUntil(
    clients.openWindow('/') // 알림 클릭 시 이동할 기본 URL
  );
});
