import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import MobileMenu from './MobileMenu';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const { totalItems, setCartOpen } = useCart();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const isAr = i18n.language === 'ar';

  const handleLogout = () => { logout(); setUserMenuOpen(false); navigate('/'); };
  const toggleLang = () => i18n.changeLanguage(isAr ? 'en' : 'ar');

  const links = [
    { to: '/shop',    label: isAr ? 'المتجر'   : 'Parfums' },
    { to: '/about',   label: isAr ? 'القصة'   : 'La Maison' },
    { to: '/contact', label: isAr ? 'اتصل'    : 'Contact' },
  ];

  return (
    <div className="announce-wrapper" style={{ direction: isAr ? 'rtl' : 'ltr' }}>
      {/* ── Announcement bar ── */}
      <div className="announce-bar">
        <span>{isAr ? 'توصيل مجاني من 400 درهم · الدفع عند الاستلام' : 'Livraison offerte dès 400 dh · Paiement à la livraison'}</span>
        <span style={{ color: 'var(--terracotta)' }}>★ {isAr ? 'إصدار ربيع 2026' : 'Édition Printemps 2026'}</span>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button onClick={toggleLang} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.18em', color: 'rgba(245,240,232,0.7)', background: 'none', border: 'none', cursor: 'pointer' }}>
            {isAr ? 'FR' : 'عربي'}
          </button>
        </div>
      </div>

      {/* ── Main nav ── */}
      <nav className="editorial-nav">
        {/* Left: page links */}
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          {links.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        {/* Centre: logo */}
        <Link to="/" className="nav-logo">
          Luxe Essence
        </Link>

        {/* Right: actions */}
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', justifyContent: 'flex-end' }}>
          {/* Cart */}
          <button
            onClick={() => setCartOpen(true)}
            style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--graphite)', display: 'flex', alignItems: 'center' }}
          >
            <BagIcon />
            {totalItems > 0 && (
              <span style={{
                position: 'absolute', top: '-7px', right: '-7px',
                background: 'var(--terracotta)', color: '#fff',
                fontSize: '0.6rem', fontWeight: 700,
                width: '16px', height: '16px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-mono)',
              }}>
                {totalItems}
              </span>
            )}
          </button>

          {/* User */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => user ? setUserMenuOpen(!userMenuOpen) : navigate('/login')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--graphite)', display: 'flex', alignItems: 'center' }}
            >
              <UserIcon />
            </button>
            <AnimatePresence>
              {userMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  style={{
                    position: 'absolute', top: 'calc(100% + 12px)',
                    right: isAr ? 'auto' : 0, left: isAr ? 0 : 'auto',
                    background: 'var(--charcoal)', border: '1px solid rgba(245,240,232,0.12)',
                    minWidth: '180px', zIndex: 10000,
                  }}
                >
                  {user?.isAdmin && (
                    <Link to="/admin" onClick={() => setUserMenuOpen(false)} style={{ display: 'block', padding: '0.75rem 1.25rem', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.7)', borderBottom: '1px solid rgba(245,240,232,0.08)' }}
                      onMouseOver={e => e.currentTarget.style.color = 'var(--terracotta)'}
                      onMouseOut={e => e.currentTarget.style.color = 'rgba(245,240,232,0.7)'}>
                      {isAr ? 'لوحة التحكم' : 'Admin'}
                    </Link>
                  )}
                  <Link to="/orders" onClick={() => setUserMenuOpen(false)} style={{ display: 'block', padding: '0.75rem 1.25rem', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.7)', borderBottom: '1px solid rgba(245,240,232,0.08)' }}
                    onMouseOver={e => e.currentTarget.style.color = 'var(--terracotta)'}
                    onMouseOut={e => e.currentTarget.style.color = 'rgba(245,240,232,0.7)'}>
                    {isAr ? 'طلباتي' : 'Mes commandes'}
                  </Link>
                  <button onClick={handleLogout} style={{ display: 'block', width: '100%', textAlign: isAr ? 'right' : 'left', padding: '0.75rem 1.25rem', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#e55', background: 'none', border: 'none', cursor: 'pointer' }}>
                    {isAr ? 'تسجيل خروج' : 'Déconnexion'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden" onClick={() => setMobileOpen(true)} style={{ color: 'var(--graphite)', background: 'none', border: 'none', cursor: 'pointer' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
        </div>
      </nav>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </div>
  );
}

function BagIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 01-8 0"/>
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  );
}
