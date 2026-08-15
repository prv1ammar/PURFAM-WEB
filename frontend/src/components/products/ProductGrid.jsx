import ProductCard from './ProductCard';

export default function ProductGrid({ products, loading }) {
  if (loading) {
    return (
      <>
        <div className="pgrid" style={{ display: 'grid', gap: '2rem 1.5rem' }}>
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
        <GridStyle />
      </>
    );
  }

  return (
    <>
      <div className="pgrid" style={{ display: 'grid', gap: '2.5rem 2rem' }}>
        {products.map((product, i) => (
          <ProductCard key={product._id || product.id} product={product} index={i} />
        ))}
      </div>
      <GridStyle />
    </>
  );
}

function GridStyle() {
  return (
    <style>{`
      .pgrid {
        grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      }
      @media (max-width: 768px) {
        .pgrid {
          grid-template-columns: repeat(2, 1fr) !important;
          gap: 1.5rem 1rem !important;
        }
      }
    `}</style>
  );
}
