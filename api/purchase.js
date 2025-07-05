import crypto from 'crypto';

export default async function handler(req, res) {
  // ✅ CORS 対応（全メソッド対応）
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end(); // プリフライトリクエストへの即時応答
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
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
