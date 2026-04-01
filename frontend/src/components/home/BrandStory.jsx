import { useTranslation } from 'react-i18next';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function BrandStory() {
  const { t, i18n } = useTranslation('pages');
  const isAr = i18n.language === 'ar';

  return (
    <section className="section-padding bg-theme border-t border-b border-theme-10">
      <div className="container-luxe grid-responsive-2 items-center gap-10">
        <ScrollReveal direction={isAr ? 'right' : 'left'} duration={0.8}>
          <p className="section-subtitle text-gold uppercase tracking-w-2 text-xs mb-4">{t('home.storySubtitle')}</p>
          <h2 className="section-title mb-6 text-theme-90">{t('home.storyTitle')}</h2>
          <div className="h-[1px] bg-gold w-16 mb-6" />
          <p className="text-theme-60 text-lg font-light leading-relaxed mb-8">
            {t('home.storyText')}
          </p>
          <div className="flex gap-8 mt-10">
            {[
              { num: '20+', label: isAr ? 'ماركة عالمية' : 'Global Brands' },
              { num: '100%', label: isAr ? 'أصلي' : 'Authentic' },
              { num: '5★', label: isAr ? 'تقييم' : 'Rated' },
            ].map(stat => (
              <div key={stat.num}>
                <p className="text-4xl font-serif text-gold leading-none mb-2">{stat.num}</p>
                <p className="text-xs tracking-widest uppercase text-theme-40">{stat.label}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal direction={isAr ? 'left' : 'right'} duration={0.8} delay={0.15} className="relative">
          <div className="aspect-4-5 overflow-hidden" style={{ borderRadius: 'var(--radius-lg)' }}>
            <img
                src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=700&q=80"
                alt="Our Story"
                className="w-full h-full object-cover transition-all duration-700"
                style={{ filter: 'grayscale(0.2)' }}
                onMouseOver={e => e.target.style.filter = 'grayscale(0)'}
                onMouseOut={e => e.target.style.filter = 'grayscale(0.2)'}
            />
          </div>
          <div className="absolute bg-gold" style={{ 
            bottom: '-1.5rem', 
            ...(isAr ? { right: '-1.5rem' } : { left: '-1.5rem' }),
            padding: '1.5rem',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-luxe)'
           }}>
            <p className="text-3xl font-serif text-black leading-none">
              {isAr ? 'منذ ٢٠٢٤' : 'Since 2024'}
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
