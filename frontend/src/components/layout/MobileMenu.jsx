import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

export default function MobileMenu({ open, onClose }) {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const isAr = i18n.language === 'ar';
  const isLight = theme === 'light';

  const links = [
    { to: '/', label: t('nav.home') },
    { to: '/shop', label: t('nav.shop') },
    { to: '/about', label: t('nav.about') },
    { to: '/contact', label: t('nav.contact') },
  ];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1001 }}
          />
          <motion.div
            initial={{ x: isAr ? '-100%' : '100%' }} animate={{ x: 0 }} exit={{ x: isAr ? '-100%' : '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            style={{
              position: 'fixed', top: 0, [isAr ? 'left' : 'right']: 0,
              width: '280px', height: '100vh',
              background: 'var(--color-dark)', borderLeft: isAr ? 'none' : '1px solid var(--color-border)',
              borderRight: isAr ? '1px solid var(--color-border)' : 'none',
              zIndex: 1002, padding: '2rem 1.5rem',
              display: 'flex', flexDirection: 'column', gap: '0',
            }}>
            <button onClick={onClose} style={{
              alignSelf: isAr ? 'flex-start' : 'flex-end',
              color: 'var(--color-light-gray)', marginBottom: '2rem',
              fontSize: '1.5rem', lineHeight: 1,
            }}>✕</button>

            <nav>
              {links.map(link => (
                <Link key={link.to} to={link.to} onClick={onClose}
                  style={{
                    display: 'block', padding: '1rem 0',
                    color: 'var(--color-off-white)',
                    fontFamily: 'var(--font-serif)', fontSize: '1.5rem',
                    borderBottom: '1px solid var(--color-border)',
                    textAlign: isAr ? 'right' : 'left',
                  }}>
                  {link.label}
                </Link>
              ))}
            </nav>

            <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {user ? (
                <>
                  <Link to="/orders" onClick={onClose} style={{ color: 'var(--color-gold)', fontSize: '0.9rem', textAlign: isAr ? 'right' : 'left' }}>
                    {t('nav.myOrders')}
                  </Link>
                  <button onClick={() => { logout(); onClose(); }} style={{ color: '#e55', textAlign: isAr ? 'right' : 'left', fontSize: '0.9rem' }}>
                    {t('nav.logout')}
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={onClose} style={{ color: 'var(--color-gold)', fontSize: '0.9rem', textAlign: isAr ? 'right' : 'left' }}>
                    {t('nav.login')}
                  </Link>
                  <Link to="/register" onClick={onClose} style={{ color: 'var(--color-off-white)', fontSize: '0.9rem', textAlign: isAr ? 'right' : 'left' }}>
                    {t('nav.register')}
                  </Link>
                </>
              )}

              <button onClick={() => i18n.changeLanguage(isAr ? 'en' : 'ar')}
                style={{
                  color: 'var(--color-gold)', fontSize: '0.85rem',
                  border: '1px solid rgba(201,168,76,0.4)', padding: '0.5rem 1rem',
                  borderRadius: 'var(--radius-sm)', textAlign: 'center', marginTop: '0.5rem',
                }}>
                {isAr ? 'English' : 'عربي'}
              </button>

              <button onClick={toggleTheme}
                style={{
                  color: 'var(--color-gold)', fontSize: '0.85rem',
                  border: '1px solid rgba(201,168,76,0.4)', padding: '0.5rem 1rem',
                  borderRadius: 'var(--radius-sm)', textAlign: 'center',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                }}>
                {isLight ? '🌙 Dark Mode' : '☀️ Light Mode'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
