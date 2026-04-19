import ProductCard from './ProductCard';

export default function ProductGrid({ products, loading }) {
  if (loading) {
    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '2rem 1.5rem',
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
      gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
      gap: '2.5rem 2rem',
    }}>
      {products.map((product, i) => (
        <ProductCard key={product._id || product.id} product={product} index={i} />
      ))}
    </div>
  );
}
