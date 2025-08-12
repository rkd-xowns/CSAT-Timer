// server.js
const express = require('express');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ⚠️ 여기에 생성한 VAPID 키를 붙여넣으세요.
const vapidKeys = {
    publicKey: "BFGczs7YfAA7enHFNHv1pzzaIUMDFlHDkyM-8N1PVnPG9ecWF7KYmzCQ1OeZZ-eamYiw4J7RCp0a-nhiEaJz6jg",
    privateKey: "roCr6L9Uu3Sg4YwemsBBAidxDLqqmkOKXOxt0K30k38",
};

webpush.setVapidDetails(
    'mailto:your-email@example.com', // 관리자 이메일
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

// 구독 정보를 저장할 변수 (실제 프로덕션에서는 DB에 저장해야 합니다)
let subscription = null;

// 1. 클라이언트에게 VAPID 공개 키 제공
app.get('/api/vapid-public-key', (req, res) => {
    res.send(vapidKeys.publicKey);
});

// 2. 클라이언트로부터 구독 정보 수신 및 저장
app.post('/api/subscribe', (req, res) => {
    subscription = req.body;
    console.log('구독 정보 수신:', subscription);
    res.status(201).json({ message: '구독이 완료되었습니다.' });
});

// 3. 클라이언트의 요청을 받아 푸시 알림 전송
app.post('/api/send-notification', (req, res) => {
    if (!subscription) {
        return res.status(404).json({ error: '구독 정보가 없습니다.' });
    }

    const { title, body } = req.body;
    const payload = JSON.stringify({ title, body });

    webpush.sendNotification(subscription, payload)
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