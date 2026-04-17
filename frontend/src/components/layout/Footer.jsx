import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import logoSrc from '@/assets/logo.png';
import { FaInstagram, FaFacebook, FaTiktok, FaLocationDot, FaPhone, FaEnvelope } from 'react-icons/fa6';

export default function Footer() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  return (
    <footer style={{
      background: 'var(--color-dark)',
      borderTop: '1px solid var(--color-border)',
      padding: '4rem 1.5rem 2rem',
    }}>
      <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '3rem', marginBottom: '3rem',
          direction: isAr ? 'rtl' : 'ltr',
        }}>
          {/* Brand column */}
          <div>
            <img src={logoSrc} alt="Luxe Essence" style={{ width: '80px', height: '80px', objectFit: 'contain', marginBottom: '1rem' }} />
            <p style={{ color: 'var(--color-gray)', fontSize: '0.9rem', lineHeight: 1.8, maxWidth: '260px' }}>
              {t('tagline')}
            </p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              {[
                { icon: <FaInstagram size={16} />, href: 'https://www.instagram.com/luxeessence.boutique/' },
                { icon: <FaFacebook  size={16} />, href: 'https://www.facebook.com/profile.php?id=61570777527869' },
                { icon: <FaTiktok    size={16} />, href: 'https://www.tiktok.com/@luxeessence.fragrance' },
              ].map((s, i) => (
                <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  border: '1px solid var(--color-border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--color-gray)', transition: 'all 0.2s',
                }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--color-gold)'; e.currentTarget.style.color = 'var(--color-gold)'; }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-gray)'; }}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-gold)', marginBottom: '1.5rem', fontSize: '1rem', letterSpacing: '0.1em' }}>
              {isAr ? 'روابط سريعة' : 'Quick Links'}
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { to: '/shop', label: t('nav.shop') },
                { to: '/about', label: t('nav.about') },
                { to: '/contact', label: t('nav.contact') },
                { to: '/orders', label: t('nav.myOrders') },
              ].map(item => (
                <li key={item.to}>
                  <Link to={item.to} style={{ color: 'var(--color-gray)', fontSize: '0.9rem', transition: 'color 0.2s' }}
                    onMouseOver={e => e.target.style.color = 'var(--color-gold)'}
                    onMouseOut={e => e.target.style.color = 'var(--color-gray)'}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Collections */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-gold)', marginBottom: '1.5rem', fontSize: '1rem', letterSpacing: '0.1em' }}>
              {isAr ? 'المجموعات' : 'Collections'}
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {['women', 'men'].map(g => (
                <li key={g}>
                  <Link to={`/shop?gender=${g}`} style={{ color: 'var(--color-gray)', fontSize: '0.9rem', transition: 'color 0.2s' }}
                    onMouseOver={e => e.target.style.color = 'var(--color-gold)'}
                    onMouseOut={e => e.target.style.color = 'var(--color-gray)'}>
                    {t(`gender.${g}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-gold)', marginBottom: '1.5rem', fontSize: '1rem', letterSpacing: '0.1em' }}>
              {isAr ? 'تواصل معنا' : 'Contact'}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { icon: <FaLocationDot size={14} />, text: isAr ? 'الدار البيضاء، المغرب' : 'Casablanca, Maroc' },
                { icon: <FaPhone       size={13} />, text: '+212 621 558 544' },
                { icon: <FaEnvelope    size={13} />, text: 'luxeessence.boutique@gmail.com' },
              ].map((item, i) => (
                <p key={i} style={{ color: 'var(--color-gray)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ color: 'var(--color-gold)', flexShrink: 0 }}>{item.icon}</span>{item.text}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid var(--color-border)', paddingTop: '2rem',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: '1rem',
          direction: isAr ? 'rtl' : 'ltr',
        }}>
          <p style={{ color: 'var(--color-gray)', fontSize: '0.8rem' }}>
            © 2024 {t('brand')}. {isAr ? 'جميع الحقوق محفوظة' : 'All rights reserved.'}
          </p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {[
              { text: isAr ? 'سياسة الخصوصية' : 'Privacy Policy', to: '#' },
              { text: isAr ? 'الشروط والأحكام' : 'Terms of Service', to: '#' },
            ].map(item => (
              <a key={item.text} href={item.to} style={{ color: 'var(--color-gray)', fontSize: '0.8rem' }}
                onMouseOver={e => e.target.style.color = 'var(--color-gold)'}
                onMouseOut={e => e.target.style.color = 'var(--color-gray)'}>
                {item.text}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

