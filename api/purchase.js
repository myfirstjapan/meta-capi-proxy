import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({ message: 'API is working!' });
  }

  // CORS対応（OPTIONSメソッドのプリフライト対応含む）
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.status(204).end();
    return;
  }

  // 他のメソッドへのCORS設定
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const {
      event_id,
      email,
      phone,
      value,
      currency = 'JPY',
      test_event_code = null,
    } = req.body;

    const pixelId = '1252395909231068'; // ← ご自身のPixel IDでOK
    const accessToken = process.env.ACCESS_TOKEN;

    const hashSHA256 = (input) =>
      crypto.createHash('sha256').update(input).digest('hex');

    const payload = {
      data: [
        {
          event_name:_
