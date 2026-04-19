import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useCart } from '@/context/CartContext';

const MONO = { fontFamily: 'var(--font-mono)', letterSpacing: '0.18em', textTransform: 'uppercase' };

export default function ProductCard({ product, index = 0 }) {
  const { t, i18n } = useTranslation();
  const { addItem } = useCart();
  const [hovered, setHovered] = useState(false);
  const [added, setAdded] = useState(false);
  const lang = i18n.language;
  const isAr = lang === 'ar';

  const name = isAr ? product.name?.ar : product.name?.en;
  const minPrice = Math.min(...product.sizes.map(s => s.price));
  const defaultSize = product.sizes[0]?.ml;
  const image = product.images?.[0] || 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=600';

  const handleAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await addItem(product, defaultSize, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{ display: 'flex', flexDirection: 'column', direction: isAr ? 'rtl' : 'ltr' }}
    >
      {/* ── Image ── */}
      <Link
        to={`/shop/${product._id || product.id}`}
        style={{ display: 'block', position: 'relative', aspectRatio: '3/4', overflow: 'hidden', flexShrink: 0 }}
      >
        {/* Image */}
        <motion.img
          src={image}
          alt={name}
          animate={{ scale: hovered ? 1.06 : 1 }}
          transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />

        {/* Gradient overlay */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.35 }}
          style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(26,25,24,0.7) 0%, rgba(26,25,24,0.1) 50%, transparent 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Add to cart — slides up from bottom on hover */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 10 }}
          transition={{ duration: 0.3 }}
          style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1rem 1.25rem' }}
        >
          <button
            onClick={handleAdd}
            style={{
              width: '100%', padding: '0.7rem',
              ...MONO, fontSize: '0.58rem',
              background: added ? 'var(--terracotta)' : 'var(--cream)',
              color: added ? 'var(--cream)' : 'var(--charcoal)',
              border: 'none', cursor: 'pointer',
              transition: 'background 0.25s, color 0.25s',
            }}
          >
            {added
              ? (isAr ? '✓ أضيف' : '✓ Added')
              : (isAr ? 'أضف إلى السلة' : lang === 'fr' ? 'Ajouter au panier' : 'Add to cart')}
          </button>
        </motion.div>

        {/* Tag badge */}
        {product.tag && (
          <div style={{
            position: 'absolute', top: '0.75rem',
            left: isAr ? 'auto' : '0.75rem', right: isAr ? '0.75rem' : 'auto',
            background: 'var(--terracotta)', color: 'var(--cream)',
            padding: '3px 8px', ...MONO, fontSize: '0.5rem',
          }}>
            {product.tag}
          </div>
        )}
      </Link>

      {/* ── Info ── */}
      <div style={{ paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {/* Brand */}
        <span style={{ ...MONO, fontSize: '0.55rem', color: 'var(--terracotta)' }}>
          {product.brand}
        </span>

        {/* Name */}
        <Link to={`/shop/${product._id || product.id}`} style={{ textDecoration: 'none' }}>
          <h3 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '0.95rem',
            fontWeight: 400,
            lineHeight: 1.2,
            color: hovered ? 'var(--terracotta)' : 'var(--charcoal)',
            margin: 0,
            transition: 'color 0.25s',
          }}>
            {name}
          </h3>
        </Link>

        {/* Thin rule */}
        <motion.div
          animate={{ width: hovered ? '40px' : '20px', background: hovered ? 'var(--terracotta)' : 'var(--line-strong)' }}
          transition={{ duration: 0.3 }}
          style={{ height: '1px', margin: '0.35rem 0' }}
        />

        {/* Price row */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: '0.95rem', fontWeight: 400, color: 'var(--charcoal)' }}>
            {minPrice} dh
          </span>
          <span style={{ ...MONO, fontSize: '0.5rem', color: 'var(--graphite)', opacity: 0.7 }}>
            {isAr ? 'من' : lang === 'fr' ? 'dès' : 'from'}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
