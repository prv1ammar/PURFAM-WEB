const Product = require('../models/Product');

const getAllProducts = async (req, res, next) => {
  try {
    const { gender, category, featured, search, minPrice, maxPrice, page = 1, limit = 12, sort = '-createdAt', size, minSize } = req.query;
    const query = {};

    if (gender) query.gender = gender;
    if (category) query.category = category;
    if (featured === 'true') query.featured = true;
    if (search) {
      query.$or = [
        { 'name.en': { $regex: search, $options: 'i' } },
        { 'name.ar': { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
      ];
    }
    if (minPrice || maxPrice) {
      query['sizes.price'] = {};
      if (minPrice) query['sizes.price'].$gte = Number(minPrice);
      if (maxPrice) query['sizes.price'].$lte = Number(maxPrice);
    }
    if (size || minSize) {
      query['sizes.ml'] = {};
      if (size) query['sizes.ml'].$eq = Number(size);
      if (minSize) query['sizes.ml'].$gte = Number(minSize);
    }

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ products, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ product });
  } catch (err) {
    next(err);
  }
};

const getFeatured = async (req, res, next) => {
  try {
    const products = await Product.find({ featured: true }).limit(8);
    res.json({ products });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllProducts, getProductById, getFeatured };
