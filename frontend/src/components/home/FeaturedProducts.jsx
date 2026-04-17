import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import api from '@/services/api';
import ProductCard from '@/components/products/ProductCard';

const MONO = { fontFamily: 'var(--font-mono)', letterSpacing: '0.22em', textTransform: 'uppercase' };

export default function FeaturedProducts() {
  const { i18n } = useTranslation('pages');
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
    <section style={{ padding: '8rem 0', background: 'var(--cream)', direction: isAr ? 'rtl' : 'ltr' }}>
      <div className="container-luxe">

        {/* Header row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem' }}
        >
          <div>
            <span style={{ ...MONO, fontSize: '0.65rem', color: 'var(--terracotta)', display: 'block', marginBottom: '1rem' }}>
              {isAr ? '— اختيار الشهر' : '— Sélection du mois'}
            </span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 300, lineHeight: 1, letterSpacing: '-0.03em', color: 'var(--charcoal)', margin: 0 }}>
              {isAr ? (
                <>الأكثر <span style={{ fontStyle: 'italic' }}>طلبًا.</span></>
              ) : (
                <>Les <span style={{ fontStyle: 'italic' }}>coups de cœur.</span></>
              )}
            </h2>
          </div>
          <Link to="/shop" style={{ ...MONO, fontSize: '0.65rem', color: 'var(--charcoal)', borderBottom: '1px solid var(--charcoal)', paddingBottom: '3px', whiteSpace: 'nowrap' }}
            onMouseOver={e => { e.currentTarget.style.color = 'var(--terracotta)'; e.currentTarget.style.borderColor = 'var(--terracotta)'; }}
            onMouseOut={e => { e.currentTarget.style.color = 'var(--charcoal)'; e.currentTarget.style.borderColor = 'var(--charcoal)'; }}>
            {isAr ? 'عرض الكل ←' : 'Tout voir →'}
          </Link>
        </motion.div>

        {/* Products grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={{ background: 'var(--cream-deep)', border: '1px solid var(--line)', overflow: 'hidden' }}>
                <div className="skeleton" style={{ aspectRatio: '4/5' }} />
                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div className="skeleton" style={{ height: '10px', width: '32%' }} />
                  <div className="skeleton" style={{ height: '20px', width: '78%' }} />
                  <div className="skeleton" style={{ height: '20px', width: '40%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {products.map((p, i) => (
              <ProductCard key={p._id || p.id} product={p} index={i} />
            ))}
          </div>
        )}

        {/* Stats ticker */}
        <div style={{ marginTop: '5rem', borderTop: '1px solid var(--charcoal)', borderBottom: '1px solid var(--line)', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {[
            [isAr ? '130' : '130', isAr ? 'عطر' : 'Parfums'],
            ['10 ml', isAr ? 'حجم' : 'Format'],
            [isAr ? '48 ساعة' : '48 h', isAr ? 'توصيل' : 'Livraison'],
            [isAr ? '100%' : '100%', isAr ? 'أصلي' : 'Authentique'],
          ].map(([big, small], i) => (
            <div key={i} style={{ padding: '2rem', borderRight: i < 3 ? '1px solid var(--line)' : 'none' }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 300, letterSpacing: '-0.02em', lineHeight: 1, color: 'var(--charcoal)' }}>{big}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--graphite)', marginTop: '0.6rem' }}>{small}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
