const { Resend } = require('resend');

const STORE_EMAIL = process.env.NOTIFY_EMAIL || 'amarrabeh1998@gmail.com';

async function sendOrderEmail(order) {
  if (!process.env.RESEND_API_KEY) {
    console.log('[Notification] No RESEND_API_KEY — order logged only:', order.id);
    return;
  }
  const resend = new Resend(process.env.RESEND_API_KEY);

  const itemsHtml = order.items.map(i => `
    <tr>
      <td style="padding:8px;border-bottom:1px solid #eee">${i.name?.en || i.name || ''}</td>
      <td style="padding:8px;border-bottom:1px solid #eee">${i.brand}</td>
      <td style="padding:8px;border-bottom:1px solid #eee">${i.size}</td>
      <td style="padding:8px;border-bottom:1px solid #eee">${i.quantity}</td>
      <td style="padding:8px;border-bottom:1px solid #eee">${i.price} dh</td>
    </tr>`).join('');

  await resend.emails.send({
    from: 'Luxe Essence Orders <onboarding@resend.dev>',
    to: STORE_EMAIL,
    subject: `🛍️ New Order via Layla — ${order.shipping_address.name} — ${order.total} dh`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:auto">
        <h2 style="color:#1a1a1a">New Order from Layla Chatbot</h2>
        <p><b>Order ID:</b> ${order.id}</p>

        <h3 style="color:#333">Customer</h3>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:6px;color:#666">Name</td><td style="padding:6px"><b>${order.shipping_address.name}</b></td></tr>
          <tr><td style="padding:6px;color:#666">Phone</td><td style="padding:6px"><b>${order.shipping_address.phone}</b></td></tr>
          <tr><td style="padding:6px;color:#666">City</td><td style="padding:6px">${order.shipping_address.city}</td></tr>
          <tr><td style="padding:6px;color:#666">Address</td><td style="padding:6px">${order.shipping_address.address}</td></tr>
          ${order.shipping_address.notes ? `<tr><td style="padding:6px;color:#666">Notes</td><td style="padding:6px">${order.shipping_address.notes}</td></tr>` : ''}
        </table>

        <h3 style="color:#333;margin-top:20px">Items</h3>
        <table style="width:100%;border-collapse:collapse">
          <thead>
            <tr style="background:#f5f5f5">
              <th style="padding:8px;text-align:left">Product</th>
              <th style="padding:8px;text-align:left">Brand</th>
              <th style="padding:8px;text-align:left">Size</th>
              <th style="padding:8px;text-align:left">Qty</th>
              <th style="padding:8px;text-align:left">Price</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
        </table>

        <div style="margin-top:20px;padding:16px;background:#f9f9f9;border-radius:8px">
          <p style="margin:4px 0"><b>Subtotal:</b> ${order.subtotal} dh</p>
          <p style="margin:4px 0"><b>Shipping:</b> ${order.shipping_cost} dh</p>
          <p style="margin:4px 0;font-size:1.1em"><b>Total: ${order.total} dh</b></p>
          <p style="margin:4px 0;color:#888">Payment: Cash on Delivery</p>
        </div>

        <p style="color:#888;font-size:0.85em;margin-top:20px">
          Order placed via Layla AI chatbot on luxeessance.com
        </p>
      </div>
    `,
  });
}

module.exports = { sendOrderEmail };
