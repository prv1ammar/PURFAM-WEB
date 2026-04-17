const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// GET all collections (public)
router.get('/', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .order('created_at', { ascending: true });
    if (error) return next(error);
    res.json({ collections: data });
  } catch (err) { next(err); }
});

// GET products of a collection (public) — used by shop filter
router.get('/:slug/products', async (req, res, next) => {
  try {
    const { data: collection, error: cErr } = await supabase
      .from('collections')
      .select('id')
      .eq('slug', req.params.slug)
      .single();
    if (cErr || !collection) return res.status(404).json({ message: 'Collection not found' });

    const { data, error } = await supabase
      .from('collection_products')
      .select('product:products(*)')
      .eq('collection_id', collection.id)
      .order('position', { ascending: true });
    if (error) return next(error);
    res.json({ products: (data || []).map(r => r.product) });
  } catch (err) { next(err); }
});

module.exports = router;
