const Cart = require('../models/Cart');
const Product = require('../models/Product');

const getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    res.json({ cart: cart || { items: [] } });
  } catch (err) { next(err); }
};

const addToCart = async (req, res, next) => {
  try {
    const { productId, qty, sizeMl } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const sizeObj = product.sizes.find(s => s.ml === sizeMl);
    if (!sizeObj) return res.status(400).json({ message: 'Size not available' });

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = new Cart({ user: req.user._id, items: [] });

    const existingIdx = cart.items.findIndex(
      i => i.product.toString() === productId && i.sizeMl === sizeMl
    );
    if (existingIdx >= 0) {
      cart.items[existingIdx].qty += qty;
    } else {
      cart.items.push({ product: productId, qty, sizeMl, price: sizeObj.price });
    }
    await cart.save();
    await cart.populate('items.product');
    res.json({ cart });
  } catch (err) { next(err); }
};

const updateCartItem = async (req, res, next) => {
  try {
    const { itemId, qty } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    const item = cart.items.id(itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    if (qty <= 0) {
      cart.items.pull(itemId);
    } else {
      item.qty = qty;
    }
    await cart.save();
    await cart.populate('items.product');
    res.json({ cart });
  } catch (err) { next(err); }
};

const removeCartItem = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    cart.items.pull(req.params.itemId);
    await cart.save();
    res.json({ cart });
  } catch (err) { next(err); }
};

const clearCart = async (req, res, next) => {
  try {
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
    res.json({ message: 'Cart cleared' });
  } catch (err) { next(err); }
};

module.exports = { getCart, addToCart, updateCartItem, removeCartItem, clearCart };
