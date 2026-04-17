import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useCart } from '@/context/CartContext';
import CartItem from '@/components/cart/CartItem';

const MONO = { fontFamily: 'var(--font-mono)', letterSpacing: '0.22em', textTransform: 'uppercase' };

export default function CartPage() {
  const { t, i18n } = useTranslation();
  const { items, totalPrice } = useCart();
  const isAr = i18n.language === 'ar';
  const shipping = totalPrice > 200 ? 0 : 15;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ background: 'var(--cream)', minHeight: '100vh', paddingTop: 'var(--navbar-height)', direction: isAr ? 'rtl' : 'ltr' }}>

      <section style={{ padding: '4rem 0 2rem' }}>
        <div className="container-luxe">
          <span style={{ ...MONO, fontSize: '0.65rem', color: 'var(--terracotta)', display: 'block', marginBottom: '1rem' }}>
            {isAr ? `— سلتك · ${items.length} منتجات` : `— Votre panier · ${items.length} articles`}
          </span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: 300, lineHeight: 0.9, letterSpacing: '-0.04em', color: 'var(--charcoal)', margin: 0 }}>
            {isAr ? (<>السلة <span style={{ fontStyle: 'italic' }}>الخاصة.</span></>) : (<>Le <span style={{ fontStyle: 'italic' }}>panier.</span></>)}
          </h1>
        </div>
      </section>

      <section style={{ padding: '2rem 0 7rem' }}>
        <div className="container-luxe">
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '6rem 0' }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '5rem', fontWeight: 200, color: 'var(--sand)', marginBottom: '1.5rem', lineHeight: 1 }}>∅</div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 300, marginBottom: '2rem', color: 'var(--graphite)' }}>
                {isAr ? 'سلتك فارغة' : 'Votre panier est vide'}
              </h2>
              <Link to="/shop" style={{ display: 'inline-block', padding: '1rem 2.5rem', background: 'var(--charcoal)', color: 'var(--cream)', ...MONO, fontSize: '0.65rem' }}
                onMouseOver={e => { e.currentTarget.style.background = 'var(--terracotta)'; }}
                onMouseOut={e => { e.currentTarget.style.background = 'var(--charcoal)'; }}>
                {isAr ? 'تصفح العطور ←' : 'Découvrir les parfums →'}
              </Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '4rem', alignItems: 'start' }}>
              {/* Items */}
              <div>
                <div style={{ borderTop: '1px solid var(--charcoal)', borderBottom: '1px solid var(--line)', padding: '0.75rem 0', display: 'grid', gridTemplateColumns: '80px 1fr 100px 100px 40px', gap: '1.5rem', ...MONO, fontSize: '0.58rem', color: 'var(--graphite)' }}>
                  <span>{isAr ? 'المنتج' : 'Produit'}</span><span></span>
                  <span>{isAr ? 'الكمية' : 'Quantité'}</span>
                  <span style={{ textAlign: 'right' }}>{isAr ? 'السعر' : 'Prix'}</span>
                  <span></span>
                </div>
                {items.map(item => <CartItem key={item.id || item._id} item={item} />)}
              </div>

              {/* Summary */}
              <div style={{ position: 'sticky', top: 'calc(var(--navbar-height) + 1rem)' }}>
                <div style={{ padding: '2.25rem', background: 'var(--charcoal)', color: 'var(--cream)' }}>
                  <span style={{ ...MONO, fontSize: '0.65rem', color: 'var(--terracotta)', display: 'block', marginBottom: '2rem' }}>
                    {isAr ? '— ملخص الطلب' : '— Récapitulatif'}
                  </span>
                  {[
                    [isAr ? 'المجموع الفرعي' : 'Sous-total',  `${totalPrice.toFixed(2)} dh`],
                    [isAr ? 'التوصيل' : 'Livraison', shipping === 0 ? (isAr ? 'مجاني' : 'Offerte') : `${shipping} dh`],
                  ].map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', fontSize: '0.9rem', opacity: 0.8, borderBottom: '1px solid rgba(245,240,232,0.1)' }}>
                      <span>{k}</span><span>{v}</span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: '1.25rem', marginTop: '0.25rem' }}>
                    <span style={{ ...MONO, fontSize: '0.65rem' }}>{isAr ? 'الإجمالي' : 'Total'}</span>
                    <span style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', fontWeight: 300 }}>{(totalPrice + shipping).toFixed(2)} dh</span>
                  </div>
                  {shipping > 0 && (
                    <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(184,92,58,0.15)', ...MONO, fontSize: '0.58rem', color: 'var(--terracotta)' }}>
                      {isAr ? `${400 - totalPrice} درهم تبقى للشحن المجاني` : `Plus que ${(400 - totalPrice).toFixed(0)} dh pour la livraison offerte`}
                    </div>
                  )}
                  <Link to="/checkout" style={{ display: 'block', marginTop: '1.75rem', padding: '1rem', textAlign: 'center', background: 'var(--terracotta)', color: 'var(--paper)', ...MONO, fontSize: '0.65rem' }}
                    onMouseOver={e => { e.currentTarget.style.background = 'var(--terracotta-deep)'; }}
                    onMouseOut={e => { e.currentTarget.style.background = 'var(--terracotta)'; }}>
                    {isAr ? 'إتمام الطلب ←' : 'Passer commande →'}
                  </Link>
                  <p style={{ marginTop: '1rem', textAlign: 'center', ...MONO, fontSize: '0.55rem', opacity: 0.5 }}>
                    {isAr ? 'دفع آمن · الدفع عند الاستلام' : 'Sécurisé · Paiement à la livraison'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <style>{`@media(max-width:900px){.cart-grid{grid-template-columns:1fr!important}}`}</style>
    </motion.div>
  );
}
