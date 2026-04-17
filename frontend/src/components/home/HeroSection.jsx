import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const MONO = { fontFamily: 'var(--font-mono)', letterSpacing: '0.22em', textTransform: 'uppercase' };

export default function HeroSection() {
  const { i18n } = useTranslation('pages');
  const isAr = i18n.language === 'ar';
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '28%']);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={sectionRef} style={{ position: 'relative', height: '100vh', minHeight: '700px', overflow: 'hidden', background: '#0a0806', direction: isAr ? 'rtl' : 'ltr' }}>

      {/* ── Parallax video ── */}
      <motion.div style={{ y, position: 'absolute', inset: 0 }}>
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: 'linear-gradient(to bottom, rgba(10,8,6,0.22) 0%, rgba(10,8,6,0.08) 40%, rgba(10,8,6,0.72) 100%)',
        }} />
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'radial-gradient(ellipse at center, transparent 38%, rgba(10,8,6,0.55) 100%)' }} />
        <video
          src="/hero-video.mp4"
          autoPlay loop muted playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.68) saturate(0.9) contrast(1.05)' }}
        />
      </motion.div>

      {/* ── Hero content ── */}
      <motion.div
        style={{ opacity, position: 'absolute', inset: 0, zIndex: 2, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '0 3rem 6rem' }}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Meta line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 1.2 }}
          style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3rem', ...MONO, fontSize: '0.62rem', color: 'rgba(245,240,232,0.5)' }}
        >
          <span>{isAr ? 'إصدار رقم 04 · ربيع 2026' : 'Édition N°04 · P/É 2026'}</span>
          <span>{isAr ? 'الدار البيضاء · الصويرة' : 'Casablanca · Essaouira'}</span>
          <span>{isAr ? '130 عطر · 10 مل' : '130 fragrances · 10 ml'}</span>
        </motion.div>

        {/* Main title */}
        <h1 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(4rem, 14vw, 11rem)',
          fontWeight: 200,
          lineHeight: 0.88,
          letterSpacing: '-0.04em',
          color: '#faf7f2',
          margin: '0 0 2.5rem',
        }}>
          {isAr ? (
            <>فن<br /><span style={{ fontStyle: 'italic', color: 'var(--terracotta)' }}>الأثر.</span></>
          ) : (
            <>L'art<br /><span style={{ fontStyle: 'italic', fontWeight: 200, color: 'var(--terracotta)' }}>du sillage.</span></>
          )}
        </h1>

        {/* Subtitle + CTA row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'end' }}>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'rgba(245,240,232,0.75)', fontFamily: 'var(--font-sans)', fontWeight: 300, maxWidth: '420px' }}>
            {isAr
              ? 'مجموعة سرية من 130 عطرًا مستوحى من أرقى دور العطور العالمية، معبأة في 10 مل.'
              : 'Une sélection confidentielle de 130 fragrances d\'inspiration haute parfumerie, reconditionnées en format 10 ml.'}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '260px', marginLeft: isAr ? 0 : 'auto', marginRight: isAr ? 'auto' : 0 }}>
            <Link to="/shop" style={{
              display: 'block', textAlign: 'center', padding: '1rem 2rem',
              background: '#faf7f2', color: '#1a1918',
              ...MONO, fontSize: '0.62rem',
            }}>
              {isAr ? 'اكتشف 130 عطرًا ←' : 'Découvrir les 130 →'}
            </Link>
            <Link to="/about" style={{
              display: 'block', textAlign: 'center', padding: '1rem 2rem',
              border: '1px solid rgba(245,240,232,0.3)', color: 'rgba(245,240,232,0.75)',
              ...MONO, fontSize: '0.62rem',
            }}>
              {isAr ? 'قصتنا' : 'Notre histoire'}
            </Link>
          </div>
        </div>
      </motion.div>

      {/* ── Scroll indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        style={{ position: 'absolute', bottom: '2.5rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', zIndex: 3 }}
      >
        <span style={{ ...MONO, fontSize: '0.58rem', color: 'rgba(245,240,232,0.35)' }}>SCROLL</span>
        <motion.div
          animate={{ scaleY: [1, 0.3, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ width: '1px', height: '40px', background: 'linear-gradient(to bottom, rgba(184,92,58,0.8), transparent)', transformOrigin: 'top' }}
        />
      </motion.div>
    </section>
  );
}
