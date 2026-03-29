import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function NotFoundPage() {
  const { t, i18n } = useTranslation('pages');
  const isAr = i18n.language === 'ar';

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="page-wrapper"
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '80vh', textAlign: 'center', padding: '2rem',
        direction: isAr ? 'rtl' : 'ltr',
      }}>
      <div>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(5rem, 15vw, 10rem)', color: 'var(--color-gold)', lineHeight: 1, opacity: 0.4, marginBottom: '1rem' }}>
          {t('notFound.title')}
        </p>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', marginBottom: '1rem' }}>
          {t('notFound.subtitle')}
        </h2>
        <p style={{ color: 'var(--color-gray)', marginBottom: '2rem' }}>{t('notFound.text')}</p>
        <Link to="/" style={{
          display: 'inline-block', padding: '0.9rem 2.5rem',
          border: '1px solid var(--color-gold)', color: 'var(--color-gold)',
          fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase',
          transition: 'all 0.2s',
        }}
          onMouseOver={e => { e.target.style.background = 'var(--color-gold)'; e.target.style.color = 'var(--color-black)'; }}
          onMouseOut={e => { e.target.style.background = 'transparent'; e.target.style.color = 'var(--color-gold)'; }}>
          {t('notFound.back')}
        </Link>
      </div>
    </motion.div>
  );
}
