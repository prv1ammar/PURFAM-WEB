import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import api from '@/services/api';
import { useCart } from '@/context/CartContext';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [mainImage, setMainImage] = useState(0);
  const isAr = i18n.language === 'ar';

  useEffect(() => {
    api.get(`/api/products/${id}`)
      .then(res => {
        setProduct(res.data.product);
        setSelectedSize(res.data.product.sizes[0]?.ml);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleAdd = async () => {
    if (!selectedSize) return;
    await addItem(product, selectedSize, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  if (loading) return (
    <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div style={{ width: '40px', height: '40px', border: '2px solid var(--color-border)', borderTopColor: 'var(--color-gold)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );

  if (!product) return (
    <div className="page-wrapper" style={{ textAlign: 'center', padding: '6rem 1.5rem' }}>
      <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-gray)' }}>Product not found</h2>
      <Link to="/shop" style={{ color: 'var(--color-gold)', marginTop: '1rem', display: 'inline-block' }}>← Back to Shop</Link>
    </div>
  );

  const name = isAr ? product.name.ar : product.name.en;
  const description = isAr ? product.description.ar : product.description.en;
  const selectedSizeObj = product.sizes.find(s => s.ml === selectedSize);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="page-wrapper">
      <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: '3rem 1.5rem', direction: isAr ? 'rtl' : 'ltr' }}>
        {/* Breadcrumb */}
        <div style={{ marginBottom: '2rem', fontSize: '0.8rem', color: 'var(--color-gray)', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Link to="/shop" style={{ color: 'var(--color-gold)' }}>{t('nav.shop')}</Link>
          <span>/</span>
          <span>{name}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }}>
          {/* Images */}
          <div>
            <div style={{ aspectRatio: '1', overflow: 'hidden', borderRadius: 'var(--radius-sm)', marginBottom: '1rem' }}>
              <img
                src={product.images?.[mainImage] || `https://images.unsplash.com/photo-1541643600914-78b084683702?w=700`}
                alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            {product.images?.length > 1 && (
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setMainImage(i)} style={{
                    width: '70px', height: '70px', overflow: 'hidden', borderRadius: 'var(--radius-sm)',
                    border: `2px solid ${mainImage === i ? 'var(--color-gold)' : 'transparent'}`,
                    transition: 'border-color 0.2s',
                  }}>
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <p style={{ fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: '0.5rem' }}>
              {product.brand}
            </p>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, marginBottom: '1rem' }}>{name}</h1>

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '2px' }}>
                {[1, 2, 3, 4, 5].map(s => (
                  <span key={s} style={{ color: s <= Math.round(product.ratings?.average || 0) ? 'var(--color-gold)' : 'var(--color-border)' }}>★</span>
                ))}
              </div>
              <span style={{ color: 'var(--color-gray)', fontSize: '0.85rem' }}>
                ({product.ratings?.count || 0} {t('reviews', { ns: 'products' })})
              </span>
            </div>

            <div style={{ height: '1px', background: 'var(--color-border)', marginBottom: '1.5rem' }} />

            <p style={{ color: 'var(--color-light-gray)', lineHeight: 1.9, marginBottom: '2rem' }}>{description}</p>

            {/* Size selector */}
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-gray)', marginBottom: '0.75rem' }}>
                {t('labels.size')} — <span style={{ color: 'var(--color-gold)' }}>{selectedSize}{t('ml', { ns: 'products' })}</span>
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {product.sizes.map(s => (
                  <button key={s.ml} onClick={() => setSelectedSize(s.ml)}
                    style={{
                      padding: '0.6rem 1.2rem',
                      border: `1px solid ${selectedSize === s.ml ? 'var(--color-gold)' : 'var(--color-border)'}`,
                      background: selectedSize === s.ml ? 'rgba(201,168,76,0.15)' : 'transparent',
                      color: selectedSize === s.ml ? 'var(--color-gold)' : 'var(--color-off-white)',
                      borderRadius: 'var(--radius-sm)', transition: 'all 0.2s',
                    }}>
                    {s.ml}ml — ${s.price}
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--color-gold)', marginBottom: '1.5rem' }}>
              ${selectedSizeObj?.price || product.sizes[0]?.price}
            </p>

            {/* Qty + Add */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ padding: '0 1rem', height: '50px', color: 'var(--color-off-white)', fontSize: '1.2rem' }}>−</button>
                <span style={{ padding: '0 1rem', minWidth: '40px', textAlign: 'center' }}>{qty}</span>
                <button onClick={() => setQty(q => q + 1)} style={{ padding: '0 1rem', height: '50px', color: 'var(--color-off-white)', fontSize: '1.2rem' }}>+</button>
              </div>
              <button onClick={handleAdd} style={{
                flex: 1, height: '50px', background: added ? 'var(--color-gold-dark)' : 'var(--color-gold)',
                color: 'var(--color-black)', fontFamily: 'var(--font-sans)', fontSize: '0.8rem',
                letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700,
                transition: 'background 0.2s', borderRadius: 'var(--radius-sm)',
              }}>
                {added ? t('btn.addedToCart') : t('btn.addToCart')}
              </button>
            </div>

            {/* Details */}
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                { label: t('labels.brand'), val: product.brand },
                { label: t('labels.gender'), val: t(`gender.${product.gender}`) },
                { label: t('labels.category'), val: t(`category.${product.category}`) },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', gap: '1rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-gray)', minWidth: '80px' }}>{item.label}:</span>
                  <span style={{ fontSize: '0.9rem' }}>{item.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; gap: 2rem !important; }
        }
      `}</style>
    </motion.div>
  );
}
