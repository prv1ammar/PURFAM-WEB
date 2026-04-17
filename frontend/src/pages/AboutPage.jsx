import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const MONO = { fontFamily: 'var(--font-mono)', letterSpacing: '0.22em', textTransform: 'uppercase' };

export default function AboutPage() {
  const { t, i18n } = useTranslation('pages');
  const isAr = i18n.language === 'ar';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ background: 'var(--cream)', direction: isAr ? 'rtl' : 'ltr' }}>

      {/* ── Hero ── */}
      <section style={{ padding: '7rem 3rem 5rem' }}>
        <div className="container-luxe">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span style={{ ...MONO, fontSize: '0.65rem', color: 'var(--terracotta)', display: 'block', marginBottom: '2rem' }}>
              {isAr ? '— الدار / الدار البيضاء · 2024' : '— La Maison / Casablanca · 2024'}
            </span>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(4rem, 12vw, 9rem)', fontWeight: 300, lineHeight: 0.88, letterSpacing: '-0.04em', color: 'var(--charcoal)', margin: 0, maxWidth: '900px' }}>
              {isAr ? (
                <>الفخامة، في<br /><span style={{ fontStyle: 'italic' }}>متناول الجميع.</span></>
              ) : (
                <>Le luxe, à portée de <span style={{ fontStyle: 'italic' }}>peau.</span></>
              )}
            </h1>
            <p style={{ marginTop: '3rem', maxWidth: '620px', fontSize: '1.1rem', lineHeight: 1.7, color: 'var(--ink)', fontFamily: 'var(--font-sans)', fontWeight: 300 }}>
              {isAr
                ? 'وُلدت لوكس إيسنس من قناعة بسيطة: يجب ألا تُحتكر العطور الرائعة من قبل القلة.'
                : 'Luxe Essence est née d\'une conviction simple : les grandes fragrances ne devraient pas être réservées à quelques-uns.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section style={{ padding: '6rem 0', background: 'var(--charcoal)', color: 'var(--cream)' }}>
        <div className="container-luxe">
          <span style={{ ...MONO, fontSize: '0.65rem', color: 'var(--terracotta)', display: 'block', marginBottom: '2rem' }}>
            {isAr ? '— تاريخنا' : '— Notre histoire'}
          </span>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 6vw, 5.5rem)', fontWeight: 300, letterSpacing: '-0.03em', margin: 0, marginBottom: '4rem', lineHeight: 1 }}>
            {isAr ? (<>سنوات،<br /><span style={{ fontStyle: 'italic', color: 'var(--sand)' }}>هوس واحد.</span></>) : (<>Quelques années,<br /><span style={{ fontStyle: 'italic', color: 'var(--sand)' }}>une obsession.</span></>)}
          </h2>
          {[
            ['2024', isAr ? 'فتح المشغل' : 'Ouverture de l\'atelier', isAr ? 'الدار البيضاء. مطبخ محوّل، 12 فلكونًا، ومؤسسة وأنفها.' : 'Casablanca. Une cuisine reconvertie, 12 flacons, une fondatrice et son nez.'],
            ['2025', isAr ? 'الكتالوج الأول' : 'Premier catalogue', isAr ? 'خمسة وأربعون عطرًا. التوصيل في المغرب فقط. إنستغرام متجرًا.' : 'Quarante-cinq parfums. Livraison au Maroc uniquement. Instagram comme boutique.'],
            ['2026', isAr ? 'الإصدار رقم 04' : 'Édition N°04', isAr ? 'مئة وثلاثون عطرًا في الكتالوج. صندوق الاكتشاف. والدار البيضاء دائمًا.' : 'Cent-trente parfums au catalogue. La box découverte. Et toujours, Casablanca.'],
          ].map(([year, title, body]) => (
            <motion.div key={year}
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={{ display: 'grid', gridTemplateColumns: '160px 1fr 2fr', gap: '3rem', padding: '2.5rem 0', borderTop: '1px solid rgba(245,240,232,0.12)', alignItems: 'baseline' }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '3rem', fontWeight: 300, color: 'var(--terracotta)' }}>{year}</div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 400 }}>{title}</div>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.75, opacity: 0.75, color: 'var(--cream)', fontFamily: 'var(--font-sans)' }}>{body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Values ── */}
      <section style={{ padding: '8rem 0' }}>
        <div className="container-luxe">
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 300, letterSpacing: '-0.03em', marginBottom: '5rem', lineHeight: 1 }}>
            {isAr ? (<>ثلاثة <span style={{ fontStyle: 'italic' }}>التزامات.</span></>) : (<>Trois <span style={{ fontStyle: 'italic' }}>engagements.</span></>)}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3rem' }}>
            {[
              { n: '01', t: isAr ? 'أصل شفاف' : 'Origine transparente',   b: isAr ? 'كل فلكون مختار من دور تركيب معتمدة.' : 'Chaque flacon est sélectionné auprès de maisons de composition certifiées.' },
              { n: '02', t: isAr ? 'مكونات نقية' : 'Ingrédients loyaux', b: isAr ? '100% عطر في كل فلكون — لا ماء. هذه قاعدتنا الوحيدة.' : '100% de parfum dans chaque flacon — pas d\'eau. C\'est notre seule règle.' },
              { n: '03', t: isAr ? 'صنع في المغرب' : 'Made in Maroc',     b: isAr ? 'إعادة تعبئة بالدار البيضاء، تسمية يدوية، توصيل في 48 ساعة.' : 'Reconditionnement à Casablanca, étiquetage à la main, livraison en 48 heures.' },
            ].map(item => (
              <motion.div key={item.n} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '4.5rem', fontWeight: 200, color: 'var(--terracotta)', lineHeight: 1 }}>{item.n}</div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 400, margin: '0.75rem 0 1rem', color: 'var(--charcoal)' }}>{item.t}</h3>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.75, color: 'var(--ink)', fontFamily: 'var(--font-sans)' }}>{item.b}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '7rem 0', background: 'var(--terracotta)', color: 'var(--paper)', textAlign: 'center' }}>
        <div className="container-luxe">
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 7vw, 6rem)', fontWeight: 300, letterSpacing: '-0.03em', margin: 0, marginBottom: '2.5rem' }}>
            {isAr ? (<>ابحث عن <span style={{ fontStyle: 'italic' }}>بصمتك.</span></>) : (<>Trouvez votre <span style={{ fontStyle: 'italic' }}>signature.</span></>)}
          </h2>
          <Link to="/shop" style={{ display: 'inline-block', padding: '1.1rem 3rem', background: 'var(--paper)', color: 'var(--charcoal)', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.22em', textTransform: 'uppercase' }}
            onMouseOver={e => { e.currentTarget.style.background = 'var(--charcoal)'; e.currentTarget.style.color = 'var(--cream)'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'var(--paper)'; e.currentTarget.style.color = 'var(--charcoal)'; }}>
            {isAr ? 'تصفح 130 عطرًا ←' : 'Parcourir les 130 parfums →'}
          </Link>
        </div>
      </section>

      <style>{`@media(max-width:768px){section[style*="grid-template-columns: 160px"] div{grid-template-columns:1fr!important}section[style*="repeat(3, 1fr)"] div{grid-template-columns:1fr!important}}</style>`}
    </motion.div>
  );
}
