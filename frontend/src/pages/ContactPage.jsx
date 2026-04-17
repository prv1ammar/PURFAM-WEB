import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FaInstagram, FaFacebook, FaTiktok, FaLocationDot, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa6';

const MONO = { fontFamily: 'var(--font-mono)', letterSpacing: '0.22em', textTransform: 'uppercase' };

export default function ContactPage() {
  const { t, i18n } = useTranslation('pages');
  const isAr = i18n.language === 'ar';
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => { e.preventDefault(); setSent(true); };

  const inputStyle = {
    width: '100%', padding: '0.85rem 0',
    background: 'transparent', border: 'none',
    borderBottom: '1px solid var(--line-strong)',
    color: 'var(--charcoal)', fontFamily: 'var(--font-sans)',
    fontSize: '1rem', outline: 'none',
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ background: 'var(--cream)', direction: isAr ? 'rtl' : 'ltr' }}>

      {/* ── Hero ── */}
      <section style={{ padding: '7rem 0 4rem' }}>
        <div className="container-luxe">
          <span style={{ ...MONO, fontSize: '0.65rem', color: 'var(--terracotta)', display: 'block', marginBottom: '2rem' }}>
            {isAr ? '— نرد عليك في 24 ساعة' : '— On vous répond en 24h'}
          </span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(3.5rem, 10vw, 8rem)', fontWeight: 300, lineHeight: 0.9, letterSpacing: '-0.04em', color: 'var(--charcoal)', margin: 0 }}>
            {isAr ? (<>اكتب لنا،<br /><span style={{ fontStyle: 'italic' }}>نحب ذلك.</span></>) : (<>Écrivez-nous,<br /><span style={{ fontStyle: 'italic' }}>on adore ça.</span></>)}
          </h1>
        </div>
      </section>

      {/* ── Form + Info ── */}
      <section style={{ padding: '2rem 0 7rem' }}>
        <div className="container-luxe" style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '6rem', alignItems: 'start' }}>

          {/* Form */}
          <div>
            {sent ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                style={{ padding: '3rem', background: 'var(--cream-deep)', border: '1px solid var(--line)', textAlign: 'center' }}>
                <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 300, fontStyle: 'italic', color: 'var(--charcoal)', marginBottom: '0.5rem' }}>
                  {isAr ? 'شكرًا على رسالتك.' : 'Message bien reçu.'}
                </p>
                <p style={{ ...MONO, fontSize: '0.65rem', color: 'var(--terracotta)' }}>
                  {isAr ? 'سنرد في أقرب وقت.' : 'On revient vers vous rapidement.'}
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                  {[
                    { key: 'name',  label: isAr ? 'الاسم' : 'Prénom' },
                    { key: 'email', label: isAr ? 'البريد' : 'Email', type: 'email' },
                  ].map(f => (
                    <div key={f.key}>
                      <label style={{ ...MONO, fontSize: '0.6rem', color: 'var(--graphite)', display: 'block', marginBottom: '0.6rem' }}>{f.label}</label>
                      <input type={f.type || 'text'} value={form[f.key]} required
                        onChange={e => setForm(v => ({ ...v, [f.key]: e.target.value }))}
                        style={inputStyle}
                        onFocus={e => e.target.style.borderColor = 'var(--terracotta)'}
                        onBlur={e => e.target.style.borderColor = 'var(--line-strong)'}
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <label style={{ ...MONO, fontSize: '0.6rem', color: 'var(--graphite)', display: 'block', marginBottom: '0.6rem' }}>{isAr ? 'الموضوع' : 'Objet'}</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                    {(isAr
                      ? ['نصيحة عطرية', 'طلب', 'شراكة', 'أخرى']
                      : ['Conseil olfactif', 'Commande', 'Partenariat', 'Autre']
                    ).map((o, i) => (
                      <span key={o} onClick={() => setForm(v => ({ ...v, subject: o }))}
                        style={{
                          padding: '0.55rem 1rem', cursor: 'pointer',
                          border: `1px solid ${form.subject === o ? 'var(--terracotta)' : 'var(--line)'}`,
                          background: form.subject === o ? 'var(--terracotta)' : 'transparent',
                          color: form.subject === o ? 'var(--paper)' : 'var(--charcoal)',
                          ...MONO, fontSize: '0.6rem',
                          transition: 'all 0.2s',
                        }}>{o}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={{ ...MONO, fontSize: '0.6rem', color: 'var(--graphite)', display: 'block', marginBottom: '0.6rem' }}>{isAr ? 'الرسالة' : 'Message'}</label>
                  <textarea rows={5} value={form.message} required
                    onChange={e => setForm(v => ({ ...v, message: e.target.value }))}
                    style={{ ...inputStyle, resize: 'vertical', padding: '0.85rem 0' }}
                    onFocus={e => e.target.style.borderColor = 'var(--terracotta)'}
                    onBlur={e => e.target.style.borderColor = 'var(--line-strong)'}
                  />
                </div>
                <button type="submit" style={{
                  alignSelf: 'flex-start', padding: '1rem 2.5rem',
                  background: 'var(--charcoal)', color: 'var(--cream)',
                  border: 'none', cursor: 'pointer',
                  ...MONO, fontSize: '0.65rem',
                }}
                  onMouseOver={e => { e.currentTarget.style.background = 'var(--terracotta)'; }}
                  onMouseOut={e => { e.currentTarget.style.background = 'var(--charcoal)'; }}
                >
                  {isAr ? 'إرسال ←' : 'Envoyer →'}
                </button>
              </form>
            )}
          </div>

          {/* Info blocks */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {[
              { icon: <FaLocationDot size={16} />, label: isAr ? 'البوتيك' : 'Boutique',    val: isAr ? 'الدار البيضاء، المغرب\nإثنين – سبت · 10:00 – 20:00' : 'Casablanca, Maroc\nLun – Sam · 10h – 20h' },
              { icon: <FaPhone       size={15} />, label: isAr ? 'الهاتف' : 'Téléphone',    val: '+212 621 558 544' },
              { icon: <FaEnvelope    size={15} />, label: isAr ? 'البريد' : 'Email',         val: 'luxeessence.boutique@gmail.com' },
              { icon: <FaClock       size={15} />, label: isAr ? 'الرد على واتساب' : 'WhatsApp', val: isAr ? 'رد في ساعتين · 9:00 – 22:00' : 'Réponse en 2h · 9h – 22h' },
            ].map(item => (
              <div key={item.label} style={{ padding: '1.5rem', background: 'var(--cream-deep)', border: '1px solid var(--line)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
                  <span style={{ color: 'var(--terracotta)' }}>{item.icon}</span>
                  <span style={{ ...MONO, fontSize: '0.6rem', color: 'var(--terracotta)' }}>{item.label}</span>
                </div>
                <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', lineHeight: 1.6, whiteSpace: 'pre-line', color: 'var(--charcoal)' }}>{item.val}</p>
              </div>
            ))}

            {/* Socials */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {[
                { icon: <FaInstagram size={16} />, href: 'https://www.instagram.com/luxeessence.boutique/', label: 'Instagram' },
                { icon: <FaFacebook  size={16} />, href: 'https://www.facebook.com/profile.php?id=61570777527869', label: 'Facebook' },
                { icon: <FaTiktok    size={16} />, href: 'https://www.tiktok.com/@luxeessence.fragrance', label: 'TikTok' },
              ].map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" title={s.label}
                  style={{ width: '44px', height: '44px', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--graphite)', transition: 'all 0.2s' }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--terracotta)'; e.currentTarget.style.color = 'var(--terracotta)'; }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.color = 'var(--graphite)'; }}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: '7rem 0', background: 'var(--charcoal)', color: 'var(--cream)' }}>
        <div className="container-luxe" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '6rem', alignItems: 'start' }}>
          <div>
            <span style={{ ...MONO, fontSize: '0.65rem', color: 'var(--terracotta)', display: 'block', marginBottom: '1.5rem' }}>
              {isAr ? '— الأسئلة الشائعة' : '— Questions fréquentes'}
            </span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 300, letterSpacing: '-0.03em', margin: 0 }}>
              {isAr ? (<>قبل أن <span style={{ fontStyle: 'italic' }}>تكتب.</span></>) : (<>Avant de nous <span style={{ fontStyle: 'italic' }}>écrire.</span></>)}
            </h2>
          </div>
          <div>
            {(isAr ? [
              ['كم يدوم الفلكون 10 مل؟', 'من 6 أسابيع إلى 3 أشهر حسب الاستخدام — ما بين 100 و150 رشة.'],
              ['ما الفرق مع الأصل؟', 'عطورنا مستوحاة، تعيد إنتاج الروائح الرئيسية بتكلفة في المتناول.'],
              ['هل توصلون خارج المغرب؟', 'نعم — المغرب العربي، غرب إفريقيا، فرنسا. من 5 إلى 10 أيام.'],
              ['الإرجاع ممكن؟', '14 يومًا لكل فلكون مختوم. بعد هذه المدة لا يمكننا استرداده.'],
            ] : [
              ['Combien de temps dure un flacon 10 ml ?', 'Entre 6 semaines et 3 mois selon la fréquence — environ 100 à 150 sprays.'],
              ['Quelle est la différence avec l\'original ?', 'Nos parfums sont des compositions inspirées, reproduisant les accords principaux à un coût accessible.'],
              ['Livrez-vous hors du Maroc ?', 'Oui — Maghreb, Afrique de l\'Ouest, France. Comptez 5 à 10 jours.'],
              ['Retours possibles ?', '14 jours pour tout flacon scellé. Passé ce délai, nous ne pouvons plus reprendre le produit.'],
            ]).map(([q, a]) => (
              <details key={q} style={{ padding: '1.5rem 0', borderBottom: '1px solid rgba(245,240,232,0.12)' }}>
                <summary style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', fontWeight: 400, cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  {q} <span style={{ color: 'var(--terracotta)', fontSize: '1.2rem', marginLeft: '1rem', flexShrink: 0 }}>+</span>
                </summary>
                <p style={{ marginTop: '1rem', fontSize: '0.9rem', lineHeight: 1.75, opacity: 0.75, fontFamily: 'var(--font-sans)' }}>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .contact-grid, .faq-grid { grid-template-columns: 1fr !important; gap: 3rem !important; }
          .form-name-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </motion.div>
  );
}
