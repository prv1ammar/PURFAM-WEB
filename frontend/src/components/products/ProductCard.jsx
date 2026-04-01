import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useCart } from '@/context/CartContext';

export default function ProductCard({ product }) {
  const { t, i18n } = useTranslation();
  const { addItem } = useCart();
  const [hovered, setHovered] = useState(false);
  const [added, setAdded] = useState(false);
  const isAr = i18n.language === 'ar';

  const name = isAr ? product.name.ar : product.name.en;
  const minPrice = Math.min(...product.sizes.map(s => s.price));
  const defaultSize = product.sizes[0]?.ml;
  const image = product.images?.[0] || `https://images.unsplash.com/photo-1541643600914-78b084683702?w=500`;

  const handleAdd = async (e) => {
    e.preventDefault();
    await addItem(product, defaultSize, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="group relative flex flex-col h-full overflow-hidden"
    >
      <Link to={`/shop/${product._id}`} className="block relative flex-grow overflow-hidden aspect-4-5 bg-black rounded-md">
        <motion.img
          src={image}
          alt={name}
          animate={{ scale: hovered ? 1.05 : 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-full object-cover transition-all duration-700"
          style={{ filter: hovered ? 'brightness(1)' : 'brightness(0.9)' }}
        />
        
        {/* Hover Overlay with Add Button */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0 }}
          className="absolute inset-x-0 bottom-0 p-4 z-20 flex"
          style={{ padding: '1rem' }}
        >
          <button
            onClick={handleAdd}
            className={`w-full py-3 text-xs uppercase tracking-widest font-bold transition-all duration-300 rounded-full shadow-lg ${added ? 'bg-theme text-theme' : 'bg-gold text-btn hover:bg-gold-light'}`}
            style={{ width: '100%', padding: '0.75rem 0' }}
          >
            {added ? t('btn.addedToCart') : t('btn.addToCart')}
          </button>
        </motion.div>

        {/* Brand Tag */}
        <div className="absolute z-10" style={{ top: '1rem', left: '1rem', right: '1rem' }}>
            <span className="text-[10px] md:text-xs uppercase tracking-w-3 font-medium text-white drop-shadow-md" style={{ display: 'inline-block', background: 'rgba(0,0,0,0.4)', padding: '0.3rem 0.6rem', borderRadius: 'var(--radius-md)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}>
                {product.brand}
            </span>
        </div>
      </Link>

      <div className={`py-6 flex flex-col gap-2 ${isAr ? 'text-right' : 'text-left'}`}>
        <h3 className="text-xl font-serif text-theme-90 leading-tight hover:text-gold transition-all duration-300" style={{ transitionProperty: 'color' }}>
           {name}
        </h3>
        <div className="flex items-center justify-between mt-1">
            <p className="text-gold font-serif text-lg tracking-tight">
                {t('labels.from')} {minPrice} dh
            </p>
            <div className="flex gap-[2px]">
              {[1, 2, 3, 4, 5].map(s => (
                <span key={s} className={`text-xs ${s <= Math.round(product.ratings?.average || 5) ? 'text-gold' : 'text-theme-40'}`}>★</span>
              ))}
            </div>
        </div>
      </div>
    </motion.div>
  );
}
