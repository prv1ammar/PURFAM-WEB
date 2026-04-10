const supabase = require('../config/supabase');

const getAllProducts = async (req, res, next) => {
  try {
    const {
      gender, category, featured, search,
      minPrice, maxPrice, page = 1, limit = 12,
      sort = 'created_at', order = 'desc',
    } = req.query;

    let query = supabase.from('products').select('*', { count: 'exact' });

    if (gender) query = query.eq('gender', gender);
    if (category) query = query.eq('category', category);
    if (featured === 'true') query = query.eq('featured', true);
    if (search) {
      query = query.or(
        `name->>'en'.ilike.%${search}%,name->>'ar'.ilike.%${search}%,brand.ilike.%${search}%`
      );
    }

    // Sort
    const sortField = sort.startsWith('-') ? sort.slice(1) : sort;
    const ascending = sort.startsWith('-') ? false : order !== 'desc';
    query = query.order(sortField === 'createdAt' ? 'created_at' : sortField, { ascending });

    // Pagination
    const from = (page - 1) * limit;
    const to = from + Number(limit) - 1;
    query = query.range(from, to);

    const { data: products, error, count } = await query;
    if (error) return next(error);

    res.json({
      products,
      total: count,
      page: Number(page),
      pages: Math.ceil(count / limit),
    });
  } catch (err) {
    next(err);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !product) return res.status(404).json({ message: 'Product not found' });
    res.json({ product });
  } catch (err) {
    next(err);
  }
};

const getFeatured = async (req, res, next) => {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('featured', true)
      .limit(8);

    if (error) return next(error);
    res.json({ products });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllProducts, getProductById, getFeatured };
