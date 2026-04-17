import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/AuthContext';

const MONO = { fontFamily: 'var(--font-mono)', letterSpacing: '0.22em', textTransform: 'uppercase' };

export default function LoginPage() {
  const { t, i18n } = useTranslation('auth');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isAr = i18n.language === 'ar';
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || (isAr ? 'حدث خطأ. حاول مجددًا.' : 'Une erreur est survenue.'));
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '0.9rem 0',
    background: 'transparent', border: 'none',
    borderBottom: '1px solid var(--line-strong)',
    color: 'var(--charcoal)', fontFamily: 'var(--font-sans)',
    fontSize: '1rem', outline: 'none', direction: 'ltr',
  };

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', padding: '2rem 1.5rem',
      background: 'var(--cream)', direction: isAr ? 'rtl' : 'ltr',
      paddingTop: 'var(--navbar-height)',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{ width: '100%', maxWidth: '440px' }}
      >
        {/* Header */}
        <div style={{ marginBottom: '3rem' }}>
          <span style={{ ...MONO, fontSize: '0.65rem', color: 'var(--terracotta)', display: 'block', marginBottom: '1.25rem' }}>
            {isAr ? '— ولوج آمن للمشرفين' : '— Accès sécurisé · Administrateurs'}
          </span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 300, lineHeight: 0.95, letterSpacing: '-0.03em', color: 'var(--charcoal)', margin: 0 }}>
            {isAr ? (<>تسجيل<br /><span style={{ fontStyle: 'italic' }}>الدخول.</span></>) : (<>Se <span style={{ fontStyle: 'italic' }}>connecter.</span></>)}
          </h1>
        </div>

        {/* Error */}
        {error && (
          <div style={{ padding: '0.75rem 1rem', background: 'rgba(220,50,50,0.06)', border: '1px solid rgba(220,50,50,0.2)', marginBottom: '1.5rem', ...MONO, fontSize: '0.6rem', color: '#c0392b' }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {[
            { key: 'email',    label: isAr ? 'البريد الإلكتروني' : 'Email',           type: 'email' },
            { key: 'password', label: isAr ? 'كلمة المرور'       : 'Mot de passe',    type: 'password' },
          ].map(field => (
            <div key={field.key}>
              <label style={{ ...MONO, fontSize: '0.6rem', color: 'var(--graphite)', display: 'block', marginBottom: '0.5rem' }}>
                {field.label}
              </label>
              <input
                type={field.type}
                value={form[field.key]}
                onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                required
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--terracotta)'}
                onBlur={e => e.target.style.borderColor = 'var(--line-strong)'}
              />
            </div>
          ))}

          <button type="submit" disabled={loading} style={{
            marginTop: '0.5rem', padding: '1rem 2.5rem',
            background: loading ? 'var(--graphite)' : 'var(--charcoal)',
            color: 'var(--cream)', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
            ...MONO, fontSize: '0.65rem',
            transition: 'background 0.2s',
          }}
            onMouseOver={e => { if (!loading) e.currentTarget.style.background = 'var(--terracotta)'; }}
            onMouseOut={e => { if (!loading) e.currentTarget.style.background = 'var(--charcoal)'; }}
          >
            {loading ? '...' : (isAr ? 'دخول ←' : 'Se connecter →')}
          </button>
        </form>

        <p style={{ marginTop: '2rem', ...MONO, fontSize: '0.6rem', color: 'var(--graphite)', textAlign: 'center' }}>
          {isAr ? 'للموظفين المخولين فقط' : 'Accès réservé au personnel autorisé'}
        </p>
      </motion.div>
    </div>
  );
}
