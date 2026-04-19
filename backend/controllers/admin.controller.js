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

// ── Collections ─────────────────────────────────────────────────────────────
const getCollections = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('collections')
      .select('*, collection_products(count)')
      .order('created_at', { ascending: true });
    if (error) return next(error);
    res.json({ collections: data });
  } catch (err) { next(err); }
};

const createCollection = async (req, res, next) => {
  try {
    const { name, description, image } = req.body;
    const slug = (name?.en || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();
    const { data, error } = await supabase.from('collections').insert({ name, description, image, slug }).select().single();
    if (error) return next(error);
    res.status(201).json({ collection: data });
  } catch (err) { next(err); }
};

const updateCollection = async (req, res, next) => {
  try {
    const { name, description, image } = req.body;
    const { data, error } = await supabase.from('collections').update({ name, description, image, updated_at: new Date() }).eq('id', req.params.id).select().single();
    if (error || !data) return res.status(404).json({ message: 'Collection not found' });
    res.json({ collection: data });
  } catch (err) { next(err); }
};

const deleteCollection = async (req, res, next) => {
  try {
    const { error } = await supabase.from('collections').delete().eq('id', req.params.id);
    if (error) return next(error);
    res.json({ message: 'Collection deleted' });
  } catch (err) { next(err); }
};

// ── Collection Products ──────────────────────────────────────────────────────
const getCollectionProducts = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('collection_products')
      .select('product_id, position, product:products(id, name, brand, images, sizes, gender)')
      .eq('collection_id', req.params.id)
      .order('position', { ascending: true });
    if (error) return next(error);
    res.json({ products: (data || []).map(r => ({ ...r.product, position: r.position })) });
  } catch (err) { next(err); }
};

const addProductToCollection = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const { error } = await supabase
      .from('collection_products')
      .upsert({ collection_id: req.params.id, product_id: productId }, { onConflict: 'collection_id,product_id' });
    if (error) return next(error);
    res.json({ message: 'Product added to collection' });
  } catch (err) { next(err); }
};

const removeProductFromCollection = async (req, res, next) => {
  try {
    const { error } = await supabase
      .from('collection_products')
      .delete()
      .eq('collection_id', req.params.id)
      .eq('product_id', req.params.productId);
    if (error) return next(error);
    res.json({ message: 'Product removed from collection' });
  } catch (err) { next(err); }
};

// ── Site Settings ────────────────────────────────────────────────────────────
const getSiteSettings = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'announcement')
      .single();
    if (error && error.code !== 'PGRST116') return next(error);
    res.json({ settings: data?.value || null });
  } catch (err) { next(err); }
};

const updateSiteSettings = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('settings')
      .upsert({ key: 'announcement', value: req.body, updated_at: new Date() }, { onConflict: 'key' })
      .select()
      .single();
    if (error) return next(error);
    res.json({ settings: data.value });
  } catch (err) { next(err); }
};

module.exports = { createProduct, updateProduct, deleteProduct, getAllOrders, updateOrderStatus, getCollections, createCollection, updateCollection, deleteCollection, getCollectionProducts, addProductToCollection, removeProductFromCollection, getSiteSettings, updateSiteSettings };
