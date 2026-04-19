import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const MONO = { fontFamily: 'var(--font-mono)', letterSpacing: '0.22em', textTransform: 'uppercase' };

export default function NewsletterSection() {
  const { i18n } = useTranslation('pages');
  const lang = i18n.language;
  const isAr = lang === 'ar';
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) { setSubmitted(true); setEmail(''); }
  };

  return (
    <section style={{ background: 'var(--terracotta)', color: 'var(--paper)', padding: '8rem 0', direction: isAr ? 'rtl' : 'ltr' }}>
      <div className="container-luxe">
        <div className="newsletter-grid" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '6rem', alignItems: 'center' }}>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span style={{ ...MONO, fontSize: '0.65rem', opacity: 0.75, display: 'block', marginBottom: '1.5rem' }}>
              {isAr ? '— النشرة البريدية' : lang === 'fr' ? '— Le Cercle' : '— The Circle'}
            </span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 300, lineHeight: 0.98, letterSpacing: '-0.03em', margin: 0, color: 'var(--paper)' }}>
              {isAr ? (
                <>ثلاثة <span style={{ fontStyle: 'italic' }}>عينات.</span><br />فلكون مجانًا.</>
              ) : lang === 'fr' ? (
                <>Trois <span style={{ fontStyle: 'italic' }}>essais</span>.<br />Un flacon offert.</>
              ) : (
                <>Three <span style={{ fontStyle: 'italic' }}>samples</span>.<br />One bottle, free.</>
              )}
            </h2>
            <p style={{ marginTop: '1.5rem', fontSize: '1rem', lineHeight: 1.7, opacity: 0.9, fontFamily: 'var(--font-sans)', maxWidth: '420px' }}>
              {isAr
                ? 'احصل على ثلاثة عينات مختارة بحسب ملفك الشمي. إذا أعجبك أحدها، الفلكون 10 مل مجاني.'
                : lang === 'fr'
                ? 'Recevez trois échantillons choisis selon votre profil olfactif. Si l\'un vous plaît, le flacon 10 ml est offert.'
                : 'Receive three samples chosen for your scent profile. If you love one, the 10 ml bottle is yours — free.'}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            {submitted ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 300, fontStyle: 'italic', color: 'var(--paper)' }}>
                  {isAr ? 'شكرًا! سنتواصل معك قريبًا.' : lang === 'fr' ? 'Merci ! On revient vers vous très vite.' : 'Thank you! We\'ll be in touch very soon.'}
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder={isAr ? 'بريدك الإلكتروني' : lang === 'fr' ? 'Votre email' : 'Your email'}
                  required
                  style={{
                    width: '100%', padding: '1rem 1.25rem',
                    background: 'rgba(250,247,242,0.12)', border: '1px solid rgba(250,247,242,0.3)',
                    color: 'var(--paper)', fontFamily: 'var(--font-sans)', fontSize: '0.95rem', outline: 'none',
                  }}
                  onFocus={e => e.target.style.borderColor = 'rgba(250,247,242,0.7)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(250,247,242,0.3)'}
                />
                <button type="submit" style={{
                  padding: '1rem', background: 'var(--paper)', color: 'var(--charcoal)',
                  border: 'none', cursor: 'pointer',
                  ...MONO, fontSize: '0.65rem',
                }}
                  onMouseOver={e => { e.currentTarget.style.background = 'var(--charcoal)'; e.currentTarget.style.color = 'var(--cream)'; }}
                  onMouseOut={e => { e.currentTarget.style.background = 'var(--paper)'; e.currentTarget.style.color = 'var(--charcoal)'; }}
                >
                  {isAr ? 'انضم إلى الدائرة ←' : lang === 'fr' ? 'Composer ma box →' : 'Compose my box →'}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>

    </section>
  );
}
