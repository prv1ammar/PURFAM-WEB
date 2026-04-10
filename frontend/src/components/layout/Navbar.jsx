import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeContext';
import MobileMenu from './MobileMenu';
import logoSrc from '@/assets/logo.png';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const { totalItems, setCartOpen } = useCart();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const isAr = i18n.language === 'ar';
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => {
      setScrollY(window.scrollY);
      setScrolled(window.scrollY > 100);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Gradual opacity: starts at 0.35, reaches 0.92 at 200px scroll
  const bgOpacity = Math.min(0.92, 0.35 + (scrollY / 200) * 0.57);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  const toggleLang = () => {
    i18n.changeLanguage(isAr ? 'en' : 'ar');
  };

  return (
    <motion.nav
      initial={{ y: -120, opacity: 0 }}
      animate={ (isHome && !scrolled) ? { y: -130, opacity: 0 } : { y: 0, opacity: 1 } }
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-9999 flex items-center justify-between px-8 ${
        scrolled
          ? 'h-24 border-b border-theme-10 shadow-luxe'
          : 'h-28 border-b border-theme-10/5'
      }`}
      style={{
        backgroundColor: isHome && !scrolled ? 'rgba(var(--bg-rgb), 0)' : `rgba(var(--bg-rgb), ${bgOpacity})`,
        backdropFilter: isHome && !scrolled ? 'none' : 'blur(14px) saturate(160%)',
        WebkitBackdropFilter: isHome && !scrolled ? 'none' : 'blur(14px) saturate(160%)',
        pointerEvents: (isHome && !scrolled) ? 'none' : 'auto',
        zIndex: 9999,
        transition: 'height 0.4s ease, background-color 0.4s ease, backdrop-filter 0.4s ease'
      }}
    >
      {/* Logo */}
      <Link to="/" className="flex items-center gap-3">
        <img
          src={logoSrc}
          alt="Luxe Essence"
          className="flex-shrink-0 object-contain transition-all duration-500"
          style={{
            width: scrolled ? '52px' : '58px',
            height: scrolled ? '52px' : '58px',
            objectFit: 'cover',
            objectPosition: 'center',
          }}
        />
        <span
          className={`block transition-all duration-500 leading-none`}
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 400,
            fontSize: scrolled ? '1.4rem' : '1.6rem',
            letterSpacing: '0.08em',
            color: 'var(--color-gold)',
          }}
        >
          Luxe Essence
        </span>
      </Link>

      {/* Navigation Links */}
      <ul className="hidden md:flex items-center gap-10">
        {['/', '/shop', '/about', '/contact'].map((path, i) => {
          const keys = ['home', 'shop', 'about', 'contact'];
          return (
            <li key={path} className="relative group">
              <NavLink 
                to={path} 
                end={path === '/'}
                className={({ isActive }) => `
                  text-[0.7rem] uppercase tracking-[0.25em] transition-all duration-300 font-semibold
                  ${isActive ? 'text-gold' : (scrolled || !isHome || theme === 'light' ? 'text-theme-70 hover:text-theme-90' : 'text-white-70 hover:text-white')}
                `}
              >
                {t(`nav.${keys[i]}`)}
              </NavLink>
              <div 
                className="absolute -bottom-1 left-0 right-0 h-[1px] bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
              />
            </li>
          );
        })}
      </ul>

      {/* Actions */}
      <div className="flex items-center gap-6">
        <button onClick={toggleLang} className={`text-[0.7rem] tracking-[0.1em] hover:text-gold transition-all font-bold uppercase ${scrolled || !isHome || theme === 'light' ? 'text-theme-70' : 'text-white-70'}`}>
           {isAr ? 'EN' : 'عربي'}
        </button>
        
        <button onClick={toggleTheme} className={`hover:text-gold transition-all ${scrolled || !isHome || theme === 'light' ? 'text-theme-80' : 'text-white-80'}`} aria-label="Toggle Theme">
           <ThemeIcon theme={theme} color={(scrolled || !isHome || theme === 'light') ? 'currentColor' : 'white'} />
        </button>

        <button onClick={() => setCartOpen(true)} className={`relative group ${scrolled || !isHome || theme === 'light' ? 'text-theme-80' : 'text-white-80'}`}>
           <CartIcon color={(scrolled || !isHome || theme === 'light') ? 'currentColor' : 'white'} />
           {totalItems > 0 && (
             <span className="absolute -top-2 -right-2 bg-gold text-black text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center" style={{ borderRadius: '50%' }}>
               {totalItems}
             </span>
           )}
        </button>

        <div className="relative">
          <button onClick={() => (user ? setUserMenuOpen(!userMenuOpen) : navigate('/login'))} className={`hover:text-gold transition-all ${scrolled || !isHome || theme === 'light' ? 'text-theme-80' : 'text-white-80'}`}>
            <UserIcon color={(scrolled || !isHome || theme === 'light') ? 'currentColor' : 'white'} />
          </button>
          
          <AnimatePresence>
            {userMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className={`absolute top-full mt-4 bg-theme border border-theme-10 rounded-sm min-w-[200px] py-2 shadow-luxe ${isAr ? 'left-0' : 'right-0'}`}
              >
                <Link to="/admin" className="block px-6 py-3 text-sm text-theme-70 hover:text-gold hover:bg-theme-10">{t('nav.admin')}</Link>
                <button onClick={handleLogout} className="w-full text-left px-6 py-3 text-sm text-red-400 hover:bg-theme-10">{t('nav.logout')}</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button className={`md:hidden ${scrolled ? 'text-theme-90' : 'text-white'}`} onClick={() => setMobileOpen(true)}>
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
      </div>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </motion.nav>
  );
}

function CartIcon({ color = 'currentColor' }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.2" className="group-hover:stroke-gold transition-all">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 01-8 0"/>
    </svg>
  );
}

function UserIcon({ color = 'currentColor' }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.2">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  );
}

function ThemeIcon({ theme, color = 'currentColor' }) {
  if (theme === 'light') {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.4">
        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
      </svg>
    );
  }
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.4">
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
