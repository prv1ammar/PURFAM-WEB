import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '@/context/CartContext';
import CartItem from './CartItem';
import CartSummary from './CartSummary';

export default function CartDrawer() {
  const { cartOpen, setCartOpen, items } = useCart();
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1100 }}
          />
          <motion.div
            initial={{ x: isAr ? '-100%' : '100%' }}
            animate={{ x: 0 }}
            exit={{ x: isAr ? '-100%' : '100%' }}
            transition={{ type: 'tween', duration: 0.35 }}
            style={{
              position: 'fixed', top: 0, [isAr ? 'left' : 'right']: 0,
              width: 'min(420px, 100vw)', height: '100vh',
              background: 'var(--color-dark)',
              borderLeft: isAr ? 'none' : '1px solid var(--color-border)',
              borderRight: isAr ? '1px solid var(--color-border)' : 'none',
              zIndex: 1101, display: 'flex', flexDirection: 'column',
              direction: isAr ? 'rtl' : 'ltr',
            }}>

            {/* Header */}
            <div style={{
              padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              borderBottom: '1px solid var(--color-border)',
            }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 400 }}>
                {t('nav.cart')}
              </h3>
              <button onClick={() => setCartOpen(false)} style={{ color: 'var(--color-light-gray)', fontSize: '1.25rem' }}>✕</button>
            </div>

            {/* Items */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.5rem' }}>
              {items.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--color-gray)' }}>
                  <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛍️</p>
                  <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', marginBottom: '1.5rem' }}>
                    {isAr ? 'سلتك فارغة' : 'Your cart is empty'}
                  </p>
                  <Link to="/shop" onClick={() => setCartOpen(false)} style={{
                    display: 'inline-block', padding: '0.75rem 2rem',
                    background: 'var(--color-gold)', color: 'var(--color-black)',
                    fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                  }}>
                    {t('btn.shopNow')}
                  </Link>
                </div>
              ) : (
                items.map(item => <CartItem key={item.id || item._id} item={item} />)
              )}
            </div>

            {/* Summary */}
            {items.length > 0 && <CartSummary onClose={() => setCartOpen(false)} />}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
