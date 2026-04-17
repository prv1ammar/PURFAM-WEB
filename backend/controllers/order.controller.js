const supabase = require('../config/supabase');
const { notifyNewOrder } = require('../utils/notify');

const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentIntentId, paymentMethod } = req.body;
    if (!items || items.length === 0) return res.status(400).json({ message: 'No items in order' });

    const subtotal = items.reduce((sum, i) => sum + i.priceAtPurchase * i.qty, 0);
    const shippingCost = subtotal > 200 ? 0 : 15;
    const total = subtotal + shippingCost;

    const isCOD = !paymentIntentId || paymentMethod === 'cash_on_delivery';
    const orderData = {
      items,
      shipping_address: shippingAddress,
      payment_intent_id: paymentIntentId || null,
      status: isCOD ? 'pending' : 'paid',
      subtotal,
      shipping_cost: shippingCost,
      total,
    };
    if (req.user) {
      orderData.user_id = req.user.id;
    }

    const { data: order, error } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single();

    if (error) return next(error);

    // Clear cart if logged in
    if (req.user) {
      const { data: cart } = await supabase
        .from('carts')
        .select('id')
        .eq('user_id', req.user.id)
        .single();
      if (cart) {
        await supabase.from('cart_items').delete().eq('cart_id', cart.id);
      }
    }

    // 🔔 Send email + WhatsApp notification (non-blocking)
    notifyNewOrder(order).catch((err) =>
      console.error('[Order] Notification error:', err.message)
    );

    res.status(201).json({ order });
  } catch (err) { next(err); }
};

const getMyOrders = async (req, res, next) => {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) return next(error);
    // Normalize snake_case to camelCase for the frontend
    const normalized = (orders || []).map(o => ({
      ...o,
      createdAt: o.created_at,
      shippingAddress: o.shipping_address,
      shippingCost: o.shipping_cost,
      paymentIntentId: o.payment_intent_id,
    }));
    res.json({ orders: normalized });
  } catch (err) { next(err); }
};

const getOrderById = async (req, res, next) => {
  try {
    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .single();

    if (error || !order) return res.status(404).json({ message: 'Order not found' });
    res.json({ order });
  } catch (err) { next(err); }
};

module.exports = { createOrder, getMyOrders, getOrderById };
