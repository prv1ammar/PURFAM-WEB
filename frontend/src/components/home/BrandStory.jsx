import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const MONO = { fontFamily: 'var(--font-mono)', letterSpacing: '0.22em', textTransform: 'uppercase' };

export default function BrandStory() {
  const { i18n } = useTranslation('pages');
  const isAr = i18n.language === 'ar';

  return (
    <section style={{ background: 'var(--charcoal)', color: 'var(--cream)', padding: '9rem 0', direction: isAr ? 'rtl' : 'ltr' }}>
      <div className="container-luxe">

        {/* Top label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: '3rem' }}
        >
          <span style={{ ...MONO, fontSize: '0.65rem', color: 'var(--terracotta)' }}>
            {isAr ? '— الدار / الدار البيضاء · 2024' : '— La Maison / Casablanca · 2024'}
          </span>
        </motion.div>

        {/* Quote */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '6rem', alignItems: 'center' }}
        >
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 5vw, 4rem)', lineHeight: 1.1, fontWeight: 300, letterSpacing: '-0.03em', color: 'var(--cream)', margin: 0 }}>
            {isAr ? (
              <>«العطر ليس شيئًا.<br /><span style={{ fontStyle: 'italic', color: 'var(--sand)' }}>إنه ذكرى تسبق الجسد.»</span></>
            ) : (
              <>«&nbsp;Le parfum n'est pas un objet.<br /><span style={{ fontStyle: 'italic', color: 'var(--sand)' }}>C'est un souvenir qui précède le corps.&nbsp;»</span></>
            )}
          </h2>
          <div>
            <img
              src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=700&q=80"
              alt={isAr ? 'الدار' : 'Atelier'}
              style={{ width: '100%', aspectRatio: '4/5', objectFit: 'cover', filter: 'brightness(0.75) saturate(0.8)' }}
            />
          </div>
        </motion.div>

        {/* 3 pillars */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          style={{ marginTop: '6rem', paddingTop: '4rem', borderTop: '1px solid rgba(245,240,232,0.14)', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4rem' }}
        >
          {[
            { n: '01', t: isAr ? 'في المتناول' : 'Accessible',   b: isAr ? 'من 40 درهمًا، دون التنازل عن الجودة.' : 'Dès 40 dirhams, sans renoncer à la tenue.' },
            { n: '02', t: isAr ? 'للتنقل'     : 'Nomade',        b: isAr ? '10 مل يغير المزاج كتغيير الجاكيت.' : 'Le 10 ml change d\'humeur comme on change de veste.' },
            { n: '03', t: isAr ? 'مختار بعناية': 'Curé',         b: isAr ? '130 عطرًا بعناية. فقط قطع المفضلة.' : '130 parfums à la main. Que des coups de cœur.' },
          ].map(item => (
            <div key={item.n}>
              <div style={{ ...MONO, fontSize: '0.65rem', color: 'var(--terracotta)', marginBottom: '1rem' }}>{item.n} · {item.t}</div>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.75, color: 'rgba(245,240,232,0.7)', fontFamily: 'var(--font-sans)' }}>{item.b}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
