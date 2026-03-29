import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '@/context/CartContext';

export default function CartSummary({ onClose }) {
  const { t, i18n } = useTranslation();
  const { totalPrice } = useCart();
  const isAr = i18n.language === 'ar';
  const shipping = totalPrice > 500 ? 0 : 30;
  const total = totalPrice + shipping;

  return (
    <div style={{ padding: '1.5rem', borderTop: '1px solid var(--color-border)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--color-light-gray)', fontSize: '0.9rem' }}>{t('labels.subtotal')}</span>
          <span>{totalPrice} dh</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--color-light-gray)', fontSize: '0.9rem' }}>{t('labels.shipping')}</span>
          <span style={{ color: shipping === 0 ? 'var(--color-gold)' : 'inherit' }}>
            {shipping === 0 ? t('labels.free') : `${shipping} dh`}
          </span>
        </div>
        <div style={{
          display: 'flex', justifyContent: 'space-between', paddingTop: '0.6rem',
          borderTop: '1px solid var(--color-border)',
          fontFamily: 'var(--font-serif)', fontSize: '1.2rem',
        }}>
          <span>{t('labels.total')}</span>
          <span style={{ color: 'var(--color-gold)' }}>{total} dh</span>
        </div>
      </div>
      <p style={{ fontSize: '0.75rem', color: 'var(--color-gray)', marginBottom: '1rem', textAlign: 'center' }}>
        {t('labels.freeShippingOver')}
      </p>
      <Link to="/checkout" onClick={onClose} style={{
        display: 'block', textAlign: 'center', padding: '1rem',
        background: 'var(--color-gold)', color: 'var(--color-black)',
        fontFamily: 'var(--font-sans)', fontSize: '0.8rem',
        letterSpacing: '0.15em', textTransform: 'uppercase',
        fontWeight: 700, transition: 'background 0.2s',
      }}
        onMouseOver={e => e.target.style.background = 'var(--color-gold-light)'}
        onMouseOut={e => e.target.style.background = 'var(--color-gold)'}>
        {t('btn.checkout')}
      </Link>
    </div>
  );
}
