import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Disable browser's native scroll restoration so it doesn't fight us
if (typeof window !== 'undefined') {
  window.history.scrollRestoration = 'manual';
}

export default function ScrollToTop() {
  const { key } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [key]);
  return null;
}
