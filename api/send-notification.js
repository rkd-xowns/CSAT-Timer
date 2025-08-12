import { kv } from '@vercel/kv';
import webpush from 'web-push';

webpush.setVapidDetails(
  'mailto:your-email@example.com',
  process.env.VITE_VAPID_PUBLIC_KEY, // Vercel 환경 변수 사용
  process.env.VAPID_PRIVATE_KEY // Vercel 환경 변수 사용
);

export default async function handler(request, response) {
  const subscription = await kv.get('subscription:user123');
  const payload = JSON.stringify({ title: 'Vercel에서 보낸 알림!', body: '서버리스 함수로 성공!' });

  try {
    await webpush.sendNotification(subscription, payload);
    return response.status(200).json({ message: 'Notification sent.' });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: 'Failed to send.' });
  }
}