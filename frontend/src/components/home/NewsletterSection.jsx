import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function NewsletterSection() {
  const { t, i18n } = useTranslation('pages');
  const isAr = i18n.language === 'ar';
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail('');
    }
  };

  return (
    <section style={{
      padding: '6rem 1.5rem',
      background: `linear-gradient(135deg, var(--color-dark) 0%, #1a150a 100%)`,
      borderTop: '1px solid var(--color-border)',
    }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', direction: isAr ? 'rtl' : 'ltr' }}>
        <ScrollReveal direction="scale" duration={0.8}>
          <div style={{
            width: '40px', height: '1px', background: 'var(--color-gold)',
            margin: '0 auto 1.5rem',
          }} />
          <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', marginBottom: '1rem' }}>
            {t('home.newsletterTitle')}
          </h2>
          <p style={{ color: 'var(--color-gray)', marginBottom: '2rem' }}>
            {t('home.newsletterSubtitle')}
          </p>

          {submitted ? (
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ color: 'var(--color-gold)', fontFamily: 'var(--font-serif)', fontSize: '1.2rem' }}>
              {t('success.subscribed', { ns: 'common' })}
            </motion.p>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0', maxWidth: '400px', margin: '0 auto' }}>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder={t('home.newsletterPlaceholder')}
                required
                style={{
                  flex: 1, padding: '0.9rem 1rem', background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--color-border)', borderRight: 'none',
                  color: 'var(--color-off-white)', fontSize: '0.9rem',
                  outline: 'none',
                  direction: isAr ? 'rtl' : 'ltr',
                  borderRadius: isAr ? '0 var(--radius-sm) var(--radius-sm) 0' : 'var(--radius-sm) 0 0 var(--radius-sm)',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--color-gold)'}
                onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
              />
              <button type="submit" style={{
                padding: '0.9rem 1.5rem', background: 'var(--color-gold)',
                color: 'var(--color-black)', fontSize: '0.75rem',
                letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700,
                borderRadius: isAr ? 'var(--radius-sm) 0 0 var(--radius-sm)' : '0 var(--radius-sm) var(--radius-sm) 0',
                whiteSpace: 'nowrap',
              }}>
                {t('btn.subscribe', { ns: 'common' })}
              </button>
            </form>
          )}
        </ScrollReveal>
      </div>
    </section>
  );
}
