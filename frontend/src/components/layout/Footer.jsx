import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaInstagram, FaFacebook, FaTiktok } from 'react-icons/fa6';

const MONO = { fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.22em', textTransform: 'uppercase' };

export default function Footer() {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const isAr = lang === 'ar';

  return (
    <footer style={{ background: 'var(--charcoal)', color: 'var(--cream)', direction: isAr ? 'rtl' : 'ltr' }}>

      {/* ── Editorial wordmark ── */}
      <div className="footer-wordmark" style={{ padding: '5rem 3rem 4rem', borderBottom: '1px solid rgba(245,240,232,0.1)' }}>
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(4rem, 12vw, 9rem)', lineHeight: 0.9, fontWeight: 200, letterSpacing: '-0.04em' }}>
          <span style={{ fontStyle: 'italic' }}>Luxe</span> Essence.
        </div>
        <p style={{ ...MONO, color: 'var(--terracotta)', marginTop: '1.5rem', color: 'var(--terracotta)' }}>
          {isAr ? 'الدار البيضاء · المغرب · منذ 2024' : lang === 'fr' ? 'Casablanca, Maroc · Depuis 2024' : 'Casablanca, Morocco · Since 2024'}
        </p>
      </div>

      {/* ── Links grid ── */}
      <div className="footer-grid" style={{ padding: '3.5rem 3rem', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '3rem', borderBottom: '1px solid rgba(245,240,232,0.1)' }}>

        {/* Brand description */}
        <div>
          <p style={{ fontSize: '0.85rem', opacity: 0.65, lineHeight: 1.8, maxWidth: '280px', fontFamily: 'var(--font-sans)', fontWeight: 300, color: 'var(--cream)' }}>
            {isAr
              ? 'عطور أصلية من أرقى دور العطور العالمية، في فلاكين ديكانت 10 مل.'
              : lang === 'fr'
              ? 'Parfums authentiques des grandes maisons internationales, en décants de 10 ml.'
              : 'Authentic fragrances from the world\'s finest houses, in 10 ml decants.'}
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.75rem' }}>
            {[
              { icon: <FaInstagram size={15} />, href: 'https://www.instagram.com/luxeessence.boutique/' },
              { icon: <FaFacebook  size={15} />, href: 'https://www.facebook.com/profile.php?id=61570777527869' },
              { icon: <FaTiktok    size={15} />, href: 'https://www.tiktok.com/@luxeessence.fragrance' },
            ].map((s, i) => (
              <a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
                style={{ width: '34px', height: '34px', border: '1px solid rgba(245,240,232,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(245,240,232,0.55)', transition: 'all 0.2s' }}
                onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--terracotta)'; e.currentTarget.style.color = 'var(--terracotta)'; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(245,240,232,0.18)'; e.currentTarget.style.color = 'rgba(245,240,232,0.55)'; }}>
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Boutique */}
        <div>
          <div style={{ ...MONO, color: 'var(--terracotta)', marginBottom: '1.25rem' }}>
            {isAr ? 'المتجر' : lang === 'fr' ? 'Boutique' : 'Shop'}
          </div>
          {[
            { to: '/shop', label: isAr ? 'جميع العطور' : lang === 'fr' ? 'Tous les parfums' : 'All fragrances' },
            { to: '/shop?gender=men',   label: isAr ? 'رجالي' : lang === 'fr' ? 'Homme' : 'Men' },
            { to: '/shop?gender=women', label: isAr ? 'نسائي' : lang === 'fr' ? 'Femme' : 'Women' },
          ].map(item => (
            <div key={item.to} style={{ marginBottom: '0.6rem' }}>
              <Link to={item.to} style={{ fontSize: '0.85rem', opacity: 0.75, fontFamily: 'var(--font-sans)', color: 'var(--cream)' }}
                onMouseOver={e => { e.currentTarget.style.opacity = 1; e.currentTarget.style.color = 'var(--terracotta)'; }}
                onMouseOut={e => { e.currentTarget.style.opacity = 0.75; e.currentTarget.style.color = 'var(--cream)'; }}>
                {item.label}
              </Link>
            </div>
          ))}
        </div>

        {/* Maison */}
        <div>
          <div style={{ ...MONO, color: 'var(--terracotta)', marginBottom: '1.25rem' }}>
            {isAr ? 'الدار' : lang === 'fr' ? 'La Maison' : 'The House'}
          </div>
          {[
            { to: '/about',   label: isAr ? 'قصتنا' : lang === 'fr' ? 'Notre histoire' : 'Our Story' },
            { to: '/contact', label: isAr ? 'اتصل بنا' : 'Contact' },
            { to: '/orders',  label: isAr ? 'طلباتي' : lang === 'fr' ? 'Mes commandes' : 'My Orders' },
          ].map(item => (
            <div key={item.to} style={{ marginBottom: '0.6rem' }}>
              <Link to={item.to} style={{ fontSize: '0.85rem', opacity: 0.75, fontFamily: 'var(--font-sans)', color: 'var(--cream)' }}
                onMouseOver={e => { e.currentTarget.style.opacity = 1; e.currentTarget.style.color = 'var(--terracotta)'; }}
                onMouseOut={e => { e.currentTarget.style.opacity = 0.75; e.currentTarget.style.color = 'var(--cream)'; }}>
                {item.label}
              </Link>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div>
          <div style={{ ...MONO, color: 'var(--terracotta)', marginBottom: '1.25rem' }}>
            {isAr ? 'تواصل' : 'Contact'}
          </div>
          {[
            isAr ? 'الدار البيضاء، المغرب' : lang === 'fr' ? 'Casablanca, Maroc' : 'Casablanca, Morocco',
            '+212 621 558 544',
            'luxeessence.boutique@gmail.com',
          ].map((line, i) => (
            <p key={i} style={{ fontSize: '0.82rem', opacity: 0.65, marginBottom: '0.5rem', fontFamily: 'var(--font-sans)', color: 'var(--cream)' }}>{line}</p>
          ))}
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="footer-bottom" style={{ padding: '1.5rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', ...MONO, opacity: 0.45 }}>
        <span>© 2026 Luxe Essence · SARL Casablanca</span>
        <span>{isAr ? 'سياسة الخصوصية · الشروط والأحكام' : lang === 'fr' ? 'CGV · Mentions légales · Confidentialité' : 'Terms · Legal · Privacy'}</span>
      </div>

    </footer>
  );
}
