import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import ScrollReveal from '@/components/ui/ScrollReveal';

const collections = [
  {
    query: 'gender=women&size=10',
    image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&q=80',
    labelEn: '10ml Women',
    labelAr: 'عطور ١٠ مل نسائي',
  },
  {
    query: 'gender=men&size=10',
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&q=80',
    labelEn: '10ml Men',
    labelAr: 'عطور ١٠ مل رجالي',
  },
  {
    query: 'minSize=50',
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&q=80',
    labelEn: 'Full Size',
    labelAr: 'الحجم الكامل',
  },
];

export default function CategoryBanner() {
  const { t, i18n } = useTranslation('pages');
  const isAr = i18n.language === 'ar';

  return (
    <section className="section-padding py-0 mb-20">
      <div className="container-luxe">
        <ScrollReveal direction="up" className="text-center mb-12">
          <p className="section-subtitle">{t('home.categorySubtitle')}</p>
          <h2 className="section-title">{t('home.categoryTitle')}</h2>
          <div className="w-10 h-[1px] bg-gold mx-auto mt-4" />
        </ScrollReveal>

        <div className="grid-responsive-3">
          {collections.map((coll, i) => (
            <ScrollReveal
              key={coll.labelEn}
              direction={i === 0 ? 'left' : i === 2 ? 'right' : 'up'}
              delay={i * 0.12}
              amount={0.1}>
              <Link to={`/shop?${coll.query}`} className="group relative block overflow-hidden shadow-luxe" style={{ aspectRatio: '4/5', borderRadius: 'var(--radius-lg)' }}>
                  <motion.img 
                    src={coll.image} 
                    alt={isAr ? coll.labelAr : coll.labelEn}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.6 }}
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 flex flex-col" style={{
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.2), transparent)',
                    justifyContent: 'flex-end',
                    padding: '2rem'
                  }}>
                    <h3 className="text-2xl font-serif text-white mb-2 font-light">
                      {isAr ? coll.labelAr : coll.labelEn}
                    </h3>
                    <span className="text-xs tracking-w-2 uppercase text-gold">
                      {t('btn.discover', { ns: 'common' })} →
                    </span>
                  </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
