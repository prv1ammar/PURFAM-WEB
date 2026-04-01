import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Section = ({ title, subtitle, children, dark = false }) => (
  <section className={`min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-8 py-20 ${dark ? 'bg-[#0a0a0a] text-white' : 'bg-white text-black'}`}>
    <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-4xl w-full text-center z-10"
    >
      <h2 className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter">{title}</h2>
      {subtitle && <p className="text-xl md:text-2xl text-gray-500 mb-12 max-w-2xl mx-auto">{subtitle}</p>}
      {children}
    </motion.div>
  </section>
);

const ParallaxImage = ({ src, speed = 0.2, top = "0%", left = "0%", size = "w-64" }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 200 * speed]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 20]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.1, 1]);

  return (
    <motion.div 
      ref={ref}
      style={{ y, rotate, scale, position: 'absolute', top, left }}
      className={`${size} z-0 pointer-events-none opacity-80`}
    >
      <img src={src} alt="Parallax Asset" className="w-full h-auto drop-shadow-2xl" />
    </motion.div>
  );
};

export default function DesignLessonPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div ref={containerRef} className="relative">
      {/* Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-[#d4af37] origin-left z-50"
        style={{ scaleX }}
      />

      {/* Hero Section */}
      <Section 
        title="MASTER THE ART OF MOTION" 
        subtitle="This is how you create 'WOW' experiences. Smooth, intentional, and breathtakingly dynamic."
        dark={true}
      >
        <motion.div 
           initial={{ opacity: 0, scale: 0.8 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 1.5, ease: "easeOut" }}
           className="mt-12"
        >
          <img src="/lessons/dark_gold.png" className="w-full max-w-md mx-auto rounded-xl shadow-[0_0_50px_rgba(212,175,55,0.3)]" />
        </motion.div>
        
        <ParallaxImage src="/lessons/dark_gold.png" speed={-0.5} top="10%" left="10%" size="w-32 opacity-20" />
        <ParallaxImage src="/lessons/ethereal_white.png" speed={0.4} top="60%" left="80%" size="w-48 opacity-30" />
      </Section>

      {/* Entry Animations */}
      <Section title="STAGGERED REVEALS" subtitle="Don't show it all at once. Let it breathe. Layer by layer.">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {[1, 2, 3].map((i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.2, duration: 0.6 }}
                    className="p-8 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-xl transition-shadow"
                >
                    <div className="w-12 h-12 bg-black text-white flex items-center justify-center rounded-full mb-4 text-xl font-bold">{i}</div>
                    <h3 className="text-xl font-bold mb-2">Step {i}</h3>
                    <p className="text-gray-500">Wait for the target. Trigger the motion. Capture the eye.</p>
                </motion.div>
            ))}
        </div>
      </Section>

      {/* Hover & Micro-interactions */}
      <Section title="THE MAGIC OF HOVER" subtitle="Every touch should feel alive. Subtle reactions build premium value." dark={true}>
        <div className="flex flex-wrap justify-center gap-6 mt-12">
            <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-[#d4af37] text-black font-bold rounded-full overflow-hidden relative group"
            >
                <span className="relative z-10">EXPLORE COLLECTION</span>
                <motion.div 
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "0%" }}
                    className="absolute inset-0 bg-white opacity-20 transition-transform duration-300"
                />
            </motion.button>

            <motion.div 
                whileHover={{ y: -10 }}
                className="px-8 py-4 bg-transparent border border-gray-700 text-white font-bold rounded-full cursor-pointer"
            >
                LEARN MORE
            </motion.div>
        </div>
      </Section>

      {/* Scroll Velocity Demo */}
      <div className="h-screen bg-white flex items-center justify-center overflow-hidden">
             <motion.h2 
                style={{ scale: useTransform(scrollYProgress, [0.7, 0.9], [1, 10]), opacity: useTransform(scrollYProgress, [0.7, 0.85], [1, 0]) }}
                className="text-[20vw] font-black tracking-tighter whitespace-nowrap"
             >
                IMPRESSIVE
             </motion.h2>
      </div>

      {/* Call to action */}
      <section className="py-20 bg-[#d4af37] text-black text-center px-8">
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="max-w-3xl mx-auto"
            >
                <h2 className="text-6xl font-black mb-8">READY TO CREATE THE NEXT WOW?</h2>
                <Link to="/shop">
                    <button className="px-12 py-6 bg-black text-white text-xl font-bold rounded-full hover:bg-gray-900 transition-colors">
                        GET STARTED NOW
                    </button>
                </Link>
            </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-gray-500 py-10 text-center">
            <p>&copy; 2024 DESIGN MASTERCLASS BY ANTIGRAVITY</p>
      </footer>
    </div>
  );
}
