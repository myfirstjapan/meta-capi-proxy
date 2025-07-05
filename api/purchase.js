import crypto from 'crypto';

export default async function handler(req, res) {
  // CORS対応（OPTIONSメソッドのプリフライト対応含む）
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*'); // 必要に応じてOriginを限定してください
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.status(204).end();
    return;
  }

  // 他のメソッドへのCORS設定
  res.setHeader('Access-Control-Allow-Origin', '*'); // 必要に応じてOriginを限定してください

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

    const pixelId = '1252395909231068'; // あなたのPixel ID
    const accessToken = process.env.ACCESS_TOKEN;

    const hashSHA256 = (input) =>
      crypto.createHash('sha256').update(input).digest('hex');

    const payload = {
      data: [
        {
          event_name: 'Purchase',
          event_time: Math.floor(Date.now() / 1000),
          event_id: event_id,
          action_source: 'website',
          user_data: {
            em: [hashSHA256(email)],
            ph: phone ? [hashSHA256(phone)] : undefined,
            client_user_agent: req.headers['user-agent'],
          },
          custom_data: {
            currency: currency,
            value: value,
          },
        },
      ],
      access_token: accessToken,
      ...(test_event_code && { test_event_code }),
    };

    const response = await fetch(`https://graph.facebook.com/v19.0/${pixelId}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    return res.status(200).json({ status: 'ok', meta_response: result });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
