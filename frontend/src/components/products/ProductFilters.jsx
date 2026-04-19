import { useTranslation } from 'react-i18next';

const MONO = { fontFamily: 'var(--font-mono)', letterSpacing: '0.18em', textTransform: 'uppercase' };

export default function ProductFilters({ filters, onChange }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const isAr = lang === 'ar';

  const genders    = ['', 'women', 'men'];
  const categories = ['', 'floral', 'woody', 'oriental', 'fresh', 'citrus', 'gourmand'];

  const btnStyle = (active) => ({
    display: 'block', width: '100%', textAlign: isAr ? 'right' : 'left',
    padding: '0.55rem 0.75rem', marginBottom: '0.25rem',
    background: active ? 'rgba(184,92,58,0.1)' : 'transparent',
    color: active ? 'var(--terracotta)' : 'var(--graphite)',
    border: `1px solid ${active ? 'rgba(184,92,58,0.3)' : 'transparent'}`,
    ...MONO, fontSize: '0.6rem',
    transition: 'all 0.2s', cursor: 'pointer',
  });

  return (
    <aside style={{
      background: 'var(--paper)',
      border: '1px solid var(--line)',
      padding: '1.75rem',
      position: 'sticky', top: 'calc(var(--navbar-height) + 1rem)',
      direction: isAr ? 'rtl' : 'ltr',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', paddingBottom: '1rem', borderBottom: '1px solid var(--line)' }}>
        <span style={{ ...MONO, fontSize: '0.65rem', color: 'var(--charcoal)' }}>
          {isAr ? 'فلاتر' : lang === 'fr' ? 'Filtres' : 'Filters'}
        </span>
        {(filters.gender || filters.category || filters.size || filters.minSize) && (
          <button onClick={() => onChange({ gender: '', category: '', sort: filters.sort, size: '', minSize: '' })}
            style={{ ...MONO, fontSize: '0.58rem', color: 'var(--terracotta)', background: 'none', border: 'none', cursor: 'pointer', borderBottom: '1px solid var(--terracotta)', paddingBottom: '1px' }}>
            {isAr ? 'مسح' : lang === 'fr' ? 'Effacer' : 'Clear'}
          </button>
        )}
      </div>

      {/* Gender */}
      <div style={{ marginBottom: '1.75rem' }}>
        <span style={{ ...MONO, fontSize: '0.6rem', color: 'var(--terracotta)', display: 'block', marginBottom: '0.75rem' }}>
          {isAr ? 'الجنس' : lang === 'fr' ? 'Genre' : 'Gender'}
        </span>
        {genders.map(g => (
          <button key={g} onClick={() => onChange({ ...filters, gender: g })} style={btnStyle(filters.gender === g)}>
            {g ? t(`gender.${g}`) : t('gender.all')}
          </button>
        ))}
      </div>

      {/* Category */}
      <div style={{ marginBottom: '1.75rem' }}>
        <span style={{ ...MONO, fontSize: '0.6rem', color: 'var(--terracotta)', display: 'block', marginBottom: '0.75rem' }}>
          {isAr ? 'الفئة' : lang === 'fr' ? 'Famille' : 'Category'}
        </span>
        {categories.map(c => (
          <button key={c} onClick={() => onChange({ ...filters, category: c })} style={btnStyle(filters.category === c)}>
            {c ? t(`category.${c}`) : t('category.all')}
          </button>
        ))}
      </div>

      {/* Sort */}
      <div>
        <span style={{ ...MONO, fontSize: '0.6rem', color: 'var(--terracotta)', display: 'block', marginBottom: '0.75rem' }}>
          {isAr ? 'الترتيب' : lang === 'fr' ? 'Trier par' : 'Sort by'}
        </span>
        {[
          { val: '-createdAt', label: isAr ? 'الأحدث' : lang === 'fr' ? 'Les plus récents' : 'Newest' },
          { val: 'price',      label: isAr ? 'السعر ↑' : lang === 'fr' ? 'Prix croissant' : 'Price ↑' },
          { val: '-price',     label: isAr ? 'السعر ↓' : lang === 'fr' ? 'Prix décroissant' : 'Price ↓' },
        ].map(s => (
          <button key={s.val} onClick={() => onChange({ ...filters, sort: s.val })} style={btnStyle(filters.sort === s.val)}>
            {s.label}
          </button>
        ))}
      </div>
    </aside>
  );
}
