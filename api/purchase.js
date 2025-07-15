// 再デプロイ用
export default async function handler(req, res) {
  // ✅ CORSヘッダー追加（ローカルテスト用）
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // ✅ preflightリクエスト処理（OPTIONSメソッド対応）
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { event_name, event_id, user_data, custom_data } = req.body;

    const pixelId = process.env.META_PIXEL_ID;
    const accessToken = process.env.META_ACCESS_TOKEN;

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
