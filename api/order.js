export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { fullName, phone, wilaya, commune } = req.body;

  if (!fullName || !phone || !wilaya || !commune) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = '6227854155';

  if (!token) {
    return res.status(500).json({ error: 'Bot token not configured' });
  }

  const text = `🛒 *طلب جديد - Anker 20W*\n\n👤 *الاسم:* ${fullName}\n📞 *الهاتف:* ${phone}\n📍 *الولاية:* ${wilaya}\n🏘️ *البلدية:* ${commune}\n\n💰 *السعر:* 3000 DA\n⏰ *التوقيت:* ${new Date().toLocaleString('ar-DZ', { timeZone: 'Africa/Algiers' })}`;

  try {
    const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' }),
    });

    const data = await tgRes.json();

    if (!data.ok) {
      console.error('Telegram error:', data);
      return res.status(500).json({ error: 'Failed to send to Telegram' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Fetch error:', err);
    return res.status(500).json({ error: 'Network error' });
  }
}
