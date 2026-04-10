const supabase = require('../config/supabase');

// Helper: get or create cart for a user, then return cart with items + product details
const getOrCreateCart = async (userId) => {
  let { data: cart } = await supabase
    .from('carts')
    .select('id')
    .eq('user_id', userId)
    .single();

  if (!cart) {
    const { data: newCart } = await supabase
      .from('carts')
      .insert({ user_id: userId })
      .select('id')
      .single();
    cart = newCart;
  }
  return cart;
};

const getCartWithItems = async (cartId) => {
  const { data: items } = await supabase
    .from('cart_items')
    .select('*, product:products(*)')
    .eq('cart_id', cartId);
  return { id: cartId, items: items || [] };
};

const getCart = async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req.user.id);
    const fullCart = await getCartWithItems(cart.id);
    res.json({ cart: fullCart });
  } catch (err) { next(err); }
};

const addToCart = async (req, res, next) => {
  try {
    const { productId, qty, sizeMl } = req.body;

    const { data: product, error: pErr } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (pErr || !product) return res.status(404).json({ message: 'Product not found' });

    const sizeObj = product.sizes.find(s => s.ml === sizeMl);
    if (!sizeObj) return res.status(400).json({ message: 'Size not available' });

    const cart = await getOrCreateCart(req.user.id);

    // Upsert: if same product+size exists, increment qty
    const { data: existing } = await supabase
      .from('cart_items')
      .select('id, qty')
      .eq('cart_id', cart.id)
      .eq('product_id', productId)
      .eq('size_ml', sizeMl)
      .single();

    if (existing) {
      await supabase
        .from('cart_items')
        .update({ qty: existing.qty + qty })
        .eq('id', existing.id);
    } else {
      await supabase.from('cart_items').insert({
        cart_id: cart.id,
        product_id: productId,
        qty,
        size_ml: sizeMl,
        price: sizeObj.price,
      });
    }

    const fullCart = await getCartWithItems(cart.id);
    res.json({ cart: fullCart });
  } catch (err) { next(err); }
};

const updateCartItem = async (req, res, next) => {
  try {
    const { itemId, qty } = req.body;
    const cart = await getOrCreateCart(req.user.id);

    if (qty <= 0) {
      await supabase.from('cart_items').delete().eq('id', itemId).eq('cart_id', cart.id);
    } else {
      const { error } = await supabase
        .from('cart_items')
        .update({ qty })
        .eq('id', itemId)
        .eq('cart_id', cart.id);
      if (error) return res.status(404).json({ message: 'Item not found' });
    }

    const fullCart = await getCartWithItems(cart.id);
    res.json({ cart: fullCart });
  } catch (err) { next(err); }
};

const removeCartItem = async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req.user.id);
    await supabase.from('cart_items').delete()
      .eq('id', req.params.itemId)
      .eq('cart_id', cart.id);
    const fullCart = await getCartWithItems(cart.id);
    res.json({ cart: fullCart });
  } catch (err) { next(err); }
};

const clearCart = async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req.user.id);
    await supabase.from('cart_items').delete().eq('cart_id', cart.id);
    res.json({ message: 'Cart cleared' });
  } catch (err) { next(err); }
};

module.exports = { getCart, addToCart, updateCartItem, removeCartItem, clearCart };
