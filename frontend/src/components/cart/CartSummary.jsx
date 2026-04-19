import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCart } from '@/context/CartContext';
import api from '@/services/api';

const inputStyle = {
  width: '100%', background: 'rgba(255,255,255,0.05)',
  border: '1px solid var(--color-border)', borderRadius: '8px',
  padding: '0.75rem 1rem', fontSize: '0.875rem',
  color: 'var(--color-white)', outline: 'none',
  boxSizing: 'border-box', transition: 'border-color 0.2s',
};

const labelStyle = {
  display: 'block', fontSize: '0.7rem', letterSpacing: '0.1em',
  textTransform: 'uppercase', color: 'var(--color-light-gray)',
  marginBottom: '0.4rem', fontWeight: 700,
};

export default function CartSummary({ onClose }) {
  const { t, i18n } = useTranslation();
  const { items, totalPrice, clearCart } = useCart();
  const lang = i18n.language;
  const isAr = lang === 'ar';

  const shipping = totalPrice > 500 ? 0 : 30;
  const total = totalPrice + shipping;

  const [step, setStep] = useState('summary');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '', address: '', email: '' });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = true;
    if (!form.lastName.trim()) e.lastName = true;
    if (!form.phone.trim()) e.phone = true;
    if (!form.address.trim()) e.address = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleConfirm = async () => {
    if (!validate()) return;
    setSubmitting(true);
    setSubmitError('');
    try {
      await api.post('/api/orders', {
        items: items.map(i => ({
          product: i.product?.id || i.product?._id || i.product,
          productName: i.product?.name || i.name,
          brand: i.product?.brand || i.brand,
          image: i.product?.images?.[0] || i.image,
          qty: i.qty,
          sizeMl: i.sizeMl || i.size_ml,
          priceAtPurchase: i.price,
        })),
        shippingAddress: {
          name: `${form.firstName} ${form.lastName}`,
          phone: form.phone,
          line1: form.address,
          city: '',
          country: 'Maroc',
        },
        paymentMethod: 'cash_on_delivery',
      });
      clearCart();
      setStep('success');
    } catch (err) {
      setSubmitError(isAr ? 'حدث خطأ، حاول مجدداً' : 'Une erreur est survenue, réessayez.');
    } finally {
      setSubmitting(false);
    }
  };

  if (step === 'success') {
    return (
      <div style={{ padding: '2.5rem 1.5rem', textAlign: 'center', borderTop: '1px solid var(--color-border)' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '1px solid var(--color-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: 'var(--color-gold)', fontSize: '1.1rem' }}>✓</div>
        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--color-gold)', marginBottom: '0.5rem' }}>
          {isAr ? 'تم استلام طلبك!' : lang === 'fr' ? 'Commande confirmée !' : 'Order Confirmed!'}
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-border)', lineHeight: 1.6 }}>
          {isAr
            ? 'سنتواصل معك قريباً لتأكيد التوصيل. شكراً لثقتك!'
            : lang === 'fr'
            ? 'Nous vous contacterons bientôt pour confirmer la livraison. Merci !'
            : 'We will contact you shortly to confirm delivery. Thank you!'}
        </p>
        <button onClick={onClose} style={{
          marginTop: '1.5rem', padding: '0.75rem 2rem',
          background: 'var(--color-gold)', color: '#000',
          fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.1em',
          textTransform: 'uppercase', border: 'none', borderRadius: '8px', cursor: 'pointer',
        }}>
          {isAr ? 'إغلاق' : lang === 'fr' ? 'Fermer' : 'Close'}
        </button>
      </div>
    );
  }

  if (step === 'form') {
    return (
      <div style={{ padding: '1.5rem', borderTop: '1px solid var(--color-border)' }}>
        <p style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-gold)', fontWeight: 700, marginBottom: '1rem' }}>
          {isAr ? 'معلومات التوصيل' : lang === 'fr' ? 'Informations de livraison' : 'Delivery information'}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <div>
            <label style={labelStyle}>{isAr ? '\u0627\u0644\u0627\u0633\u0645 \u0627\u0644\u0623\u0648\u0644' : 'Pr\u00e9nom'} *</label>
            <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="Ahmed"
              style={{ ...inputStyle, borderColor: errors.firstName ? '#f87171' : 'var(--color-border)' }} />
          </div>
          <div>
            <label style={labelStyle}>{isAr ? '\u0627\u0644\u0644\u0642\u0628' : 'Nom'} *</label>
            <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Ben Ali"
              style={{ ...inputStyle, borderColor: errors.lastName ? '#f87171' : 'var(--color-border)' }} />
          </div>
        </div>
        <div style={{ marginBottom: '0.75rem' }}>
          <label style={labelStyle}>{isAr ? '\u0647\u0627\u062a\u0641 \u0648\u0627\u062a\u0633\u0627\u0628' : 'T\u00e9l\u00e9phone WhatsApp'} *</label>
          <input name="phone" value={form.phone} onChange={handleChange} placeholder="06 XX XX XX XX"
            style={{ ...inputStyle, borderColor: errors.phone ? '#f87171' : 'var(--color-border)' }} />
        </div>
        <div style={{ marginBottom: '0.75rem' }}>
          <label style={labelStyle}>{isAr ? '\u0627\u0644\u0628\u0631\u064a\u062f \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a (\u0627\u062e\u062a\u064a\u0627\u0631\u064a)' : 'Email (Optionnel)'}</label>
          <input name="email" value={form.email} onChange={handleChange} placeholder="votre@email.com" style={inputStyle} />
        </div>
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={labelStyle}>{isAr ? '\u0639\u0646\u0648\u0627\u0646 \u0627\u0644\u062a\u0648\u0635\u064a\u0644' : 'Adresse de livraison'} *</label>
          <textarea name="address" value={form.address} onChange={handleChange} rows={3}
            placeholder={isAr ? '\u0627\u0644\u0645\u062f\u064a\u0646\u0629\u060c \u0627\u0644\u062d\u064a\u060c \u0627\u0644\u0634\u0627\u0631\u0639...' : 'Ville, Quartier, Rue, N\u00b0 App...'}
            style={{ ...inputStyle, resize: 'none', borderColor: errors.address ? '#f87171' : 'var(--color-border)' }} />
        </div>
        {submitError && (
          <p style={{ color: '#f87171', fontSize: '0.8rem', marginBottom: '0.75rem', textAlign: 'center' }}>{submitError}</p>
        )}
        <button onClick={handleConfirm} disabled={submitting} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
          width: '100%', padding: '1rem', background: submitting ? 'var(--color-border)' : 'var(--color-gold)',
          color: '#000', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase',
          border: 'none', borderRadius: '8px', cursor: submitting ? 'not-allowed' : 'pointer',
        }}>
          {submitting
            ? (isAr ? 'جاري الإرسال...' : lang === 'fr' ? 'Envoi en cours...' : 'Processing...')
            : (isAr ? `تأكيد الطلب — ${total.toFixed(2)} دهـ` : lang === 'fr' ? `Confirmer la commande — ${total.toFixed(2)} dh` : `Confirm Order — ${total.toFixed(2)} dh`)}
        </button>
        <button onClick={() => setStep('summary')} style={{
          display: 'block', width: '100%', marginTop: '0.75rem', padding: '0.6rem',
          background: 'transparent', border: '1px solid var(--color-border)',
          color: 'var(--color-light-gray)', fontSize: '0.8rem', borderRadius: '8px', cursor: 'pointer',
        }}>
          ← {isAr ? 'رجوع' : lang === 'fr' ? 'Retour' : 'Back'}
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '1.5rem', borderTop: '1px solid var(--color-border)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--color-light-gray)', fontSize: '0.9rem' }}>{t('labels.subtotal')}</span>
          <span>{totalPrice.toFixed(2)} dh</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--color-light-gray)', fontSize: '0.9rem' }}>{t('labels.shipping')}</span>
          <span style={{ color: shipping === 0 ? 'var(--color-gold)' : 'inherit' }}>
            {shipping === 0 ? t('labels.free') : `${shipping} dh`}
          </span>
        </div>
        <div style={{
          display: 'flex', justifyContent: 'space-between', paddingTop: '0.6rem',
          borderTop: '1px solid var(--color-border)', fontFamily: 'var(--font-serif)', fontSize: '1.2rem',
        }}>
          <span>{t('labels.total')}</span>
          <span style={{ color: 'var(--color-gold)' }}>{total.toFixed(2)} dh</span>
        </div>
      </div>

      <button onClick={() => setStep('form')} style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
        width: '100%', padding: '1rem', background: 'var(--color-gold)', color: '#000',
        fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase',
        border: 'none', borderRadius: '8px', cursor: 'pointer',
      }}>
        {isAr ? 'إتمام الطلب' : lang === 'fr' ? 'Passer la commande' : 'Place Order'}
      </button>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginTop: '0.75rem', opacity: 0.4 }}>
        <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-light-gray)' }}>
          {isAr ? 'الدفع عند الاستلام' : lang === 'fr' ? 'Paiement à la livraison' : 'Cash on delivery'}
        </p>
      </div>
    </div>
  );
}
