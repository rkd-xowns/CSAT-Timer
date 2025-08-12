// server.js
const express = require('express');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const cors = require('cors'); // CORS 처리를 위한 라이브러리

const app = express();

app.use(cors());
app.use(bodyParser.json());

// 1단계에서 생성한 VAPID 키들을 여기에 붙여넣으세요.
const vapidKeys = {
  publicKey: 'BKXpq1VUNSibGPU7k9OQN1mKxlwYc7txB-SYdX5AKw0fDBhleX8Ew2I0ipmlEDsG-9mrIcDsNECfHg17SrVlJms',
  privateKey: 'ZXXKmeToRCN5U2sAAzIRtXc91DoRoYviXjgeJ635y08',
};

webpush.setVapidDetails(
  'mailto:your-email@example.com', // 비상 연락용 이메일
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

// 구독 정보를 메모리에 저장 (실제 서비스에서는 DB에 저장해야 합니다)
let savedSubscription = null;

// 클라이언트로부터 구독 정보를 받아 저장하는 API
app.post('/save-subscription', (req, res) => {
  savedSubscription = req.body;
  console.log('구독 정보가 성공적으로 저장되었습니다.');
  res.status(201).json({ message: 'Subscription saved.' });
});

// "원할 때" 알림을 보내는 API (테스트용)
// 브라우저에서 http://localhost:4000/send-notification 주소로 접속하면 실행됩니다.
app.get('/send-notification', (req, res) => {
  if (savedSubscription) {
    const payload = JSON.stringify({
      title: '서버에서 보낸 알림! 🚀',
      body: '앱이 꺼져 있어도 잘 받으셨나요?',
    });

    console.log('알림을 발송합니다...');
    webpush.sendNotification(savedSubscription, payload)
      .then(() => res.status(200).json({ message: 'Notification sent.' }))
      .catch(err => {
        console.error('알림 발송 오류:', err);
        res.sendStatus(500);
      });
  } else {
    res.status(404).json({ message: 'Subscription not found.' });
  }
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`백엔드 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});