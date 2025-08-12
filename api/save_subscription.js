import { kv } from '@vercel/kv';

export default async function handler(request, response) {
  if (request.method === 'POST') {
    const subscription = request.body;
    // 'user123' 대신 실제 사용자 ID를 사용해야 합니다.
    await kv.set('subscription:user123', subscription); 
    return response.status(201).json({ message: 'Subscription saved.' });
  }
}