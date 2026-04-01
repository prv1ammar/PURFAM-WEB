import { useTranslation } from 'react-i18next';

export default function ProductFilters({ filters, onChange }) {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const genders = ['', 'women', 'men'];
  const categories = ['', 'floral', 'woody', 'oriental', 'fresh', 'citrus', 'gourmand'];

  const sectionStyle = {
    marginBottom: '2rem',
    direction: isAr ? 'rtl' : 'ltr',
  };

  const labelStyle = {
    fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase',
    color: 'var(--color-gold)', marginBottom: '0.75rem', display: 'block',
  };

  const btnStyle = (active) => ({
    display: 'block', width: '100%', textAlign: isAr ? 'right' : 'left',
    padding: '0.6rem 1rem', marginBottom: '0.4rem',
    background: active ? 'rgba(201,168,76,0.15)' : 'transparent',
    color: active ? 'var(--color-gold)' : 'rgba(var(--text-rgb), 0.6)',
    borderRadius: 'var(--radius-full)', fontSize: '0.9rem',
    border: active ? '1px solid rgba(201,168,76,0.3)' : '1px solid transparent',
    transition: 'all 0.2s', cursor: 'pointer',
  });

  return (
    <aside style={{
      background: 'var(--color-charcoal)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-md)',
      padding: '1.5rem',
      position: 'sticky', top: 'calc(var(--navbar-height) + 1rem)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 400 }}>
          {t('shop.filters', { ns: 'pages' })}
        </h3>
        {(filters.gender || filters.category || filters.size || filters.minSize) && (
          <button onClick={() => onChange({ gender: '', category: '', sort: filters.sort, size: '', minSize: '' })}
            style={{ color: 'var(--color-gold)', fontSize: '0.75rem', textDecoration: 'underline' }}>
            {t('shop.clearFilters', { ns: 'pages' })}
          </button>
        )}
      </div>

      {/* Gender */}
      <div style={sectionStyle}>
        <span style={labelStyle}>{t('labels.gender')}</span>
        {genders.map(g => (
          <button key={g} onClick={() => onChange({ ...filters, gender: g })} style={btnStyle(filters.gender === g)}>
            {g ? t(`gender.${g}`) : t('gender.all')}
          </button>
        ))}
      </div>

      {/* Category */}
      <div style={sectionStyle}>
        <span style={labelStyle}>{t('labels.category')}</span>
        {categories.map(c => (
          <button key={c} onClick={() => onChange({ ...filters, category: c })} style={btnStyle(filters.category === c)}>
            {c ? t(`category.${c}`) : t('category.all')}
          </button>
        ))}
      </div>

      {/* Sort */}
      <div style={sectionStyle}>
        <span style={labelStyle}>{t('shop.sortBy', { ns: 'pages' })}</span>
        {[
          { val: '-createdAt', label: t('shop.sortNewest', { ns: 'pages' }) },
          { val: 'price', label: t('shop.sortPriceAsc', { ns: 'pages' }) },
          { val: '-price', label: t('shop.sortPriceDesc', { ns: 'pages' }) },
        ].map(s => (
          <button key={s.val} onClick={() => onChange({ ...filters, sort: s.val })} style={btnStyle(filters.sort === s.val)}>
            {s.label}
          </button>
        ))}
      </div>
    </aside>
  );
}
