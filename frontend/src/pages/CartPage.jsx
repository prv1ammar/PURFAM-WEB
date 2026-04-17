import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useCart } from '@/context/CartContext';
import CartItem from '@/components/cart/CartItem';

export default function CartPage() {
  const { t, i18n } = useTranslation();
  const { items, totalPrice } = useCart();
  const isAr = i18n.language === 'ar';
  const shipping = totalPrice > 200 ? 0 : 15;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="page-wrapper">
      <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: '3rem 1.5rem', direction: isAr ? 'rtl' : 'ltr' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, marginBottom: '2rem' }}>{t('nav.cart')}</h1>

        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <p style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛍️</p>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, marginBottom: '1.5rem', color: 'var(--color-gray)' }}>
              {isAr ? 'سلتك فارغة' : 'Your cart is empty'}
            </h2>
            <Link to="/shop" style={{
              display: 'inline-block', padding: '0.9rem 2.5rem',
              background: 'var(--color-gold)', color: 'var(--color-black)',
              fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700,
            }}>
              {t('btn.shopNow')}
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '3rem', alignItems: 'start' }}>
            <div>
              {items.map(item => <CartItem key={item.id || item._id} item={item} />)}
            </div>
            <div style={{
              background: 'var(--color-charcoal)', border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)', padding: '1.5rem',
              position: 'sticky', top: 'calc(var(--navbar-height) + 1rem)',
            }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', fontWeight: 400, marginBottom: '1.5rem' }}>
                {isAr ? 'ملخص الطلب' : 'Order Summary'}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-gray)' }}>{t('labels.subtotal')}</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-gray)' }}>{t('labels.shipping')}</span>
                  <span style={{ color: shipping === 0 ? 'var(--color-gold)' : 'inherit' }}>
                    {shipping === 0 ? t('labels.free') : `$${shipping}`}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-serif)', fontSize: '1.2rem', paddingTop: '0.6rem', borderTop: '1px solid var(--color-border)' }}>
                  <span>{t('labels.total')}</span>
                  <span style={{ color: 'var(--color-gold)' }}>${(totalPrice + shipping).toFixed(2)}</span>
                </div>
              </div>
              <Link to="/checkout" style={{
                display: 'block', textAlign: 'center', padding: '1rem',
                background: 'var(--color-gold)', color: 'var(--color-black)',
                fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700,
                borderRadius: 'var(--radius-sm)',
              }}>
                {t('btn.checkout')}
              </Link>
            </div>
          </div>
        )}
      </div>
      <style>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 350px"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </motion.div>
  );
}
