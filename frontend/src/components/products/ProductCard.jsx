import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useCart } from '@/context/CartContext';

export default function ProductCard({ product }) {
  const { t, i18n } = useTranslation();
  const { addItem } = useCart();
  const [hovered, setHovered] = useState(false);
  const [added, setAdded] = useState(false);
  const isAr = i18n.language === 'ar';

  const name = isAr ? product.name.ar : product.name.en;
  const minPrice = Math.min(...product.sizes.map(s => s.price));
  const defaultSize = product.sizes[0]?.ml;
  const image = product.images?.[0] || `https://images.unsplash.com/photo-1541643600914-78b084683702?w=500`;

  const handleAdd = async (e) => {
    e.preventDefault();
    await addItem(product, defaultSize, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{ position: 'relative', cursor: 'pointer' }}
    >
      <Link to={`/shop/${product._id}`}>
        {/* Image container */}
        <div style={{
          position: 'relative', overflow: 'hidden',
          aspectRatio: '3/4', background: 'var(--color-charcoal)',
          borderRadius: 'var(--radius-sm)',
        }}>
          <motion.img
            src={image} alt={name}
            animate={{ scale: hovered ? 1.06 : 1 }}
            transition={{ duration: 0.5 }}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />

          {/* Hover overlay */}
          <motion.div
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'absolute', inset: 0,
              background: 'rgba(10,10,10,0.5)',
              display: 'flex', alignItems: 'flex-end',
              padding: '1.5rem',
            }}>
            <button
              onClick={handleAdd}
              style={{
                width: '100%', padding: '0.75rem',
                background: added ? 'var(--color-gold-dark)' : 'var(--color-gold)',
                color: 'var(--color-black)',
                fontFamily: 'var(--font-sans)', fontSize: '0.75rem',
                letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700,
                transition: 'background 0.2s',
              }}>
              {added ? t('btn.addedToCart') : t('btn.addToCart')}
            </button>
          </motion.div>

          {/* Badge */}
          {product.featured && (
            <div style={{
              position: 'absolute', top: '1rem', left: isAr ? 'auto' : '1rem', right: isAr ? '1rem' : 'auto',
              background: 'var(--color-gold)', color: 'var(--color-black)',
              fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase',
              padding: '0.25rem 0.6rem', fontWeight: 700,
            }}>
              {isAr ? 'مميز' : 'Featured'}
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{ padding: '1rem 0.25rem', direction: isAr ? 'rtl' : 'ltr' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-gray)', marginBottom: '0.25rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            {product.brand}
          </p>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', fontWeight: 400, marginBottom: '0.4rem', lineHeight: 1.3 }}>
            {name}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p style={{ color: 'var(--color-gold)', fontFamily: 'var(--font-serif)', fontSize: '1.05rem' }}>
              {t('labels.from')} {minPrice} dh
            </p>
            <div style={{ display: 'flex', gap: '2px' }}>
              {[1, 2, 3, 4, 5].map(s => (
                <span key={s} style={{
                  fontSize: '0.6rem',
                  color: s <= Math.round(product.ratings?.average || 0) ? 'var(--color-gold)' : 'var(--color-border)',
                }}>★</span>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
