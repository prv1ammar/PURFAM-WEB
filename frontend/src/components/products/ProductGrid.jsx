import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';

function columnsForWidth(w) {
  if (w <= 768) return 2;
  if (w <= 1024) return 3;
  if (w <= 1440) return 4;
  return 5;
}

function useColumns() {
  const [cols, setCols] = useState(() => columnsForWidth(typeof window !== 'undefined' ? window.innerWidth : 1440));

  useEffect(() => {
    const onResize = () => setCols(columnsForWidth(window.innerWidth));
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return cols;
}

export default function ProductGrid({ products, loading }) {
  const cols = useColumns();
  const isMobile = cols === 2;

  if (loading) {
    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: isMobile ? '1.5rem 1rem' : '2rem 1.5rem',
      }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i}>
            <div className="skeleton" style={{ aspectRatio: '3/4' }} />
            <div style={{ paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div className="skeleton" style={{ height: '10px', width: '35%' }} />
              <div className="skeleton" style={{ height: '18px', width: '75%' }} />
              <div className="skeleton" style={{ height: '16px', width: '30%', marginTop: '0.25rem' }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
      gap: isMobile ? '1.5rem 1rem' : '2.5rem 2rem',
    }}>
      {products.map((product, i) => (
        <ProductCard key={product._id || product.id} product={product} index={i} />
      ))}
    </div>
  );
}
