import { useTranslation } from 'react-i18next';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function BrandStory() {
  const { t, i18n } = useTranslation('pages');
  const isAr = i18n.language === 'ar';

  return (
    <section style={{
      padding: '6rem 1.5rem',
      background: 'var(--color-charcoal)',
      borderTop: '1px solid var(--color-border)',
      borderBottom: '1px solid var(--color-border)',
    }}>
      <div style={{
        maxWidth: 'var(--max-width)', margin: '0 auto',
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center',
        direction: isAr ? 'rtl' : 'ltr',
      }}>
        <ScrollReveal direction={isAr ? 'right' : 'left'} duration={0.8}>
          <p className="section-subtitle">{t('home.storySubtitle')}</p>
          <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>{t('home.storyTitle')}</h2>
          <div style={{ height: '1px', background: 'var(--color-gold)', width: '60px', marginBottom: '1.5rem' }} />
          <p style={{ color: 'var(--color-light-gray)', lineHeight: 1.9, fontSize: '1rem', fontWeight: 300 }}>
            {t('home.storyText')}
          </p>
          <div style={{ display: 'flex', gap: '3rem', marginTop: '2.5rem' }}>
            {[
              { num: '20+', label: isAr ? 'ماركة عالمية' : 'Global Brands' },
              { num: '100%', label: isAr ? 'أصلي' : 'Authentic' },
              { num: '5★', label: isAr ? 'تقييم' : 'Rated' },
            ].map(stat => (
              <div key={stat.num}>
                <p style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--color-gold)' }}>{stat.num}</p>
                <p style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-gray)' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal direction={isAr ? 'left' : 'right'} duration={0.8} delay={0.15} style={{ position: 'relative' }}>
          <img
            src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=700&q=80"
            alt="Our Story"
            style={{
              width: '100%', aspectRatio: '4/5', objectFit: 'cover',
              borderRadius: 'var(--radius-sm)',
            }}
          />
          <div style={{
            position: 'absolute', bottom: '-1.5rem', [isAr ? 'right' : 'left']: '-1.5rem',
            background: 'var(--color-gold)', padding: '1.5rem 2rem',
          }}>
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: 'var(--color-black)', lineHeight: 1 }}>
              {isAr ? 'منذ ٢٠٢٤' : 'Since 2024'}
            </p>
          </div>
        </ScrollReveal>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .story-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
