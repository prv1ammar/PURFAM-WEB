import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import api from '@/services/api';

const MONO = { fontFamily: 'var(--font-mono)', letterSpacing: '0.18em', textTransform: 'uppercase' };

export default function SearchOverlay({ open, onClose }) {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const lang = i18n.language;
  const isAr = lang === 'ar';
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [open]);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (!query.trim()) { setResults([]); setLoading(false); return; }
    setLoading(true);
    debounceRef.current = setTimeout(() => {
      api.get('/api/products', { params: { search: query.trim(), limit: 6 } })
        .then(res => setResults(res.data.products || []))
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const goToAllResults = () => {
    if (!query.trim()) return;
    navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
    onClose();
  };

  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'fixed', inset: 0, background: 'rgba(26,25,24,0.55)', zIndex: 10001 }}
          />
          <motion.div
            initial={{ y: '-100%' }} animate={{ y: 0 }} exit={{ y: '-100%' }}
            transition={{ type: 'tween', duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'fixed', top: 0, left: 0, right: 0,
              background: 'var(--charcoal)', color: 'var(--cream)',
              zIndex: 10002, padding: '2.5rem 1.5rem 2rem',
              maxHeight: '85vh', overflowY: 'auto',
              direction: isAr ? 'rtl' : 'ltr',
            }}>
            <div style={{ maxWidth: '640px', margin: '0 auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid rgba(245,240,232,0.18)', paddingBottom: '1rem' }}>
                <SearchIcon />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') goToAllResults(); }}
                  placeholder={isAr ? 'ابحث عن عطر أو ماركة...' : lang === 'fr' ? 'Rechercher un parfum ou une marque...' : 'Search for a fragrance or brand...'}
                  style={{
                    flex: 1, background: 'none', border: 'none', outline: 'none',
                    color: 'var(--cream)', fontFamily: 'var(--font-serif)',
                    fontSize: 'clamp(1.1rem, 3vw, 1.6rem)', fontWeight: 300,
                  }}
                />
                <button onClick={onClose} style={{ color: 'rgba(245,240,232,0.5)', fontSize: '1.25rem', lineHeight: 1, background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0 }}>
                  ✕
                </button>
              </div>

              {/* Results */}
              <div style={{ marginTop: '1.5rem', minHeight: query.trim() ? '80px' : 0 }}>
                {loading && (
                  <p style={{ ...MONO, fontSize: '0.6rem', color: 'rgba(245,240,232,0.45)' }}>
                    {isAr ? 'جارٍ البحث...' : 'Searching...'}
                  </p>
                )}

                {!loading && query.trim() && results.length === 0 && (
                  <p style={{ ...MONO, fontSize: '0.6rem', color: 'rgba(245,240,232,0.45)' }}>
                    {isAr ? 'لا نتائج' : lang === 'fr' ? 'Aucun résultat' : 'No results'}
                  </p>
                )}

                {results.map(p => {
                  const name = isAr ? p.name?.ar : p.name?.en;
                  const price = p.sizes?.[0]?.price;
                  const image = p.images?.[0];
                  return (
                    <Link
                      key={p.id || p._id}
                      to={`/shop/${p.id || p._id}`}
                      onClick={onClose}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '1rem',
                        padding: '0.75rem 0', borderBottom: '1px solid rgba(245,240,232,0.08)',
                        textDecoration: 'none',
                      }}
                    >
                      <div style={{ width: '48px', height: '60px', flexShrink: 0, background: 'rgba(245,240,232,0.06)', overflow: 'hidden' }}>
                        {image && <img src={image} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ ...MONO, fontSize: '0.5rem', color: 'var(--terracotta)', marginBottom: '0.25rem' }}>{p.brand}</div>
                        <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', color: 'var(--cream)' }}>{name}</div>
                      </div>
                      {price != null && (
                        <div style={{ fontFamily: 'var(--font-serif)', fontSize: '0.9rem', color: 'rgba(245,240,232,0.7)', flexShrink: 0 }}>
                          {price} dh
                        </div>
                      )}
                    </Link>
                  );
                })}

                {!loading && results.length > 0 && (
                  <button
                    onClick={goToAllResults}
                    style={{
                      ...MONO, fontSize: '0.6rem', color: 'var(--terracotta)',
                      background: 'none', border: 'none', cursor: 'pointer',
                      marginTop: '1.25rem', borderBottom: '1px solid var(--terracotta)', paddingBottom: '2px',
                    }}>
                    {isAr ? 'كل النتائج' : lang === 'fr' ? 'Voir tous les résultats' : 'View all results'} →
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ flexShrink: 0, opacity: 0.7 }}>
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
