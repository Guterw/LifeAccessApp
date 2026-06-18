// src/hooks/useKeyboardOpen.js
import { useState, useEffect } from 'react';

export function useKeyboardOpen(threshold = 150) {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return; // navegador sem suporte: nunca acusa teclado aberto

    const handleResize = () => {
      const heightDiff = window.innerHeight - vv.height;
      setIsKeyboardOpen(heightDiff > threshold);
    };

    handleResize();
    vv.addEventListener('resize', handleResize);
    return () => vv.removeEventListener('resize', handleResize);
  }, [threshold]);

  return isKeyboardOpen;
}