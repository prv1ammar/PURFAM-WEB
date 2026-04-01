import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const collections = [
  {
    query: 'gender=women',
    image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=900&q=80',
    labelEn: 'Pour Femme',
    labelAr: 'نسائي',
    descEn: 'Floral, Oriental & Powdery',
    descAr: 'زهري، شرقي وبودري',
    accent: '#c8951a',
  },
  {
    query: 'gender=unisex',
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=900&q=80',
    labelEn: 'Les Unisexes',
    labelAr: 'للجنسين',
    descEn: 'Bold, Woody & Aromatic',
    descAr: 'جريء، خشبي وعطري',
    accent: '#c8951a',
    featured: true,
  },
  {
    query: 'gender=men',
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=900&q=80',
    labelEn: 'Pour Homme',
    labelAr: 'رجالي',
    descEn: 'Fresh, Woody & Intense',
    descAr: 'منعش، خشبي ومكثف',
    accent: '#c8951a',
  },
];

export default function CategoryBanner() {
  const { t, i18n } = useTranslation('pages');
  const isAr = i18n.language === 'ar';
  const [hoveredIdx, setHoveredIdx] = useState(null);

  return (
    <section style={{ padding: '8rem 0', direction: isAr ? 'rtl' : 'ltr' }}>
      <div className="container-luxe">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: 'center', marginBottom: '5rem' }}
        >
          <span className="section-subtitle">{t('home.categorySubtitle')}</span>
          <h2 className="section-title">{t('home.categoryTitle')}</h2>
          <div style={{ width: '50px', height: '1px', background: 'linear-gradient(to right, transparent, var(--color-gold), transparent)', margin: '1.25rem auto 0' }} />
        </motion.div>

        {/* Collections Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.4fr 1fr',
          gap: '1.25rem',
          alignItems: 'stretch',
        }}>
          {collections.map((coll, i) => {
            const isHovered = hoveredIdx === i;
            const label = isAr ? coll.labelAr : coll.labelEn;
            const desc = isAr ? coll.descAr : coll.descEn;

            return (
              <motion.div
                key={coll.query}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                onHoverStart={() => setHoveredIdx(i)}
                onHoverEnd={() => setHoveredIdx(null)}
                style={{
                  position: 'relative',
                  aspectRatio: coll.featured ? '3 / 4.4' : '3 / 4',
                  overflow: 'hidden',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                <Link to={`/shop?${coll.query}`} style={{ display: 'block', width: '100%', height: '100%' }}>
                  {/* Background Image */}
                  <motion.img
                    src={coll.image}
                    alt={label}
                    animate={{ scale: isHovered ? 1.07 : 1 }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />

                  {/* Permanent Dark Gradient */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.1) 100%)',
                  }} />

                  {/* Hover Overlay */}
                  <motion.div
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.4 }}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(0,0,0,0.2)',
                    }}
                  />

                  {/* Content */}
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '2rem',
                  }}>
                    {/* Description tag */}
                    <motion.span
                      animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 6 }}
                      transition={{ duration: 0.35 }}
                      style={{
                        display: 'block',
                        fontSize: '0.6rem',
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        color: 'rgba(255,255,255,0.65)',
                        fontFamily: 'var(--font-sans)',
                        fontWeight: 600,
                        marginBottom: '0.5rem',
                      }}
                    >
                      {desc}
                    </motion.span>

                    {/* Collection Name */}
                    <h3 style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: coll.featured ? '2rem' : '1.6rem',
                      fontWeight: 400,
                      color: '#fff',
                      lineHeight: 1.15,
                      margin: 0,
                      marginBottom: '1rem',
                    }}>
                      {label}
                    </h3>

                    {/* CTA */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                      <motion.div
                        animate={{ width: isHovered ? '32px' : '18px', background: isHovered ? 'var(--color-gold)' : 'rgba(255,255,255,0.5)' }}
                        transition={{ duration: 0.4 }}
                        style={{ height: '1px', flexShrink: 0 }}
                      />
                      <span style={{
                        fontSize: '0.6rem',
                        letterSpacing: '0.22em',
                        textTransform: 'uppercase',
                        color: isHovered ? 'var(--color-gold)' : 'rgba(255,255,255,0.75)',
                        fontFamily: 'var(--font-sans)',
                        fontWeight: 700,
                        transition: 'color 0.3s',
                      }}>
                        {t('btn.discover', { ns: 'common' })}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 768px) {
          .collections-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 1024px) {
          .collections-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </section>
  );
}
