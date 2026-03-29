import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function ContactPage() {
  const { t, i18n } = useTranslation('pages');
  const isAr = i18n.language === 'ar';
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  const inputStyle = {
    width: '100%', padding: '0.8rem 1rem',
    background: 'var(--color-charcoal)', border: '1px solid var(--color-border)',
    color: 'var(--color-off-white)', borderRadius: 'var(--radius-sm)',
    fontSize: '0.95rem', outline: 'none',
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="page-wrapper">
      {/* Hero */}
      <div style={{
        height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
        background: 'linear-gradient(to bottom, var(--color-charcoal), var(--color-black))',
        borderBottom: '1px solid var(--color-border)',
      }}>
        <div>
          <p className="section-subtitle">{isAr ? 'تواصل معنا' : 'GET IN TOUCH'}</p>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
            {t('contact.heroTitle')}
          </h1>
        </div>
      </div>

      <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: '4rem 1.5rem', direction: isAr ? 'rtl' : 'ltr' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }}>
          {/* Form */}
          <div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: '1.8rem', marginBottom: '2rem' }}>
              {t('contact.subtitle')}
            </h2>
            {sent ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                style={{ padding: '2rem', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✉️</p>
                <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--color-gold)' }}>
                  {t('success.messageSent', { ns: 'common' })}
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {[
                  { key: 'name', label: t('contact.name') },
                  { key: 'email', label: t('contact.email'), type: 'email' },
                  { key: 'subject', label: t('contact.subject') },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ display: 'block', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-gray)', marginBottom: '0.4rem' }}>
                      {f.label}
                    </label>
                    <input type={f.type || 'text'} value={form[f.key]} required
                      onChange={e => setForm(v => ({ ...v, [f.key]: e.target.value }))}
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = 'var(--color-gold)'}
                      onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
                    />
                  </div>
                ))}
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-gray)', marginBottom: '0.4rem' }}>
                    {t('contact.message')}
                  </label>
                  <textarea value={form.message} required rows={5}
                    onChange={e => setForm(v => ({ ...v, message: e.target.value }))}
                    placeholder={t('contact.messagePlaceholder')}
                    style={{ ...inputStyle, resize: 'vertical' }}
                    onFocus={e => e.target.style.borderColor = 'var(--color-gold)'}
                    onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
                  />
                </div>
                <button type="submit" style={{
                  padding: '0.9rem', background: 'var(--color-gold)',
                  color: 'var(--color-black)', fontFamily: 'var(--font-sans)',
                  fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700,
                  borderRadius: 'var(--radius-sm)',
                }}>
                  {t('btn.send', { ns: 'common' })}
                </button>
              </form>
            )}
          </div>

          {/* Info */}
          <div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: '1.8rem', marginBottom: '2rem' }}>
              {t('contact.infoTitle')}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {[
                { icon: '📍', label: t('contact.addressLabel'), val: t('contact.addressValue') },
                { icon: '📞', label: t('contact.phoneLabel'), val: '+971 4 000 0000' },
                { icon: '✉️', label: t('contact.emailLabel'), val: 'hello@luxeessence.com' },
                { icon: '🕐', label: t('contact.hoursLabel'), val: t('contact.hoursValue') },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <span style={{
                    fontSize: '1.2rem', width: '40px', height: '40px',
                    background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)',
                    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>{item.icon}</span>
                  <div>
                    <p style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: '0.25rem' }}>
                      {item.label}
                    </p>
                    <p style={{ color: 'var(--color-light-gray)' }}>{item.val}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </motion.div>
  );
}
