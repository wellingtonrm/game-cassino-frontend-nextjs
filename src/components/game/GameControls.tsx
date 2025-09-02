import React from 'react';
import { Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePlinkoStore } from '@/stores/plinkoStore';
import { useSSRSafe } from '@/hooks/useSSRSafe';

interface GameControlsProps {
  onPlayClick: () => void;
  onBetChange: (amount: number) => void;
  onQuickBet: (multiplier: number) => void;
  onMaxBet: () => void;
  onRiskChange: (risk: 'low' | 'average' | 'high') => void;
  onBallWeightChange?: (weight: number) => void;
  onBallFrictionChange?: (friction: number) => void;
  onBallSizeChange?: (size: number) => void;
}

/**
 * GameControls Component
 * 
 * Android bottom sheet style game controls for bet management and game actions.
 * Includes play button, bet amount input, quick bet buttons, and risk selection.
 */
export const GameControls: React.FC<GameControlsProps> = ({
  onPlayClick,
  onBetChange,
  onQuickBet,
  onMaxBet,
  onRiskChange,
  onBallWeightChange,
  onBallFrictionChange,
  onBallSizeChange
}) => {
  const isMounted = useSSRSafe();
  const { 
    settings, 
    isPlaying, 
    animating, 
    getMaxBet 
  } = usePlinkoStore();

  return (
    <div className="bg-[#1a1a2e] border border-gray-700/50 rounded-t-2xl mx-1 p-3 shadow-2xl">
      {/* Play Button and Bet Amount - Thumb-friendly layout */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        {/* Play Button */}
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Action</label>
          <button 
            onClick={onPlayClick}
            disabled={isPlaying || animating}
            className={cn(
              "w-full py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center",
              (isPlaying || animating)
                ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg"
            )}
          >
            {(isPlaying || animating) ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Playing
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Play
              </>
            )}
          </button>
        </div>

        {/* Bet Amount */}
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Your Bet</label>
          <div className="relative">
            <input 
              type="number" 
              value={settings.betAmount}
              onChange={(e) => onBetChange(Number(e.target.value))}
              className="w-full bg-[#2a2a3e] border border-gray-600 rounded-lg px-3 py-1.5 text-white font-mono text-sm"
              min="1"
              max={isMounted ? getMaxBet() : 1000}
              placeholder="Bet amount"
            />
          </div>
        </div>
      </div>

      {/* Quick Bet Buttons */}
      <div className="flex gap-1 mb-3">
        <button 
          onClick={() => onQuickBet(0.5)}
          className="flex-1 bg-[#2a2a3e] hover:bg-gray-600 py-1.5 px-2 rounded text-xs transition-colors font-medium"
        >
          ½
        </button>
        <button 
          onClick={() => onQuickBet(2)}
          className="flex-1 bg-[#2a2a3e] hover:bg-gray-600 py-1.5 px-2 rounded text-xs transition-colors font-medium"
        >
          2x
        </button>
        <button 
          onClick={() => onQuickBet(10)}
          className="flex-1 bg-[#2a2a3e] hover:bg-gray-600 py-1.5 px-2 rounded text-xs transition-colors font-medium"
        >
          +10
        </button>
        <button 
          onClick={onMaxBet}
          className="flex-1 bg-[#2a2a3e] hover:bg-gray-600 py-1.5 px-2 rounded text-xs transition-colors font-medium"
        >
          MAX
        </button>
      </div>

      {/* Risk Selection */}
      <div className="mb-3">
        <label className="text-xs text-gray-400 mb-1 block">Risk Level</label>
        <div className="flex bg-[#2a2a3e] rounded-lg p-1">
          <button 
            onClick={() => onRiskChange('low')}
            className={cn(
              "flex-1 py-2 px-2 rounded text-sm font-medium transition-colors",
              settings.risk === 'low' ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-white'
            )}
          >
            Low
          </button>
          <button 
            onClick={() => onRiskChange('average')}
            className={cn(
              "flex-1 py-2 px-2 rounded text-sm font-medium transition-colors",
              settings.risk === 'average' ? 'bg-yellow-600 text-white' : 'text-gray-400 hover:text-white'
            )}
          >
            Average
          </button>
          <button 
            onClick={() => onRiskChange('high')}
            className={cn(
              "flex-1 py-2 px-2 rounded text-sm font-medium transition-colors",
              settings.risk === 'high' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'
            )}
          >
            High
          </button>
        </div>
      </div>

      {/* Controles de Física da Bola */}
      <div className="space-y-3">
        <label className="text-xs text-gray-400 mb-1 block">Física da Bola</label>
        
        {/* Peso da Bola */}
        <div>
          <label className="text-xs text-gray-500 block mb-1">Peso: {(settings.ballWeight || 1).toFixed(1)}x</label>
          <input 
            type="range"
            min="0.5"
            max="3.0"
            step="0.1"
            value={settings.ballWeight || 1}
            onChange={(e) => onBallWeightChange?.(Number(e.target.value))}
            className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Atrito da Bola */}
        <div>
          <label className="text-xs text-gray-500 block mb-1">Atrito: {(settings.ballFriction || 0.1).toFixed(2)}</label>
          <input 
            type="range"
            min="0.05"
            max="0.5"
            step="0.05"
            value={settings.ballFriction || 0.1}
            onChange={(e) => onBallFrictionChange?.(Number(e.target.value))}
            className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Tamanho da Bola */}
        <div>
          <label className="text-xs text-gray-500 block mb-1">Tamanho: {(settings.ballSize || 6).toFixed(0)}px</label>
          <input 
            type="range"
            min="4"
            max="12"
            step="1"
            value={settings.ballSize || 6}
            onChange={(e) => onBallSizeChange?.(Number(e.target.value))}
            className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};