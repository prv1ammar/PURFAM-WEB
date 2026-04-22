import { motion } from 'framer-motion';
import HeroSection from '@/components/home/HeroSection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import CategoryBanner from '@/components/home/CategoryBanner';
import BrandStory from '@/components/home/BrandStory';
import NewsletterSection from '@/components/home/NewsletterSection';

const pageVariants = {
  initial: { opacity: 0, scale: 0.98 },
  in: { opacity: 1, scale: 1, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } },
  out: { opacity: 0, scale: 1.02, transition: { duration: 0.6, ease: "easeInOut" } },
};

export default function HomePage() {
  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants}>
      <HeroSection />
      <CategoryBanner />
      <FeaturedProducts />
      <BrandStory />
      <NewsletterSection />
    </motion.div>
  );
}
