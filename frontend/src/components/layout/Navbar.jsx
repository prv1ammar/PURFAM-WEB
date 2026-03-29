import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeContext';
import MobileMenu from './MobileMenu';
import logoSrc from '@/assets/logo.svg';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const { totalItems, setCartOpen } = useCart();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const isAr = i18n.language === 'ar';
  const isLight = theme === 'light';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  const toggleLang = () => {
    i18n.changeLanguage(isAr ? 'en' : 'ar');
  };

  return (
    <>
      <motion.nav
        className="navbar"
        animate={{ backgroundColor: scrolled
          ? (isLight ? 'rgba(250,248,244,0.96)' : 'rgba(10,10,10,0.96)')
          : 'rgba(0,0,0,0)' }}
        transition={{ duration: 0.3 }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(201,168,76,0.15)' : '1px solid transparent',
          padding: '0 1.5rem',
          height: 'var(--navbar-height)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
          <img src={logoSrc} alt="Luxe Essence" style={{ height: 48 }} />
        </Link>

        {/* Desktop Nav */}
        <ul style={{ display: 'flex', gap: '2rem', alignItems: 'center', listStyle: 'none' }}
          className="desktop-nav">
          {['/', '/shop', '/about', '/contact'].map((path, i) => {
            const keys = ['home', 'shop', 'about', 'contact'];
            return (
              <li key={path}>
                <NavLink to={path} end={path === '/'}
                  style={({ isActive }) => ({
                    color: isActive ? 'var(--color-gold)' : 'var(--color-off-white)',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.8rem',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    transition: 'color 0.2s',
                  })}>
                  {t(`nav.${keys[i]}`)}
                </NavLink>
              </li>
            );
          })}
        </ul>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Theme Toggle */}
          <button onClick={toggleTheme} title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            style={{
              color: 'var(--color-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '32px', height: '32px',
              border: '1px solid rgba(201,168,76,0.4)', borderRadius: 'var(--radius-sm)',
              transition: 'all 0.2s', flexShrink: 0,
            }}
            onMouseOver={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.1)'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'transparent'; }}>
            {isLight ? <MoonIcon /> : <SunIcon />}
          </button>

          {/* Language Toggle */}
          <button onClick={toggleLang} style={{
            color: 'var(--color-gold)', fontSize: '0.75rem', letterSpacing: '0.1em',
            fontFamily: 'var(--font-sans)', padding: '0.25rem 0.5rem',
            border: '1px solid rgba(201,168,76,0.4)', borderRadius: 'var(--radius-sm)',
            transition: 'all 0.2s',
          }}
            onMouseOver={e => { e.target.style.background = 'rgba(201,168,76,0.1)'; }}
            onMouseOut={e => { e.target.style.background = 'transparent'; }}>
            {isAr ? 'EN' : 'عربي'}
          </button>

          {/* Cart */}
          <button onClick={() => setCartOpen(true)} style={{
            position: 'relative', color: 'var(--color-off-white)',
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            fontSize: '0.8rem', letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}>
            <CartIcon />
            {totalItems > 0 && (
              <span style={{
                position: 'absolute', top: '-8px', right: '-8px',
                background: 'var(--color-gold)', color: 'var(--color-black)',
                borderRadius: '50%', width: '18px', height: '18px',
                fontSize: '0.65rem', fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{totalItems}</span>
            )}
          </button>

          {/* User */}
          {user ? (
            <div style={{ position: 'relative' }}>
              <button onClick={() => setUserMenuOpen(v => !v)} style={{
                color: 'var(--color-off-white)', fontSize: '0.8rem',
                letterSpacing: '0.1em', textTransform: 'uppercase',
                display: 'flex', alignItems: 'center', gap: '0.3rem',
              }}>
                <UserIcon />
              </button>
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                    style={{
                      position: 'absolute', top: '100%', right: isAr ? 'auto' : 0, left: isAr ? 0 : 'auto',
                      background: 'var(--color-charcoal)', border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-sm)', minWidth: '160px', marginTop: '0.5rem',
                      overflow: 'hidden', zIndex: 100,
                    }}>
                    {[
                      { to: '/orders', label: t('nav.myOrders') },
                      ...(user.role === 'admin' ? [{ to: '/admin', label: t('nav.admin') }] : []),
                    ].map(item => (
                      <Link key={item.to} to={item.to}
                        onClick={() => setUserMenuOpen(false)}
                        style={{ display: 'block', padding: '0.75rem 1rem', color: 'var(--color-off-white)', fontSize: '0.85rem', borderBottom: '1px solid var(--color-border)' }}
                        onMouseOver={e => e.target.style.color = 'var(--color-gold)'}
                        onMouseOut={e => e.target.style.color = 'var(--color-off-white)'}>
                        {item.label}
                      </Link>
                    ))}
                    <button onClick={handleLogout} style={{
                      display: 'block', width: '100%', textAlign: isAr ? 'right' : 'left',
                      padding: '0.75rem 1rem', color: '#e55', fontSize: '0.85rem',
                    }}>
                      {t('nav.logout')}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link to="/login" style={{
              color: 'var(--color-off-white)', fontSize: '0.8rem',
              letterSpacing: '0.1em', textTransform: 'uppercase',
            }}>
              {t('nav.login')}
            </Link>
          )}

          {/* Hamburger */}
          <button className="hamburger" onClick={() => setMobileOpen(true)}
            style={{ display: 'none', flexDirection: 'column', gap: '4px', padding: '4px' }}>
            {[0, 1, 2].map(i => (
              <span key={i} style={{ display: 'block', width: '22px', height: '1.5px', background: 'var(--color-off-white)' }} />
            ))}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: flex !important; }
        }
      `}</style>
    </>
  );
}

function CartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 01-8 0"/>
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
    </svg>
  );
}
