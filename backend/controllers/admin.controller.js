const supabase = require('../config/supabase');

const createProduct = async (req, res, next) => {
  try {
    const body = req.body;
    // Auto-generate slug if not provided
    if (!body.slug) {
      const nameEn = body.name?.en || '';
      body.slug = nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();
    }
    const { data: product, error } = await supabase
      .from('products')
      .insert(body)
      .select()
      .single();
    if (error) return next(error);
    res.status(201).json({ product });
  } catch (err) { next(err); }
};

const updateProduct = async (req, res, next) => {
  try {
    const { data: product, error } = await supabase
      .from('products')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();
    if (error || !product) return res.status(404).json({ message: 'Product not found' });
    res.json({ product });
  } catch (err) { next(err); }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { data: product, error } = await supabase
      .from('products')
      .delete()
      .eq('id', req.params.id)
      .select()
      .single();
    if (error || !product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) { next(err); }
};

const getAllOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const from = (page - 1) * limit;
    const to = from + Number(limit) - 1;

    let query = supabase
      .from('orders')
      .select('*, user:users(name, email)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (status) query = query.eq('status', status);

    const { data: orders, error, count } = await query;
    if (error) return next(error);
    res.json({ orders, total: count });
  } catch (err) { next(err); }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const { data: order, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', req.params.id)
      .select()
      .single();
    if (error || !order) return res.status(404).json({ message: 'Order not found' });
    res.json({ order });
  } catch (err) { next(err); }
};

module.exports = { createProduct, updateProduct, deleteProduct, getAllOrders, updateOrderStatus };
