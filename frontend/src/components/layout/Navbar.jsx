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
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-[1000] flex items-center justify-between px-8 transition-all duration-500 ${scrolled ? 'h-20 bg-theme backdrop-blur-md border-b border-theme-10 shadow-luxe' : 'h-24 bg-transparent'}`}
    >
      {/* Logo */}
      <Link to="/" className="flex items-center">
         <img src={logoSrc} alt="Luxe Essence" className={`h-10 transition-all duration-500 flex-shrink-0 ${scrolled ? 'scale-90 invert-0 dark:invert-0' : 'scale-100'} ${theme === 'light' && scrolled ? 'invert' : ''}`} style={theme === 'light' && scrolled ? { filter: 'invert(1)' } : {}} />
      </Link>

      {/* Navigation Links */}
      <ul className="hidden md:flex items-center gap-10">
        {['/', '/shop', '/about', '/contact', '/design'].map((path, i) => {
          const keys = ['home', 'shop', 'about', 'contact', 'design'];
          return (
            <li key={path}>
              <NavLink 
                to={path} 
                end={path === '/'}
                className={({ isActive }) => `text-xs uppercase tracking-w-2 transition-all duration-300 font-medium ${isActive ? 'text-gold' : (scrolled ? 'text-theme-60 hover:text-theme-90' : 'text-white-60 hover:text-white')}`}
              >
                {t(`nav.${keys[i]}`)}
              </NavLink>
            </li>
          );
        })}
      </ul>

      {/* Actions */}
      <div className="flex items-center gap-6">
        <button onClick={toggleLang} className={`text-xs tracking-w-1 hover:text-gold transition-all font-bold uppercase ${scrolled ? 'text-theme-60' : 'text-white-60'}`}>
           {isAr ? 'EN' : 'عربي'}
        </button>
        
        <button onClick={toggleTheme} className={`hover:text-gold transition-all ${scrolled ? 'text-theme-80' : 'text-white-80'}`} aria-label="Toggle Theme">
           <ThemeIcon theme={theme} />
        </button>

        <button onClick={() => setCartOpen(true)} className={`relative group ${scrolled ? 'text-theme-80' : 'text-white-80'}`}>
           <CartIcon />
           {totalItems > 0 && (
             <span className="absolute -top-2 -right-2 bg-gold text-black text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center" style={{ borderRadius: '50%' }}>
               {totalItems}
             </span>
           )}
        </button>

        <div className="relative">
          <button onClick={() => (user ? setUserMenuOpen(!userMenuOpen) : navigate('/login'))} className={`hover:text-gold transition-all ${scrolled ? 'text-theme-80' : 'text-white-80'}`}>
            <UserIcon />
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

function CartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.2" className="group-hover:stroke-gold transition-all">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 01-8 0"/>
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  );
}

function ThemeIcon({ theme }) {
  if (theme === 'light') {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
      </svg>
    );
  }
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
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
