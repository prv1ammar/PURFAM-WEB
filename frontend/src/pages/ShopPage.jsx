import { useState, useEffect } from 'react';
import shopBg from '@/assets/shop-bg.jpg';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import api from '@/services/api';
import ProductGrid from '@/components/products/ProductGrid';
import ProductFilters from '@/components/products/ProductFilters';

export default function ShopPage() {
  const { t, i18n } = useTranslation('pages');
  const lang = i18n.language;
  const isAr = lang === 'ar';
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const collectionSlug = searchParams.get('collection') || '';
  const [collectionName, setCollectionName] = useState('');

  const filters = {
    gender: searchParams.get('gender') || '',
    category: searchParams.get('category') || '',
    sort: searchParams.get('sort') || '-createdAt',
    size: searchParams.get('size') || '',
    minSize: searchParams.get('minSize') || '',
  };

  useEffect(() => {
    setLoading(true);

    if (collectionSlug) {
      // Fetch only the products belonging to this collection
      api.get(`/api/collections/${collectionSlug}/products`)
        .then(res => {
          const prods = res.data.products || [];
          setProducts(prods);
          setTotal(prods.length);
          setPages(1);
          // Grab collection name for the header
          const first = prods[0];
          if (!collectionName) {
            api.get('/api/collections')
              .then(r => {
                const col = (r.data.collections || []).find(c => c.slug === collectionSlug);
                if (col) setCollectionName(col.name?.[lang] || col.name?.en || '');
              })
              .catch(() => {});
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setCollectionName('');
      const params = {};
      if (filters.gender) params.gender = filters.gender;
      if (filters.category) params.category = filters.category;
      if (filters.sort) params.sort = filters.sort;
      if (filters.size) params.size = filters.size;
      if (filters.minSize) params.minSize = filters.minSize;
      if (search) params.search = search;
      params.page = page;
      api.get('/api/products', { params })
        .then(res => { setProducts(res.data.products); setTotal(res.data.total); setPages(res.data.pages); })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [searchParams, search, page]);

  const handleFilterChange = (newFilters) => {
    const params = {};
    if (newFilters.gender) params.gender = newFilters.gender;
    if (newFilters.category) params.category = newFilters.category;
    if (newFilters.sort) params.sort = newFilters.sort;
    if (newFilters.size) params.size = newFilters.size;
    if (newFilters.minSize) params.minSize = newFilters.minSize;
    setPage(1);
    setSearchParams(params);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="page-wrapper" style={{ direction: isAr ? 'rtl' : 'ltr' }}>

      {/* ── Page Header ── */}
      <section style={{ padding: '5rem 0 3rem' }}>
        <div className="container-luxe">
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--terracotta)', display: 'block', marginBottom: '1.5rem' }}>
            {collectionSlug
              ? `— ${isAr ? 'المجموعة' : lang === 'fr' ? 'Collection' : 'Collection'}`
              : (isAr ? `— الكتالوج / 130 عطرًا` : lang === 'fr' ? '— Le catalogue / 130 parfums' : '— The catalogue / 130 fragrances')}
          </span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(3rem, 9vw, 7rem)', fontWeight: 300, lineHeight: 0.9, letterSpacing: '-0.04em', color: 'var(--charcoal)', margin: '0 0 2rem' }}>
            {collectionSlug && collectionName
              ? <span style={{ fontStyle: 'italic' }}>{collectionName}</span>
              : (isAr ? (<>جميع <span style={{ fontStyle: 'italic' }}>العطور.</span></>) : lang === 'fr' ? (<>Tous les <span style={{ fontStyle: 'italic' }}>parfums.</span></>) : (<>All <span style={{ fontStyle: 'italic' }}>fragrances.</span></>))}
          </h1>
          {collectionSlug && (
            <button onClick={() => setSearchParams({})}
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--terracotta)', background: 'none', border: 'none', cursor: 'pointer', borderBottom: '1px solid var(--terracotta)', paddingBottom: '2px', marginBottom: '1rem' }}>
              ← {isAr ? 'كل العطور' : lang === 'fr' ? 'Tous les parfums' : 'All fragrances'}
            </button>
          )}
        </div>
      </section>

      <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: '0 3rem 3rem' }}>
        {/* Search Bar */}
        <div style={{ marginBottom: '2rem' }}>
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder={isAr ? 'ابحث عن عطر...' : lang === 'fr' ? 'Rechercher une fragrance...' : 'Search a fragrance...'}
            className="shop-search"
            style={{
              width: '100%', maxWidth: '400px', padding: '0.75rem 1.25rem',
              background: 'var(--paper)', border: '1px solid var(--line)',
              color: 'var(--charcoal)', fontFamily: 'var(--font-sans)',
              fontSize: '0.95rem', outline: 'none',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--terracotta)'}
            onBlur={e => e.target.style.borderColor = 'var(--line)'}
          />
        </div>

        <div className="shop-layout-grid" style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '2.5rem', alignItems: 'start' }}>
          {/* Filters - desktop */}
          <div className="desktop-filters">
            <ProductFilters filters={filters} onChange={handleFilterChange} />
          </div>

          {/* Products */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--graphite)' }}>
                {loading ? '...' : `${total} ${isAr ? 'عطر' : 'parfums'}`}
              </p>
            </div>

            {!loading && products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--graphite)' }}>
                <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 300, marginBottom: '1rem' }}>
                  {isAr ? 'لا نتائج' : 'Aucun résultat'}
                </p>
                <button onClick={() => handleFilterChange({ gender: '', category: '', sort: '-createdAt', size: '', minSize: '' })}
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--terracotta)', background: 'none', border: 'none', cursor: 'pointer', borderBottom: '1px solid var(--terracotta)', paddingBottom: '2px' }}>
                  {isAr ? 'مسح الفلاتر' : 'Effacer les filtres'}
                </button>
              </div>
            ) : (
              <>
                <ProductGrid products={products} loading={loading} />

                {/* Pagination */}
                {!loading && pages > 1 && (
                  <div style={{
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    gap: '0.35rem', marginTop: '3rem', flexWrap: 'wrap',
                  }}>
                    {/* Prev */}
                    <button
                      onClick={() => { setPage(p => p - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      disabled={page === 1}
                      style={{
                        padding: '0.5rem 1rem', fontSize: '0.85rem',
                        background: 'transparent', border: '1px solid var(--color-border)',
                        color: page === 1 ? 'rgba(var(--text-rgb), 0.3)' : 'rgba(var(--text-rgb), 0.9)',
                        cursor: page === 1 ? 'not-allowed' : 'pointer',
                        borderRadius: 'var(--radius-full)', transition: 'all 0.2s',
                      }}
                      onMouseOver={e => { if (page !== 1) e.currentTarget.style.borderColor = 'rgba(var(--text-rgb), 0.9)'; }}
                      onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; }}
                    >
                      ‹
                    </button>

                    {/* Page numbers */}
                    {(() => {
                      const buttons = [];
                      let start = Math.max(1, page - 2);
                      let end = Math.min(pages, page + 2);
                      if (start > 1) {
                        buttons.push(1);
                        if (start > 2) buttons.push('...');
                      }
                      for (let i = start; i <= end; i++) buttons.push(i);
                      if (end < pages) {
                        if (end < pages - 1) buttons.push('...');
                        buttons.push(pages);
                      }
                      return buttons.map((b, i) => b === '...' ? (
                        <span key={`ellipsis-${i}`} style={{ padding: '0.5rem 0.4rem', color: 'rgba(var(--text-rgb), 0.5)', fontSize: '0.85rem' }}>…</span>
                      ) : (
                        <button key={b}
                          onClick={() => { setPage(b); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                          style={{
                            minWidth: '36px', height: '36px', fontSize: '0.85rem',
                            background: b === page ? 'rgba(var(--text-rgb), 1)' : 'transparent',
                            color: b === page ? 'var(--color-black)' : 'rgba(var(--text-rgb), 0.9)',
                            border: `1px solid ${b === page ? 'rgba(var(--text-rgb), 1)' : 'var(--color-border)'}`,
                            cursor: 'pointer', borderRadius: 'var(--radius-full)', transition: 'all 0.2s',
                            fontWeight: b === page ? 700 : 400,
                          }}
                          onMouseOver={e => { if (b !== page) { e.currentTarget.style.borderColor = 'rgba(var(--text-rgb), 0.9)'; } }}
                          onMouseOut={e => { if (b !== page) { e.currentTarget.style.borderColor = 'var(--color-border)'; } }}
                        >
                          {b}
                        </button>
                      ));
                    })()}

                    {/* Next */}
                    <button
                      onClick={() => { setPage(p => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      disabled={page === pages}
                      style={{
                        padding: '0.5rem 1rem', fontSize: '0.85rem',
                        background: 'transparent', border: '1px solid var(--color-border)',
                        color: page === pages ? 'rgba(var(--text-rgb), 0.3)' : 'rgba(var(--text-rgb), 0.9)',
                        cursor: page === pages ? 'not-allowed' : 'pointer',
                        borderRadius: 'var(--radius-full)', transition: 'all 0.2s',
                      }}
                      onMouseOver={e => { if (page !== pages) e.currentTarget.style.borderColor = 'rgba(var(--text-rgb), 0.9)'; }}
                      onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; }}
                    >
                      ›
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .desktop-filters { display: none; }
          div[style*="grid-template-columns: 240px"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </motion.div>
  );
}
