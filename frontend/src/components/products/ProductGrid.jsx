import ProductCard from './ProductCard';

export default function ProductGrid({ products, loading }) {
  if (loading) {
    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '2rem',
      }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i}>
            <div className="skeleton" style={{ aspectRatio: '3/4', borderRadius: 'var(--radius-sm)' }} />
            <div className="skeleton" style={{ height: '14px', marginTop: '1rem', width: '60%' }} />
            <div className="skeleton" style={{ height: '20px', marginTop: '0.5rem', width: '80%' }} />
            <div className="skeleton" style={{ height: '16px', marginTop: '0.5rem', width: '40%' }} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
      gap: '2rem',
    }}>
      {products.map(product => (
        <ProductCard key={product._id || product.id} product={product} />
      ))}
    </div>
  );
}
