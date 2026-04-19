import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/AuthContext';

const MONO = { fontFamily: 'var(--font-mono)', letterSpacing: '0.18em', textTransform: 'uppercase' };

export default function MobileMenu({ open, onClose }) {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const lang = i18n.language;
  const isAr = lang === 'ar';

  const links = [
    { to: '/',        label: isAr ? 'الرئيسية'  : lang === 'fr' ? 'Accueil'   : 'Home' },
    { to: '/shop',    label: isAr ? 'المتجر'    : lang === 'fr' ? 'Boutique'  : 'Shop' },
    { to: '/about',   label: isAr ? 'القصة'     : lang === 'fr' ? 'La Maison' : 'About' },
    { to: '/contact', label: isAr ? 'اتصل بنا'  : lang === 'fr' ? 'Contact'   : 'Contact' },
  ];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'fixed', inset: 0, background: 'rgba(26,25,24,0.55)', zIndex: 10001 }}
          />
          <motion.div
            initial={{ x: isAr ? '-100%' : '100%' }}
            animate={{ x: 0 }}
            exit={{ x: isAr ? '-100%' : '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'fixed', top: 0, [isAr ? 'left' : 'right']: 0,
              width: '300px', height: '100vh',
              background: 'var(--charcoal)', color: 'var(--cream)',
              zIndex: 10002, padding: '2.5rem 2rem',
              display: 'flex', flexDirection: 'column',
            }}>

            {/* Close */}
            <button onClick={onClose} style={{ alignSelf: isAr ? 'flex-start' : 'flex-end', color: 'rgba(245,240,232,0.5)', fontSize: '1.25rem', lineHeight: 1, background: 'none', border: 'none', cursor: 'pointer', marginBottom: '3rem' }}>
              ✕
            </button>

            {/* Brand */}
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontStyle: 'italic', fontWeight: 200, color: 'var(--cream)', marginBottom: '3rem', letterSpacing: '0.03em' }}>
              Luxe Essence
            </div>

            {/* Links */}
            <nav style={{ flex: 1 }}>
              {links.map(link => (
                <Link key={link.to} to={link.to} onClick={onClose}
                  style={{
                    display: 'block', padding: '1.1rem 0',
                    fontFamily: 'var(--font-serif)', fontSize: '1.6rem', fontWeight: 300,
                    color: 'var(--cream)', borderBottom: '1px solid rgba(245,240,232,0.1)',
                    textAlign: isAr ? 'right' : 'left',
                  }}
                  onMouseOver={e => e.currentTarget.style.color = 'var(--terracotta)'}
                  onMouseOut={e => e.currentTarget.style.color = 'var(--cream)'}>
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Bottom actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '2rem' }}>
              {user ? (
                <>
                  {user.isAdmin && (
                    <Link to="/admin" onClick={onClose} style={{ ...MONO, fontSize: '0.6rem', color: 'var(--terracotta)', textAlign: isAr ? 'right' : 'left' }}>
                      Admin →
                    </Link>
                  )}
                  <Link to="/orders" onClick={onClose} style={{ ...MONO, fontSize: '0.6rem', color: 'rgba(245,240,232,0.6)', textAlign: isAr ? 'right' : 'left' }}>
                    {isAr ? 'طلباتي' : lang === 'en' ? 'My Orders' : 'Mes commandes'}
                  </Link>
                  <button onClick={() => { logout(); onClose(); }} style={{ ...MONO, fontSize: '0.6rem', color: '#e55', textAlign: isAr ? 'right' : 'left', background: 'none', border: 'none', cursor: 'pointer' }}>
                    {isAr ? 'تسجيل خروج' : lang === 'en' ? 'Logout' : 'Déconnexion'}
                  </button>
                </>
              ) : null}

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                {[{code:'fr',label:'FR'},{code:'en',label:'EN'},{code:'ar',label:'ع'}].map(({ code, label }) => (
                  <button key={code} onClick={() => i18n.changeLanguage(code)}
                    style={{ ...MONO, fontSize: '0.6rem', color: lang === code ? 'var(--terracotta)' : 'rgba(245,240,232,0.45)', background: 'none', border: 'none', cursor: 'pointer', padding: '0.2rem 0.4rem', borderBottom: lang === code ? '1px solid var(--terracotta)' : '1px solid transparent' }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
