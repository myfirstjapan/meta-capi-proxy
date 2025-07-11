export default async function handler(req, res) {
  // ✅ CORS ヘッダーの設定
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // ✅ OPTIONSリクエストには即レスポンス
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // ✅ POST以外は拒否
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      event_name,
      event_time,
      event_id,
      user_data,
      custom_data,
      action_source,
      access_token,
      pixel_id,
    } = req.body;

    const payload = {
      data: [
        {
          event_name,
          event_time,
          event_id,
          user_data,
          custom_data,
          action_source,
        },
      ],
    };

    const response = await fetch(
      `https://graph.facebook.com/v17.0/${pixel_id}/events?access_token=${access_token}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error('❌ Meta送信エラー:', result);
      return res.status(500).json({ error: 'Failed to send event to Meta', detail: result });
    }

    console.log('✅ Meta送信成功:', result);
    res.status(200).json({ message: 'Event sent to Meta successfully', result });
  } catch (err) {
    console.error('❌ サーバーエラー:', err);
    res.status(500).json({ error: 'Server error', detail: err.message });
  }
}
