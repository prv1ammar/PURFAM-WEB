import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function HeroSection() {
  const { t, i18n } = useTranslation('pages');
  const isAr = i18n.language === 'ar';
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  return (
    <section ref={sectionRef} className="relative h-screen min-h-[700px] overflow-hidden flex items-center justify-center bg-black">

      {/* ── Video Background with Parallax & Scale ── */}
      <motion.div
        style={{ y, scale }}
        className="absolute inset-0 z-0"
      >
        {/* Cinematic gradient overlays */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background: `
              linear-gradient(to bottom,
                rgba(0,0,0,0.25) 0%,
                rgba(0,0,0,0.10) 40%,
                rgba(0,0,0,0.65) 100%
              )
            `,
          }}
        />
        {/* Vignette for depth */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)',
          }}
        />

        {/* Looping hero video */}
        <video
          ref={videoRef}
          src="/hero-video.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          style={{ filter: 'brightness(0.72) contrast(1.08) saturate(0.95)' }}
        />
      </motion.div>

      {/* ── Floating Content ── */}
      <motion.div
        style={{ opacity }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-20 text-center px-6 max-w-5xl"
      >
        <motion.span
          initial={{ opacity: 0, letterSpacing: '0.2em' }}
          animate={{ opacity: 1, letterSpacing: '0.35em' }}
          transition={{ duration: 2, delay: 0.3, ease: 'easeOut' }}
          className="text-gold uppercase text-xs mb-6 block font-sans font-medium"
        >
          {isAr ? 'جوهر الفخامة' : 'The Essence of Luxury'}
        </motion.span>

        <h1 className="text-white mb-8" style={{ lineHeight: '1.1' }}>
          <span className="block italic font-light opacity-80 text-2xl md:text-4xl tracking-widest mb-2" style={{ textTransform: 'capitalize' }}>
            {t('home.heroTitle')}
          </span>
          <span className="text-gold font-bold block text-5xl md:text-8xl tracking-tight" style={{ textShadow: '0 0 30px rgba(212, 175, 55, 0.3)' }}>
            {t('home.heroTitleAccent')}
          </span>
        </h1>

        <div className="w-24 h-[1px] mx-auto mb-10" style={{ background: 'linear-gradient(to right, transparent, var(--color-gold), transparent)' }} />

        <p className="text-white-80 text-xl md:text-2xl max-w-3xl mx-auto mb-12 font-light leading-relaxed tracking-wide">
          {t('home.heroSubtitle')}
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Link to="/shop" className="btn-luxe w-full sm:w-auto text-center">
            {t('btn.shopNow', { ns: 'common' })}
          </Link>
          <Link
            to="/about"
            className="text-white-80 hover:text-white tracking-widest text-xs uppercase border-b border-white-20 pb-1 transition-all duration-300"
          >
            {t('btn.discover', { ns: 'common' })}
          </Link>
        </div>
      </motion.div>

      {/* ── Scroll Indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1.2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-20"
      >
        <span className="text-xs tracking-widest uppercase text-white-40">
          {isAr ? 'مرر' : 'SCROLL'}
        </span>
        <motion.div
          animate={{ scaleY: [1, 0.4, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-[1px] h-12 origin-top"
          style={{ background: 'linear-gradient(to bottom, var(--color-gold), transparent)' }}
        />
      </motion.div>

    </section>
  );
}
