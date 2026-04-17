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
  const isAr = i18n.language === 'ar';

  const name = isAr ? product.name?.ar : product.name?.en;
  const minPrice = Math.min(...product.sizes.map(s => s.price));
  const defaultSize = product.sizes[0]?.ml;
  const image = product.images?.[0] || 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=500';

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
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        display: 'flex', flexDirection: 'column',
        background: 'var(--paper)',
        border: `1px solid ${hovered ? 'var(--line-strong)' : 'var(--line)'}`,
        transition: 'border-color 0.3s ease',
        direction: isAr ? 'rtl' : 'ltr',
      }}
    >
      {/* ── Image ── */}
      <Link to={`/shop/${product._id || product.id}`} style={{ display: 'block', position: 'relative', aspectRatio: '4/5', overflow: 'hidden', flexShrink: 0 }}>
        <motion.img
          src={image}
          alt={name}
          animate={{ scale: hovered ? 1.04 : 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />

        {/* Gradient on hover */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(26,25,24,0.55) 0%, transparent 55%)', pointerEvents: 'none' }}
        />

        {/* Add to cart button */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 8 }}
          transition={{ duration: 0.3 }}
          style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1rem' }}
        >
          <button onClick={handleAdd} style={{
            width: '100%', padding: '0.75rem',
            ...MONO, fontSize: '0.6rem',
            background: added ? 'var(--terracotta)' : 'var(--paper)',
            color: added ? 'var(--paper)' : 'var(--charcoal)',
            border: 'none', cursor: 'pointer',
            transition: 'background 0.3s, color 0.3s',
          }}>
            {added ? (isAr ? '✓ أضيف' : '✓ Ajouté') : (isAr ? 'أضف إلى السلة' : 'Ajouter au panier')}
          </button>
        </motion.div>

        {/* Tag */}
        {product.tag && (
          <div style={{ position: 'absolute', top: '0.75rem', left: isAr ? 'auto' : '0.75rem', right: isAr ? '0.75rem' : 'auto', background: 'var(--paper)', padding: '4px 8px', ...MONO, fontSize: '0.55rem', color: 'var(--terracotta)' }}>
            {product.tag}
          </div>
        )}
      </Link>

      {/* ── Info ── */}
      <div style={{ padding: '1rem 1.25rem 1.4rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', flexGrow: 1 }}>
        <span style={{ ...MONO, fontSize: '0.58rem', color: 'var(--terracotta)', display: 'block' }}>
          {product.brand}
        </span>
        <Link to={`/shop/${product._id || product.id}`} style={{ textDecoration: 'none' }}>
          <h3 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.15rem',
            fontWeight: 400,
            lineHeight: 1.25,
            color: hovered ? 'var(--terracotta)' : 'var(--charcoal)',
            margin: 0,
            transition: 'color 0.25s',
          }}>
            {name}
          </h3>
        </Link>
        <div style={{ width: '20px', height: '1px', background: 'var(--line-strong)', margin: '0.25rem 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '0.15rem' }}>
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', fontWeight: 400, color: 'var(--charcoal)' }}>
            {minPrice} dh
          </span>
          <span style={{ ...MONO, fontSize: '0.55rem', color: 'var(--graphite)' }}>
            {isAr ? 'من' : 'dès'}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
