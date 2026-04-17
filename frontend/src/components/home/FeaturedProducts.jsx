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
    <section className="section-padding overflow-hidden" style={{ direction: isAr ? 'rtl' : 'ltr' }}>
      <div className="container-luxe">
        <ScrollReveal direction="up" style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <span className="section-subtitle">{t('home.featuredSubtitle')}</span>
          <h2 className="section-title">{t('home.featuredTitle')}</h2>
          <div className="mx-auto" style={{ width: '60px', height: '1px', background: 'linear-gradient(to right, transparent, var(--color-gold), transparent)' }} />
        </ScrollReveal>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '2rem' }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={{ background: 'rgba(var(--text-rgb),0.03)', border: '1px solid rgba(var(--text-rgb),0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                <div className="skeleton" style={{ aspectRatio: '4/5' }} />
                <div style={{ padding: '1.25rem', display:'flex', flexDirection:'column', gap:'0.75rem' }}>
                  <div className="skeleton" style={{ height: '10px', width: '32%' }} />
                  <div className="skeleton" style={{ height: '20px', width: '78%' }} />
                  <div className="skeleton" style={{ height: '14px', width: '28px' }} />
                  <div className="skeleton" style={{ height: '20px', width: '40%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '2rem' }}>
            {products.map((p, i) => (
              <ProductCard key={p._id || p.id} product={p} index={i} />
            ))}
          </div>
        )}

        <ScrollReveal direction="fade" delay={0.4} style={{ textAlign: 'center', marginTop: '6rem' }}>
          <Link to="/shop" className="btn-luxe shadow-luxe">
            {t('btn.viewAll', { ns: 'common' })}
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
