const nodemailer = require('nodemailer');
const axios = require('axios');

// ─── Email via Gmail SMTP (Nodemailer) ────────────────────────────────────────
const sendOrderEmail = async (order) => {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.log('[Notify] Email skipped — GMAIL_USER / GMAIL_APP_PASSWORD not set');
    return;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  const addr = order.shipping_address || {};
  const itemsHtml = (order.items || [])
    .map(i => `
      <tr>
        <td style="padding:6px 12px;border-bottom:1px solid #e5e7eb;">${i.productName?.en || i.productName || 'Product'}</td>
        <td style="padding:6px 12px;border-bottom:1px solid #e5e7eb;text-align:center;">${i.sizeMl || '-'}ml</td>
        <td style="padding:6px 12px;border-bottom:1px solid #e5e7eb;text-align:center;">×${i.qty}</td>
        <td style="padding:6px 12px;border-bottom:1px solid #e5e7eb;text-align:right;">${((i.priceAtPurchase || 0) * i.qty).toFixed(2)} dh</td>
      </tr>`)
    .join('');

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;">
      <div style="background:#0f0f0f;padding:24px;text-align:center;">
        <h1 style="color:#c8951a;margin:0;font-size:22px;letter-spacing:2px;">LUXE ESSENCE</h1>
        <p style="color:#888;margin:4px 0 0;font-size:13px;">Nouvelle Commande Reçue</p>
      </div>
      <div style="padding:24px;">
        <h2 style="font-size:16px;color:#111;margin-bottom:16px;">
          Commande du ${new Date().toLocaleString('fr-FR')}
        </h2>

        <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
          <tr style="background:#f9fafb;">
            <th style="padding:8px 12px;text-align:left;font-size:12px;color:#555;">Article</th>
            <th style="padding:8px 12px;text-align:center;font-size:12px;color:#555;">Taille</th>
            <th style="padding:8px 12px;text-align:center;font-size:12px;color:#555;">Qté</th>
            <th style="padding:8px 12px;text-align:right;font-size:12px;color:#555;">Prix</th>
          </tr>
          ${itemsHtml}
        </table>

        <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
          <tr>
            <td style="padding:4px 0;color:#555;font-size:14px;">Sous-total</td>
            <td style="padding:4px 0;text-align:right;font-size:14px;">${(order.subtotal || 0).toFixed(2)} dh</td>
          </tr>
          <tr>
            <td style="padding:4px 0;color:#555;font-size:14px;">Livraison</td>
            <td style="padding:4px 0;text-align:right;font-size:14px;">${(order.shipping_cost || 0) === 0 ? 'Gratuite' : order.shipping_cost.toFixed(2) + ' dh'}</td>
          </tr>
          <tr style="border-top:2px solid #c8951a;">
            <td style="padding:8px 0;font-weight:bold;color:#111;">TOTAL</td>
            <td style="padding:8px 0;text-align:right;font-weight:bold;font-size:18px;color:#c8951a;">${(order.total || 0).toFixed(2)} dh</td>
          </tr>
        </table>

        <div style="background:#f9fafb;padding:16px;border-radius:8px;">
          <p style="font-size:13px;font-weight:bold;margin:0 0 8px;color:#111;">Informations client</p>
          <p style="font-size:13px;margin:2px 0;color:#444;">👤 ${addr.name || '—'}</p>
          <p style="font-size:13px;margin:2px 0;color:#444;">📞 ${addr.phone || '—'}</p>
          <p style="font-size:13px;margin:2px 0;color:#444;">📍 ${addr.line1 || '—'}, ${addr.city || '—'}, ${addr.country || '—'}</p>
        </div>
      </div>
      <div style="background:#f3f4f6;padding:12px;text-align:center;">
        <p style="font-size:12px;color:#999;margin:0;">Luxe Essence — Paiement ✅ Confirmé</p>
      </div>
    </div>`;

  await transporter.sendMail({
    from: `"Luxe Essence" <${process.env.GMAIL_USER}>`,
    to: process.env.NOTIFY_EMAIL || process.env.GMAIL_USER,
    subject: `🛍️ Nouvelle commande — ${addr.name || 'Client'} — ${(order.total || 0).toFixed(2)} dh`,
    html,
  });

  console.log('[Notify] ✅ Email envoyé à', process.env.NOTIFY_EMAIL || process.env.GMAIL_USER);
};

// ─── WhatsApp via UltraMsg ────────────────────────────────────────────────────
const sendOrderWhatsApp = async (order) => {
  if (!process.env.ULTRAMSG_TOKEN || !process.env.ULTRAMSG_INSTANCE) {
    console.log('[Notify] WhatsApp skipped — ULTRAMSG_TOKEN / ULTRAMSG_INSTANCE not set');
    return;
  }

  const addr = order.shipping_address || {};
  const itemsList = (order.items || [])
    .map(i => `• ${i.productName?.en || i.productName || 'Produit'} ${i.sizeMl || ''}ml ×${i.qty}`)
    .join('\n');

  const message = `🌹 *NOUVELLE COMMANDE — LUXE ESSENCE*

👤 *Client:* ${addr.name || '—'}
📞 *Tél:* ${addr.phone || '—'}
📍 *Adresse:* ${addr.line1 || '—'}, ${addr.city || '—'}, ${addr.country || '—'}

🛍️ *Articles:*
${itemsList}

💰 *Total: ${(order.total || 0).toFixed(2)} dh*
🚚 Livraison: ${(order.shipping_cost || 0) === 0 ? 'Gratuite' : order.shipping_cost.toFixed(2) + ' dh'}

✅ Paiement confirmé`;

  await axios.post(
    `https://api.ultramsg.com/${process.env.ULTRAMSG_INSTANCE}/messages/chat`,
    new URLSearchParams({
      token: process.env.ULTRAMSG_TOKEN,
      to: process.env.WHATSAPP_PHONE,
      body: message,
    }),
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, timeout: 10000 }
  );

  console.log('[Notify] ✅ WhatsApp envoyé via UltraMsg');
};

// ─── Master notify function ───────────────────────────────────────────────────
const notifyNewOrder = async (order) => {
  await Promise.allSettled([
    sendOrderEmail(order).catch(err => console.error('[Notify] ❌ Email error:', err.message)),
    sendOrderWhatsApp(order).catch(err => console.error('[Notify] ❌ WhatsApp error:', err.message)),
  ]);
};

module.exports = { notifyNewOrder };
