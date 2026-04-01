import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCart } from '@/context/CartContext';
import api from '@/services/api';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

function CheckoutForm({ items, totalPrice }) {
  const { t, i18n } = useTranslation('pages');
  const isAr = i18n.language === 'ar';
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [address, setAddress] = useState({ name: '', line1: '', city: '', country: '', phone: '' });

  const shipping = totalPrice > 200 ? 0 : 15;
  const total = totalPrice + shipping;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/api/payment/create-intent', { amount: total });
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      });
      if (result.error) {
        setError(result.error.message);
        return;
      }
      await api.post('/api/orders', {
        items: items.map(i => ({
          product: i.product?._id || i.product,
          productName: i.product?.name,
          brand: i.product?.brand,
          image: i.product?.images?.[0],
          qty: i.qty, sizeMl: i.sizeMl, priceAtPurchase: i.price,
        })),
        shippingAddress: address,
        paymentIntentId: data.paymentIntentId,
      });
      clearCart();
      alert(isAr ? 'تم استلام طلبك بنجاح! شكراً لتسوقك معنا.' : 'Order placed successfully! Thank you for shopping with us.');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || t('error.general', { ns: 'common' }));
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '0.8rem 1rem',
    background: 'var(--color-dark-gray)', border: '1px solid var(--color-border)',
    color: 'var(--color-off-white)', borderRadius: 'var(--radius-sm)',
    fontSize: '0.95rem', outline: 'none',
  };

  const labelStyle = {
    display: 'block', fontSize: '0.75rem', letterSpacing: '0.1em',
    textTransform: 'uppercase', color: 'var(--color-gray)', marginBottom: '0.4rem',
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '3rem', alignItems: 'start', direction: isAr ? 'rtl' : 'ltr' }}>
        {/* Left: Forms */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Shipping */}
          <div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 400, marginBottom: '1.5rem' }}>
              {t('checkout.shippingInfo')}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {[
                { key: 'name', label: t('checkout.fullName'), fullWidth: true },
                { key: 'line1', label: t('checkout.address'), fullWidth: true },
                { key: 'city', label: t('checkout.city') },
                { key: 'country', label: t('checkout.country') },
                { key: 'phone', label: t('checkout.phone') },
              ].map(f => (
                <div key={f.key} style={{ gridColumn: f.fullWidth ? '1 / -1' : 'auto' }}>
                  <label style={labelStyle}>{f.label}</label>
                  <input
                    required value={address[f.key]}
                    onChange={e => setAddress(a => ({ ...a, [f.key]: e.target.value }))}
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = 'var(--color-gold)'}
                    onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Payment */}
          <div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 400, marginBottom: '1.5rem' }}>
              {t('checkout.paymentInfo')}
            </h3>
            <div style={{
              padding: '1rem',
              background: 'var(--color-dark-gray)', border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
            }}>
              <CardElement options={{
                style: {
                  base: {
                    fontSize: '16px', color: '#f5f0e8', fontFamily: 'Lato, sans-serif',
                    '::placeholder': { color: '#6b6b6b' },
                    iconColor: '#ffffff',
                  },
                },
              }} />
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-gray)', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              🔒 {t('checkout.secure')}
            </p>
          </div>

          {error && (
            <div style={{ background: 'rgba(220,50,50,0.1)', border: '1px solid rgba(220,50,50,0.3)', borderRadius: 'var(--radius-sm)', padding: '0.75rem', color: '#e55', fontSize: '0.85rem' }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading || !stripe}
            style={{
              padding: '1rem', background: 'var(--color-gold)', color: 'var(--color-black)',
              fontFamily: 'var(--font-sans)', fontSize: '0.85rem', letterSpacing: '0.15em',
              textTransform: 'uppercase', fontWeight: 700, borderRadius: 'var(--radius-sm)',
              opacity: loading ? 0.7 : 1,
            }}>
            {loading ? (isAr ? 'جاري المعالجة...' : 'Processing...') : `${t('btn.placeOrder', { ns: 'common' })} — $${total.toFixed(2)}`}
          </button>
        </div>

        {/* Right: Order summary */}
        <div style={{
          background: 'var(--color-charcoal)', border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)', padding: '1.5rem',
          position: 'sticky', top: 'calc(var(--navbar-height) + 1rem)',
        }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 400, marginBottom: '1.5rem' }}>
            {t('checkout.orderSummary')}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
            {items.map(item => {
              const product = item.product || {};
              const name = isAr ? product.name?.ar : product.name?.en;
              return (
                <div key={item._id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <img src={product.images?.[0]} alt={name}
                    style={{ width: '50px', height: '60px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '0.85rem', fontFamily: 'var(--font-serif)' }}>{name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-gray)' }}>{item.sizeMl}ml × {item.qty}</p>
                  </div>
                  <p style={{ color: 'var(--color-gold)' }}>${(item.price * item.qty).toFixed(2)}</p>
                </div>
              );
            })}
          </div>
          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--color-gray)' }}>{t('labels.subtotal', { ns: 'common' })}</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--color-gray)' }}>{t('labels.shipping', { ns: 'common' })}</span>
              <span style={{ color: shipping === 0 ? 'var(--color-gold)' : 'inherit' }}>
                {shipping === 0 ? t('labels.free', { ns: 'common' }) : `$${shipping}`}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-serif)', fontSize: '1.2rem', paddingTop: '0.5rem', borderTop: '1px solid var(--color-border)' }}>
              <span>{t('labels.total', { ns: 'common' })}</span>
              <span style={{ color: 'var(--color-gold)' }}>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

export default function CheckoutPage() {
  const { t, i18n } = useTranslation('pages');
  const isAr = i18n.language === 'ar';
  const { items, totalPrice } = useCart();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="page-wrapper">
      <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: '3rem 1.5rem' }}>
        <div style={{ textAlign: isAr ? 'right' : 'left', marginBottom: '2rem' }}>
          <p className="section-subtitle">{t('checkout.title')}</p>
        </div>
        <Elements stripe={stripePromise}>
          <CheckoutForm items={items} totalPrice={totalPrice} />
        </Elements>
      </div>

      <style>{`
        @media (max-width: 900px) {
          div[style*="grid-template-columns: 1fr 380px"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </motion.div>
  );
}
