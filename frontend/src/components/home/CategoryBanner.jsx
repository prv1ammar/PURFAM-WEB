import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const decants = [
  {
    to: '/shop?gender=women&size=10',
    image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=900&q=80',
    labelEn: '10ml — Women',
    labelAr: '10 مل — نسائي',
    descEn: 'Floral · Oriental · Powdery',
    descAr: 'زهري · شرقي · بودري',
    tag: '10 ml',
  },
  {
    to: '/shop?gender=men&size=10',
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=900&q=80',
    labelEn: '10ml — Men',
    labelAr: '10 مل — رجالي',
    descEn: 'Fresh · Woody · Intense',
    descAr: 'منعش · خشبي · مكثف',
    tag: '10 ml',
  },
];

const fullSize = {
  to: '/shop?minSize=30',
  image: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=900&q=80',
  labelEn: 'Full Size Perfumes',
  labelAr: 'العطور بالحجم الكامل',
  descEn: 'The Complete Collection · 30ml & Above',
  descAr: 'المجموعة الكاملة · 30 مل وما فوق',
  tag: '30 ml+',
};

function CollectionCard({ coll, i, isAr, aspect = '3/4', titleSize = '1.75rem', hovered, onEnter, onLeave }) {
  const label = isAr ? coll.labelAr : coll.labelEn;
  const desc  = isAr ? coll.descAr  : coll.descEn;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={onEnter}
      onHoverEnd={onLeave}
      style={{
        position: 'relative',
        aspectRatio: aspect,
        overflow: 'hidden',
        borderRadius: '16px',
        cursor: 'pointer',
      }}
    >
      <Link to={coll.to} style={{ display: 'block', width: '100%', height: '100%' }}>

        {/* Image */}
        <motion.img
          src={coll.image}
          alt={label}
          animate={{ scale: hovered ? 1.06 : 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />

        {/* Gradient */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.3) 55%, rgba(0,0,0,0.05) 100%)',
        }} />

        {/* Size Tag */}
        <div style={{
          position: 'absolute',
          top: '1.4rem',
          ...(isAr ? { left: '1.4rem' } : { right: '1.4rem' }),
          background: 'rgba(200,149,26,0.12)',
          border: '1px solid rgba(200,149,26,0.5)',
          color: 'var(--color-gold)',
          fontFamily: 'var(--font-sans)',
          fontSize: '0.6rem',
          fontWeight: 700,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          padding: '0.35rem 0.85rem',
          borderRadius: '2px',
        }}>
          {coll.tag}
        </div>

        {/* Bottom Content */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '2.25rem' }}>
          <motion.p
            animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 8 }}
            transition={{ duration: 0.3 }}
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.6rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.6)',
              margin: '0 0 0.6rem',
            }}
          >
            {desc}
          </motion.p>

          <h3 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: titleSize,
            fontWeight: 400,
            color: '#fff',
            margin: '0 0 1.4rem',
            lineHeight: 1.2,
          }}>
            {label}
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <motion.div
              animate={{ width: hovered ? '30px' : '14px', backgroundColor: hovered ? 'var(--color-gold)' : 'rgba(255,255,255,0.4)' }}
              transition={{ duration: 0.35 }}
              style={{ height: '1px', flexShrink: 0 }}
            />
            <motion.span
              animate={{ color: hovered ? 'var(--color-gold)' : 'rgba(255,255,255,0.7)' }}
              transition={{ duration: 0.3 }}
              style={{ fontFamily: 'var(--font-sans)', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase' }}
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
  const isAr = i18n.language === 'ar';
  const [hovered, setHovered] = useState(null);

  return (
    <section style={{ padding: '8rem 0', direction: isAr ? 'rtl' : 'ltr' }}>
      <div className="container-luxe">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: 'center', marginBottom: '4.5rem' }}
        >
          <span className="section-subtitle">{isAr ? 'تسوّق حسب الفئة' : 'Shop by Category'}</span>
          <h2 className="section-title">{isAr ? 'المجموعات' : 'The Collections'}</h2>
          <div style={{ width: '50px', height: '1px', background: 'linear-gradient(to right, transparent, var(--color-gold), transparent)', margin: '1.25rem auto 0' }} />
        </motion.div>

        {/* ── All 3 in one row ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
          {[...decants, fullSize].map((coll, i) => (
            <CollectionCard
              key={coll.to}
              coll={coll}
              i={i}
              isAr={isAr}
              aspect="3/4"
              titleSize="1.4rem"
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
