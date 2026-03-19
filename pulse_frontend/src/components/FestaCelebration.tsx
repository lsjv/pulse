// src/components/FestaCelebration.tsx
import { useEffect, useState } from 'react';
import { Confetti } from './Confetti';
import { Sparkles, PartyPopper, Music } from 'lucide-react';
import confetti from 'canvas-confetti';

export function FestaCelebration() {
  const [visible, setVisible] = useState(true);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Contagem regressiva
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          // Disparar uma grande explosão final
          confetti({
            particleCount: 150,
            spread: 100,
            origin: { y: 0.6 }
          });
          setTimeout(() => setVisible(false), 1000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Múltiplas explosões de confetes durante a contagem
    const confettiInterval = setInterval(() => {
      // Explosão esquerda
      confetti({
        particleCount: Math.floor(Math.random() * 50) + 30,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      });
      
      // Explosão direita
      confetti({
        particleCount: Math.floor(Math.random() * 50) + 30,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      });
      
      // Explosão central aleatória
      confetti({
        particleCount: Math.floor(Math.random() * 30) + 20,
        angle: Math.random() * 180,
        spread: Math.random() * 70 + 30,
        origin: { 
          x: Math.random(),
          y: Math.random() * 0.5
        }
      });
    }, 800);

    return () => {
      clearInterval(timer);
      clearInterval(confettiInterval);
    };
  }, []);

  if (!visible) return null;

  return (
    <>
      <Confetti active={true} />
      <div className="fixed inset-0 bg-gradient-to-br from-purple-600/80 via-pink-600/80 to-orange-500/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white/95 rounded-3xl p-8 max-w-md w-full mx-4 text-center shadow-2xl animate-pulse border-4 border-white/30">
          <div className="flex justify-center gap-4 mb-6">
            <div className="animate-bounce">
              <PartyPopper className="w-12 h-12 text-purple-600" />
            </div>
            <div className="animate-pulse">
              <Sparkles className="w-12 h-12 text-pink-600" />
            </div>
            <div className="animate-bounce" style={{ animationDelay: '0.2s' }}>
              <Music className="w-12 h-12 text-yellow-600" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-yellow-500 bg-clip-text text-transparent mb-4">
            🎉 PULSE SOCIAL 🎉
          </h1>
          
          <p className="text-gray-800 text-lg mb-2 font-semibold">Bem-vindo à festa!</p>
          <p className="text-gray-600 mb-6">Conecte-se com a galera em tempo real</p>
          
          <div className="relative inline-block mb-6">
            <div className="text-6xl font-bold text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text animate-pulse">
              {countdown}
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 blur-xl opacity-30 -z-10"></div>
          </div>
          
          <p className="text-sm text-gray-500 mb-4 animate-pulse">
            A festa começa em {countdown} segundo{countdown !== 1 ? 's' : ''}...
          </p>
          
          <div className="space-y-3 text-gray-700">
            <div className="flex items-center justify-center gap-3 p-2 bg-purple-50 rounded-lg">
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
              <span>Posts em tempo real ⚡</span>
            </div>
            <div className="flex items-center justify-center gap-3 p-2 bg-pink-50 rounded-lg">
              <div className="w-3 h-3 bg-pink-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <span>Curtidas com confetes 🎊</span>
            </div>
            <div className="flex items-center justify-center gap-3 p-2 bg-yellow-50 rounded-lg">
              <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              <span>Interação total da galera 👥</span>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Prepare-se para a melhor experiência social!
            </p>
          </div>
        </div>
      </div>
    </>
  );
}