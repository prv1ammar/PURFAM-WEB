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
  const isAr = i18n.language === 'ar';
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filters = {
    gender: searchParams.get('gender') || '',
    category: searchParams.get('category') || '',
    sort: searchParams.get('sort') || '-createdAt',
    size: searchParams.get('size') || '',
    minSize: searchParams.get('minSize') || '',
  };

  useEffect(() => {
    setLoading(true);
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

      {/* Hero Banner */}
      <div style={{
        height: '250px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: '2.5rem',
        background: `linear-gradient(to bottom, rgba(10,10,10,0) 0%, var(--color-black) 100%),
                     url(${shopBg}) center/cover`,
        textAlign: 'center',
      }}>
        <div>
          <p className="section-subtitle">{t('shop.subtitle')}</p>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
            {t('shop.title')}
          </h1>
        </div>
      </div>

      <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: '3rem 1.5rem' }}>
        {/* Search Bar */}
        <div style={{ marginBottom: '2rem' }}>
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder={isAr ? 'ابحث عن عطر...' : 'Search fragrances...'}
            style={{
              width: '100%', maxWidth: '400px', padding: '0.8rem 1.5rem',
              background: 'var(--color-charcoal)', border: '1px solid var(--color-border)',
              color: 'rgba(var(--text-rgb), 0.9)', borderRadius: 'var(--radius-full)',
              fontSize: '0.95rem', outline: 'none',
              boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
            }}
            onFocus={e => e.target.style.borderColor = 'var(--color-gold)'}
            onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '2.5rem', alignItems: 'start' }}>
          {/* Filters - desktop */}
          <div className="desktop-filters">
            <ProductFilters filters={filters} onChange={handleFilterChange} />
          </div>

          {/* Products */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <p style={{ color: 'rgba(var(--text-rgb), 0.5)', fontSize: '0.9rem' }}>
                {loading ? '...' : `${total} ${t('shop.results')}`}
              </p>
            </div>

            {!loading && products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem', color: 'rgba(var(--text-rgb), 0.5)' }}>
                <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', marginBottom: '1rem' }}>
                  {t('shop.noResults')}
                </p>
                <button onClick={() => handleFilterChange({ gender: '', category: '', sort: '-createdAt', size: '', minSize: '' })}
                  style={{ color: 'var(--color-gold)', textDecoration: 'underline', fontSize: '0.9rem' }}>
                  {t('shop.clearFilters')}
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
