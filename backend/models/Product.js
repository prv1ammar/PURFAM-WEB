const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    en: { type: String, required: true },
    ar: { type: String, required: true },
  },
  description: {
    en: { type: String, required: true },
    ar: { type: String, required: true },
  },
  brand: { type: String, required: true },
  gender: {
    type: String,
    enum: ['women', 'men', 'girls', 'boys', 'unisex'],
    required: true,
  },
  category: {
    type: String,
    enum: ['floral', 'woody', 'oriental', 'fresh', 'citrus', 'gourmand'],
    required: true,
  },
  sizes: [
    {
      ml: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  images: [{ type: String }],
  stock: { type: Number, default: 100 },
  featured: { type: Boolean, default: false },
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
  },
  slug: { type: String, unique: true },
}, { timestamps: true });

productSchema.pre('save', function (next) {
  if (!this.slug) {
    this.slug = this.name.en
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + Date.now();
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
