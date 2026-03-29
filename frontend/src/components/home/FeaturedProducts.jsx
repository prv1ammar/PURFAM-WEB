import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '@/services/api';
import ProductCard from '@/components/products/ProductCard';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function FeaturedProducts() {
  const { t, i18n } = useTranslation('pages');
  const isAr = i18n.language === 'ar';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/products/featured')
      .then(res => setProducts(res.data.products))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section style={{ padding: '6rem 1.5rem', direction: isAr ? 'rtl' : 'ltr' }}>
      <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto' }}>
        <ScrollReveal direction="up" style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p className="section-subtitle">{t('home.featuredSubtitle')}</p>
          <h2 className="section-title">{t('home.featuredTitle')}</h2>
          <div style={{ width: '40px', height: '1px', background: 'var(--color-gold)', margin: '1rem auto 0' }} />
        </ScrollReveal>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '2rem' }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <div className="skeleton" style={{ aspectRatio: '3/4' }} />
                <div className="skeleton" style={{ height: '14px', marginTop: '1rem', width: '60%' }} />
                <div className="skeleton" style={{ height: '20px', marginTop: '0.5rem', width: '80%' }} />
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '2rem' }}>
            {products.map((p, i) => (
              <ScrollReveal key={p._id} direction="up" delay={i * 0.08} amount={0.1}>
                <ProductCard product={p} />
              </ScrollReveal>
            ))}
          </div>
        )}

        <ScrollReveal direction="fade" delay={0.2} style={{ textAlign: 'center', marginTop: '3rem' }}>
          <Link to="/shop" style={{
            display: 'inline-block', padding: '0.8rem 2rem',
            border: '1px solid var(--color-gold)', color: 'var(--color-gold)',
            fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase',
            transition: 'all 0.2s',
          }}
            onMouseOver={e => { e.target.style.background = 'var(--color-gold)'; e.target.style.color = 'var(--color-black)'; }}
            onMouseOut={e => { e.target.style.background = 'transparent'; e.target.style.color = 'var(--color-gold)'; }}>
            {t('btn.viewAll', { ns: 'common' })}
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
