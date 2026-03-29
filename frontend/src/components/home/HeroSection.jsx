import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const VIDEO_SRC = '/hero-video.mp4';   // downloaded to public/hero-video.mp4
const POSTER = 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=1920&q=85&auto=format&fit=crop';

export default function HeroSection() {
  const { t, i18n } = useTranslation('pages');
  const isAr = i18n.language === 'ar';
  const sectionRef = useRef(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const contentY  = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);
  const bgScale   = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const darkening = useTransform(scrollYProgress, [0, 0.8], [0, 0.42]);

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.22 } },
  };
  const itemVariants = {
    hidden:   { opacity: 0, y: 50 },
    visible:  { opacity: 1, y: 0, transition: { duration: 0.95, ease: [0.25, 0.1, 0.25, 1] } },
  };

  return (
    <>
      <style>{`
        /* ── Ken Burns on the hero image ── */
        @keyframes heroPan {
          0%   { transform: scale(1.0)  translate(0%,    0%);   }
          25%  { transform: scale(1.06) translate(-1.2%, -0.8%);}
          50%  { transform: scale(1.1)  translate(1%,    -1%);  }
          75%  { transform: scale(1.07) translate(-0.5%, 0.8%); }
          100% { transform: scale(1.0)  translate(0%,    0%);   }
        }

        /* ── Animated liquid-gold shimmer blobs ── */
        @keyframes blob1 {
          0%,100% { transform: translate(0%, 0%)   scale(1);   }
          33%     { transform: translate(8%, -12%) scale(1.15); }
          66%     { transform: translate(-6%, 8%)  scale(0.9); }
        }
        @keyframes blob2 {
          0%,100% { transform: translate(0%, 0%)    scale(1);   }
          33%     { transform: translate(-10%, 10%) scale(1.2); }
          66%     { transform: translate(7%,  -8%)  scale(0.85);}
        }
        @keyframes blob3 {
          0%,100% { transform: translate(0%, 0%)   scale(1);   }
          50%     { transform: translate(5%,  12%) scale(1.1); }
        }

        /* ── Rising particles ── */
        @keyframes riseParticle {
          0%   { transform: translateY(0)   scale(1);   opacity: 0; }
          10%  { opacity: 0.7; }
          90%  { opacity: 0.3; }
          100% { transform: translateY(-110vh) scale(0.3); opacity: 0; }
        }

        /* ── Gold scan line ── */
        @keyframes scanLine {
          0%   { top: 100%; opacity: 0; }
          5%   { opacity: 0.6; }
          95%  { opacity: 0.2; }
          100% { top: -5%;   opacity: 0; }
        }

        .hero-bg-img {
          position: absolute; inset: -6%;
          background-size: cover; background-position: center;
          animation: heroPan 28s ease-in-out infinite;
          will-change: transform;
        }

        .hero-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          mix-blend-mode: screen;
          pointer-events: none;
        }

        .hero-particle {
          position: absolute; bottom: -10px;
          border-radius: 50%; pointer-events: none;
          animation: riseParticle linear infinite;
        }

        .hero-scanline {
          position: absolute; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent 0%, rgba(201,168,76,0.6) 30%, rgba(255,220,100,0.9) 50%, rgba(201,168,76,0.6) 70%, transparent 100%);
          animation: scanLine 8s ease-in-out infinite;
          pointer-events: none;
        }
      `}</style>

      <section ref={sectionRef} style={{
        position: 'relative', height: '100vh', minHeight: '640px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden', background: '#050403',
      }}>

        {/* ── Layer 1: Ken Burns poster (shows while video loads) ── */}
        <motion.div style={{ scale: bgScale, position: 'absolute', inset: 0 }}>
          <div
            className="hero-bg-img"
            style={{
              backgroundImage: `url(${POSTER})`,
              filter: `brightness(${videoLoaded ? 0 : 0.35}) saturate(1.3) contrast(1.1)`,
              transition: 'filter 1.5s ease',
            }}
          />

          {/* ── Real perfume video (fades in once loaded) ── */}
          <video
            autoPlay muted loop playsInline
            onCanPlay={() => setVideoLoaded(true)}
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover',
              filter: 'brightness(0.38) saturate(1.25) contrast(1.05)',
              opacity: videoLoaded ? 1 : 0,
              transition: 'opacity 1.5s ease',
            }}
          >
            <source src={VIDEO_SRC} type="video/mp4" />
          </video>
        </motion.div>

        {/* ── Layer 2: Animated gold liquid blobs (hidden once video loads) ── */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', opacity: videoLoaded ? 0 : 1, transition: 'opacity 2s ease' }}>
          <div className="hero-blob" style={{
            width: '55vw', height: '55vw',
            top: '-15%', left: '-10%',
            background: 'radial-gradient(circle, rgba(201,140,20,0.18) 0%, rgba(160,100,10,0.08) 60%, transparent 100%)',
            animation: 'blob1 18s ease-in-out infinite',
          }} />
          <div className="hero-blob" style={{
            width: '60vw', height: '60vw',
            bottom: '-20%', right: '-12%',
            background: 'radial-gradient(circle, rgba(180,120,15,0.16) 0%, rgba(140,90,8,0.07) 60%, transparent 100%)',
            animation: 'blob2 22s ease-in-out infinite',
          }} />
          <div className="hero-blob" style={{
            width: '40vw', height: '40vw',
            top: '30%', left: '30%',
            background: 'radial-gradient(circle, rgba(220,170,60,0.09) 0%, transparent 70%)',
            animation: 'blob3 15s ease-in-out infinite',
          }} />
        </div>

        {/* ── Layer 3: Floating gold particles ── */}
        {[
          { left: '5%',  size: 2,   delay: '0s',   dur: '9s',  opacity: 0.5 },
          { left: '12%', size: 1.5, delay: '1.8s', dur: '11s', opacity: 0.4 },
          { left: '22%', size: 3,   delay: '0.5s', dur: '8s',  opacity: 0.6 },
          { left: '31%', size: 1,   delay: '3s',   dur: '12s', opacity: 0.35},
          { left: '42%', size: 2.5, delay: '1s',   dur: '10s', opacity: 0.55},
          { left: '55%', size: 1.5, delay: '2.5s', dur: '9.5s',opacity: 0.45},
          { left: '64%', size: 2,   delay: '0.8s', dur: '11s', opacity: 0.5 },
          { left: '73%', size: 3,   delay: '4s',   dur: '8.5s',opacity: 0.4 },
          { left: '82%', size: 1,   delay: '1.5s', dur: '10.5s',opacity: 0.3},
          { left: '91%', size: 2,   delay: '3.2s', dur: '9s',  opacity: 0.5 },
          { left: '96%', size: 1.5, delay: '0.3s', dur: '12s', opacity: 0.4 },
        ].map((p, i) => (
          <div key={i} className="hero-particle" style={{
            left: p.left,
            width: p.size + 'px', height: p.size + 'px',
            background: `rgba(201, ${140 + i * 5}, 50, ${p.opacity})`,
            animationDelay: p.delay, animationDuration: p.dur,
            boxShadow: `0 0 ${p.size * 3}px rgba(201,168,76,0.8)`,
          }} />
        ))}

        {/* ── Layer 4: Scanning gold line (mimics video light leak) ── */}
        <div className="hero-scanline" />

        {/* ── Layer 5: Cinematic gradient overlay ── */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `
            linear-gradient(180deg,
              rgba(0,0,0,0.05) 0%,
              rgba(0,0,0,0.0)  35%,
              rgba(10,8,5,0.55) 68%,
              rgba(5,4,3,0.88) 100%
            ),
            radial-gradient(ellipse at 50% 40%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.35) 100%)
          `,
        }} />

        {/* ── Layer 6: Scroll-driven darkening ── */}
        <motion.div style={{
          position: 'absolute', inset: 0, background: 'rgba(0,0,0,1)',
          opacity: darkening, pointerEvents: 'none',
        }} />

        {/* ── Layer 7: Gold shimmer line entrance ── */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 2, delay: 1.4, ease: [0.25, 0.1, 0.25, 1] }}
          style={{
            position: 'absolute', bottom: '32%', left: 0, right: 0, height: '1px',
            background: 'linear-gradient(90deg, transparent 5%, rgba(201,168,76,0.22) 50%, transparent 95%)',
            pointerEvents: 'none',
          }}
        />

        {/* ── Main Content ── */}
        <motion.div style={{ y: contentY, position: 'relative', zIndex: 10, width: '100%' }}>
          <motion.div
            variants={containerVariants} initial="hidden" animate="visible"
            style={{
              textAlign: 'center', padding: '0 1.5rem',
              maxWidth: '840px', margin: '0 auto',
              direction: isAr ? 'rtl' : 'ltr',
            }}>

            <motion.p variants={itemVariants} className="section-subtitle"
              style={{ letterSpacing: '0.38em', marginBottom: '1.4rem' }}>
              {isAr ? 'لوكس إيسنس' : 'LUXE ESSENCE'}
            </motion.p>

            <motion.h1 variants={itemVariants} style={{
              fontFamily: 'var(--font-serif)', fontWeight: 300,
              color: '#fff', letterSpacing: '0.02em', lineHeight: 1.07,
              marginBottom: '1.2rem',
              textShadow: '0 4px 50px rgba(0,0,0,0.6)',
            }}>
              {t('home.heroTitle')}{' '}
              <span style={{ fontStyle: 'italic', color: 'var(--color-gold)', display: 'block' }}>
                {t('home.heroTitleAccent')}
              </span>
            </motion.h1>

            <motion.div variants={itemVariants} style={{
              width: '50px', height: '1px', background: 'var(--color-gold)', margin: '0 auto 1.5rem',
            }} />

            <motion.p variants={itemVariants} style={{
              fontSize: '1.1rem', color: 'rgba(255,255,255,0.72)',
              maxWidth: '480px', margin: '0 auto 2.8rem', lineHeight: 1.85, fontWeight: 300,
            }}>
              {t('home.heroSubtitle')}
            </motion.p>

            <motion.div variants={itemVariants}
              style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/shop" style={{
                padding: '1rem 2.8rem', background: 'var(--color-gold)',
                color: '#0a0a0a', fontFamily: 'var(--font-sans)',
                fontSize: '0.78rem', letterSpacing: '0.22em', textTransform: 'uppercase',
                fontWeight: 700, transition: 'all 0.25s',
                boxShadow: '0 4px 24px rgba(201,168,76,0.4)',
              }}
                onMouseOver={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 8px 32px rgba(201,168,76,0.6)'; }}
                onMouseOut={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 24px rgba(201,168,76,0.4)'; }}>
                {t('btn.shopNow', { ns: 'common' })}
              </Link>
              <Link to="/about" style={{
                padding: '1rem 2.8rem', border: '1px solid rgba(201,168,76,0.65)',
                color: 'var(--color-gold)', fontFamily: 'var(--font-sans)',
                fontSize: '0.78rem', letterSpacing: '0.22em', textTransform: 'uppercase',
                transition: 'all 0.25s', backdropFilter: 'blur(6px)',
              }}
                onMouseOver={e => { e.target.style.background = 'rgba(201,168,76,0.12)'; e.target.style.transform = 'translateY(-2px)'; }}
                onMouseOut={e => { e.target.style.background = 'transparent'; e.target.style.transform = 'translateY(0)'; }}>
                {t('btn.discover', { ns: 'common' })}
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2, duration: 1 }}
          style={{
            position: 'absolute', bottom: '2.5rem', left: '50%', transform: 'translateX(-50%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem', zIndex: 10,
          }}>
          <span style={{
            fontSize: '0.62rem', letterSpacing: '0.35em', textTransform: 'uppercase',
            color: 'rgba(201,168,76,0.7)', fontFamily: 'var(--font-sans)',
          }}>
            {isAr ? 'مرر للأسفل' : 'SCROLL'}
          </span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            style={{ width: '1px', height: '50px', background: 'linear-gradient(to bottom, var(--color-gold), transparent)' }}
          />
        </motion.div>

      </section>
    </>
  );
}
