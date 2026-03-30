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
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState({
    'name.en': '', 'name.ar': '', 'description.en': '', 'description.ar': '',
    brand: '', gender: 'women', category: 'floral', stock: 100, featured: false,
  });
  const [sizes, setSizes] = useState([{ ml: '', price: '' }]);
  const [images, setImages] = useState([]);
  const [uploadingImg, setUploadingImg] = useState(false);

  useEffect(() => {
    if (tab === 'products') {
      setLoading(true);
      api.get('/api/products', { params: { page } })
        .then(r => { setProducts(r.data.products); setPages(r.data.pages); })
        .catch(console.error).finally(() => setLoading(false));
    } else {
      api.get('/api/admin/orders').then(r => setOrders(r.data.orders)).catch(console.error).finally(() => setLoading(false));
    }
  }, [tab, page]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    await api.delete(`/api/admin/products/${id}`);
    setProducts(p => p.filter(x => x._id !== id));
  };

  const handleUploadImage = async (file) => {
    setUploadingImg(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const token = localStorage.getItem('luxe_token');
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (data.url) setImages(prev => [...prev, data.url]);
      else alert(data.message || 'Upload failed');
    } catch {
      alert('Upload failed');
    } finally {
      setUploadingImg(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: { en: form['name.en'], ar: form['name.ar'] },
        description: { en: form['description.en'], ar: form['description.ar'] },
        brand: form.brand, gender: form.gender, category: form.category,
        sizes: sizes.filter(s => s.ml && s.price).map(s => ({ ml: Number(s.ml), price: Number(s.price) })),
        images,
        stock: Number(form.stock), featured: form.featured,
      };
      if (editProduct) {
        await api.put(`/api/admin/products/${editProduct._id}`, payload);
      } else {
        await api.post('/api/admin/products', payload);
      }
      setShowForm(false);
      setEditProduct(null);
      const r = await api.get('/api/products', { params: { page } });
      setProducts(r.data.products); setPages(r.data.pages);
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
              <button onClick={() => { setShowForm(true); setEditProduct(null); setForm({ 'name.en': '', 'name.ar': '', 'description.en': '', 'description.ar': '', brand: '', gender: 'women', category: 'floral', stock: 100, featured: false }); setSizes([{ ml: '', price: '' }]); setImages([]); }}
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

                  {/* Text fields */}
                  {[
                    { key: 'name.en', label: 'Name (English)', placeholder: 'e.g. Bleu de Chanel' },
                    { key: 'name.ar', label: 'Name (Arabic)', placeholder: 'e.g. بلو دي شانيل' },
                    { key: 'brand', label: 'Brand', placeholder: 'e.g. Chanel' },
                    { key: 'stock', label: 'Stock', type: 'number', placeholder: 'e.g. 50' },
                    { key: 'description.en', label: 'Description (English)', fullWidth: true, textarea: true, placeholder: 'Describe the fragrance, notes, character...' },
                    { key: 'description.ar', label: 'Description (Arabic)', fullWidth: true, textarea: true, placeholder: 'وصف العطر...' },
                  ].map(f => (
                    <div key={f.key} style={{ gridColumn: f.fullWidth ? '1 / -1' : 'auto' }}>
                      <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-gray)', marginBottom: '0.3rem' }}>{f.label}</label>
                      {f.textarea ? (
                        <textarea rows={3} value={form[f.key] || ''} onChange={e => setForm(v => ({ ...v, [f.key]: e.target.value }))}
                          placeholder={f.placeholder}
                          style={{ width: '100%', padding: '0.6rem', background: 'var(--color-dark)', border: '1px solid var(--color-border)', color: 'var(--color-off-white)', resize: 'vertical', borderRadius: 'var(--radius-sm)' }} />
                      ) : (
                        <input type={f.type || 'text'} value={form[f.key] || ''} onChange={e => setForm(v => ({ ...v, [f.key]: e.target.value }))}
                          placeholder={f.placeholder}
                          style={{ width: '100%', padding: '0.6rem', background: 'var(--color-dark)', border: '1px solid var(--color-border)', color: 'var(--color-off-white)', borderRadius: 'var(--radius-sm)' }} />
                      )}
                    </div>
                  ))}

                  {/* Gender & Category */}
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

                  {/* Sizes */}
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-gray)', marginBottom: '0.5rem' }}>
                      Sizes & Prices
                    </label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {sizes.map((s, i) => (
                        <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <input
                            type="number" value={s.ml} placeholder="Size (ml) — e.g. 50"
                            onChange={e => setSizes(prev => prev.map((x, j) => j === i ? { ...x, ml: e.target.value } : x))}
                            style={{ flex: 1, padding: '0.6rem', background: 'var(--color-dark)', border: '1px solid var(--color-border)', color: 'var(--color-off-white)', borderRadius: 'var(--radius-sm)' }}
                          />
                          <input
                            type="number" value={s.price} placeholder="Price (dh) — e.g. 350"
                            onChange={e => setSizes(prev => prev.map((x, j) => j === i ? { ...x, price: e.target.value } : x))}
                            style={{ flex: 1, padding: '0.6rem', background: 'var(--color-dark)', border: '1px solid var(--color-border)', color: 'var(--color-off-white)', borderRadius: 'var(--radius-sm)' }}
                          />
                          {sizes.length > 1 && (
                            <button type="button" onClick={() => setSizes(prev => prev.filter((_, j) => j !== i))}
                              style={{ padding: '0.4rem 0.7rem', border: '1px solid #e55', color: '#e55', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>
                              ✕
                            </button>
                          )}
                        </div>
                      ))}
                      <button type="button" onClick={() => setSizes(prev => [...prev, { ml: '', price: '' }])}
                        style={{ alignSelf: 'flex-start', padding: '0.4rem 0.9rem', border: '1px solid var(--color-border)', color: 'var(--color-gray)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem' }}>
                        + Add size
                      </button>
                    </div>
                  </div>

                  {/* Images */}
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-gray)', marginBottom: '0.5rem' }}>
                      Product Images
                    </label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      {images.map((url, i) => (
                        <div key={i} style={{ position: 'relative' }}>
                          <img src={url} alt="" style={{ width: '80px', height: '90px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }} />
                          <button type="button" onClick={() => setImages(prev => prev.filter((_, j) => j !== i))}
                            style={{ position: 'absolute', top: '-6px', right: '-6px', width: '20px', height: '20px', borderRadius: '50%', background: '#e55', color: '#fff', border: 'none', fontSize: '0.7rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            ✕
                          </button>
                        </div>
                      ))}
                      <label style={{
                        width: '80px', height: '90px', border: '1px dashed var(--color-border)',
                        borderRadius: 'var(--radius-sm)', display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center', cursor: uploadingImg ? 'wait' : 'pointer',
                        color: 'var(--color-gray)', fontSize: '0.7rem', gap: '0.3rem',
                      }}>
                        <span style={{ fontSize: '1.4rem' }}>{uploadingImg ? '⏳' : '+'}</span>
                        <span>{uploadingImg ? 'Uploading...' : 'Upload'}</span>
                        <input type="file" accept="image/*" style={{ display: 'none' }}
                          onChange={e => e.target.files[0] && handleUploadImage(e.target.files[0])} />
                      </label>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                    <button type="button" onClick={() => setShowForm(false)}
                      style={{ padding: '0.6rem 1.5rem', border: '1px solid var(--color-border)', color: 'var(--color-gray)', borderRadius: 'var(--radius-sm)' }}>
                      Cancel
                    </button>
                    <button type="submit"
                      style={{ padding: '0.6rem 1.5rem', background: 'var(--color-gold)', color: 'var(--color-black)', fontWeight: 700, borderRadius: 'var(--radius-sm)' }}>
                      Save Product
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
                    <button onClick={() => { setEditProduct(p); setForm({ 'name.en': p.name.en, 'name.ar': p.name.ar, 'description.en': p.description.en, 'description.ar': p.description.ar, brand: p.brand, gender: p.gender, category: p.category, stock: p.stock, featured: p.featured }); setSizes(p.sizes.map(s => ({ ml: s.ml, price: s.price }))); setImages(p.images || []); setShowForm(true); }}
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

            {/* Pagination */}
            {pages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.35rem', marginTop: '2rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setPage(p => p - 1)} disabled={page === 1}
                  style={{ padding: '0.45rem 0.8rem', fontSize: '0.85rem', background: 'transparent', border: '1px solid var(--color-border)', color: page === 1 ? 'var(--color-gray)' : 'var(--color-off-white)', cursor: page === 1 ? 'not-allowed' : 'pointer', borderRadius: 'var(--radius-sm)' }}>
                  ‹
                </button>
                {(() => {
                  const btns = [];
                  let start = Math.max(1, page - 2), end = Math.min(pages, page + 2);
                  if (start > 1) { btns.push(1); if (start > 2) btns.push('...'); }
                  for (let i = start; i <= end; i++) btns.push(i);
                  if (end < pages) { if (end < pages - 1) btns.push('...'); btns.push(pages); }
                  return btns.map((b, i) => b === '...' ? (
                    <span key={`e${i}`} style={{ padding: '0 0.4rem', color: 'var(--color-gray)', fontSize: '0.85rem' }}>…</span>
                  ) : (
                    <button key={b} onClick={() => setPage(b)} style={{ minWidth: '34px', height: '34px', fontSize: '0.85rem', background: b === page ? 'var(--color-off-white)' : 'transparent', color: b === page ? 'var(--color-black)' : 'var(--color-off-white)', border: `1px solid ${b === page ? 'var(--color-off-white)' : 'var(--color-border)'}`, cursor: 'pointer', borderRadius: 'var(--radius-sm)', fontWeight: b === page ? 700 : 400 }}>
                      {b}
                    </button>
                  ));
                })()}
                <button
                  onClick={() => setPage(p => p + 1)} disabled={page === pages}
                  style={{ padding: '0.45rem 0.8rem', fontSize: '0.85rem', background: 'transparent', border: '1px solid var(--color-border)', color: page === pages ? 'var(--color-gray)' : 'var(--color-off-white)', cursor: page === pages ? 'not-allowed' : 'pointer', borderRadius: 'var(--radius-sm)' }}>
                  ›
                </button>
              </div>
            )}
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
