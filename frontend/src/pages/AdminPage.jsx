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

  // Settings state
  const [settingsForm, setSettingsForm] = useState({
    leftEn: '', leftFr: '', leftAr: '',
    rightEn: '', rightFr: '', rightAr: '',
    heroImage: '',
  });
  const [uploadingHeroImg, setUploadingHeroImg] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Collections state
  const [collections, setCollections] = useState([]);
  const [colForm, setColForm] = useState({ nameEn: '', nameAr: '', descEn: '', descAr: '', image: '' });
  const [editCol, setEditCol] = useState(null);
  const [showColForm, setShowColForm] = useState(false);
  const [savingCol, setSavingCol] = useState(false);
  const [uploadingColImg, setUploadingColImg] = useState(false);

  // Collection products manager
  const [manageCol, setManageCol] = useState(null); // collection being managed
  const [colProducts, setColProducts] = useState([]); // products already in collection
  const [allProducts, setAllProducts] = useState([]); // all products for search
  const [productSearch, setProductSearch] = useState('');
  const [addingProd, setAddingProd] = useState(false);

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

  const loadCollections = async () => {
    setLoading(true);
    try {
      const r = await api.get('/api/admin/collections');
      setCollections(r.data.collections || []);
    } finally { setLoading(false); }
  };

  const loadSettings = async () => {
    try {
      const r = await api.get('/api/admin/settings');
      const s = r.data.settings;
      if (s) setSettingsForm({
        leftEn: s.left?.en || '', leftFr: s.left?.fr || '', leftAr: s.left?.ar || '',
        rightEn: s.right?.en || '', rightFr: s.right?.fr || '', rightAr: s.right?.ar || '',
        heroImage: s.heroImage || '',
      });
    } catch {}
  };

  const handleUploadHeroImage = async (file) => {
    setUploadingHeroImg(true);
    try {
      const fd = new FormData(); fd.append('image', file);
      const token = localStorage.getItem('luxe_token');
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'https://purfam-web-production.up.railway.app'}/api/admin/upload`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd });
      const data = await res.json();
      if (data.url) setSettingsForm(v => ({ ...v, heroImage: data.url }));
    } finally { setUploadingHeroImg(false); }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault(); setSavingSettings(true); setSettingsSaved(false);
    try {
      await api.put('/api/admin/settings', {
        left: { en: settingsForm.leftEn, fr: settingsForm.leftFr, ar: settingsForm.leftAr },
        right: { en: settingsForm.rightEn, fr: settingsForm.rightFr, ar: settingsForm.rightAr },
        heroImage: settingsForm.heroImage,
      });
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 3000);
    } catch (err) { alert('Error saving settings: ' + (err.response?.data?.message || err.message)); }
    finally { setSavingSettings(false); }
  };

  useEffect(() => {
    if (tab === 'products') loadProducts();
    else if (tab === 'orders') loadOrders();
    else if (tab === 'collections') loadCollections();
    else if (tab === 'settings') loadSettings();
  }, [tab, page]);

  const handleUploadColImage = async (file) => {
    setUploadingColImg(true);
    try {
      const fd = new FormData(); fd.append('image', file);
      const token = localStorage.getItem('luxe_token');
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'https://purfam-web-production.up.railway.app'}/api/admin/upload`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd });
      const data = await res.json();
      if (data.url) setColForm(v => ({ ...v, image: data.url }));
    } finally { setUploadingColImg(false); }
  };

  const openAddCol = () => { setEditCol(null); setColForm({ nameEn: '', nameAr: '', descEn: '', descAr: '', image: '' }); setShowColForm(true); };
  const openEditCol = (c) => { setEditCol(c); setColForm({ nameEn: c.name?.en || '', nameAr: c.name?.ar || '', descEn: c.description?.en || '', descAr: c.description?.ar || '', image: c.image || '' }); setShowColForm(true); };

  const handleSaveCol = async (e) => {
    e.preventDefault(); setSavingCol(true);
    try {
      const payload = { name: { en: colForm.nameEn, ar: colForm.nameAr }, description: { en: colForm.descEn, ar: colForm.descAr }, image: colForm.image };
      if (editCol) await api.put(`/api/admin/collections/${editCol.id}`, payload);
      else await api.post('/api/admin/collections', payload);
      setShowColForm(false);
      await loadCollections();
    } catch (err) { alert(err.response?.data?.message || 'Error saving collection'); }
    finally { setSavingCol(false); }
  };

  const handleDeleteCol = async (id) => {
    if (!confirm('Delete this collection?')) return;
    await api.delete(`/api/admin/collections/${id}`);
    setCollections(c => c.filter(x => x.id !== id));
  };

  const openManageProducts = async (col) => {
    setManageCol(col);
    setProductSearch('');
    const [colProds, allProds] = await Promise.all([
      api.get(`/api/admin/collections/${col.id}/products`).then(r => r.data.products || []),
      api.get('/api/products', { params: { limit: 200 } }).then(r => r.data.products || []),
    ]);
    setColProducts(colProds);
    setAllProducts(allProds);
  };

  const handleAddProdToCol = async (productId) => {
    setAddingProd(true);
    try {
      await api.post(`/api/admin/collections/${manageCol.id}/products`, { productId });
      const updated = await api.get(`/api/admin/collections/${manageCol.id}/products`);
      setColProducts(updated.data.products || []);
    } finally { setAddingProd(false); }
  };

  const handleRemoveProdFromCol = async (productId) => {
    await api.delete(`/api/admin/collections/${manageCol.id}/products/${productId}`);
    setColProducts(prev => prev.filter(p => p.id !== productId));
  };

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
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'https://purfam-web-production.up.railway.app'}/api/admin/upload`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd });
      const data = await res.json();
      if (data.url) setImages(prev => [...prev, data.url]);
      else alert('Upload failed: ' + (data.message || 'Unknown error'));
    } catch (err) {
      alert('Upload error: ' + err.message);
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
    <>
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="admin-page"
      style={{
        minHeight: '100vh', paddingTop: 'calc(var(--navbar-height) + 1rem)',
        backgroundImage: `linear-gradient(to bottom, rgba(5,5,5,0.82) 0%, rgba(5,5,5,0.72) 50%, rgba(5,5,5,0.88) 100%), url(${adminBg})`,
        backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed',
      }}>

      <style>{`
        /* ── Text visibility fixes ── */
        /* Page-level text sits on the dark background image */
        .admin-header h1  { color: #f5f0e8 !important; }
        .admin-header p   { color: rgba(245,240,232,0.6) !important; }
        /* Inactive tab labels */
        .admin-tabs button { color: #f5f0e8 !important; }
        /* Table column-header labels (sit on light beige panel) */
        .admin-table-head span,
        .admin-table-head p { color: rgba(26,25,24,0.65) !important; }
        /* Row secondary text (brand, gender, stock labels) */
        .admin-row p, .admin-row span { color: rgba(26,25,24,0.75) !important; }
        /* Primary row text stays dark-on-light */
        .admin-row .prod-name, .admin-row .col-name { color: #1a1918 !important; }
        /* Pagination / misc on dark bg */
        .admin-page > div > div[style*="center"] { color: rgba(245,240,232,0.55) !important; }

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

        @media (max-width: 768px) {
          .admin-header { flex-direction: column !important; align-items: flex-start !important; gap: 1rem !important; }
          .admin-tabs { width: 100% !important; display: grid !important; grid-template-columns: 1fr 1fr !important; }
          .admin-tabs button { padding: 0.6rem 0.5rem !important; font-size: 0.7rem !important; }

          /* Hide table header rows on mobile */
          .admin-table-head { display: none !important; }

          /* Products — card layout */
          .admin-prod-row {
            display: flex !important; flex-direction: column !important;
            gap: 0.5rem !important; padding: 1rem !important;
          }
          .admin-prod-row .prod-img { width: 56px !important; height: 64px !important; }
          .admin-prod-row .prod-meta { display: flex !important; flex-wrap: wrap !important; gap: 0.4rem 1rem !important; }
          .admin-prod-row .prod-actions { display: flex !important; gap: 0.5rem !important; margin-top: 0.25rem !important; }

          /* Orders — card layout */
          .admin-order-row {
            display: flex !important; flex-direction: column !important;
            gap: 0.35rem !important; padding: 1rem !important;
          }
          .admin-order-row .order-actions { margin-top: 0.25rem !important; }

          /* Collections — card layout */
          .admin-col-row {
            display: flex !important; flex-wrap: wrap !important;
            gap: 0.6rem !important; padding: 1rem !important; align-items: center !important;
          }
          .admin-col-row .col-meta { flex: 1 !important; min-width: 0 !important; }
          .admin-col-row .col-actions { width: 100% !important; display: flex !important; gap: 0.4rem !important; flex-wrap: wrap !important; }

          /* Form grids */
          .admin-form-2col { grid-template-columns: 1fr !important; }
          .admin-form-4col { grid-template-columns: 1fr 1fr !important; }

          /* Modals — full screen on mobile */
          .admin-modal {
            top: 0 !important; left: 0 !important; right: 0 !important;
            width: 100% !important; max-width: 100% !important;
            height: 100vh !important; max-height: 100vh !important; border-radius: 0 !important;
          }
        }
      `}</style>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* Header */}
        <div className="admin-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 300, color: 'var(--color-off-white)', margin: 0 }}>
              Admin Dashboard
            </h1>
            <p style={{ color: 'var(--color-border)', fontSize: '0.85rem', marginTop: '0.3rem' }}>Manage your products and orders</p>
          </div>
          {tab === 'products' && (
            <button onClick={openAdd} style={{ padding: '0.7rem 1.6rem', background: 'var(--color-gold)', color: '#000', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.1em', borderRadius: '6px', cursor: 'pointer', border: 'none', textTransform: 'uppercase' }}>
              + Add Product
            </button>
          )}
          {tab === 'collections' && (
            <button onClick={openAddCol} style={{ padding: '0.7rem 1.6rem', background: 'var(--color-gold)', color: '#000', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.1em', borderRadius: '6px', cursor: 'pointer', border: 'none', textTransform: 'uppercase' }}>
              + Add Collection
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="admin-tabs" style={{ display: 'flex', marginBottom: '2rem', border: '1px solid var(--color-border)', borderRadius: '8px', overflow: 'hidden', width: 'fit-content' }}>
          {[['products', 'Products'], ['orders', 'Orders'], ['collections', 'Collections'], ['settings', 'Settings']].map(([key, label]) => (
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
                <div className="admin-table-head" style={{ display: 'grid', gridTemplateColumns: '60px 1fr 120px 100px 80px 80px 130px', gap: '1rem', padding: '0.9rem 1.25rem', borderBottom: '1px solid var(--color-border)', background: 'var(--color-black)' }}>
                  {['', 'Product', 'Brand', 'Gender', 'Stock', 'Price', 'Actions'].map(h => (
                    <span key={h} style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-border)' }}>{h}</span>
                  ))}
                </div>
                {products.map((p, i) => {
                  const id = p._id || p.id;
                  return (
                    <div key={id} className="admin-row admin-prod-row" style={{
                      display: 'grid', gridTemplateColumns: '60px 1fr 120px 100px 80px 80px 130px',
                      gap: '1rem', padding: '1rem 1.25rem', alignItems: 'center',
                      borderBottom: i < products.length - 1 ? '1px solid var(--color-border)' : 'none',
                      transition: 'background 0.15s', background: 'transparent',
                    }}>
                      <img className="prod-img" src={p.images?.[0] || ''} alt="" style={{ width: '44px', height: '52px', objectFit: 'cover', borderRadius: '4px', background: 'var(--color-charcoal)' }} />
                      <div>
                        <p style={{ color: 'var(--color-off-white)', fontSize: '0.875rem', fontFamily: 'var(--font-serif)', marginBottom: '0.2rem' }}>{p.name?.en || p.name}</p>
                        {p.featured && <span style={{ fontSize: '0.6rem', background: 'rgba(201,149,26,0.15)', color: 'var(--color-gold)', padding: '0.15rem 0.5rem', borderRadius: '3px', letterSpacing: '0.1em' }}>FEATURED</span>}
                      </div>
                      <div className="prod-meta">
                        <p style={{ color: 'var(--color-border)', fontSize: '0.8rem' }}>{p.brand}</p>
                        <p style={{ color: 'var(--color-border)', fontSize: '0.8rem', textTransform: 'capitalize' }}>{p.gender}</p>
                        <p style={{ color: p.stock < 10 ? '#ef4444' : 'var(--color-border)', fontSize: '0.8rem' }}>Stock: {p.stock}</p>
                        <p style={{ color: 'var(--color-gold)', fontSize: '0.85rem', fontWeight: 600 }}>{p.sizes?.[0]?.price} dh</p>
                      </div>
                      <div className="prod-actions" style={{ display: 'flex', gap: '0.5rem' }}>
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
                <div className="admin-table-head" style={{ display: 'grid', gridTemplateColumns: '140px 1fr 100px 110px 150px', gap: '1rem', padding: '0.9rem 1.25rem', borderBottom: '1px solid var(--color-border)', background: 'var(--color-black)' }}>
                  {['Order ID', 'Customer', 'Total', 'Date', 'Status'].map(h => (
                    <span key={h} style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-border)' }}>{h}</span>
                  ))}
                </div>
                {orders.map((order, i) => {
                  const id = order._id || order.id;
                  return (
                    <div key={id} className="admin-row admin-order-row" style={{
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
                      <select className="order-actions" value={order.status} onChange={e => handleStatusChange(id, e.target.value)}
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

        {/* ── COLLECTIONS TAB ── */}
        {tab === 'collections' && (
          <div>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-border)' }}>Loading...</div>
            ) : collections.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-border)' }}>No collections yet. Click "+ Add Collection" to create one.</div>
            ) : (
              <div style={{ background: 'var(--color-dark)', border: '1px solid var(--color-border)', borderRadius: '12px', overflow: 'hidden' }}>
                {/* Table Header */}
                <div className="admin-table-head" style={{ display: 'grid', gridTemplateColumns: '70px 1fr 1fr 1fr 80px 160px', gap: '1rem', padding: '0.75rem 1.25rem', background: 'var(--color-charcoal)', borderBottom: '1px solid var(--color-border)' }}>
                  {['Image', 'Name (EN)', 'Name (AR)', 'Description', 'Products', 'Actions'].map(h => (
                    <p key={h} style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-border)', margin: 0 }}>{h}</p>
                  ))}
                </div>
                {/* Table Rows */}
                {collections.map(col => {
                  const prodCount = col.collection_products?.[0]?.count ?? 0;
                  return (
                    <div key={col.id} className="admin-row admin-col-row" style={{ display: 'grid', gridTemplateColumns: '70px 1fr 1fr 1fr 80px 160px', gap: '1rem', padding: '0.85rem 1.25rem', borderBottom: '1px solid var(--color-border)', alignItems: 'center' }}>
                      {/* col 1: image */}
                      <div style={{ width: '56px', height: '56px', borderRadius: '8px', overflow: 'hidden', background: 'var(--color-charcoal)', flexShrink: 0 }}>
                        {col.image
                          ? <img src={col.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-border)', fontSize: '1.2rem' }}>🖼</div>
                        }
                      </div>
                      {/* col 2: name EN */}
                      <p style={{ fontFamily: 'var(--font-serif)', fontSize: '0.9rem', color: 'var(--color-off-white)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{col.name?.en || '—'}</p>
                      {/* col 3: name AR */}
                      <p style={{ fontSize: '0.85rem', color: 'var(--color-border)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', direction: 'rtl' }}>{col.name?.ar || '—'}</p>
                      {/* col 4: description */}
                      <p style={{ fontSize: '0.78rem', color: 'var(--color-border)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{col.description?.en || '—'}</p>
                      {/* col 5: products count */}
                      <span style={{ display: 'inline-block', background: 'rgba(200,149,26,0.12)', border: '1px solid rgba(200,149,26,0.3)', color: 'var(--color-gold)', borderRadius: '999px', padding: '0.2rem 0.7rem', fontSize: '0.75rem', fontWeight: 700, textAlign: 'center' }}>
                        {prodCount}
                      </span>
                      {/* col 6: actions */}
                      <div className="col-actions" style={{ display: 'flex', gap: '0.4rem' }}>
                        <button onClick={() => openManageProducts(col)} style={{ padding: '0.4rem 0.6rem', border: '1px solid rgba(200,149,26,0.4)', background: 'rgba(200,149,26,0.08)', color: 'var(--color-gold)', borderRadius: '5px', fontSize: '0.72rem', cursor: 'pointer', fontWeight: 700 }}>Products</button>
                        <button className="admin-btn-edit" onClick={() => openEditCol(col)} style={{ padding: '0.4rem 0.6rem', border: '1px solid var(--color-border)', background: 'transparent', color: 'var(--color-off-white)', borderRadius: '5px', fontSize: '0.72rem', cursor: 'pointer', fontWeight: 600 }}>Edit</button>
                        <button className="admin-btn-del" onClick={() => handleDeleteCol(col.id)} style={{ padding: '0.4rem 0.6rem', border: '1px solid var(--color-border)', background: 'transparent', color: 'var(--color-off-white)', borderRadius: '5px', fontSize: '0.72rem', cursor: 'pointer', fontWeight: 600 }}>Del</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
        {/* ── SETTINGS TAB ── */}
        {tab === 'settings' && (
          <div>
            <div style={{ background: 'var(--color-dark)', border: '1px solid var(--color-border)', borderRadius: '12px', overflow: 'hidden' }}>
              <div style={{ padding: '1.25rem 1.75rem', borderBottom: '1px solid var(--color-border)', background: 'var(--color-black)' }}>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: '1.2rem', color: 'var(--color-off-white)', margin: 0 }}>Announcement Bar</h2>
                <p style={{ color: 'var(--color-border)', fontSize: '0.78rem', marginTop: '0.25rem' }}>Edit the text shown in the black bar at the top of the site.</p>
              </div>
              <form className="admin-form" onSubmit={handleSaveSettings} style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                {/* Left text */}
                <div>
                  <p style={{ ...lbl, color: 'var(--color-gold)', marginBottom: '0.75rem' }}>Left text (offers / shipping)</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {[['leftEn', 'EN'], ['leftFr', 'FR'], ['leftAr', 'عربي']].map(([key, label]) => (
                      <div key={key} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <span style={{ ...lbl, minWidth: '40px', margin: 0, textAlign: 'right' }}>{label}</span>
                        <input style={{ ...inp, flex: 1 }} value={settingsForm[key]}
                          placeholder={key === 'leftAr' ? 'توصيل مجاني من 400 درهم...' : key === 'leftFr' ? 'Livraison offerte dès 400 dh...' : 'Free shipping from 400 dh...'}
                          onChange={e => setSettingsForm(v => ({ ...v, [key]: e.target.value }))} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right text */}
                <div>
                  <p style={{ ...lbl, color: 'var(--color-gold)', marginBottom: '0.75rem' }}>Right text (season / edition)</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {[['rightEn', 'EN'], ['rightFr', 'FR'], ['rightAr', 'عربي']].map(([key, label]) => (
                      <div key={key} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <span style={{ ...lbl, minWidth: '40px', margin: 0, textAlign: 'right' }}>{label}</span>
                        <input style={{ ...inp, flex: 1 }} value={settingsForm[key]}
                          placeholder={key === 'rightAr' ? 'إصدار ربيع 2026' : key === 'rightFr' ? 'Édition Printemps 2026' : 'Spring Edition 2026'}
                          onChange={e => setSettingsForm(v => ({ ...v, [key]: e.target.value }))} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hero image */}
                <div>
                  <p style={{ ...lbl, color: 'var(--color-gold)', marginBottom: '0.75rem' }}>Home page image</p>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.6rem' }}>
                    <label style={{
                      display: 'flex', alignItems: 'center', gap: '0.5rem',
                      padding: '0.6rem 1.1rem', background: 'var(--color-charcoal)',
                      border: '1px solid var(--color-border)', borderRadius: '7px',
                      cursor: uploadingHeroImg ? 'wait' : 'pointer', fontSize: '0.78rem',
                      color: 'var(--color-off-white)', whiteSpace: 'nowrap', flexShrink: 0,
                    }}>
                      {uploadingHeroImg ? '⏳ Uploading...' : '↑ Upload image'}
                      <input type="file" accept="image/*" style={{ display: 'none' }}
                        onChange={e => e.target.files[0] && handleUploadHeroImage(e.target.files[0])} />
                    </label>
                    <input style={{ ...inp, flex: 1 }} placeholder="Or paste image URL..."
                      value={settingsForm.heroImage}
                      onChange={e => setSettingsForm(v => ({ ...v, heroImage: e.target.value }))} />
                    {settingsForm.heroImage && (
                      <button type="button" onClick={() => setSettingsForm(v => ({ ...v, heroImage: '' }))}
                        style={{ padding: '0.6rem 0.75rem', background: 'transparent', border: '1px solid var(--color-border)', color: '#ef4444', borderRadius: '7px', cursor: 'pointer', fontSize: '0.8rem', flexShrink: 0 }}>✕</button>
                    )}
                  </div>
                  {settingsForm.heroImage && (
                    <img src={settingsForm.heroImage} alt="preview"
                      style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--color-border)' }} />
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingTop: '0.5rem', borderTop: '1px solid var(--color-border)' }}>
                  <button type="submit" disabled={savingSettings} style={{
                    padding: '0.7rem 2rem', background: savingSettings ? 'var(--color-border)' : 'var(--color-gold)',
                    color: '#000', fontWeight: 700, fontSize: '0.82rem', letterSpacing: '0.1em',
                    textTransform: 'uppercase', borderRadius: '8px', border: 'none',
                    cursor: savingSettings ? 'not-allowed' : 'pointer',
                  }}>
                    {savingSettings ? 'Saving...' : 'Save Changes'}
                  </button>
                  {settingsSaved && (
                    <span style={{ color: '#10b981', fontSize: '0.82rem', fontWeight: 600 }}>✓ Saved successfully</span>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

    </motion.div>

      {/* ── MANAGE COLLECTION PRODUCTS MODAL ── */}
      <AnimatePresence>
        {manageCol && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setManageCol(null)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, backdropFilter: 'blur(4px)' }} />
            <motion.div className="admin-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'fixed', top: '80px', left: '2vw', right: '2vw', margin: '0 auto', zIndex: 1001, width: '96vw', maxWidth: '720px', height: 'calc(100vh - 100px)', background: 'var(--color-dark)', border: '1px solid var(--color-border)', borderRadius: '14px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.75rem', borderBottom: '1px solid var(--color-border)', flexShrink: 0 }}>
                <div>
                  <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: '1.3rem', color: 'var(--color-off-white)', margin: 0 }}>
                    Products — {manageCol.name?.en}
                  </h2>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-border)', margin: '0.25rem 0 0' }}>{colProducts.length} product{colProducts.length !== 1 ? 's' : ''} in this collection</p>
                </div>
                <button onClick={() => setManageCol(null)} style={{ color: 'var(--color-border)', fontSize: '1.3rem', cursor: 'pointer', background: 'none', border: 'none' }}>✕</button>
              </div>

              <div style={{ overflowY: 'auto', flex: 1, minHeight: 0, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                {/* Search & Add */}
                <div>
                  <label style={lbl}>Add a product</label>
                  <input style={inp} placeholder="Search by name..." value={productSearch} onChange={e => setProductSearch(e.target.value)} />
                  {productSearch.trim() && (
                    <div style={{ marginTop: '0.5rem', background: 'var(--color-charcoal)', border: '1px solid var(--color-border)', borderRadius: '8px', maxHeight: '220px', overflowY: 'auto' }}>
                      {allProducts
                        .filter(p => {
                          const alreadyIn = colProducts.some(cp => cp.id === p.id);
                          const q = productSearch.toLowerCase();
                          return !alreadyIn && (p.name?.en?.toLowerCase().includes(q) || p.brand?.toLowerCase().includes(q));
                        })
                        .slice(0, 10)
                        .map(p => (
                          <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.65rem 1rem', borderBottom: '1px solid var(--color-border)' }}>
                            {p.images?.[0] && <img src={p.images[0]} alt="" style={{ width: '36px', height: '42px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0 }} />}
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p style={{ fontSize: '0.85rem', color: 'var(--color-off-white)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name?.en}</p>
                              <p style={{ fontSize: '0.75rem', color: 'var(--color-border)', margin: 0 }}>{p.brand}</p>
                            </div>
                            <button disabled={addingProd} onClick={() => { handleAddProdToCol(p.id); setProductSearch(''); }}
                              style={{ padding: '0.35rem 0.75rem', background: 'var(--color-gold)', color: '#000', border: 'none', borderRadius: '5px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>
                              + Add
                            </button>
                          </div>
                        ))}
                      {allProducts.filter(p => {
                        const alreadyIn = colProducts.some(cp => cp.id === p.id);
                        const q = productSearch.toLowerCase();
                        return !alreadyIn && (p.name?.en?.toLowerCase().includes(q) || p.brand?.toLowerCase().includes(q));
                      }).length === 0 && (
                        <p style={{ padding: '1rem', color: 'var(--color-border)', fontSize: '0.85rem', textAlign: 'center' }}>No products found</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Current products in collection */}
                <div>
                  <label style={lbl}>Products in this collection ({colProducts.length})</label>
                  {colProducts.length === 0 ? (
                    <p style={{ color: 'var(--color-border)', fontSize: '0.85rem', padding: '1rem 0' }}>No products yet. Use the search above to add some.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {colProducts.map(p => (
                        <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.65rem 1rem', background: 'var(--color-charcoal)', border: '1px solid var(--color-border)', borderRadius: '8px' }}>
                          {p.images?.[0] && <img src={p.images[0]} alt="" style={{ width: '40px', height: '48px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0 }} />}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: '0.88rem', color: 'var(--color-off-white)', margin: 0 }}>{p.name?.en}</p>
                            <p style={{ fontSize: '0.75rem', color: 'var(--color-border)', margin: '2px 0 0' }}>{p.brand} · {p.gender}</p>
                          </div>
                          <button onClick={() => handleRemoveProdFromCol(p.id)}
                            style={{ padding: '0.35rem 0.7rem', background: 'transparent', border: '1px solid var(--color-border)', color: '#ef4444', borderRadius: '5px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}>
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── COLLECTION FORM MODAL ── */}
      <AnimatePresence>
        {showColForm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowColForm(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1000, backdropFilter: 'blur(4px)' }} />
            <motion.div className="admin-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'fixed', top: '80px', left: '2vw', right: '2vw', margin: '0 auto', zIndex: 1001, width: '96vw', maxWidth: '600px', maxHeight: 'calc(100vh - 100px)', overflowY: 'auto', background: 'var(--color-dark)', border: '1px solid var(--color-border)', borderRadius: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.75rem', borderBottom: '1px solid var(--color-border)' }}>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: '1.4rem', color: 'var(--color-off-white)', margin: 0 }}>
                  {editCol ? 'Edit Collection' : 'New Collection'}
                </h2>
                <button onClick={() => setShowColForm(false)} style={{ color: 'var(--color-border)', fontSize: '1.3rem', cursor: 'pointer', background: 'none', border: 'none' }}>✕</button>
              </div>
              <form className="admin-form" onSubmit={handleSaveCol} style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="admin-form-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={lbl}>Name (English)</label>
                    <input style={inp} required placeholder="e.g. Oud Collection" value={colForm.nameEn} onChange={e => setColForm(v => ({ ...v, nameEn: e.target.value }))} />
                  </div>
                  <div>
                    <label style={lbl}>Name (Arabic)</label>
                    <input style={inp} placeholder="مثال: مجموعة العود" value={colForm.nameAr} onChange={e => setColForm(v => ({ ...v, nameAr: e.target.value }))} />
                  </div>
                </div>
                <div className="admin-form-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={lbl}>Description (English)</label>
                    <textarea style={{ ...inp, resize: 'none', height: '80px' }} placeholder="Short description..." value={colForm.descEn} onChange={e => setColForm(v => ({ ...v, descEn: e.target.value }))} />
                  </div>
                  <div>
                    <label style={lbl}>Description (Arabic)</label>
                    <textarea style={{ ...inp, resize: 'none', height: '80px' }} placeholder="وصف قصير..." value={colForm.descAr} onChange={e => setColForm(v => ({ ...v, descAr: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <label style={lbl}>Collection Image</label>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.6rem' }}>
                    <label style={{
                      display: 'flex', alignItems: 'center', gap: '0.5rem',
                      padding: '0.6rem 1.1rem', background: 'var(--color-charcoal)',
                      border: '1px solid var(--color-border)', borderRadius: '7px',
                      cursor: uploadingColImg ? 'wait' : 'pointer', fontSize: '0.78rem',
                      color: 'var(--color-off-white)', whiteSpace: 'nowrap', flexShrink: 0,
                    }}>
                      {uploadingColImg ? '⏳ Uploading...' : '↑ Upload image'}
                      <input type="file" accept="image/*" style={{ display: 'none' }}
                        onChange={e => e.target.files[0] && handleUploadColImage(e.target.files[0])} />
                    </label>
                    <input style={{ ...inp, flex: 1 }} placeholder="Or paste image URL..." value={colForm.image}
                      onChange={e => setColForm(v => ({ ...v, image: e.target.value }))} />
                  </div>
                  {colForm.image && (
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                      <img src={colForm.image} alt="preview" style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px' }} />
                      <button type="button" onClick={() => setColForm(v => ({ ...v, image: '' }))}
                        style={{ position: 'absolute', top: '6px', right: '6px', width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(0,0,0,0.7)', color: '#fff', border: 'none', fontSize: '0.7rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                    </div>
                  )}
                </div>
                <button type="submit" disabled={savingCol} style={{ padding: '0.85rem', background: savingCol ? 'var(--color-border)' : 'var(--color-gold)', color: '#000', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', borderRadius: '8px', border: 'none', cursor: savingCol ? 'not-allowed' : 'pointer' }}>
                  {savingCol ? 'Saving...' : (editCol ? 'Save Changes' : 'Create Collection')}
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── PRODUCT FORM MODAL ── */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowForm(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1000, backdropFilter: 'blur(4px)' }} />

            <motion.div className="admin-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{
                position: 'fixed', top: '80px', left: '2vw', right: '2vw', margin: '0 auto',
                zIndex: 1001, width: '96vw', maxWidth: '1100px', height: 'calc(100vh - 100px)',
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

              {/* Modal Body — scrollable */}
              <form id="product-form" className="admin-form" onSubmit={handleSave} style={{ overflowY: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1, minHeight: 0 }}>

                <div className="admin-form-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  {[{ key: 'name.en', label: 'Name (English)', ph: 'e.g. Bleu de Chanel' }, { key: 'name.ar', label: 'Name (Arabic)', ph: 'e.g. بلو دي شانيل' }].map(f => (
                    <div key={f.key}>
                      <label style={lbl}>{f.label}</label>
                      <input style={inp} placeholder={f.ph} value={form[f.key]} onChange={e => setForm(v => ({ ...v, [f.key]: e.target.value }))} required />
                    </div>
                  ))}
                </div>

                <div className="admin-form-4col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem' }}>
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

              </form>

              {/* Modal Footer — always visible */}
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', padding: '1rem 1.75rem', borderTop: '1px solid var(--color-border)', flexShrink: 0, background: 'var(--color-dark)' }}>
                <button type="button" onClick={() => setShowForm(false)}
                  style={{ padding: '0.65rem 1.5rem', border: '1px solid var(--color-border)', color: 'var(--color-off-white)', borderRadius: '6px', cursor: 'pointer', background: 'transparent', fontSize: '0.85rem', opacity: 0.8 }}>
                  Cancel
                </button>
                <button type="submit" form="product-form" disabled={saving}
                  style={{ padding: '0.65rem 2rem', background: saving ? 'var(--color-border)' : 'var(--color-gold)', color: '#000', fontWeight: 700, borderRadius: '6px', cursor: saving ? 'wait' : 'pointer', border: 'none', fontSize: '0.85rem' }}>
                  {saving ? 'Saving...' : (editProduct ? 'Update Product' : 'Create Product')}
                </button>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
