import { useTranslation } from 'react-i18next';
import { useCart } from '@/context/CartContext';

export default function CartItem({ item }) {
  const { t, i18n } = useTranslation();
  const { removeItem, updateQty } = useCart();
  const isAr = i18n.language === 'ar';

  const product = item.product || item;
  const name = product?.name ? (isAr ? product.name.ar : product.name.en) : '';
  const image = product?.images?.[0] || '';

  return (
    <div style={{
      display: 'flex', gap: '1rem', padding: '1rem 0',
      borderBottom: '1px solid var(--color-border)',
    }}>
      {/* Image */}
      <div style={{ width: '70px', height: '85px', flexShrink: 0, overflow: 'hidden', borderRadius: 'var(--radius-sm)' }}>
        <img src={image} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>

      {/* Details */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-gray)', marginBottom: '0.2rem' }}>
            {product?.brand}
          </p>
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem' }}>{name}</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-light-gray)', marginTop: '0.2rem' }}>
            {item.sizeMl}{t('ml', { ns: 'products' })}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Qty stepper */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button onClick={() => updateQty(item.id || item._id, item.qty - 1)}
              style={{
                width: '24px', height: '24px', border: '1px solid var(--color-border)',
                color: 'var(--color-off-white)', borderRadius: '2px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>−</button>
            <span style={{ fontSize: '0.9rem', minWidth: '20px', textAlign: 'center' }}>{item.qty}</span>
            <button onClick={() => updateQty(item.id || item._id, item.qty + 1)}
              style={{
                width: '24px', height: '24px', border: '1px solid var(--color-border)',
                color: 'var(--color-off-white)', borderRadius: '2px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>+</button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <p style={{ color: 'var(--color-gold)', fontFamily: 'var(--font-serif)', fontSize: '1.1rem' }}>
              {item.price * item.qty} dh
            </p>
            <button onClick={() => removeItem(item.id || item._id)} style={{ color: 'var(--color-gray)', fontSize: '1rem' }}>🗑</button>
          </div>
        </div>
      </div>
    </div>
  );
}
