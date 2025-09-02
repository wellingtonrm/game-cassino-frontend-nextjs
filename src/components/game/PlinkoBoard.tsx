import React, { useRef, useCallback, useEffect } from 'react';
import { usePlinkoStore, type PlinkoResult } from '@/stores/plinkoStore';
import { PlinkoCanvas, type PlinkoCanvasRef } from '@/components/game/PlinkoCanvas';

/**
 * PlinkoBoard Component
 * 
 * Main game board component that integrates CSS/HTML + Matter.js game with Zustand state management.
 * Handles ball dropping, game completion, and animation states.
 */
export const PlinkoBoard: React.FC = () => {
  const plinkoCanvasRef = useRef<PlinkoCanvasRef>(null);
  
  const { 
    settings, 
    isPlaying, 
    animating, 
    finishGame, 
    setAnimating 
  } = usePlinkoStore();

  const handleBallComplete = useCallback((multiplier: number) => {
    const payout = settings.betAmount * multiplier;
    const result: PlinkoResult = {
      multiplier,
      payout,
      betAmount: settings.betAmount,
      timestamp: new Date()
    };
    
    finishGame(result);
    console.log(`Ball landed with ${multiplier}x multiplier! Payout: ${payout}`);
  }, [settings.betAmount, finishGame]);

  const handleBallDrop = useCallback(() => {
    setAnimating(true);
  }, [setAnimating]);

  // Trigger ball drop when play button is pressed
  useEffect(() => {
    console.log('🔄 PlinkoBoard useEffect triggered:');
    console.log('  - isPlaying:', isPlaying);
    console.log('  - animating:', animating);
    console.log('  - plinkoCanvasRef.current:', !!plinkoCanvasRef.current);
    
    if (isPlaying && plinkoCanvasRef.current) {
      console.log('✅ All conditions met - Triggering ball drop!');
      console.log('  - Calling plinkoCanvasRef.current.dropBall()');
      plinkoCanvasRef.current.dropBall();
    } else {
      console.log('❌ Ball drop conditions not met:');
      console.log('  - isPlaying:', isPlaying, '(need: true)');
      console.log('  - plinkoCanvasRef.current:', !!plinkoCanvasRef.current, '(need: true)');
    }
  }, [isPlaying]);

  return (
    <div className="w-full">
      <PlinkoCanvas 
        ref={plinkoCanvasRef}
        betAmount={settings.betAmount}
        onBallComplete={handleBallComplete}
        onBallDrop={handleBallDrop}
        ballWeight={settings.ballWeight}
        ballFriction={settings.ballFriction}
        ballSize={settings.ballSize}
      />
    </div>
  );
};