// api/purchase.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  console.log('📦 Received purchase event:', req.body);

  return res.status(200).json({ message: 'Event received successfully' });
}
