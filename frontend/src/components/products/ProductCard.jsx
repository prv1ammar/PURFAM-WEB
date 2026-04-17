import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useCart } from '@/context/CartContext';

export default function ProductCard({ product, index = 0 }) {
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
    e.stopPropagation();
    await addItem(product, defaultSize, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.65, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(var(--text-rgb), 0.03)',
        border: '1px solid rgba(var(--text-rgb), 0.08)',
        borderRadius: '4px',
        overflow: 'hidden',
        transition: 'border-color 0.4s ease, box-shadow 0.4s ease',
        boxShadow: hovered
          ? '0 12px 40px rgba(0,0,0,0.12)'
          : '0 2px 12px rgba(0,0,0,0.04)',
        borderColor: hovered
          ? 'rgba(var(--text-rgb), 0.18)'
          : 'rgba(var(--text-rgb), 0.08)',
        direction: isAr ? 'rtl' : 'ltr',
      }}
    >
      {/* ── Product Image ── */}
      <Link
        to={`/shop/${product._id || product.id}`}
        style={{ display: 'block', position: 'relative', aspectRatio: '4 / 5', overflow: 'hidden', flexShrink: 0 }}
      >
        <motion.img
          src={image}
          alt={name}
          animate={{ scale: hovered ? 1.05 : 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />

        {/* Gradient overlay on hover */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 55%)',
            pointerEvents: 'none',
          }}
        />

        {/* Add to Cart button */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 8 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1rem' }}
        >
          <button
            onClick={handleAdd}
            style={{
              width: '100%',
              padding: '0.75rem',
              fontSize: '0.65rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              fontWeight: 700,
              fontFamily: 'var(--font-sans)',
              background: added ? 'var(--color-gold)' : 'rgba(255,255,255,0.96)',
              color: '#000',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '2px',
              transition: 'background 0.3s',
            }}
          >
            {added ? t('btn.addedToCart') : t('btn.addToCart')}
          </button>
        </motion.div>
      </Link>

      {/* ── Product Info ── */}
      <div style={{
        padding: '1.25rem 1.25rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        flexGrow: 1,
        textAlign: isAr ? 'right' : 'left',
      }}>

        {/* Brand */}
        <span style={{
          fontSize: '0.6rem',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: 'var(--color-gold)',
          fontFamily: 'var(--font-sans)',
          fontWeight: 700,
          opacity: 0.9,
          display: 'block',
        }}>
          {product.brand}
        </span>

        {/* Product Name */}
        <Link to={`/shop/${product._id || product.id}`} style={{ textDecoration: 'none' }}>
          <h3 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.2rem',
            fontWeight: 400,
            lineHeight: 1.35,
            color: 'rgb(var(--text-rgb))',
            margin: 0,
            transition: 'color 0.3s',
            color: hovered ? 'var(--color-gold)' : 'rgb(var(--text-rgb))',
          }}>
            {name}
          </h3>
        </Link>

        {/* Divider */}
        <div style={{ width: '28px', height: '1px', background: 'var(--color-gold)', opacity: 0.4, margin: '0.25rem 0' }} />

        {/* Price Row */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.25rem' }}>
          <span style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.25rem',
            fontWeight: 400,
            color: 'var(--color-gold)',
            letterSpacing: '-0.01em',
          }}>
            {minPrice} dh
          </span>
          <span style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.6rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'rgba(var(--text-rgb), 0.4)',
            fontWeight: 600,
          }}>
            {t('labels.from')}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
