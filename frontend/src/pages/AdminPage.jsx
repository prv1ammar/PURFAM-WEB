import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/services/api';
import adminBg from '@/assets/admin-bg.jpg';

const STATUSES = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'];
const STATUS_COLORS = {
  pending: '#f59e0b', paid: '#10b981', processing: '#3b82f6',
  shipped: '#8b5cf6', delivered: '#10b981', cancelled: '#ef4444',
};

// All colors via CSS variables — works in both dark and light mode
const inp = {
  width: '100%', padding: '0.75rem 1rem',
  background: 'var(--color-charcoal)',
  border: '1px solid var(--color-border)',
  color: 'var(--color-off-white)',
  borderRadius: '8px', fontSize: '0.875rem',
  outline: 'none', boxSizing: 'border-box',
  transition: 'border-color 0.2s',
  fontFamily: 'inherit',
};
const lbl = {
  display: 'block', fontSize: '0.68rem', fontWeight: 700,
  letterSpacing: '0.1em', textTransform: 'uppercase',
  color: 'var(--color-gray, #888)', marginBottom: '0.5rem',
};

export default function AdminPage() {
  const [tab, setTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm());
  const [sizes, setSizes] = useState([{ ml: '', price: '' }]);
  const [images, setImages] = useState([]);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  function emptyForm() {
    return { 'name.en': '', 'name.ar': '', 'description.en': '', 'description.ar': '', brand: '', gender: 'women', category: 'floral', stock: 100, featured: false };
  }

  const loadProducts = async (p = page) => {
    setLoading(true);
    try {
      const r = await api.get('/api/products', { params: { page: p, limit: 15 } });
      setProducts(r.data.products); setPages(r.data.pages);
    } finally { setLoading(false); }
  };

  const loadOrders = async () => {
    setLoading(true);
    try {
      const r = await api.get('/api/admin/orders');
      setOrders(r.data.orders);
    } finally { setLoading(false); }
  };

  useEffect(() => { tab === 'products' ? loadProducts() : loadOrders(); }, [tab, page]);

  const openAdd = () => {
    setEditProduct(null); setForm(emptyForm());
    setSizes([{ ml: '', price: '' }]); setImages([]); setShowForm(true);
  };

  const openEdit = (p) => {
    setEditProduct(p);
    setForm({ 'name.en': p.name?.en || '', 'name.ar': p.name?.ar || '', 'description.en': p.description?.en || '', 'description.ar': p.description?.ar || '', brand: p.brand || '', gender: p.gender || 'women', category: p.category || 'floral', stock: p.stock || 0, featured: p.featured || false });
    setSizes((p.sizes || []).map(s => ({ ml: s.ml, price: s.price })));
    setImages(p.images || []);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    await api.delete(`/api/admin/products/${id}`);
    setProducts(pr => pr.filter(x => (x._id || x.id) !== id));
  };

  const handleUploadImage = async (file) => {
    setUploadingImg(true);
    try {
      const fd = new FormData(); fd.append('image', file);
      const token = localStorage.getItem('luxe_token');
      const res = await fetch('/api/admin/upload', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd });
      const data = await res.json();
      if (data.url) setImages(prev => [...prev, data.url]);
    } finally { setUploadingImg(false); }
  };

  const handleAddImageUrl = () => {
    if (imageUrl.trim()) { setImages(prev => [...prev, imageUrl.trim()]); setImageUrl(''); }
  };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const payload = {
        name: { en: form['name.en'], ar: form['name.ar'] },
        description: { en: form['description.en'], ar: form['description.ar'] },
        brand: form.brand, gender: form.gender, category: form.category,
        sizes: sizes.filter(s => s.ml && s.price).map(s => ({ ml: Number(s.ml), price: Number(s.price) })),
        images, stock: Number(form.stock), featured: form.featured,
      };
      const id = editProduct?._id || editProduct?.id;
      if (id) await api.put(`/api/admin/products/${id}`, payload);
      else await api.post('/api/admin/products', payload);
      setShowForm(false);
      await loadProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving product');
    } finally { setSaving(false); }
  };

  const handleStatusChange = async (orderId, status) => {
    await api.put(`/api/admin/orders/${orderId}/status`, { status });
    setOrders(o => o.map(x => (x._id || x.id) === orderId ? { ...x, status } : x));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{
        minHeight: '100vh', paddingTop: '6rem',
        backgroundImage: `linear-gradient(to bottom, rgba(5,5,5,0.82) 0%, rgba(5,5,5,0.72) 50%, rgba(5,5,5,0.88) 100%), url(${adminBg})`,
        backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed',
      }}>

      <style>{`
        .admin-form input:focus, .admin-form select:focus, .admin-form textarea:focus {
          border-color: var(--color-gold) !important;
          box-shadow: 0 0 0 3px rgba(200,149,26,0.12);
        }
        .admin-form input::placeholder, .admin-form textarea::placeholder {
          color: var(--color-border);
          opacity: 1;
        }
        .admin-form select option {
          background: var(--color-dark);
          color: var(--color-off-white);
        }
        .admin-row:hover { background: var(--color-charcoal) !important; }
        .admin-btn-edit:hover { border-color: var(--color-gold) !important; color: var(--color-gold) !important; }
        .admin-btn-del:hover { border-color: #ef4444 !important; color: #ef4444 !important; }
      `}</style>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 300, color: 'var(--color-off-white)', margin: 0 }}>
              Admin Dashboard
            </h1>
            <p style={{ color: 'var(--color-border)', fontSize: '0.85rem', marginTop: '0.3rem' }}>Manage your products and orders</p>
          </div>
          {tab === 'products' && (
            <button onClick={openAdd} style={{
              padding: '0.7rem 1.6rem', background: 'var(--color-gold)', color: '#000',
              fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.1em', borderRadius: '6px',
              cursor: 'pointer', border: 'none', textTransform: 'uppercase',
            }}>
              + Add Product
            </button>
          )}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', marginBottom: '2rem', border: '1px solid var(--color-border)', borderRadius: '8px', overflow: 'hidden', width: 'fit-content' }}>
          {[['products', 'Products'], ['orders', 'Orders']].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)} style={{
              padding: '0.65rem 2rem', fontSize: '0.78rem', fontWeight: 600,
              letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', border: 'none',
              background: tab === key ? 'var(--color-gold)' : 'var(--color-dark)',
              color: tab === key ? '#000' : 'var(--color-off-white)',
              opacity: tab === key ? 1 : 0.6,
              transition: 'all 0.2s',
            }}>
              {label}
            </button>
          ))}
        </div>

        {/* ── PRODUCTS TAB ── */}
        {tab === 'products' && (
          <div>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-border)' }}>Loading...</div>
            ) : products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-border)' }}>
                <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>No products yet</p>
                <button onClick={openAdd} style={{ padding: '0.6rem 1.5rem', background: 'var(--color-gold)', color: '#000', fontWeight: 700, borderRadius: '6px', cursor: 'pointer', border: 'none' }}>Add your first product</button>
              </div>
            ) : (
              <div style={{ background: 'var(--color-dark)', border: '1px solid var(--color-border)', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 120px 100px 80px 80px 130px', gap: '1rem', padding: '0.9rem 1.25rem', borderBottom: '1px solid var(--color-border)', background: 'var(--color-black)' }}>
                  {['', 'Product', 'Brand', 'Gender', 'Stock', 'Price', 'Actions'].map(h => (
                    <span key={h} style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-border)' }}>{h}</span>
                  ))}
                </div>
                {products.map((p, i) => {
                  const id = p._id || p.id;
                  return (
                    <div key={id} className="admin-row" style={{
                      display: 'grid', gridTemplateColumns: '60px 1fr 120px 100px 80px 80px 130px',
                      gap: '1rem', padding: '1rem 1.25rem', alignItems: 'center',
                      borderBottom: i < products.length - 1 ? '1px solid var(--color-border)' : 'none',
                      transition: 'background 0.15s', background: 'transparent',
                    }}>
                      <img src={p.images?.[0] || ''} alt="" style={{ width: '44px', height: '52px', objectFit: 'cover', borderRadius: '4px', background: 'var(--color-charcoal)' }} />
                      <div>
                        <p style={{ color: 'var(--color-off-white)', fontSize: '0.875rem', fontFamily: 'var(--font-serif)', marginBottom: '0.2rem' }}>{p.name?.en || p.name}</p>
                        {p.featured && <span style={{ fontSize: '0.6rem', background: 'rgba(201,149,26,0.15)', color: 'var(--color-gold)', padding: '0.15rem 0.5rem', borderRadius: '3px', letterSpacing: '0.1em' }}>FEATURED</span>}
                      </div>
                      <p style={{ color: 'var(--color-border)', fontSize: '0.8rem' }}>{p.brand}</p>
                      <p style={{ color: 'var(--color-border)', fontSize: '0.8rem', textTransform: 'capitalize' }}>{p.gender}</p>
                      <p style={{ color: p.stock < 10 ? '#ef4444' : 'var(--color-border)', fontSize: '0.8rem' }}>{p.stock}</p>
                      <p style={{ color: 'var(--color-gold)', fontSize: '0.85rem', fontWeight: 600 }}>{p.sizes?.[0]?.price} dh</p>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="admin-btn-edit" onClick={() => openEdit(p)} style={{ padding: '0.35rem 0.75rem', border: '1px solid var(--color-border)', color: 'var(--color-off-white)', fontSize: '0.72rem', borderRadius: '5px', cursor: 'pointer', background: 'transparent', transition: 'all 0.2s' }}>Edit</button>
                        <button className="admin-btn-del" onClick={() => handleDelete(id)} style={{ padding: '0.35rem 0.75rem', border: '1px solid var(--color-border)', color: 'var(--color-off-white)', fontSize: '0.72rem', borderRadius: '5px', cursor: 'pointer', background: 'transparent', transition: 'all 0.2s' }}>Delete</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {pages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem', marginTop: '2rem' }}>
                <button onClick={() => setPage(p => p - 1)} disabled={page === 1}
                  style={{ padding: '0.4rem 0.8rem', background: 'var(--color-dark)', border: '1px solid var(--color-border)', color: 'var(--color-off-white)', borderRadius: '5px', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.4 : 1 }}>‹</button>
                {Array.from({ length: pages }, (_, i) => i + 1).map(n => (
                  <button key={n} onClick={() => setPage(n)}
                    style={{ width: '34px', height: '34px', background: n === page ? 'var(--color-gold)' : 'var(--color-dark)', border: '1px solid var(--color-border)', color: n === page ? '#000' : 'var(--color-off-white)', borderRadius: '5px', cursor: 'pointer', fontWeight: n === page ? 700 : 400 }}>{n}</button>
                ))}
                <button onClick={() => setPage(p => p + 1)} disabled={page === pages}
                  style={{ padding: '0.4rem 0.8rem', background: 'var(--color-dark)', border: '1px solid var(--color-border)', color: 'var(--color-off-white)', borderRadius: '5px', cursor: page === pages ? 'not-allowed' : 'pointer', opacity: page === pages ? 0.4 : 1 }}>›</button>
              </div>
            )}
          </div>
        )}

        {/* ── ORDERS TAB ── */}
        {tab === 'orders' && (
          <div>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-border)' }}>Loading...</div>
            ) : orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-border)' }}>No orders yet</div>
            ) : (
              <div style={{ background: 'var(--color-dark)', border: '1px solid var(--color-border)', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr 100px 110px 150px', gap: '1rem', padding: '0.9rem 1.25rem', borderBottom: '1px solid var(--color-border)', background: 'var(--color-black)' }}>
                  {['Order ID', 'Customer', 'Total', 'Date', 'Status'].map(h => (
                    <span key={h} style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-border)' }}>{h}</span>
                  ))}
                </div>
                {orders.map((order, i) => {
                  const id = order._id || order.id;
                  return (
                    <div key={id} className="admin-row" style={{
                      display: 'grid', gridTemplateColumns: '140px 1fr 100px 110px 150px',
                      gap: '1rem', padding: '1rem 1.25rem', alignItems: 'center',
                      borderBottom: i < orders.length - 1 ? '1px solid var(--color-border)' : 'none',
                      transition: 'background 0.15s', background: 'transparent',
                    }}>
                      <p style={{ color: 'var(--color-border)', fontSize: '0.75rem', fontFamily: 'monospace' }}>#{id?.slice(-8).toUpperCase()}</p>
                      <div>
                        <p style={{ color: 'var(--color-off-white)', fontSize: '0.85rem' }}>{order.user?.name || 'Guest'}</p>
                        <p style={{ color: 'var(--color-border)', fontSize: '0.75rem' }}>{order.user?.email || '—'}</p>
                      </div>
                      <p style={{ color: 'var(--color-gold)', fontWeight: 600, fontSize: '0.9rem' }}>{order.total} dh</p>
                      <p style={{ color: 'var(--color-border)', fontSize: '0.75rem' }}>{new Date(order.created_at || order.createdAt).toLocaleDateString()}</p>
                      <select value={order.status} onChange={e => handleStatusChange(id, e.target.value)}
                        style={{ padding: '0.4rem 0.6rem', background: 'var(--color-black)', border: `1px solid ${STATUS_COLORS[order.status] || 'var(--color-border)'}`, color: STATUS_COLORS[order.status] || 'var(--color-off-white)', borderRadius: '5px', fontSize: '0.75rem', cursor: 'pointer', outline: 'none' }}>
                        {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                      </select>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── PRODUCT FORM MODAL ── */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowForm(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1000, backdropFilter: 'blur(4px)' }} />

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }}
              style={{
                position: 'fixed', top: '120px', left: '50%', transform: 'translateX(-50%)',
                zIndex: 1001, width: '94%', maxWidth: '800px', height: 'calc(100vh - 140px)',
                background: 'var(--color-dark)', border: '1px solid var(--color-border)', borderRadius: '14px',
                overflow: 'hidden', display: 'flex', flexDirection: 'column',
              }}>

              {/* Modal Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.75rem', borderBottom: '1px solid var(--color-border)', flexShrink: 0 }}>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: '1.4rem', color: 'var(--color-off-white)', margin: 0 }}>
                  {editProduct ? 'Edit Product' : 'New Product'}
                </h2>
                <button onClick={() => setShowForm(false)} style={{ color: 'var(--color-border)', fontSize: '1.3rem', cursor: 'pointer', background: 'none', border: 'none', lineHeight: 1 }}>✕</button>
              </div>

              {/* Modal Body */}
              <form className="admin-form" onSubmit={handleSave} style={{ overflowY: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1 }}>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  {[{ key: 'name.en', label: 'Name (English)', ph: 'e.g. Bleu de Chanel' }, { key: 'name.ar', label: 'Name (Arabic)', ph: 'e.g. بلو دي شانيل' }].map(f => (
                    <div key={f.key}>
                      <label style={lbl}>{f.label}</label>
                      <input style={inp} placeholder={f.ph} value={form[f.key]} onChange={e => setForm(v => ({ ...v, [f.key]: e.target.value }))} required />
                    </div>
                  ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem' }}>
                  <div><label style={lbl}>Brand</label><input style={inp} placeholder="e.g. Chanel" value={form.brand} onChange={e => setForm(v => ({ ...v, brand: e.target.value }))} required /></div>
                  <div><label style={lbl}>Stock</label><input style={inp} type="number" placeholder="100" value={form.stock} onChange={e => setForm(v => ({ ...v, stock: e.target.value }))} /></div>
                  <div>
                    <label style={lbl}>Gender</label>
                    <select style={inp} value={form.gender} onChange={e => setForm(v => ({ ...v, gender: e.target.value }))}>
                      {['women', 'men'].map(g => <option key={g} value={g}>{g.charAt(0).toUpperCase() + g.slice(1)}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={lbl}>Category</label>
                    <select style={inp} value={form.category} onChange={e => setForm(v => ({ ...v, category: e.target.value }))}>
                      {['floral', 'woody', 'oriental', 'fresh', 'citrus', 'gourmand'].map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                    </select>
                  </div>
                </div>

                {[{ key: 'description.en', label: 'Description (English)', ph: 'Describe the fragrance...' }, { key: 'description.ar', label: 'Description (Arabic)', ph: 'وصف العطر...' }].map(f => (
                  <div key={f.key}>
                    <label style={lbl}>{f.label}</label>
                    <textarea rows={2} style={{ ...inp, resize: 'vertical' }} placeholder={f.ph} value={form[f.key]} onChange={e => setForm(v => ({ ...v, [f.key]: e.target.value }))} />
                  </div>
                ))}

                <div>
                  <label style={lbl}>Sizes & Prices</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {sizes.map((s, i) => (
                      <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <input type="number" placeholder="Size (ml)" value={s.ml} onChange={e => setSizes(prev => prev.map((x, j) => j === i ? { ...x, ml: e.target.value } : x))} style={{ ...inp, flex: 1 }} />
                        <input type="number" placeholder="Price (dh)" value={s.price} onChange={e => setSizes(prev => prev.map((x, j) => j === i ? { ...x, price: e.target.value } : x))} style={{ ...inp, flex: 1 }} />
                        {sizes.length > 1 && (
                          <button type="button" onClick={() => setSizes(prev => prev.filter((_, j) => j !== i))}
                            style={{ padding: '0.5rem 0.7rem', border: '1px solid var(--color-border)', color: '#ef4444', borderRadius: '5px', cursor: 'pointer', background: 'transparent', fontSize: '0.8rem' }}>✕</button>
                        )}
                      </div>
                    ))}
                    <button type="button" onClick={() => setSizes(prev => [...prev, { ml: '', price: '' }])}
                      style={{ alignSelf: 'flex-start', padding: '0.4rem 1rem', border: '1px solid var(--color-border)', color: 'var(--color-off-white)', borderRadius: '5px', cursor: 'pointer', background: 'transparent', fontSize: '0.78rem' }}>
                      + Add size
                    </button>
                  </div>
                </div>

                <div>
                  <label style={lbl}>Product Images</label>
                  <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                    {images.map((url, i) => (
                      <div key={i} style={{ position: 'relative' }}>
                        <img src={url} alt="" style={{ width: '72px', height: '80px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--color-border)' }} />
                        <button type="button" onClick={() => setImages(prev => prev.filter((_, j) => j !== i))}
                          style={{ position: 'absolute', top: '-6px', right: '-6px', width: '18px', height: '18px', borderRadius: '50%', background: '#ef4444', color: '#fff', border: 'none', fontSize: '0.65rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                      </div>
                    ))}
                    <label style={{ width: '72px', height: '80px', border: '1px dashed var(--color-border)', borderRadius: '6px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: uploadingImg ? 'wait' : 'pointer', color: 'var(--color-border)', fontSize: '0.65rem', gap: '0.3rem' }}>
                      <span style={{ fontSize: '1.2rem' }}>{uploadingImg ? '⏳' : '+'}</span>
                      <span>{uploadingImg ? '...' : 'Upload'}</span>
                      <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => e.target.files[0] && handleUploadImage(e.target.files[0])} />
                    </label>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input style={{ ...inp, flex: 1 }} placeholder="Or paste image URL here" value={imageUrl} onChange={e => setImageUrl(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddImageUrl())} />
                    <button type="button" onClick={handleAddImageUrl} style={{ padding: '0 1rem', background: 'var(--color-charcoal)', border: '1px solid var(--color-border)', color: 'var(--color-off-white)', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>Add URL</button>
                  </div>
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.featured} onChange={e => setForm(v => ({ ...v, featured: e.target.checked }))}
                    style={{ width: '16px', height: '16px', accentColor: 'var(--color-gold)' }} />
                  <span style={{ color: 'var(--color-off-white)', fontSize: '0.85rem', opacity: 0.8 }}>Mark as Featured</span>
                </label>

                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', paddingTop: '0.5rem', borderTop: '1px solid var(--color-border)' }}>
                  <button type="button" onClick={() => setShowForm(false)}
                    style={{ padding: '0.65rem 1.5rem', border: '1px solid var(--color-border)', color: 'var(--color-off-white)', borderRadius: '6px', cursor: 'pointer', background: 'transparent', fontSize: '0.85rem', opacity: 0.8 }}>
                    Cancel
                  </button>
                  <button type="submit" disabled={saving}
                    style={{ padding: '0.65rem 2rem', background: saving ? 'var(--color-border)' : 'var(--color-gold)', color: '#000', fontWeight: 700, borderRadius: '6px', cursor: saving ? 'wait' : 'pointer', border: 'none', fontSize: '0.85rem' }}>
                    {saving ? 'Saving...' : (editProduct ? 'Update Product' : 'Create Product')}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
