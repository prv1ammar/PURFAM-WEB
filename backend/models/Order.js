const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      productName: { en: String, ar: String },
      brand: String,
      image: String,
      qty: { type: Number, required: true },
      sizeMl: { type: Number, required: true },
      priceAtPurchase: { type: Number, required: true },
    },
  ],
  shippingAddress: {
    name: { type: String, required: true },
    line1: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    phone: String,
  },
  paymentIntentId: { type: String },
  status: {
    type: String,
    enum: ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  subtotal: { type: Number, required: true },
  shippingCost: { type: Number, default: 0 },
  total: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
