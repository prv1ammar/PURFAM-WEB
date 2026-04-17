import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useCart } from '@/context/CartContext';
import api from '@/services/api';

export default function CheckoutPage() {
  const { t, i18n } = useTranslation('pages');
  const isAr = i18n.language === 'ar';
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [address, setAddress] = useState({ name: '', line1: '', city: '', country: '', phone: '' });

  const shipping = totalPrice > 500 ? 0 : 30;
  const total = totalPrice + shipping;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/api/orders', {
        items: items.map(i => ({
          product: i.product?.id || i.product?._id || i.product,
          productName: i.product?.name,
          brand: i.product?.brand,
          image: i.product?.images?.[0],
          qty: i.qty,
          sizeMl: i.sizeMl || i.size_ml,
          priceAtPurchase: i.price,
        })),
        shippingAddress: address,
        paymentMethod: 'cash_on_delivery',
      });
      clearCart();
      setSuccess(true);
      setTimeout(() => navigate('/'), 3500);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inp = {
    width: '100%', padding: '0.85rem 1rem',
    background: 'var(--color-charcoal)', border: '1px solid var(--color-border)',
    color: 'var(--color-off-white)', borderRadius: '8px',
    fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.2s', fontFamily: 'inherit',
  };
  const lbl = {
    display: 'block', fontSize: '0.7rem', letterSpacing: '0.1em',
    textTransform: 'uppercase', color: 'var(--color-border)', marginBottom: '0.45rem', fontWeight: 600,
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ minHeight: '100vh', background: 'var(--color-black)', paddingTop: 'calc(var(--navbar-height) + 1.5rem)', paddingBottom: '4rem' }}>

      {/* Success overlay */}
      <AnimatePresence>
        {success && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 999,
              background: 'rgba(5,5,5,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              style={{ textAlign: 'center', padding: '3rem' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--color-gold)', marginBottom: '0.75rem' }}>
                {isAr ? 'تم استلام طلبك!' : 'Order Confirmed!'}
              </h2>
              <p style={{ color: 'var(--color-border)', fontSize: '1rem' }}>
                {isAr ? 'سنتواصل معك قريباً لتأكيد التوصيل.' : 'We will contact you shortly to confirm delivery.'}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Title */}
        <div style={{ marginBottom: '2.5rem', direction: isAr ? 'rtl' : 'ltr' }}>
          <p style={{ fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: '0.4rem' }}>
            {isAr ? 'إتمام الشراء' : 'Checkout'}
          </p>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 300, color: 'var(--color-off-white)', margin: 0 }}>
            {isAr ? 'تأكيد الطلب' : 'Confirm Your Order'}
          </h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 370px', gap: '2.5rem', alignItems: 'start', direction: isAr ? 'rtl' : 'ltr' }}>

            {/* Left — Shipping */}
            <div style={{ background: 'var(--color-dark)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '2rem' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', fontWeight: 400, marginBottom: '1.5rem', color: 'var(--color-off-white)' }}>
                {isAr ? 'معلومات الشحن' : 'Shipping Information'}
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {[
                  { key: 'name',    label: isAr ? 'الاسم الكامل'  : 'Full Name',    full: true },
                  { key: 'line1',   label: isAr ? 'العنوان'       : 'Address',      full: true },
                  { key: 'city',    label: isAr ? 'المدينة'       : 'City',         full: false },
                  { key: 'country', label: isAr ? 'الدولة'        : 'Country',      full: false },
                  { key: 'phone',   label: isAr ? 'رقم الهاتف'    : 'Phone Number', full: true },
                ].map(f => (
                  <div key={f.key} style={{ gridColumn: f.full ? '1 / -1' : 'auto' }}>
                    <label style={lbl}>{f.label}</label>
                    <input
                      required
                      value={address[f.key]}
                      onChange={e => setAddress(a => ({ ...a, [f.key]: e.target.value }))}
                      style={inp}
                      onFocus={e => e.target.style.borderColor = 'var(--color-gold)'}
                      onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
                    />
                  </div>
                ))}
              </div>

              {/* Payment method badge */}
              <div style={{ marginTop: '2rem', padding: '1rem 1.25rem', background: 'rgba(200,149,26,0.08)', border: '1px solid rgba(200,149,26,0.25)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.4rem' }}>💵</span>
                <div>
                  <p style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-off-white)', margin: 0 }}>
                    {isAr ? 'الدفع عند الاستلام' : 'Cash on Delivery'}
                  </p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--color-border)', margin: '2px 0 0' }}>
                    {isAr ? 'ادفع عند وصول طلبك' : 'Pay when your order arrives'}
                  </p>
                </div>
              </div>

              {error && (
                <div style={{ marginTop: '1rem', background: 'rgba(220,50,50,0.1)', border: '1px solid rgba(220,50,50,0.3)', borderRadius: '8px', padding: '0.75rem', color: '#e55', fontSize: '0.85rem' }}>
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading}
                style={{
                  marginTop: '1.5rem', width: '100%', padding: '1rem',
                  background: loading ? 'var(--color-border)' : 'var(--color-gold)',
                  color: '#000', fontWeight: 700, fontSize: '0.85rem',
                  letterSpacing: '0.15em', textTransform: 'uppercase',
                  borderRadius: '8px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'opacity 0.2s',
                }}>
                {loading
                  ? (isAr ? 'جاري المعالجة...' : 'Placing Order...')
                  : (isAr ? `تأكيد الطلب — ${total.toFixed(2)} درهم` : `Place Order — ${total.toFixed(2)} dh`)}
              </button>
            </div>

            {/* Right — Summary */}
            <div style={{ background: 'var(--color-dark)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '1.5rem', position: 'sticky', top: 'calc(var(--navbar-height) + 1.5rem)' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 400, marginBottom: '1.5rem', color: 'var(--color-off-white)' }}>
                {isAr ? 'ملخص الطلب' : 'Order Summary'}
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
                {items.map(item => {
                  const product = item.product || {};
                  const name = isAr ? product.name?.ar : product.name?.en;
                  const sizeMl = item.sizeMl || item.size_ml;
                  return (
                    <div key={item.id || item._id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      {product.images?.[0] && (
                        <img src={product.images[0]} alt={name}
                          style={{ width: '52px', height: '62px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }} />
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: '0.85rem', fontFamily: 'var(--font-serif)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--color-border)', marginTop: '2px' }}>{sizeMl}ml × {item.qty}</p>
                      </div>
                      <p style={{ color: 'var(--color-gold)', fontSize: '0.9rem', flexShrink: 0 }}>{(item.price * item.qty).toFixed(2)} dh</p>
                    </div>
                  );
                })}
              </div>

              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--color-border)' }}>{isAr ? 'المجموع الفرعي' : 'Subtotal'}</span>
                  <span>{totalPrice.toFixed(2)} dh</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--color-border)' }}>{isAr ? 'الشحن' : 'Shipping'}</span>
                  <span style={{ color: shipping === 0 ? 'var(--color-gold)' : 'inherit' }}>
                    {shipping === 0 ? (isAr ? 'مجاني' : 'Free') : `${shipping} dh`}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-serif)', fontSize: '1.2rem', paddingTop: '0.6rem', borderTop: '1px solid var(--color-border)' }}>
                  <span>{isAr ? 'الإجمالي' : 'Total'}</span>
                  <span style={{ color: 'var(--color-gold)' }}>{total.toFixed(2)} dh</span>
                </div>
              </div>
            </div>

          </div>
        </form>
      </div>

      <style>{`
        @media (max-width: 860px) {
          div[style*="grid-template-columns: 1fr 370px"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </motion.div>
  );
}
