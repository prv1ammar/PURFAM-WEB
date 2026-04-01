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
    <section className="section-padding bg-theme border-t border-theme-10">
      <div className="container-luxe max-w-md text-center">
        <ScrollReveal direction="scale" duration={0.8}>
          <div className="w-10 h-[1px] bg-gold mx-auto mb-6" />
          <h2 className="text-3xl font-serif text-theme-90 mb-4 font-light">
            {t('home.newsletterTitle')}
          </h2>
          <p className="text-theme-60 mb-8 font-light leading-relaxed">
            {t('home.newsletterSubtitle')}
          </p>

          {submitted ? (
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-gold font-serif text-xl">
              {t('success.subscribed', { ns: 'common' })}
            </motion.p>
          ) : (
            <form onSubmit={handleSubmit} className="flex max-w-md mx-auto" style={{ gap: '0.5rem' }}>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder={t('home.newsletterPlaceholder')}
                required
                className={`text-theme-90 text-sm outline-none transition-all focus:border-gold`}
                style={{ flex: 1, padding: '1rem 1.5rem', backgroundColor: 'rgba(var(--text-rgb), 0.05)', border: '1px solid rgba(var(--text-rgb), 0.1)', borderRadius: 'var(--radius-full)' }}
              />
              <button type="submit" className={`bg-gold text-black text-xs tracking-widest uppercase font-bold transition-all hover:bg-gold-light`}
                style={{ padding: '1rem 2rem', border: 'none', cursor: 'pointer', borderRadius: 'var(--radius-full)', boxShadow: 'var(--shadow-luxe)' }}>
                {t('btn.subscribe', { ns: 'common' })}
              </button>
            </form>
          )}
        </ScrollReveal>
      </div>
    </section>
  );
}
