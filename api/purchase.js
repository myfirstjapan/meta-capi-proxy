module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const accessToken = process.env.META_ACCESS_TOKEN;
  const pixelId = process.env.META_PIXEL_ID;

  if (!accessToken || !pixelId) {
    return res.status(500).json({ error: 'Missing Meta config' });
  }

  const event_id = req.body.event_id || `event_${Date.now()}`;
  const payload = {
    data: [
      {
        event_name: "Purchase",
        event_time: Math.floor(Date.now() / 1000),
        event_id: event_id,
        action_source: "website",
        event_source_url: req.body.url || "",
        user_data: req.body.user_data,
        custom_data: req.body.custom_data || {},
      }
    ]
  };

  const response = await fetch(`https://graph.facebook.com/v18.0/${pixelId}/events?access_token=${accessToken}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const data = await response.json();

  if (!response.ok) {
    return res.status(500).json({ error: 'Meta API error', details: data });
  }

  return res.status(200).json({ success: true, data });
};