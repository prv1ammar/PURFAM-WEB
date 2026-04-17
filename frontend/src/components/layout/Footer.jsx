import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaInstagram, FaFacebook, FaTiktok } from 'react-icons/fa6';

const MONO = { fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.22em', textTransform: 'uppercase' };

export default function Footer() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  return (
    <footer style={{ background: 'var(--charcoal)', color: 'var(--cream)', direction: isAr ? 'rtl' : 'ltr' }}>

      {/* ── Editorial wordmark ── */}
      <div style={{ padding: '5rem 3rem 4rem', borderBottom: '1px solid rgba(245,240,232,0.1)' }}>
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(4rem, 12vw, 9rem)', lineHeight: 0.9, fontWeight: 200, letterSpacing: '-0.04em' }}>
          <span style={{ fontStyle: 'italic' }}>Luxe</span> Essence.
        </div>
        <p style={{ ...MONO, color: 'var(--terracotta)', marginTop: '1.5rem', color: 'var(--terracotta)' }}>
          {isAr ? 'الدار البيضاء · المغرب · منذ 2024' : 'Casablanca, Maroc · Depuis 2024'}
        </p>
      </div>

      {/* ── Links grid ── */}
      <div style={{ padding: '3.5rem 3rem', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '3rem', borderBottom: '1px solid rgba(245,240,232,0.1)' }}>

        {/* Brand description */}
        <div>
          <p style={{ fontSize: '0.85rem', opacity: 0.65, lineHeight: 1.8, maxWidth: '280px', fontFamily: 'var(--font-sans)', fontWeight: 300 }}>
            {isAr
              ? 'عطور مستوحاة من أرقى دور العطور العالمية، في تعبئة 10 مل.'
              : 'Parfums d\'inspiration haute parfumerie, conditionnés en 10 ml.'}
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
            {isAr ? 'المتجر' : 'Boutique'}
          </div>
          {[
            { to: '/shop', label: isAr ? 'جميع العطور' : 'Tous les parfums' },
            { to: '/shop?gender=men',   label: isAr ? 'رجالي' : 'Homme' },
            { to: '/shop?gender=women', label: isAr ? 'نسائي' : 'Femme' },
          ].map(item => (
            <div key={item.to} style={{ marginBottom: '0.6rem' }}>
              <Link to={item.to} style={{ fontSize: '0.85rem', opacity: 0.75, fontFamily: 'var(--font-sans)' }}
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
            {isAr ? 'الدار' : 'La Maison'}
          </div>
          {[
            { to: '/about',   label: isAr ? 'قصتنا' : 'Notre histoire' },
            { to: '/contact', label: isAr ? 'اتصل بنا' : 'Contact' },
            { to: '/orders',  label: isAr ? 'طلباتي' : 'Mes commandes' },
          ].map(item => (
            <div key={item.to} style={{ marginBottom: '0.6rem' }}>
              <Link to={item.to} style={{ fontSize: '0.85rem', opacity: 0.75, fontFamily: 'var(--font-sans)' }}
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
            isAr ? 'الدار البيضاء، المغرب' : 'Casablanca, Maroc',
            '+212 621 558 544',
            'luxeessence.boutique@gmail.com',
          ].map((line, i) => (
            <p key={i} style={{ fontSize: '0.82rem', opacity: 0.65, marginBottom: '0.5rem', fontFamily: 'var(--font-sans)' }}>{line}</p>
          ))}
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div style={{ padding: '1.5rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', ...MONO, opacity: 0.45 }}>
        <span>© 2026 Luxe Essence · SARL Casablanca</span>
        <span>{isAr ? 'سياسة الخصوصية · الشروط والأحكام' : 'CGV · Mentions légales · Confidentialité'}</span>
      </div>

      <style>{`
        @media (max-width: 900px) {
          footer > div:nth-child(2) { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 600px) {
          footer > div:nth-child(2) { grid-template-columns: 1fr !important; }
          footer > div:nth-child(3) { flex-direction: column !important; gap: 0.5rem !important; }
        }
      `}</style>
    </footer>
  );
}
