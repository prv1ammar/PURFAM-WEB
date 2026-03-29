import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import api from '@/services/api';

export default function AdminPage() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const [tab, setTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState({
    'name.en': '', 'name.ar': '', 'description.en': '', 'description.ar': '',
    brand: '', gender: 'women', category: 'floral',
    'sizes': '[{"ml":50,"price":100}]',
    images: '[]', stock: 100, featured: false,
  });

  useEffect(() => {
    if (tab === 'products') {
      api.get('/api/products').then(r => setProducts(r.data.products)).catch(console.error).finally(() => setLoading(false));
    } else {
      api.get('/api/admin/orders').then(r => setOrders(r.data.orders)).catch(console.error).finally(() => setLoading(false));
    }
  }, [tab]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    await api.delete(`/api/admin/products/${id}`);
    setProducts(p => p.filter(x => x._id !== id));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: { en: form['name.en'], ar: form['name.ar'] },
        description: { en: form['description.en'], ar: form['description.ar'] },
        brand: form.brand, gender: form.gender, category: form.category,
        sizes: JSON.parse(form.sizes),
        images: JSON.parse(form.images),
        stock: Number(form.stock), featured: form.featured,
      };
      if (editProduct) {
        await api.put(`/api/admin/products/${editProduct._id}`, payload);
      } else {
        await api.post('/api/admin/products', payload);
      }
      setShowForm(false);
      setEditProduct(null);
      const r = await api.get('/api/products');
      setProducts(r.data.products);
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving product');
    }
  };

  const handleStatusChange = async (orderId, status) => {
    await api.put(`/api/admin/orders/${orderId}/status`, { status });
    setOrders(o => o.map(x => x._id === orderId ? { ...x, status } : x));
  };

  const tabStyle = (active) => ({
    padding: '0.75rem 1.5rem', fontSize: '0.8rem', letterSpacing: '0.1em',
    textTransform: 'uppercase', cursor: 'pointer',
    background: active ? 'var(--color-gold)' : 'transparent',
    color: active ? 'var(--color-black)' : 'var(--color-gray)',
    border: `1px solid ${active ? 'var(--color-gold)' : 'var(--color-border)'}`,
    borderRadius: 'var(--radius-sm)', transition: 'all 0.2s',
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="page-wrapper">
      <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: '3rem 1.5rem', direction: isAr ? 'rtl' : 'ltr' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, marginBottom: '2rem' }}>
          {isAr ? 'لوحة الإدارة' : 'Admin Dashboard'}
        </h1>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
          <button style={tabStyle(tab === 'products')} onClick={() => setTab('products')}>
            {isAr ? 'المنتجات' : 'Products'}
          </button>
          <button style={tabStyle(tab === 'orders')} onClick={() => setTab('orders')}>
            {isAr ? 'الطلبات' : 'Orders'}
          </button>
        </div>

        {tab === 'products' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
              <button onClick={() => { setShowForm(true); setEditProduct(null); }}
                style={{ padding: '0.75rem 1.5rem', background: 'var(--color-gold)', color: 'var(--color-black)', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em', borderRadius: 'var(--radius-sm)' }}>
                + {isAr ? 'إضافة منتج' : 'Add Product'}
              </button>
            </div>

            {showForm && (
              <div style={{ background: 'var(--color-charcoal)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '2rem', marginBottom: '2rem' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', marginBottom: '1.5rem' }}>
                  {editProduct ? (isAr ? 'تعديل المنتج' : 'Edit Product') : (isAr ? 'إضافة منتج جديد' : 'New Product')}
                </h3>
                <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  {[
                    { key: 'name.en', label: 'Name (English)' },
                    { key: 'name.ar', label: 'Name (Arabic)' },
                    { key: 'brand', label: 'Brand' },
                    { key: 'stock', label: 'Stock', type: 'number' },
                    { key: 'description.en', label: 'Description (EN)', fullWidth: true, textarea: true },
                    { key: 'description.ar', label: 'Description (AR)', fullWidth: true, textarea: true },
                    { key: 'sizes', label: 'Sizes JSON (e.g. [{"ml":50,"price":100}])', fullWidth: true },
                    { key: 'images', label: 'Images JSON (array of URLs)', fullWidth: true },
                  ].map(f => (
                    <div key={f.key} style={{ gridColumn: f.fullWidth ? '1 / -1' : 'auto' }}>
                      <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-gray)', marginBottom: '0.3rem' }}>{f.label}</label>
                      {f.textarea ? (
                        <textarea rows={3} value={form[f.key]} onChange={e => setForm(v => ({ ...v, [f.key]: e.target.value }))}
                          style={{ width: '100%', padding: '0.6rem', background: 'var(--color-dark)', border: '1px solid var(--color-border)', color: 'var(--color-off-white)', resize: 'vertical', borderRadius: 'var(--radius-sm)' }} />
                      ) : (
                        <input type={f.type || 'text'} value={form[f.key]} onChange={e => setForm(v => ({ ...v, [f.key]: e.target.value }))}
                          style={{ width: '100%', padding: '0.6rem', background: 'var(--color-dark)', border: '1px solid var(--color-border)', color: 'var(--color-off-white)', borderRadius: 'var(--radius-sm)' }} />
                      )}
                    </div>
                  ))}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-gray)', marginBottom: '0.3rem' }}>Gender</label>
                    <select value={form.gender} onChange={e => setForm(v => ({ ...v, gender: e.target.value }))}
                      style={{ width: '100%', padding: '0.6rem', background: 'var(--color-dark)', border: '1px solid var(--color-border)', color: 'var(--color-off-white)', borderRadius: 'var(--radius-sm)' }}>
                      {['women', 'men', 'girls', 'boys', 'unisex'].map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-gray)', marginBottom: '0.3rem' }}>Category</label>
                    <select value={form.category} onChange={e => setForm(v => ({ ...v, category: e.target.value }))}
                      style={{ width: '100%', padding: '0.6rem', background: 'var(--color-dark)', border: '1px solid var(--color-border)', color: 'var(--color-off-white)', borderRadius: 'var(--radius-sm)' }}>
                      {['floral', 'woody', 'oriental', 'fresh', 'citrus', 'gourmand'].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                    <button type="button" onClick={() => setShowForm(false)} style={{ padding: '0.6rem 1.5rem', border: '1px solid var(--color-border)', color: 'var(--color-gray)', borderRadius: 'var(--radius-sm)' }}>
                      Cancel
                    </button>
                    <button type="submit" style={{ padding: '0.6rem 1.5rem', background: 'var(--color-gold)', color: 'var(--color-black)', fontWeight: 700, borderRadius: 'var(--radius-sm)' }}>
                      Save
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {products.map(p => (
                <div key={p._id} style={{ background: 'var(--color-charcoal)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <img src={p.images?.[0]} alt="" style={{ width: '50px', height: '60px', objectFit: 'cover', borderRadius: '2px' }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: 'var(--font-serif)' }}>{p.name.en}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-gray)' }}>{p.brand} · {p.gender} · {p.sizes[0]?.price} dh</p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => { setEditProduct(p); setForm({ 'name.en': p.name.en, 'name.ar': p.name.ar, 'description.en': p.description.en, 'description.ar': p.description.ar, brand: p.brand, gender: p.gender, category: p.category, sizes: JSON.stringify(p.sizes), images: JSON.stringify(p.images), stock: p.stock, featured: p.featured }); setShowForm(true); }}
                      style={{ padding: '0.4rem 0.8rem', border: '1px solid var(--color-gold)', color: 'var(--color-gold)', fontSize: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(p._id)}
                      style={{ padding: '0.4rem 0.8rem', border: '1px solid #e55', color: '#e55', fontSize: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'orders' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {orders.map(order => (
              <div key={order._id} style={{ background: 'var(--color-charcoal)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-gray)' }}>#{order._id.slice(-8).toUpperCase()}</p>
                  <p style={{ fontFamily: 'var(--font-serif)' }}>{order.user?.name}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-gray)' }}>{order.user?.email}</p>
                </div>
                <p style={{ color: 'var(--color-gold)', fontFamily: 'var(--font-serif)', fontSize: '1.1rem' }}>${order.total}</p>
                <select value={order.status} onChange={e => handleStatusChange(order._id, e.target.value)}
                  style={{ padding: '0.4rem 0.8rem', background: 'var(--color-dark)', border: '1px solid var(--color-border)', color: 'var(--color-off-white)', borderRadius: 'var(--radius-sm)' }}>
                  {['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
