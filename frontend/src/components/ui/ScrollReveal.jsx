import { motion } from 'framer-motion';

const directionMap = {
  up:    { opacity: 0, y: 60, x: 0, scale: 1 },
  down:  { opacity: 0, y: -60, x: 0, scale: 1 },
  left:  { opacity: 0, x: -60, y: 0, scale: 1 },
  right: { opacity: 0, x: 60, y: 0, scale: 1 },
  scale: { opacity: 0, scale: 0.85, y: 0, x: 0 },
  fade:  { opacity: 0, y: 0, x: 0, scale: 1 },
};

export default function ScrollReveal({
  children,
  delay = 0,
  direction = 'up',
  duration = 0.75,
  amount = 0.15,
  className,
  style,
  as = 'div',
}) {
  const MotionTag = motion[as] || motion.div;

  return (
    <MotionTag
      initial={directionMap[direction]}
      whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      viewport={{ once: true, amount }}
      transition={{ duration, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
      style={style}
    >
      {children}
    </MotionTag>
  );
}
