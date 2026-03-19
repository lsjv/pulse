// src/hooks/useConfetti.ts
import { useCallback } from 'react';

export function useConfetti() {
  const launchConfetti = useCallback((options = {}) => {
    // Se já houver confetti global (do código que você mandou), usa ele
    if ((window as any).confetti) {
      (window as any).confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        ...options
      });
    }
  }, []);

  return launchConfetti;
}