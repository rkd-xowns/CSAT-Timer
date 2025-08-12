// server.cjs

// 'import' 대신 'require'를 사용합니다.
require('dotenv').config();
const express = require('express');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// .env 파일에서 키를 읽어옵니다.
const vapidKeys = {
    publicKey: process.env.VAPID_PUBLIC_KEY,
    privateKey: process.env.VAPID_PRIVATE_KEY,
};

// VAPID 키가 제대로 로드되었는지 확인
if (!vapidKeys.publicKey || !vapidKeys.privateKey) {
    console.error("VAPID 키가 .env 파일에 설정되지 않았습니다. 프로그램을 종료합니다.");
    process.exit(1);
}

webpush.setVapidDetails(
    'mailto:your-email@example.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

let pushSubscription = null;

app.get('/api/vapid-public-key', (req, res) => {
    res.send(vapidKeys.publicKey);
});

app.post('/api/subscribe', (req, res) => {
    pushSubscription = req.body;
    console.log('구독 정보 수신:', pushSubscription);
    res.status(201).json({ message: '구독이 완료되었습니다.' });
});

app.post('/api/send-notification', (req, res) => {
    if (!pushSubscription) {
        return res.status(404).json({ error: '구독 정보가 없습니다.' });
    }

    const { title, body } = req.body;
    const payload = JSON.stringify({ title, body });

    webpush.sendNotification(pushSubscription, payload)
        .then(() => res.status(200).json({ message: '알림이 성공적으로 전송되었습니다.' }))
        .catch(err => {
            console.error('알림 전송 실패:', err);
            res.sendStatus(500);
        });
});

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`푸시 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});