import ProductCard from './ProductCard';
import useGridColumns from '@/hooks/useGridColumns';

export default function ProductGrid({ products, loading }) {
  const cols = useGridColumns();
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
