import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import logoImg from '@/assets/logo.png';

const AGENT_URL = import.meta.env.VITE_AGENT_URL || 'http://localhost:8000';

const GREETINGS = [
  { text: 'Looking for your signature scent? 🌹',     rtl: false },
  { text: 'Vous cherchez votre parfum idéal ? 🌹',    rtl: false },
  { text: 'تبحث عن عطرك المميز؟ 🌹',                  rtl: true  },
  { text: 'كتقلب على العطر ديالك؟ 🌹',               rtl: true  },
  { text: 'Discover luxury fragrances ✦',             rtl: false },
  { text: 'اكتشف أفضل العطور الفاخرة ✦',              rtl: true  },
];

function GreetingBubble({ onOpen }) {
  const [visible, setVisible]   = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [msgIndex, setMsgIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [typing, setTyping]     = useState(true);

  // Show after 2s delay
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(t);
  }, []);

  // Typewriter effect
  useEffect(() => {
    if (!visible || dismissed) return;
    const full = GREETINGS[msgIndex].text;
    setDisplayed('');
    setTyping(true);
    let i = 0;
    const type = setInterval(() => {
      i++;
      setDisplayed(full.slice(0, i));
      if (i >= full.length) {
        clearInterval(type);
        setTyping(false);
        // After reading pause, cycle to next message
        setTimeout(() => {
          setMsgIndex(prev => (prev + 1) % GREETINGS.length);
        }, 3200);
      }
    }, 45);
    return () => clearInterval(type);
  }, [visible, msgIndex, dismissed]);

  if (dismissed) return null;

  const isRtl = GREETINGS[msgIndex].rtl;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.9 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          onClick={onOpen}
          style={{
            position: 'fixed',
            bottom: '5.6rem',
            right: '1.75rem',
            zIndex: 8998,
            width: '248px',
            cursor: 'pointer',
            direction: isRtl ? 'rtl' : 'ltr',
            userSelect: 'none',
          }}
        >
          {/* Main card */}
          <div style={{
            background: 'linear-gradient(145deg, #1e1916 0%, #2a2118 100%)',
            borderRadius: '18px 18px 4px 18px',
            padding: '1rem 1.1rem 0.9rem',
            boxShadow: '0 12px 40px rgba(0,0,0,0.28), 0 0 0 1px rgba(255,255,255,0.07)',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Top accent line */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
              background: 'linear-gradient(90deg, transparent, var(--terracotta), transparent)',
              borderRadius: '18px 18px 0 0',
            }} />

            {/* Header row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.55rem',
              flexDirection: isRtl ? 'row-reverse' : 'row' }}>
              <img src={logoImg} alt="LE" style={{
                width: '18px', height: '18px', objectFit: 'contain',
                filter: 'brightness(0) invert(1)', opacity: 0.75, flexShrink: 0,
              }} />
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.48rem',
                letterSpacing: '0.2em', textTransform: 'uppercase',
                color: 'var(--terracotta)', opacity: 0.9,
              }}>Layla · Luxe Essence</span>

              {/* Dismiss */}
              <button
                onClick={e => { e.stopPropagation(); setDismissed(true); }}
                style={{
                  marginLeft: isRtl ? 0 : 'auto', marginRight: isRtl ? 'auto' : 0,
                  width: '18px', height: '18px', borderRadius: '50%',
                  background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)',
                  cursor: 'pointer', color: 'rgba(255,255,255,0.4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, transition: 'all 0.15s',
                }}
                onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = '#fff'; }}
                onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}
              >
                <svg width="7" height="7" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="1" y1="1" x2="9" y2="9"/><line x1="9" y1="1" x2="1" y2="9"/>
                </svg>
              </button>
            </div>

            {/* Message text */}
            <p style={{
              margin: 0,
              fontFamily: 'var(--font-serif)',
              fontSize: '0.9rem',
              lineHeight: 1.55,
              color: '#f0ebe4',
              letterSpacing: '0.01em',
              minHeight: '1.4em',
            }}>
              {displayed}
              {typing && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.55, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    display: 'inline-block', width: '2px', height: '0.85em',
                    background: 'var(--terracotta)', marginLeft: '2px',
                    verticalAlign: 'middle', borderRadius: '1px',
                  }}
                />
              )}
            </p>

            {/* CTA */}
            {!typing && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                style={{
                  marginTop: '0.65rem',
                  display: 'flex', alignItems: 'center', gap: '0.35rem',
                  flexDirection: isRtl ? 'row-reverse' : 'row',
                }}>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.52rem',
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.35)',
                }}>
                  {isRtl ? 'اضغط للمحادثة' : 'Tap to chat'}
                </span>
                <motion.svg
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                  width="10" height="10" viewBox="0 0 24 24" fill="none"
                  stroke="rgba(255,255,255,0.3)" strokeWidth="2.5" strokeLinecap="round"
                  style={{ transform: isRtl ? 'rotate(180deg)' : 'none', flexShrink: 0 }}>
                  <polyline points="9 18 15 12 9 6"/>
                </motion.svg>
              </motion.div>
            )}
          </div>

          {/* Bubble tail */}
          <div style={{
            position: 'absolute', bottom: '-7px',
            right: isRtl ? 'auto' : '18px', left: isRtl ? '18px' : 'auto',
            width: 0, height: 0,
            borderLeft: '8px solid transparent',
            borderRight: '8px solid transparent',
            borderTop: '8px solid #2a2118',
          }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const SUGGESTIONS = {
  en:  ['✦  Bestsellers', '✦  Fresh summer scent', '✦  Oud fragrances', '✦  How to order'],
  fr:  ['✦  Bestsellers', '✦  Parfum d\'été frais', '✦  Fragrances Oud', '✦  Comment commander'],
  ar:  ['✦  الأكثر مبيعًا', '✦  عطر منعش', '✦  عطور العود', '✦  كيف أطلب'],
  dar: ['✦  شنو كيبيعو بزاف', '✦  بغيت عطر فريش', '✦  عطور العود', '✦  كيفاش نطلب'],
};

const MSG_SUGGESTIONS = {
  en:  ['What are your bestsellers?', 'Find me a fresh summer perfume', 'Show Oud fragrances', 'How do I place an order?'],
  fr:  ['Quels sont vos bestsellers ?', 'Un parfum frais pour l\'été ?', 'Montrez-moi les Ouds', 'Comment passer une commande ?'],
  ar:  ['ما هي الأكثر مبيعًا؟', 'ابحث لي عن عطر منعش', 'أرني عطور العود', 'كيف أضع طلبًا؟'],
  dar: ['شنو كيبيعو بزاف عندكم؟', 'قلبلي على عطر فريش للصيف', 'عندكم عطور العود؟', 'كيفاش نطلب؟'],
};

function TypingDots() {
  return (
    <div style={{ display: 'flex', gap: '5px', alignItems: 'center', padding: '2px 0' }}>
      {[0, 1, 2].map(i => (
        <motion.span key={i}
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.18, ease: 'easeInOut' }}
          style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--terracotta)', display: 'block', opacity: 0.8 }}
        />
      ))}
    </div>
  );
}

function ProductCard({ product, isAr }) {
  const name = isAr ? (product.name?.ar || product.name?.en) : (product.name?.en || '');
  const price = product.price_from || product.sizes?.[0]?.price;

  return (
    <Link to={`/shop/${product.id}`} style={{ display: 'block', textDecoration: 'none', flexShrink: 0, width: '148px' }}>
      <div style={{
        background: '#fff', borderRadius: '12px', overflow: 'hidden',
        border: '1px solid rgba(0,0,0,0.07)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
        onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.12)'; }}
        onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'; }}
      >
        {product.image ? (
          <img src={product.image} alt={name} style={{ width: '100%', height: '106px', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: '106px', background: 'linear-gradient(135deg,#f5ede3,#e8d9c8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '1.8rem', opacity: 0.6 }}>🌸</span>
          </div>
        )}
        <div style={{ padding: '0.55rem 0.7rem 0.65rem' }}>
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: '0.78rem', color: '#1a1a1a', margin: 0, lineHeight: 1.35,
            overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {name}
          </p>
          <p style={{ fontSize: '0.6rem', color: '#888', margin: '3px 0 0', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            {product.brand}
          </p>
          {price && (
            <p style={{ fontSize: '0.72rem', color: 'var(--terracotta)', fontWeight: 600, margin: '5px 0 0', fontFamily: 'var(--font-mono)' }}>
              {isAr ? `من ${price} د` : `from ${price} dh`}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

function ChatMessage({ msg, isAr, logoImg }) {
  const isUser = msg.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      style={{
        display: 'flex',
        flexDirection: isUser ? 'row-reverse' : 'row',
        alignItems: 'flex-end',
        gap: '0.5rem',
      }}
    >
      {/* Avatar for assistant */}
      {!isUser && (
        <div style={{
          width: '26px', height: '26px', borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg,#1a1a1a,#2a2520)',
          border: '1px solid rgba(255,255,255,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '2px',
        }}>
          <img src={logoImg} alt="" style={{ width: '16px', height: '16px', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
        </div>
      )}

      <div style={{ maxWidth: '78%', display: 'flex', flexDirection: 'column', gap: '6px', alignItems: isUser ? 'flex-end' : 'flex-start' }}>
        <div style={{
          padding: '0.7rem 0.95rem',
          borderRadius: isUser ? '18px 18px 4px 18px' : '4px 18px 18px 18px',
          background: isUser
            ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2520 100%)'
            : '#ffffff',
          border: isUser ? 'none' : '1px solid rgba(0,0,0,0.07)',
          boxShadow: isUser ? '0 2px 12px rgba(0,0,0,0.18)' : '0 1px 6px rgba(0,0,0,0.06)',
          color: isUser ? '#f5f0eb' : '#1a1a1a',
          fontSize: '0.845rem',
          lineHeight: 1.65,
          fontFamily: 'var(--font-sans)',
          whiteSpace: 'pre-wrap',
          direction: isAr ? 'rtl' : 'ltr',
        }}>
          {msg.content}
        </div>

        {msg.products && msg.products.length > 0 && (
          <div style={{
            display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '4px',
            maxWidth: '100%', scrollbarWidth: 'thin',
          }}>
            {msg.products.map(p => (
              <ProductCard key={p.id} product={p} isAr={isAr} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function ChatWidget() {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const isAr = lang === 'ar' || lang === 'dar';
  const isDar = lang === 'dar';
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open && !started) {
      setStarted(true);
      setMessages([{
        role: 'assistant',
        content: isDar
          ? 'مرحبا! أنا ليلى، مستشارتك ديال العطور فـ Luxe Essence. كيفاش نقدر نعاونك؟ 🌹'
          : lang === 'ar'
          ? 'مرحبًا! أنا ليلى، مستشارتك للعطور في Luxe Essence. كيف أساعدك اليوم؟ 🌹'
          : lang === 'fr'
          ? 'Bonjour ! Je suis Layla, votre conseillère parfum chez Luxe Essence. Comment puis-je vous aider ? 🌹'
          : 'Hello! I\'m Layla, your perfume advisor at Luxe Essence. How can I help you today? 🌹',
        products: null,
      }]);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userText, products: null }]);
    setLoading(true);
    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);
      const res = await fetch(`${AGENT_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText, history }),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Agent error');
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply, products: data.products || null }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: isDar ? 'عذراً، وقع شي مشكل. عاود حاول.' : lang === 'ar' ? 'عذرًا، حدث خطأ. حاول مجددًا.' : lang === 'fr' ? 'Désolée, une erreur s\'est produite.' : 'Sorry, something went wrong. Please try again.',
        products: null,
      }]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = SUGGESTIONS[lang] || SUGGESTIONS.en;
  const msgSuggestions = MSG_SUGGESTIONS[lang] || MSG_SUGGESTIONS.en;

  return (
    <>
      {/* ── Greeting bubble (only when chat is closed) ── */}
      {!open && <GreetingBubble onOpen={() => setOpen(true)} />}

      {/* ── Floating Button ── */}
      <motion.button
        onClick={() => setOpen(o => !o)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.93 }}
        style={{
          position: 'fixed', bottom: '1.75rem', right: '1.75rem', zIndex: 9000,
          width: '60px', height: '60px', borderRadius: '50%',
          background: 'linear-gradient(145deg, #2a2520, #1a1a1a)',
          border: 'none', cursor: 'pointer', padding: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: open
            ? '0 4px 20px rgba(0,0,0,0.4)'
            : '0 4px 24px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.08)',
          transition: 'box-shadow 0.3s',
          overflow: 'hidden',
        }}
        aria-label="Open chat"
      >
        {/* Pulse ring when closed */}
        {!open && (
          <motion.span
            animate={{ scale: [1, 1.6], opacity: [0.3, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
            style={{
              position: 'absolute', inset: 0, borderRadius: '50%',
              border: '1.5px solid var(--terracotta)', pointerEvents: 'none',
            }}
          />
        )}
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}
              style={{ display: 'flex' }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2.2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </motion.span>
          ) : (
            <motion.span key="logo" initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.7, opacity: 0 }} transition={{ duration: 0.18 }}
              style={{ display: 'flex' }}>
              <img src={logoImg} alt="Luxe Essence" style={{ width: '36px', height: '36px', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* ── Chat Panel ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'fixed',
              right: '1.25rem', bottom: '5.5rem',
              top: '7.5rem',
              zIndex: 8999,
              width: '385px', maxWidth: 'calc(100vw - 2rem)',
              maxHeight: '600px',
              background: '#f7f3ee',
              borderRadius: '22px', overflow: 'hidden',
              display: 'flex', flexDirection: 'column',
              boxShadow: '0 28px 72px rgba(0,0,0,0.24), 0 0 0 1px rgba(0,0,0,0.06)',
              direction: isAr ? 'rtl' : 'ltr',
            }}
          >

            {/* ── Header ── */}
            <div style={{
              flexShrink: 0, position: 'relative', overflow: 'hidden',
              background: 'linear-gradient(150deg, #181512 0%, #241e18 60%, #1e1a15 100%)',
            }}>
              {/* Top terracotta line */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                background: 'linear-gradient(90deg, transparent 0%, var(--terracotta) 40%, #c8956a 60%, transparent 100%)' }} />

              {/* Subtle texture overlay */}
              <div style={{ position: 'absolute', inset: 0, opacity: 0.04,
                backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)',
                backgroundSize: '8px 8px', pointerEvents: 'none' }} />

              <div style={{ padding: '1.1rem 1.2rem 1rem', display: 'flex', alignItems: 'center', gap: '0.85rem', position: 'relative' }}>
                {/* Avatar */}
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '50%',
                    background: 'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.12), rgba(255,255,255,0.03))',
                    border: '1.5px solid rgba(255,255,255,0.14)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 0 20px rgba(180,90,40,0.3), inset 0 1px 0 rgba(255,255,255,0.08)',
                  }}>
                    <img src={logoImg} alt="LE" style={{ width: '32px', height: '32px', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
                  </div>
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                    style={{
                      position: 'absolute', bottom: '1px', right: '1px',
                      width: '12px', height: '12px', borderRadius: '50%',
                      background: '#4ade80', border: '2px solid #181512',
                      boxShadow: '0 0 8px rgba(74,222,128,0.8)', display: 'block',
                    }} />
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '3px' }}>
                    <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', color: '#f0ebe4', letterSpacing: '0.02em', fontWeight: 400 }}>
                      Layla
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontSize: '0.42rem', letterSpacing: '0.2em',
                      textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)',
                      border: '1px solid rgba(255,255,255,0.14)', borderRadius: '3px',
                      padding: '1px 4px',
                    }}>AI</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#4ade80', display: 'block', flexShrink: 0 }} />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.52rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.38)' }}>
                      {isDar ? 'متوفرة دابا' : lang === 'ar' ? 'متاحة الآن' : lang === 'fr' ? 'Disponible maintenant' : 'Available now'}
                    </span>
                  </div>
                </div>

                {/* Close */}
                <button onClick={() => setOpen(false)} style={{
                  width: '32px', height: '32px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.05)', cursor: 'pointer', color: 'rgba(255,255,255,0.45)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.18s', flexShrink: 0,
                }}
                  onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.11)'; e.currentTarget.style.color = '#fff'; }}
                  onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; }}
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>

              {/* Brand footer strip */}
              <div style={{
                padding: '0.4rem 1.2rem',
                background: 'rgba(0,0,0,0.25)',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                display: 'flex', alignItems: 'center', gap: '0.75rem',
              }}>
                <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.1))' }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.46rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)' }}>
                  ✦ &nbsp;LUXE ESSENCE&nbsp; ✦
                </span>
                <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg,rgba(255,255,255,0.1),transparent)' }} />
              </div>
            </div>

            {/* ── Messages ── */}
            <div style={{
              flex: 1, overflowY: 'auto', padding: '1.1rem 1rem 0.5rem',
              display: 'flex', flexDirection: 'column', gap: '0.85rem',
              scrollbarWidth: 'thin', scrollbarColor: 'rgba(0,0,0,0.1) transparent',
              minHeight: 0,
              background: 'linear-gradient(180deg,#f7f3ee 0%,#f4f0ea 100%)',
            }}>
              {messages.map((msg, i) => (
                <ChatMessage key={i} msg={msg} isAr={isAr} logoImg={logoImg} />
              ))}

              {loading && (
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem' }}>
                  <div style={{
                    width: '26px', height: '26px', borderRadius: '50%', flexShrink: 0,
                    background: 'linear-gradient(135deg,#1a1a1a,#2a2520)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <img src={logoImg} alt="" style={{ width: '16px', height: '16px', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
                  </div>
                  <div style={{ padding: '0.65rem 0.9rem', background: '#fff', border: '1px solid rgba(0,0,0,0.07)', borderRadius: '4px 18px 18px 18px', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
                    <TypingDots />
                  </div>
                </div>
              )}

              {/* Suggestion chips */}
              {messages.length === 1 && !loading && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.2rem', paddingLeft: '34px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.52rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.3)', marginBottom: '0.1rem' }}>
                    {isAr ? 'اقتراحات' : lang === 'fr' ? 'Suggestions' : 'Quick start'}
                  </span>
                  {suggestions.map((s, i) => (
                    <button key={s} onClick={() => sendMessage(msgSuggestions[i])}
                      style={{
                        padding: '0.5rem 0.9rem', fontSize: '0.75rem',
                        fontFamily: 'var(--font-sans)', cursor: 'pointer',
                        border: '1px solid rgba(0,0,0,0.1)',
                        borderRadius: '10px',
                        background: '#fff',
                        color: '#2a2520',
                        transition: 'all 0.18s',
                        textAlign: isAr ? 'right' : 'left',
                        letterSpacing: '0.01em',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                      }}
                      onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--terracotta)'; e.currentTarget.style.color = 'var(--terracotta)'; e.currentTarget.style.background = '#fff9f6'; }}
                      onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)'; e.currentTarget.style.color = '#2a2520'; e.currentTarget.style.background = '#fff'; }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* ── Input ── */}
            <div style={{
              flexShrink: 0,
              background: '#fff',
              borderTop: '1px solid rgba(0,0,0,0.07)',
              padding: '0.75rem 0.875rem',
            }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
                <textarea
                  ref={inputRef}
                  rows={1}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  placeholder={isDar ? 'كتب سؤالك...' : lang === 'ar' ? 'اكتب سؤالك...' : lang === 'fr' ? 'Posez votre question...' : 'Ask Layla anything...'}
                  style={{
                    flex: 1, resize: 'none',
                    border: '1.5px solid rgba(0,0,0,0.1)',
                    borderRadius: '14px', padding: '0.65rem 1rem',
                    fontFamily: 'var(--font-sans)', fontSize: '0.875rem',
                    color: '#1a1a1a', background: '#f9f7f4',
                    outline: 'none', lineHeight: 1.5, maxHeight: '100px',
                    direction: isAr ? 'rtl' : 'ltr', overflowY: 'auto',
                    transition: 'border-color 0.2s, background 0.2s',
                  }}
                  onFocus={e => { e.target.style.borderColor = 'var(--terracotta)'; e.target.style.background = '#fff'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(0,0,0,0.1)'; e.target.style.background = '#f9f7f4'; }}
                />
                <motion.button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || loading}
                  whileHover={input.trim() && !loading ? { scale: 1.06 } : {}}
                  whileTap={input.trim() && !loading ? { scale: 0.94 } : {}}
                  style={{
                    width: '42px', height: '42px', borderRadius: '50%', border: 'none',
                    background: input.trim() && !loading
                      ? 'linear-gradient(145deg,#2a2520,#1a1a1a)'
                      : 'rgba(0,0,0,0.08)',
                    color: input.trim() && !loading ? '#fff' : 'rgba(0,0,0,0.3)',
                    cursor: input.trim() && !loading ? 'pointer' : 'default',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: input.trim() && !loading ? '0 3px 12px rgba(0,0,0,0.2)' : 'none',
                    transition: 'background 0.2s, box-shadow 0.2s',
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                    style={{ transform: isAr ? 'rotate(180deg)' : 'none', marginLeft: isAr ? 0 : '1px' }}>
                    <line x1="22" y1="2" x2="11" y2="13"/>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                </motion.button>
              </div>
              {/* Powered by line */}
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.44rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.2)', textAlign: 'center', margin: '0.5rem 0 0' }}>
                ✦ &nbsp;Powered by Luxe Essence AI&nbsp; ✦
              </p>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
