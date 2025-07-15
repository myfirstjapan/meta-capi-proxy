export default async function handler(req, res) {
  // CORS ヘッダー設定
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Preflightリクエスト処理
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // POST以外は拒否
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // 環境変数の読み込み
  const pixelId = process.env.META_PIXEL_ID;
  const accessToken = process.env.META_ACCESS_TOKEN;

  // 環境変数が未設定の場合
  if (!pixelId || !accessToken) {
    return res.status(500).json({ error: "環境変数が設定されていません。" });
  }

  try {
    const { event_name, event_id, user_data, custom_data } = req.body;

    const payload = {
      data: [
        {
          event_name,
          event_time: Math.floor(Date.now() / 1000),
          event_id,
          user_data,
          custom_data,
        },
      ],
    };

    const fbResponse = await fetch(
      `https://graph.facebook.com/v18.0/${pixelId}/events?access_token=${accessToken}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const fbData = await fbResponse.json();

    return res.status(200).json({ success: true, fb: fbData });
  } catch (error) {
    console.error("❌ Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
