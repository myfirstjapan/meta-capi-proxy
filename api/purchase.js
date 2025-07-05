export default async function handler(req, res) {
  // CORS対応ヘッダーを設定
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const payload = req.body;

    const response = await fetch('https://graph.facebook.com/v19.0/[あなたのピクセルID]/events?access_token=[トークン]', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const meta_response = await response.json();
    res.status(200).json({ status: 'ok', meta_response });
  } catch (err) {
    console.error('❌ エラー:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
}
