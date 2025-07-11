// /api/purchase.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const accessToken = process.env.META_ACCESS_TOKEN;
  const pixelId = process.env.META_PIXEL_ID;

  if (!accessToken || !pixelId) {
    return res.status(500).json({ error: "Server config missing" });
  }

  const {
    event_name,
    event_id,
    event_source_url,
    currency,
    value,
    contents
  } = req.body;

  const payload = {
    data: [
      {
        event_name: event_name || "Purchase",
        event_time: Math.floor(Date.now() / 1000),
        event_id: event_id,
        event_source_url: event_source_url || "https://yourdomain.com",
        action_source: "website",
        custom_data: {
          currency: currency || "JPY",
          value: value || 0,
          contents: contents || []
        }
      }
    ]
  };

  try {
    const fbRes = await fetch(
      `https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${accessToken}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      }
    );

    const fbData = await fbRes.json();
    res.status(200).json(fbData);
  } catch (err) {
    console.error("Meta CAPI送信エラー:", err);
    res.status(500).json({ error: "Meta CAPI送信エラー" });
  }
}
