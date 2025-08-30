import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

interface PhaserGameProps {
  onBallComplete: (multiplier: number) => void;
  onBallDrop: () => void;
  betAmount: number;
}

export interface PhaserGameRef {
  dropBall: () => void;
}

export const PhaserGame = forwardRef<PhaserGameRef, PhaserGameProps>(({ onBallComplete, onBallDrop, betAmount }, ref) => {
  const gameRef = useRef<HTMLDivElement>(null);
  const phaserGameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!gameRef.current || typeof window === 'undefined') return;

    const initPhaser = async () => {
      const Phaser = await import('phaser');
      const { PlinkoScene } = await import('./scenes/PlinkoScene');

      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        parent: gameRef.current,
        backgroundColor: '#0f1419',
        antialias: true,
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH,
          width: 800,
          height: 600
        },
        physics: {
          default: 'matter',
          matter: {
            gravity: { x: 0, y: 1.2 },
            debug: false,
            enableSleeping: true
          }
        }
      };  

      const scene = new PlinkoScene(onBallComplete, onBallDrop, betAmount);
      config.scene = [scene];

      const game = new Phaser.Game(config);
      phaserGameRef.current = game;
    };

    initPhaser();

    return () => {
      if (phaserGameRef.current) {
        phaserGameRef.current.destroy(true);
        phaserGameRef.current = null;
      }
    };
  }, [onBallComplete, onBallDrop, betAmount]);

  // Update scene with new callbacks when they change
  useEffect(() => {
    if (phaserGameRef.current && phaserGameRef.current.scene.scenes[0]) {
      const scene = phaserGameRef.current.scene.scenes[0] as Phaser.Scene & {
        updateCallbacks?: (onBallComplete: (multiplier: number) => void, onBallDrop: () => void, betAmount: number) => void;
      };
      if (scene.updateCallbacks) {
        scene.updateCallbacks(onBallComplete, onBallDrop, betAmount);
      }
    }
  }, [onBallComplete, onBallDrop, betAmount]);

  const dropBall = () => {
    if (phaserGameRef.current && phaserGameRef.current.scene.scenes[0]) {
      const scene = phaserGameRef.current.scene.scenes[0] as Phaser.Scene & {
        dropBall?: () => void;
      };
      if (scene.dropBall) {
        scene.dropBall();
      }
    }
  };

  // Expose dropBall method to parent component
  useImperativeHandle(ref, () => ({
    dropBall
  }), []);

  return (
    <div className="game-canvas relative w-full max-w-4xl mx-auto">
      <div
        ref={gameRef}
        className="w-full aspect-[4/3] border border-casino-gold/30 rounded-xl overflow-hidden shadow-2xl"
        style={{
          minHeight: '600px',
          background: 'linear-gradient(135deg, hsl(var(--casino-dark)) 0%, hsl(var(--casino-purple)) 50%, hsl(var(--casino-dark)) 100%)',
          boxShadow: '0 0 50px hsl(var(--casino-gold) / 0.3), inset 0 0 20px hsl(var(--casino-purple) / 0.2)'
        }}
      />
    </div>
  );
});

PhaserGame.displayName = 'PhaserGame';