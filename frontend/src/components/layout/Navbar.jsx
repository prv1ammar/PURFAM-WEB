import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import api from '@/services/api';
import MobileMenu from './MobileMenu';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const { totalItems, setCartOpen } = useCart();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [announcement, setAnnouncement] = useState(null);
  const lang = i18n.language;
  const isAr = lang === 'ar' || lang === 'dar';
  const isDar = lang === 'dar';

  useEffect(() => {
    api.get('/api/settings')
      .then(res => { if (res.data.settings) setAnnouncement(res.data.settings); })
      .catch(() => {});
  }, []);

  const handleLogout = () => { logout(); setUserMenuOpen(false); navigate('/'); };

  const LANGS = [
    { code: 'fr',  label: 'FR'  },
    { code: 'en',  label: 'EN'  },
    { code: 'ar',  label: 'ع'   },
    { code: 'dar', label: 'دار' },
  ];

  const links = [
    { to: '/',        label: isDar ? 'الصفحة الرئيسية' : isAr ? 'الرئيسية' : lang === 'fr' ? 'Accueil'   : 'Home'    },
    { to: '/shop',    label: isDar ? 'الحانوت'          : isAr ? 'المتجر'   : lang === 'fr' ? 'Boutique'  : 'Shop'    },
    { to: '/about',   label: isDar ? 'من حنا'           : isAr ? 'القصة'    : lang === 'fr' ? 'La Maison' : 'About'   },
    { to: '/contact', label: isDar ? 'تواصل معنا'       : isAr ? 'اتصل'     : lang === 'fr' ? 'Contact'   : 'Contact' },
  ];

  return (
    <div className="announce-wrapper" style={{ direction: isAr ? 'rtl' : 'ltr' }}>
      {/* ── Announcement bar ── */}
      <div className="announce-bar">

        {/* Scrolling ticker */}
        <div className="announce-ticker-wrap">
          <div className="announce-ticker">
            {[1, 2, 3, 4].map(n => (
              <span key={n}>
                ★&nbsp;
                {announcement?.left
                  ? (isAr ? announcement.left.ar : lang === 'fr' ? announcement.left.fr : announcement.left.en)
                  : (isAr ? 'توصيل مجاني من 400 درهم · الدفع عند الاستلام' : lang === 'fr' ? 'Livraison offerte dès 400 dh · Paiement à la livraison' : 'Free shipping from 400 dh · Cash on delivery')}
                &nbsp;&nbsp;·&nbsp;&nbsp;
                <span style={{ color: 'var(--terracotta)' }}>
                  {announcement?.right
                    ? (isAr ? announcement.right.ar : lang === 'fr' ? announcement.right.fr : announcement.right.en)
                    : (isAr ? 'إصدار ربيع 2026' : lang === 'fr' ? 'Édition Printemps 2026' : 'Spring Edition 2026')}
                </span>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </span>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center', flexShrink: 0, marginLeft: '1rem' }}>
          {LANGS.map(({ code, label }) => (
            <button key={code} onClick={() => i18n.changeLanguage(code)}
              style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.15em',
                color: lang === code ? 'var(--terracotta)' : 'rgba(245,240,232,0.55)',
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '0.15rem 0.4rem',
                borderBottom: lang === code ? '1px solid var(--terracotta)' : '1px solid transparent',
                transition: 'color 0.2s',
              }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Main nav ── */}
      <nav className="editorial-nav">
        {/* Left: page links */}
        <div className="nav-desktop-links" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          {links.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
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

          {/* User — hidden from clients; admin accesses /login directly */}
          {user && (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
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
                      {isAr ? 'طلباتي' : lang === 'en' ? 'My Orders' : 'Mes commandes'}
                    </Link>
                    <button onClick={handleLogout} style={{ display: 'block', width: '100%', textAlign: isAr ? 'right' : 'left', padding: '0.75rem 1.25rem', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#e55', background: 'none', border: 'none', cursor: 'pointer' }}>
                      {isAr ? 'تسجيل خروج' : lang === 'en' ? 'Logout' : 'Déconnexion'}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

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
