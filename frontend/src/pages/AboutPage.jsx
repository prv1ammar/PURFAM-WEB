import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function AboutPage() {
  const { t, i18n } = useTranslation('pages');
  const isAr = i18n.language === 'ar';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="page-wrapper">
      {/* Hero */}
      <div style={{
        height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: `linear-gradient(to bottom, rgba(10,10,10,0.3), var(--color-black)),
                     url(https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=1600&q=80) center/cover`,
        textAlign: 'center',
      }}>
        <div>
          <p className="section-subtitle">{isAr ? 'لوكس إيسنس' : 'LUXE ESSENCE'}</p>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: 'clamp(2rem, 6vw, 4rem)' }}>
            {t('about.heroTitle')}
          </h1>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '5rem 1.5rem', direction: isAr ? 'rtl' : 'ltr' }}>
        {/* Mission */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ marginBottom: '4rem', textAlign: 'center' }}>
          <p className="section-subtitle">{t('about.missionTitle')}</p>
          <p style={{ fontSize: '1.15rem', lineHeight: 1.9, color: 'var(--color-light-gray)', maxWidth: '700px', margin: '0 auto' }}>
            {t('about.missionText')}
          </p>
        </motion.div>

        <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, var(--color-gold), transparent)', marginBottom: '4rem' }} />

        {/* Values */}
        <div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, textAlign: 'center', marginBottom: '3rem', fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>
            {t('about.valuesTitle')}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
            {[1, 2, 3].map(n => (
              <motion.div key={n}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: (n - 1) * 0.1 }}
                style={{
                  background: 'var(--color-charcoal)', border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)', padding: '2rem', textAlign: 'center',
                }}>
                <div style={{
                  width: '50px', height: '50px', borderRadius: '50%',
                  border: '1px solid var(--color-gold)', margin: '0 auto 1.25rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--color-gold)', fontSize: '1.2rem',
                }}>
                  {['✦', '◈', '✿'][n - 1]}
                </div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, marginBottom: '0.75rem', color: 'var(--color-gold)' }}>
                  {t(`about.value${n}Title`)}
                </h3>
                <p style={{ color: 'var(--color-gray)', fontSize: '0.9rem', lineHeight: 1.7 }}>
                  {t(`about.value${n}Text`)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns: repeat(3, 1fr)"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </motion.div>
  );
}
