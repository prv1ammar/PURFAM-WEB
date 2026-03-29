import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/AuthContext';
import logoSrc from '@/assets/logo.svg';

export default function RegisterPage() {
  const { t, i18n } = useTranslation('auth');
  const { register } = useAuth();
  const navigate = useNavigate();
  const isAr = i18n.language === 'ar';
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      return setError(t('validation.passwordMatch'));
    }
    if (form.password.length < 6) {
      return setError(t('validation.passwordMin'));
    }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || t('error.general', { ns: 'common' }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper" style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', padding: '2rem 1.5rem',
      background: `linear-gradient(135deg, var(--color-black) 0%, #0d0d1a 100%)`,
      direction: isAr ? 'rtl' : 'ltr',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          width: '100%', maxWidth: '440px',
          background: 'var(--color-charcoal)', border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)', padding: '2.5rem',
        }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img src={logoSrc} alt="Luxe Essence" style={{ height: 50, margin: '0 auto 1.5rem' }} />
          <h1 style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: '1.8rem', marginBottom: '0.5rem' }}>
            {t('register.title')}
          </h1>
          <p style={{ color: 'var(--color-gray)', fontSize: '0.9rem' }}>{t('register.subtitle')}</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(220,50,50,0.1)', border: '1px solid rgba(220,50,50,0.3)', borderRadius: 'var(--radius-sm)', padding: '0.75rem', marginBottom: '1rem', color: '#e55', fontSize: '0.85rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            { key: 'name', type: 'text', labelKey: 'register.name' },
            { key: 'email', type: 'email', labelKey: 'register.email' },
            { key: 'password', type: 'password', labelKey: 'register.password' },
            { key: 'confirmPassword', type: 'password', labelKey: 'register.confirmPassword' },
          ].map(field => (
            <div key={field.key}>
              <label style={{ display: 'block', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-gray)', marginBottom: '0.4rem' }}>
                {t(field.labelKey)}
              </label>
              <input
                type={field.type}
                value={form[field.key]}
                onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                required
                style={{
                  width: '100%', padding: '0.8rem 1rem',
                  background: 'var(--color-dark-gray)', border: '1px solid var(--color-border)',
                  color: 'var(--color-off-white)', borderRadius: 'var(--radius-sm)',
                  fontSize: '0.95rem', outline: 'none', direction: 'ltr',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--color-gold)'}
                onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
              />
            </div>
          ))}

          <button type="submit" disabled={loading} style={{
            marginTop: '0.5rem', padding: '0.9rem', background: 'var(--color-gold)',
            color: 'var(--color-black)', fontFamily: 'var(--font-sans)', fontSize: '0.8rem',
            letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700,
            borderRadius: 'var(--radius-sm)', opacity: loading ? 0.7 : 1,
          }}>
            {loading ? '...' : t('register.submit')}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--color-gray)', fontSize: '0.9rem' }}>
          {t('register.hasAccount')}{' '}
          <Link to="/login" style={{ color: 'var(--color-gold)' }}>{t('register.login')}</Link>
        </p>
      </motion.div>
    </div>
  );
}
