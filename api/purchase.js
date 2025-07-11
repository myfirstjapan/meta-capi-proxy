// /api/purchase.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const accessToken = process.env.META_ACCESS_TOKEN;
  const pixelId = process.env.META_PIXEL_ID;

  if (!accessToken || !pixelId) {
    return res.status(500).json({ error: "Missing META_ACCESS_TOKEN or META_PIXEL_ID" });
  }

  const {
    event_name,
    event_id,
    event_source_url,
    currency,
    value,
    contents,
    user_data
  } = req.body;

  const payload = {
    data: [
      {
        event_name: event_name || "Purchase",
        event_time: Math.floor(Date.now() / 1000),
        event_id: event_id,
        event_source_url: event_source_url || "https://yourdomain.com",
        action_source: "website",
        user_data: user_data || {},
        custom_data: {
          currency: currency || "JPY",
          value: value || 0,
          contents: contents || []
        }
      }
    ]
  };

  try {
    const response = await fetch(
      `https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${accessToken}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Meta CAPI Error Response:", data);
      return res.status(500).json({ error: "Meta API Error", details: data });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Meta CAPI送信エラー:", error);
    res.status(500).json({ error: "Meta CAPI送信エラー" });
  }
}
