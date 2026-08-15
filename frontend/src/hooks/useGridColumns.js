import { useState, useEffect } from 'react';

function columnsForWidth(w) {
  if (w <= 768) return 2;
  if (w <= 1024) return 3;
  if (w <= 1440) return 4;
  return 5;
}

export default function useGridColumns() {
  const [cols, setCols] = useState(() => columnsForWidth(typeof window !== 'undefined' ? window.innerWidth : 1440));

  useEffect(() => {
    const onResize = () => setCols(columnsForWidth(window.innerWidth));
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return cols;
}
