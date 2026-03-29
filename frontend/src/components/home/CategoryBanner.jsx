import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import ScrollReveal from '@/components/ui/ScrollReveal';

const categories = [
  {
    gender: 'women',
    image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&q=80',
    labelKey: 'home.womenCollection',
  },
  {
    gender: 'men',
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&q=80',
    labelKey: 'home.menCollection',
  },
  {
    gender: 'unisex',
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&q=80',
    labelKey: 'home.unisexCollection',
  },
];

export default function CategoryBanner() {
  const { t, i18n } = useTranslation('pages');
  const isAr = i18n.language === 'ar';

  return (
    <section style={{ padding: '0 1.5rem 6rem', direction: isAr ? 'rtl' : 'ltr' }}>
      <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto' }}>
        <ScrollReveal direction="up" style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p className="section-subtitle">{t('home.categorySubtitle')}</p>
          <h2 className="section-title">{t('home.categoryTitle')}</h2>
          <div style={{ width: '40px', height: '1px', background: 'var(--color-gold)', margin: '1rem auto 0' }} />
        </ScrollReveal>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1.5rem',
        }}>
          {categories.map((cat, i) => (
            <ScrollReveal
              key={cat.gender}
              direction={i === 0 ? 'left' : i === 2 ? 'right' : 'up'}
              delay={i * 0.12}
              amount={0.1}>
              <Link to={`/shop?gender=${cat.gender}`}>
                <div style={{
                  position: 'relative', aspectRatio: '2/3', overflow: 'hidden',
                  borderRadius: 'var(--radius-sm)',
                }}
                  onMouseOver={e => e.currentTarget.querySelector('img').style.transform = 'scale(1.05)'}
                  onMouseOut={e => e.currentTarget.querySelector('img').style.transform = 'scale(1)'}>
                  <img src={cat.image} alt={t(cat.labelKey)}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} />
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top, rgba(10,10,10,0.8) 0%, rgba(10,10,10,0.1) 60%)',
                    display: 'flex', alignItems: 'flex-end', padding: '1.5rem',
                  }}>
                    <div>
                      <h3 style={{
                        fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 300,
                        color: 'var(--color-off-white)', marginBottom: '0.5rem',
                      }}>
                        {t(cat.labelKey)}
                      </h3>
                      <span style={{
                        fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase',
                        color: 'var(--color-gold)',
                      }}>
                        {t('btn.discover', { ns: 'common' })} →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .category-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
