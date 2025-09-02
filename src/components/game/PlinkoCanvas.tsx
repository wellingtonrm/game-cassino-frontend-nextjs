import React, { useRef, useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { useSSRSafe } from '@/hooks/useSSRSafe';
import { usePlinkoStore } from '@/stores/plinkoStore';
import Matter from "matter-js";


interface PlinkoCanvasProps {
  onBallComplete?: (multiplier: number) => void;
  onBallDrop?: () => void;
  betAmount?: number;
  ballWeight?: number;
  ballFriction?: number;
  ballSize?: number;
}

export interface PlinkoCanvasRef {
  dropBall: () => void;
}

/**
 * Componente PlinkoCanvas
 * 
 * Jogo Plinko baseado em CSS/HTML com motor de física Matter.js.
 * Segue os princípios de design Material You para experiência visual consistente.
 */
export const PlinkoCanvas = forwardRef<PlinkoCanvasRef, PlinkoCanvasProps>(({
  onBallComplete,
  onBallDrop,
  betAmount = 100,
  ballWeight = 1,
  ballFriction = 0.1,
  ballSize = 6
}, ref) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const ballRef = useRef<HTMLDivElement | null>(null);
  const zoneElementsRef = useRef<HTMLDivElement[]>([]);
  const isSSRSafeMounted = useSSRSafe();
  const { animating } = usePlinkoStore();

  // Configuração do Plinko seguindo especificações profissionais
  const ROWS = 9;
  const CANVAS_WIDTH = 380;
  const CANVAS_HEIGHT = 420; // Altura aumentada para melhor distribuição  
  const PEG_RADIUS = 4;
  const BALL_RADIUS = ballSize || 6;
  const ROW_SPACING = 35; // Melhor espaçamento para dispositivos móveis
  const START_Y = 60; // Mais espaço no topo
  const MULTIPLIERS = [2.5, 2.0, 1.7, 1.2, 1.0, 0.5, 1.0, 1.2, 1.7, 2.0, 2.5];

  // Initialize Matter.js engine
  useEffect(() => {
    // Only initialize Matter.js on the client side after mounting and when canvasRef is available
    if (!isSSRSafeMounted || !canvasRef.current) {
      return;
    }

    const initMatterEngine = () => {
      console.log('Initializing Matter.js engine...');
      
      // Create Matter.js engine with natural physics
      const engine = Matter.Engine.create();
      engine.world.gravity.y = 0.8; // More natural gravity
      engine.world.gravity.x = 0;
      
      // Standard engine timing
      engine.timing.timeScale = 1;
      
      engineRef.current = engine;
      
      console.log('Matter.js engine created:', engine);

      // Create world boundaries
      const walls = [
          // Left wall
          Matter.Bodies.rectangle(-10, CANVAS_HEIGHT / 2, 20, CANVAS_HEIGHT, { 
            isStatic: true,
            label: 'wall'
          }),
          // Right wall  
          Matter.Bodies.rectangle(CANVAS_WIDTH + 10, CANVAS_HEIGHT / 2, 20, CANVAS_HEIGHT, { 
            isStatic: true,
            label: 'wall'
          }),
          // Bottom wall
          Matter.Bodies.rectangle(CANVAS_WIDTH / 2, CANVAS_HEIGHT + 10, CANVAS_WIDTH, 20, { 
            isStatic: true,
            label: 'wall'
          })
        ];

      // Create pegs in pyramid formation with organic positioning
      const pegs: Matter.Body[] = [];
      const pyramidCenterX = CANVAS_WIDTH / 2 + 15; // Move 15px to the right
      const pegMargin = PEG_RADIUS + 8; // Margin for boundaries
      
      for (let row = 0; row < ROWS; row++) {
        const pegsInRow = row + 3; // 3,4,5,6,7,8,9,10,11 pinos por linha
        
        // Base row uses centered width, other rows scale proportionally
        let rowWidth;
        if (row === ROWS - 1) {
          // Última linha (base com 11 pinos) usa largura centralizada
          rowWidth = CANVAS_WIDTH - (pegMargin * 2);
        } else {
          // Outras linhas escalam proporcionalmente à base
          const baseRowPegs = ROWS + 2; // 11 pegs in base row
          const widthRatio = (pegsInRow - 1) / (baseRowPegs - 1);
          rowWidth = (CANVAS_WIDTH - (pegMargin * 2)) * widthRatio;
        }
        
        const startX = pyramidCenterX - rowWidth / 2;
        const pegSpacing = pegsInRow > 1 ? rowWidth / (pegsInRow - 1) : 0;
        
        for (let col = 0; col < pegsInRow; col++) {
          const baseX = pegsInRow === 1 ? pyramidCenterX : startX + col * pegSpacing;
          const baseY = START_Y + row * ROW_SPACING;
          
          // Adicionar aleatoriedade orgânica às posições dos pinos
          const randomOffsetX = (Math.random() - 0.5) * 8;
          const randomOffsetY = (Math.random() - 0.5) * 4;
          
          const x = baseX + randomOffsetX;
          const y = baseY + randomOffsetY;
          
          const peg = Matter.Bodies.circle(x, y, PEG_RADIUS, {
              isStatic: true,
              label: 'peg',
              restitution: 0.3, // Reduced bounce for more natural feel
              friction: 0.05, // Minimal friction
              frictionStatic: 0.05
            });
          
          pegs.push(peg);
        }
      }

      // Create multiplier zones with physics bodies for ball containment
      const zones: Matter.Body[] = [];
      const lastPegY = START_Y + (ROWS - 1) * ROW_SPACING;
      const zoneY = lastPegY + 20;
      const zoneHeight = 48;
      
      // Use consistent zone calculation with visual rendering - no gaps
      const availableWidth = CANVAS_WIDTH;
      const zoneWidth = availableWidth / MULTIPLIERS.length;
      
      for (let i = 0; i < MULTIPLIERS.length; i++) {
        const zoneX = i * zoneWidth + zoneWidth / 2;
        
        // Create zone walls for ball containment - only between zones, not at edges
        if (i > 0) {
          const leftWall = Matter.Bodies.rectangle(
            i * zoneWidth,
            zoneY + zoneHeight / 2,
            2, // Wall thickness
            zoneHeight,
            { 
              isStatic: true,
              label: 'zone-wall',
              render: { visible: false }
            }
          );
          zones.push(leftWall);
        }
        
        // Create zone floor for ball to rest
        const zoneFloor = Matter.Bodies.rectangle(
          zoneX,
          zoneY + zoneHeight - 2,
          zoneWidth * 0.95,
          4,
          { 
            isStatic: true,
            label: 'zone-floor',
            render: { visible: false }
          }
        );
        
        // Create trigger zone for detection
        const triggerZone = Matter.Bodies.rectangle(
          zoneX,
          zoneY + zoneHeight / 2,
          zoneWidth * 0.9,
          zoneHeight * 0.8,
          { 
            isStatic: true, 
            isSensor: true,
            label: `zone-${i}`,
            render: { visible: false }
          }
        );
        
        zones.push(zoneFloor, triggerZone);
      }

      // Adicionar todos os corpos ao mundo
      Matter.World.add(engine.world, [...walls, ...pegs, ...zones]);

      // Iniciar o motor
      const runner = Matter.Runner.create();
      Matter.Runner.run(runner, engine);
    };

    initMatterEngine();

    // Limpar motor ao desmontar
    return () => {
      if (engineRef.current) {
        Matter.Engine.clear(engineRef.current);
        engineRef.current = null;
      }
    };
  }, [isSSRSafeMounted, canvasRef.current]);

  // Ball drop function
  const dropBall = () => {
    if (!engineRef.current) {
      return;
    }
    
    usePlinkoStore.setState({ animating: true });
    
    // Notify parent component that animation has started
    onBallDrop?.();

    // Create ball physics body with completely natural properties
    const ballWeightMultiplier = ballWeight || 1;
    
    // Natural drop position with minimal randomness
    const dropX = CANVAS_WIDTH / 2 + 15 + (Math.random() - 0.5) * 5;
    
    // Create ball with pure natural physics - no artificial effects
    const ballBody = Matter.Bodies.circle(
      dropX,
      30,
      BALL_RADIUS,
      {
        restitution: 0.4, // Natural bounce
        friction: 0.005, // Minimal friction
        frictionAir: 0.0005, // Minimal air resistance
        density: 0.001 * ballWeightMultiplier,
        frictionStatic: 0.005
      }
    );

    // Create visual ball element with simple appearance
    const ballSizePx = BALL_RADIUS * 2;
    const ballElement = document.createElement('div');
    ballElement.className = 'absolute rounded-full z-20';
    ballElement.style.width = `${ballSizePx}px`;
    ballElement.style.height = `${ballSizePx}px`;
    ballElement.style.background = 'radial-gradient(circle at 30% 30%, #fff59d, #ffeb3b, #ff9800)';
    ballElement.style.border = '1px solid rgba(255, 152, 0, 0.3)';
    ballElement.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
    
    if (canvasRef.current) {
      canvasRef.current.appendChild(ballElement);
      ballRef.current = ballElement;
    } else {
      return;
    }

    // Add ball to physics world
    Matter.World.add(engineRef.current.world, [ballBody]);

    // Add collision detection for natural physics and zone effects
    Matter.Events.on(engineRef.current, 'collisionStart', (event: any) => {
      const pairs = event.pairs;
      
      pairs.forEach((pair: any) => {
        const { bodyA, bodyB } = pair;
        
        // Detect ball collision with zones
        if (bodyA === ballBody || bodyB === ballBody) {
          const otherBody = bodyA === ballBody ? bodyB : bodyA;
          
          // Zone collision detection
          if (otherBody.label?.startsWith('zone-')) {
            const zoneIndex = parseInt(otherBody.label.split('-')[1]);
            const multiplier = MULTIPLIERS[zoneIndex];
            
            // Trigger zone flash effect
            const zoneElement = zoneElementsRef.current[zoneIndex];
            if (zoneElement) {
              // Add flashing animation class
              zoneElement.style.animation = 'flash 0.6s ease-in-out 3';
              zoneElement.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.8), inset 0 0 20px rgba(255, 255, 255, 0.3)';
              
              // Reset animation after completion
              setTimeout(() => {
                zoneElement.style.animation = '';
                zoneElement.style.boxShadow = '';
              }, 1800);
            }
            
            // Stop animation
            usePlinkoStore.setState({ animating: false });
            
            // Clean up with delay to show the ball settling
            setTimeout(() => {
              if (engineRef.current && ballBody) {
                Matter.World.remove(engineRef.current.world, ballBody);
                if (ballRef.current) {
                  ballRef.current.remove();
                  ballRef.current = null;
                }
              }
            }, 800);
            
            // Notify completion
            setTimeout(() => {
              onBallComplete?.(multiplier);
            }, 900);
            
            return;
          }
        }
      });
    });

    // Natural animation loop - no artificial effects
    const animate = () => {
      if (!ballBody || !ballElement) {
        return;
      }

      const position = ballBody.position;
      const x = position.x - BALL_RADIUS;
      const y = position.y - BALL_RADIUS;
      
      // Pure positioning - no wobble or artificial effects
      ballElement.style.left = `${x}px`;
      ballElement.style.top = `${y}px`;

      // Check if ball fell below the game area (safety cleanup)
      if (position.y > CANVAS_HEIGHT + 50) {
        // Clean up
        if (engineRef.current) {
          Matter.World.remove(engineRef.current.world, ballBody);
        }
        ballElement.remove();
        ballRef.current = null;
        usePlinkoStore.setState({ animating: false });
        
        // Default to middle zone if no collision was detected
        const defaultMultiplier = MULTIPLIERS[Math.floor(MULTIPLIERS.length / 2)];
        
        setTimeout(() => {
          onBallComplete?.(defaultMultiplier);
        }, 100);
        
        return;
      }
      
      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  };

  // Expose dropBall method to parent
  useImperativeHandle(ref, () => ({
    dropBall
  }), [animating]);

  // Render pegs - adjusted to move right
  const renderPegs = () => {
    const pegs = [];
    const pyramidCenterX = CANVAS_WIDTH / 2 + 15; // Move 15px to the right
    const pegMargin = PEG_RADIUS + 8; // Margin for boundaries
    
    for (let row = 0; row < ROWS; row++) {
      const pegsInRow = row + 3; // 3,4,5,6,7,8,9,10,11 pegs per row
      
      // Base row uses centered width, other rows scale proportionally
      let rowWidth;
      if (row === ROWS - 1) {
        // Last row (base with 11 pegs) uses centered width
        rowWidth = CANVAS_WIDTH - (pegMargin * 2);
      } else {
        // Other rows scale proportionally to the base
        const baseRowPegs = ROWS + 2; // 11 pegs in base row
        const widthRatio = (pegsInRow - 1) / (baseRowPegs - 1);
        rowWidth = (CANVAS_WIDTH - (pegMargin * 2)) * widthRatio;
      }
      
      const startX = pyramidCenterX - rowWidth / 2;
      const pegSpacing = pegsInRow > 1 ? rowWidth / (pegsInRow - 1) : 0;
      
      for (let col = 0; col < pegsInRow; col++) {
        const x = pegsInRow === 1 ? pyramidCenterX : startX + col * pegSpacing;
        const y = START_Y + row * ROW_SPACING;
        
        pegs.push(
          <div
            key={`peg-${row}-${col}`}
            className="absolute bg-gradient-to-br from-purple-400 to-purple-600 rounded-full shadow-md"
            style={{
              width: `${PEG_RADIUS * 2}px`,
              height: `${PEG_RADIUS * 2}px`,
              left: `${x - PEG_RADIUS}px`,
              top: `${y - PEG_RADIUS}px`,
              boxShadow: '0 0 8px rgba(168, 85, 247, 0.4)'
            }}
          />
        );
      }
    }
    
    return pegs;
  };

  // Render multiplier zones using 100% of horizontal space with physics containers
  const renderMultiplierZones = () => {
    const lastPegY = START_Y + (ROWS - 1) * ROW_SPACING;
    const zoneY = lastPegY + 20;
    
    // Perfect equal distribution without gaps
    const availableWidth = CANVAS_WIDTH;
    const zoneWidth = availableWidth / MULTIPLIERS.length;
    
    // Clear previous zone elements
    zoneElementsRef.current = [];
    
    return MULTIPLIERS.map((multiplier, index) => {
      // Material You accent colors based on multiplier value
      let colorClasses = "";
      
      if (multiplier >= 2.5) {
        // Highest values (2.5x) - Red with smooth gradient
        colorClasses = "bg-gradient-to-br from-red-500 via-red-600 to-red-700 text-white";
      } else if (multiplier >= 2.0) {
        // High values (2.0x) - Orange with smooth gradient
        colorClasses = "bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 text-white";
      } else if (multiplier >= 1.7) {
        // Medium-high values (1.7x) - Amber with smooth gradient
        colorClasses = "bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 text-white";
      } else if (multiplier >= 1.2) {
        // Medium values (1.2x) - Yellow with smooth gradient
        colorClasses = "bg-gradient-to-br from-yellow-500 via-yellow-600 to-yellow-700 text-white";
      } else if (multiplier === 1.0) {
        // Base value (1.0x) - Blue with smooth gradient
        colorClasses = "bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white";
      } else {
        // Lowest value (0.5x) - Green with smooth gradient (loss)
        colorClasses = "bg-gradient-to-br from-green-500 via-green-600 to-green-700 text-white";
      }
      
      // Determine rounded corners - only first and last zones get top corners
      let roundedClass = "";
      if (index === 0) {
        roundedClass = "rounded-tl-lg"; // Top-left corner only
      } else if (index === MULTIPLIERS.length - 1) {
        roundedClass = "rounded-tr-lg"; // Top-right corner only
      }
      
      const zoneElement = (
        <div
          key={`zone-${index}`}
          ref={(el) => {
            if (el) zoneElementsRef.current[index] = el;
          }}
          className={cn(
            "absolute flex items-center justify-center text-xs font-bold transition-all duration-300",
            "shadow-lg backdrop-blur-sm",
            colorClasses,
            roundedClass
          )}
          style={{
            left: `${index * zoneWidth}px`, // No gaps between zones
            top: `${zoneY}px`,
            width: `${zoneWidth}px`,
            height: '48px',
          }}
        >
          {multiplier}x
        </div>
      );
      
      return zoneElement;
    });
  };

  // Estado de carregamento para SSR
  if (!isSSRSafeMounted) {
    return (
      <div 
        className="w-full flex items-center justify-center bg-[#0f1419] rounded-xl border border-purple-500/30" 
        style={{ height: CANVAS_HEIGHT }}
      >
        <div className="text-purple-300 text-lg font-medium">Loading Game...</div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto">
      <div
        ref={canvasRef}
        className="relative w-full  rounded-xl overflow-hidden shadow-2xl"
        style={{
          height: CANVAS_HEIGHT,
          background: `
            radial-gradient(circle at 0% 0%, #0f1419 0%, transparent 50%),
            radial-gradient(circle at 100% 0%, #1a1a2e 0%, transparent 50%),
            radial-gradient(circle at 0% 100%, #0a0a15 0%, transparent 50%),
            radial-gradient(circle at 100% 100%, #151826 0%, transparent 50%),
            rgba(0, 0, 0, 0.3)
          `,
          boxShadow: '0 0 30px rgba(168, 85, 247, 0.3), inset 0 0 20px rgba(168, 85, 247, 0.1)'
        }}
      >
        {/* CSS Animation for zone flashing */}
        <style jsx>{`
          @keyframes flash {
            0%, 100% {
              filter: brightness(1);
              transform: scale(1);
            }
            50% {
              filter: brightness(1.5);
              transform: scale(1.05);
            }
          }
        `}</style>
        {/* Pegs */}
        {renderPegs()}
        
        {/* Multiplier zones */}
        {renderMultiplierZones()}
        
        {/* Drop indicator - centered with pyramid */}
        <div 
          className="absolute w-4 h-1 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full"
          style={{ 
            left: `${(CANVAS_WIDTH / 2 + 15) - 8}px`, // Match pyramid center
            top: '10px',
            boxShadow: '0 0 10px rgba(168, 85, 247, 0.6)'
          }}
        />
      </div>
    </div>
  );
});

PlinkoCanvas.displayName = 'PlinkoCanvas';