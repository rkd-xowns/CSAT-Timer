// server.cjs

require('dotenv').config();
const fs = require('fs'); // 파일을 다루기 위한 Node.js 내장 모듈
const express = require('express');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const cors = require('cors');

// Express 앱 설정 및 실행 로직을 함수로 분리
const startServer = () => {
    const app = express();
    app.use(cors());
    app.use(bodyParser.json());

    const vapidKeys = {
        publicKey: process.env.VAPID_PUBLIC_KEY,
        privateKey: process.env.VAPID_PRIVATE_KEY,
    };

    if (!vapidKeys.publicKey || !vapidKeys.privateKey) {
        console.error("VAPID 키가 .env 파일에서 로드되지 않았습니다. .env 파일을 삭제하고 다시 시도해보세요.");
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
        // ... (이하 API 로직은 기존과 동일)
        if (!pushSubscription) return res.status(404).json({ error: '구독 정보가 없습니다.' });
        const { title, body } = req.body;
        const payload = JSON.stringify({ title, body });
        webpush.sendNotification(pushSubscription, payload)
            .then(() => res.status(200).json({ message: '알림이 성공적으로 전송되었습니다.' }))
            .catch(err => {
                console.error('알림 전송 실패:', err);
                res.sendStatus(500);
            });
    });
    
    app.get('/api/test', (req, res) => {
    console.log('✅ /api/test 엔드포인트에 GET 요청이 성공적으로 도착했습니다.');
    res.status(200).send('ngrok connection is working correctly!');
});

    const PORT = 4000;
    app.listen(PORT, () => {
        console.log(`푸시 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
    });
};

// --- ✨ 메인 로직: .env 파일 확인 및 자동 생성 ---
// .env 파일이 없으면 새로 생성하고, 있으면 기존 파일 사용
if (!fs.existsSync('.env')) {
    console.log('.env 파일이 없으므로, 새로운 VAPID 키를 생성하고 저장합니다...');
    const vapidKeys = webpush.generateVAPIDKeys();
    const envContent = `VAPID_PUBLIC_KEY=${vapidKeys.publicKey}\nVAPID_PRIVATE_KEY=${vapidKeys.privateKey}\n`;
    
    fs.writeFileSync('.env', envContent);
    console.log('.env 파일에 키가 성공적으로 저장되었습니다.');
    
    // 새로 만든 .env 파일의 내용을 즉시 로드
    require('dotenv').config({ override: true });
    startServer();
} else {
    console.log('.env 파일이 이미 존재하므로, 기존 키를 사용하여 서버를 시작합니다.');
    startServer();
}