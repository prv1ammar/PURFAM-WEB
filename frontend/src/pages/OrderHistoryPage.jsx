import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import api from '@/services/api';

export default function OrderHistoryPage() {
  const { t, i18n } = useTranslation('pages');
  const isAr = i18n.language === 'ar';
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/orders')
      .then(res => setOrders(res.data.orders))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statusColors = {
    pending: '#f59e0b', paid: '#10b981', processing: '#3b82f6',
    shipped: '#8b5cf6', delivered: 'var(--color-gold)', cancelled: '#ef4444',
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="page-wrapper">
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 1.5rem', direction: isAr ? 'rtl' : 'ltr' }}>
        <div style={{ marginBottom: '2rem' }}>
          <p className="section-subtitle">{t('orders.subtitle')}</p>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: 'clamp(1.8rem, 4vw, 2.5rem)' }}>
            {t('orders.title')}
          </h1>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: '100px', borderRadius: 'var(--radius-md)' }} />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</p>
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: 'var(--color-gray)', marginBottom: '1.5rem' }}>
              {t('orders.noOrders')}
            </p>
            <Link to="/shop" style={{ color: 'var(--color-gold)', textDecoration: 'underline' }}>
              {t('orders.startShopping')}
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {orders.map(order => (
              <motion.div key={order.id || order._id}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                style={{
                  background: 'var(--color-charcoal)', border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)', padding: '1.5rem',
                }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-gray)', marginBottom: '0.25rem' }}>
                      {t('orders.orderId')}: <span style={{ fontFamily: 'monospace', color: 'var(--color-off-white)' }}>#{(order.id || order._id || '').toString().slice(-8).toUpperCase()}</span>
                    </p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-gray)' }}>
                      {new Date(order.createdAt).toLocaleDateString(isAr ? 'ar-SA' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{
                      padding: '0.3rem 0.8rem', borderRadius: '999px', fontSize: '0.75rem',
                      background: `${statusColors[order.status]}20`,
                      color: statusColors[order.status],
                      border: `1px solid ${statusColors[order.status]}40`,
                    }}>
                      {t(`status.${order.status}`, { ns: 'common' })}
                    </div>
                    <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: 'var(--color-gold)' }}>
                      ${order.total.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {order.items.map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {item.image && (
                        <img src={item.image} alt="" style={{ width: '40px', height: '48px', objectFit: 'cover', borderRadius: '2px' }} />
                      )}
                      <div>
                        <p style={{ fontSize: '0.8rem', fontFamily: 'var(--font-serif)' }}>
                          {isAr ? item.productName?.ar : item.productName?.en}
                        </p>
                        <p style={{ fontSize: '0.7rem', color: 'var(--color-gray)' }}>{item.sizeMl}ml × {item.qty}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
