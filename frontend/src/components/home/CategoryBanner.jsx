import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import api from '@/services/api';

function CollectionCard({ col, i, isAr, hovered, onEnter, onLeave }) {
  const label = isAr ? (col.name?.ar || col.name?.en) : (col.name?.en || '');
  const desc  = isAr ? (col.description?.ar || col.description?.en) : (col.description?.en || '');

  const link  = col.slug ? `/shop?collection=${col.slug}` : '/shop';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={onEnter}
      onHoverEnd={onLeave}
      className="collection-card"
      style={{ position: 'relative', width: '340px', height: '420px', overflow: 'hidden', borderRadius: '12px', cursor: 'pointer', flexShrink: 0 }}
    >
      <Link to={link} style={{ display: 'block', width: '100%', height: '100%' }}>

        {/* Image */}
        <motion.img
          src={col.image || 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=900&q=80'}
          alt={label}
          animate={{ scale: hovered ? 1.07 : 1 }}
          transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />

        {/* Gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: hovered
            ? 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.35) 60%, rgba(0,0,0,0.1) 100%)'
            : 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0.0) 100%)',
          transition: 'background 0.4s ease',
        }} />

        {/* Gold line on hover */}
        <motion.div
          animate={{ scaleX: hovered ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            height: '2px', background: 'var(--terracotta)',
            transformOrigin: 'left',
          }}
        />

        {/* Content */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.5rem 1.75rem' }}>
          {desc && (
            <motion.p
              animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 6 }}
              transition={{ duration: 0.25 }}
              style={{ fontSize: '0.65rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', margin: '0 0 0.4rem', fontFamily: 'var(--font-sans)' }}
            >
              {desc}
            </motion.p>
          )}
          <h3 style={{
            fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 400,
            color: '#fff', margin: '0 0 0.85rem', lineHeight: 1.2,
          }}>
            {label}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <motion.div
              animate={{ width: hovered ? '24px' : '10px', backgroundColor: hovered ? 'var(--terracotta)' : 'rgba(255,255,255,0.35)' }}
              transition={{ duration: 0.3 }}
              style={{ height: '1px', flexShrink: 0 }}
            />
            <motion.span
              animate={{ color: hovered ? 'var(--terracotta)' : 'rgba(255,255,255,0.6)' }}
              transition={{ duration: 0.25 }}
              style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'var(--font-sans)' }}
            >
              {isAr ? 'اكتشف' : 'Discover'}
            </motion.span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function CategoryBanner() {
  const { i18n } = useTranslation('pages');
  const lang = i18n.language;
  const isAr = lang === 'ar';
  const [hovered, setHovered] = useState(null);
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    api.get('/api/collections')
      .then(r => setCollections(r.data.collections || []))
      .catch(() => setCollections([]));
  }, []);

  if (collections.length === 0) return null;

  const cols = Math.min(collections.length, 3);

  return (
    <section style={{ padding: '7rem 0', background: 'var(--cream-deep)', direction: isAr ? 'rtl' : 'ltr' }}>
      <div className="container-luxe">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3.5rem' }}
        >
          <div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--terracotta)', display: 'block', marginBottom: '1rem' }}>
              {isAr ? '— تسوّق حسب المجموعة' : lang === 'fr' ? '— Trier par collection' : '— Shop by collection'}
            </span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 300, letterSpacing: '-0.03em', margin: 0, lineHeight: 1, color: 'var(--charcoal)' }}>
              {isAr ? (<>أربع <span style={{ fontStyle: 'italic' }}>مجموعات.</span></>) : lang === 'fr' ? (<>Les <span style={{ fontStyle: 'italic' }}>collections.</span></>) : (<>Our <span style={{ fontStyle: 'italic' }}>collections.</span></>)}
            </h2>
          </div>
        </motion.div>

        {/* Grid */}
        <div className="collection-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', justifyContent: 'center' }}>
          {collections.map((col, i) => (
            <CollectionCard
              key={col.id} col={col} i={i} isAr={isAr}
              hovered={hovered === i}
              onEnter={() => setHovered(i)}
              onLeave={() => setHovered(null)}
            />
          ))}
        </div>

      </div>

    </section>
  );
}
