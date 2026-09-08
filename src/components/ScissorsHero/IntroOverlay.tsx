import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// Self-contained: gerencia seu próprio timer, sem dependência de estado externo
export default function IntroOverlay({ onComplete }: { onComplete?: () => void }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Abre depois de 1.4s para dar tempo de ver a tesoura
    const timer = setTimeout(() => setOpen(true), 1400);
    return () => clearTimeout(timer);
  }, []);

  const baseStyle: React.CSSProperties = {
    position: 'fixed',
    left: 0,
    right: 0,
    background: '#1A1A1A',
    zIndex: 100,
    pointerEvents: open ? 'none' : 'auto',
  };

  return (
    <>
      <motion.div
        animate={{ y: open ? '-100%' : '0%' }}
        transition={{ duration: 0.9, ease: 'easeInOut' }}
        style={{ ...baseStyle, top: 0, height: '50vh' }}
      />
      <motion.div
        animate={{ y: open ? '100%' : '0%' }}
        transition={{ duration: 0.9, ease: 'easeInOut' }}
        onAnimationComplete={() => { if (open && onComplete) onComplete(); }}
        style={{ ...baseStyle, bottom: 0, height: '50vh' }}
      />
    </>
  );
}
