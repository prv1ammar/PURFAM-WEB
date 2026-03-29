import { motion } from 'framer-motion';
import HeroSection from '@/components/home/HeroSection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import CategoryBanner from '@/components/home/CategoryBanner';
import BrandStory from '@/components/home/BrandStory';
import NewsletterSection from '@/components/home/NewsletterSection';

const pageVariants = {
  initial: { opacity: 0 },
  in: { opacity: 1, transition: { duration: 0.4 } },
  out: { opacity: 0, transition: { duration: 0.2 } },
};

export default function HomePage() {
  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants}>
      <HeroSection />
      <FeaturedProducts />
      <CategoryBanner />
      <BrandStory />
      <NewsletterSection />
    </motion.div>
  );
}
