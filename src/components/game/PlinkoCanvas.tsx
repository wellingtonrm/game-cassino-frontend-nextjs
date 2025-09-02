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

interface Engine  {
  
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
      
      // Create Matter.js engine with more natural physics
      const engine = Matter.Engine.create();
      engine.world.gravity.y = 0.35; // Even lighter gravity for smoother fall
      engine.world.gravity.x = (Math.random() - 0.5) * 0.01; // Minimal horizontal variation
      engineRef.current = engine;
      
      console.log('Matter.js engine created:', engine);

      // Create world boundaries
      const walls = [
          // Left wall
          Matter.Bodies.rectangle(-10, CANVAS_HEIGHT / 2, 20, CANVAS_HEIGHT, { isStatic: true }),
          // Right wall  
          Matter.Bodies.rectangle(CANVAS_WIDTH + 10, CANVAS_HEIGHT / 2, 20, CANVAS_HEIGHT, { isStatic: true }),
          // Bottom wall
          Matter.Bodies.rectangle(CANVAS_WIDTH / 2, CANVAS_HEIGHT + 10, CANVAS_WIDTH, 20, { isStatic: true })
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
              restitution: 0.9 + (Math.random() * 0.05), // Maior elasticidade para fluidez
              friction: 0.0001, // Atrito ultra-baixo
              frictionStatic: 0.0001 // Prevenir aderência
            });
          
          pegs.push(peg);
        }
      }

      // Create multiplier zones using 100% horizontal space
      const zones: Matter.Body[] = [];
      const lastPegY = START_Y + (ROWS - 1) * ROW_SPACING;
      const zoneY = lastPegY + 35; // Professional spacing below pyramid
      
      // Distribuição de largura total para caixas de multiplicador
      const zoneWidth = CANVAS_WIDTH / MULTIPLIERS.length; // 100% width divided equally
      
      for (let i = 0; i < MULTIPLIERS.length; i++) {
        const zone = Matter.Bodies.rectangle(
          i * zoneWidth + zoneWidth / 2, // Full width distribution
          zoneY + 25,
          zoneWidth * 0.95, // Pequena lacuna entre zonas para clareza visual
          50,
          { 
            isStatic: true, 
            isSensor: true,
            label: `zone-${i}`,
            render: { visible: false }
          }
        );
        zones.push(zone);
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
    console.log('🎯 dropBall called - conditions:');
    console.log('  - engineRef.current:', !!engineRef.current);
    console.log('  - animating:', animating);
    if (!engineRef.current) {
      console.log('❌ Cannot drop ball - Matter.js engine not initialized');
      return;
    }
    
    console.log('✅ All conditions met - Starting ball drop animation...');
    usePlinkoStore.setState({ animating: true });
    
    // Notify parent component that animation has started
    setTimeout(() => {
      onBallDrop?.();
    }, 50); // Pequeno atraso para garantir que o estado local seja atualizado primeiro

    // Criar corpo físico da bola com propriedades ultra-fluidas e orgânicas
    const ballWeightMultiplier = ballWeight || 1;
    const ballFrictionValue = ballFriction || 0.05;
    
    // Adicionar aleatoriedade sutil à posição de queda para sensação orgânica
    const dropX = CANVAS_WIDTH / 2 + 15 + (Math.random() - 0.5) * 20;
    
    // Criar bola ultra-fluida e orgânica com mínima aderência
    const ballBody = Matter.Bodies.circle(
      dropX,
      30,
      BALL_RADIUS,
      {
        restitution: 0.75 + (Math.random() * 0.15), // Elasticidade aumentada para fluidez
        friction: 0.0005, // Atrito reduzido para movimento mais suave
        frictionAir: 0.008 + (Math.random() * 0.004), // Menor resistência do ar
        density: 0.0008 * ballWeightMultiplier, // Sensação mais leve
        frictionStatic: 0.0001, // Minimizar aderência


      }
    );
    
    // Adicionar efeito de vento sutil e rotação para movimento orgânico
    const windForce = (Math.random() - 0.5) * 0.001;
    const windDirection = Math.random() > 0.5 ? 1 : -1;
    Matter.Body.applyForce(ballBody, ballBody.position, { x: windForce * windDirection, y: 0 });
    
    console.log('🏀 Corpo físico da bola criado:', ballBody.id);

    // Create visual ball element with organic appearance
        const ballSizePx = BALL_RADIUS * 2;
        const ballElement = document.createElement('div');
        ballElement.className = 'absolute rounded-full transition-all duration-75 ease-linear z-20';
        ballElement.style.width = `${ballSizePx}px`;
        ballElement.style.height = `${ballSizePx}px`;
        ballElement.style.background = 'radial-gradient(circle at 30% 30%, #fff59d, #ffeb3b, #ff9800)';
        ballElement.style.border = '1px solid rgba(255, 152, 0, 0.3)';
        ballElement.style.boxShadow = 'inset -2px -2px 4px rgba(0,0,0,0.2), inset 2px 2px 4px rgba(255,255,255,0.5), 0 2px 8px rgba(0,0,0,0.3)';
    
    if (canvasRef.current) {
      canvasRef.current.appendChild(ballElement);
      ballRef.current = ballElement;
      console.log('🎨 Elemento visual da bola adicionado ao DOM');
    } else {
      console.log('❌ Não é possível adicionar a bola ao DOM - canvasRef não disponível');
      return;
    }

    // Add ball to physics world
    Matter.World.add(engineRef.current.world, [ballBody]);
    console.log('🌍 Bola adicionada ao mundo Matter.js');

    // Adicionar ouvintes de eventos para detecção de colisão com efeitos orgânicos
    Matter.Events.on(engineRef.current, 'collisionStart', (event: any) => {
      const pairs = event.pairs;
      
      pairs.forEach((pair: any) => {
        const { bodyA, bodyB } = pair;
        
        // Colisões orgânicas aprimoradas com física natural
        if ((bodyA === ballBody && bodyB.label === 'peg') || 
            (bodyB === ballBody && bodyA.label === 'peg')) {
          
          // Adicionar força aleatória sutil com variação orgânica
          const randomForce = {
            x: (Math.random() - 0.5) * 0.003,
            y: (Math.random() - 0.5) * 0.001
          };
            Matter.Body.applyForce(ballBody, ballBody.position, randomForce);
          
          // Adicionar rotação/giro orgânica
          const rotationForce = (Math.random() - 0.5) * 0.01;
          Matter.Body.setAngularVelocity(ballBody, rotationForce);
          
          // Aplicar variação natural de amortecimento
          const currentDamping = ballBody.frictionAir;
          Matter.Body.set(ballBody, 'frictionAir', currentDamping * (0.95 + Math.random() * 0.1));
        }
        
        // Adicionar resposta orgânica à colisão com parede
        if ((bodyA === ballBody && bodyB.label === 'wall') || 
            (bodyB === ballBody && bodyA.label === 'wall')) {
          const wallForce = {
            x: (Math.random() - 0.5) * 0.001,
            y: Math.random() * 0.0005
          };
          Matter.Body.applyForce(ballBody, ballBody.position, wallForce);
        }
        
        // Check if ball hit a zone
        if (bodyA === ballBody || bodyB === ballBody) {
          const otherBody = bodyA === ballBody ? bodyB : bodyA;
          
          if (otherBody.label?.startsWith('zone-')) {
            const zoneIndex = parseInt(otherBody.label.split('-')[1]);
            const multiplier = MULTIPLIERS[zoneIndex];
            
            // Calculate payout
            const payout = betAmount * multiplier;
            
            // Add organic damping for natural deceleration
           Matter.Body.setVelocity(ballBody, {
              x: ballBody.velocity.x * 0.8,
              y: ballBody.velocity.y * 0.8
            });
            
            // Stop the animation
            usePlinkoStore.setState({ animating: false });
            
            // Clean up physics with natural delay
            setTimeout(() => {
              if (engineRef.current && ballBody) {
                  Matter.World.remove(engineRef.current.world, ballBody);
                if (ballRef.current) {
                  ballRef.current.remove();
                  ballRef.current = null;
                }
              }
            }, 300); // Slightly longer for natural feel
            
            // Notify parent component
            setTimeout(() => {
              onBallComplete?.(multiplier);
            }, 400);
          }
        }
      });
    });
    
    // Add collision with pegs for more organic bounces
    Matter.Events.on(engineRef.current, 'collisionActive', (event: any) => {
      const pairs = event.pairs;
      
      pairs.forEach((pair: any) => {
        const { bodyA, bodyB } = pair;
        
        if ((bodyA === ballBody || bodyB === ballBody) && 
            (!bodyA.label?.startsWith('zone-') && !bodyB.label?.startsWith('zone-'))) {
          
          // Add subtle random force on peg collision for organic movement
          const randomForce = (Math.random() - 0.5) * 0.002;
          Matter.Body.applyForce(ballBody, ballBody.position, { 
            x: randomForce, 
            y: -randomForce * 0.5 
          });
        }
      });
    });

    // Animation loop with organic movement
    const animate = () => {
      if (!ballBody || !ballElement) {
        console.log('❌ Animação parada - corpo ou elemento da bola faltando');
        return;
      }

      const position = ballBody.position;
      const baseX = position.x - BALL_RADIUS;
      const baseY = position.y - BALL_RADIUS;
      
      // Ultra-subtle micro-wobble for fluid movement
      const wobbleX = Math.sin(Date.now() * 0.005) * 0.2;
      const wobbleY = Math.cos(Date.now() * 0.004) * 0.1;
      
      const x = baseX + wobbleX;
      const y = baseY + wobbleY;
      
      // Ultra-fluid positioning - simplified for performance
        ballElement.style.left = `${x}px`;
        ballElement.style.top = `${y}px`;

      // Check if ball reached bottom zones - 100% width calculation
      if (position.y > CANVAS_HEIGHT - 80) {
        console.log('🎯 Bola alcançou as zonas inferiores na posição:', position);
        
        // Calculate zone based on 100% width distribution
        const zoneWidth = CANVAS_WIDTH / MULTIPLIERS.length;
        const zoneIndex = Math.floor(position.x / zoneWidth);
        const clampedZone = Math.max(0, Math.min(MULTIPLIERS.length - 1, zoneIndex));
        const multiplier = MULTIPLIERS[clampedZone];
        
        console.log(`🎰 Bola aterrissou na zona ${clampedZone} com multiplicador ${multiplier}x`);

        // Clean up
        Matter.World.remove(engineRef.current!.world, ballBody);
        ballElement.remove();
        ballRef.current = null;
        usePlinkoStore.setState({ animating: false });
        
            console.log('🧹 Limpeza concluída - acionando callback de conclusão');

        // Trigger completion callback
        setTimeout(() => {
          console.log('📢 Calling onBallComplete with multiplier:', multiplier);
          onBallComplete?.(multiplier);
        }, 500);
        
        return;
      }

      // Ultra-light trail effect for fluid movement
        if (Math.random() < 0.2) { // 20% chance for minimal trail
          const trail = document.createElement('div');
          trail.className = 'absolute rounded-full pointer-events-none';
          trail.style.width = `${BALL_RADIUS * 0.8}px`;
          trail.style.height = `${BALL_RADIUS * 0.8}px`;
          trail.style.background = 'rgba(255,235,59,0.2)';
          trail.style.left = `${position.x - BALL_RADIUS * 0.4}px`;
          trail.style.top = `${position.y - BALL_RADIUS * 0.4}px`;
          trail.style.opacity = '0.4';
          trail.style.transition = 'opacity 0.3s ease-out';
          trail.style.zIndex = '5';
          
          if (canvasRef.current) {
            canvasRef.current.appendChild(trail);
          }
          
          // Quick fade out
          setTimeout(() => {
            trail.style.opacity = '0';
            setTimeout(() => trail.remove(), 300);
          }, 50);
        }
      
      requestAnimationFrame(animate);
    };

    console.log('🎬 Iniciando loop de animação...');
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

  // Render multiplier zones using 100% of horizontal space
  const renderMultiplierZones = () => {
    const lastPegY = START_Y + (ROWS - 1) * ROW_SPACING;
    const zoneY = lastPegY + 20;
    
    // Full width distribution for multiplier boxes
    const zoneWidth = CANVAS_WIDTH / MULTIPLIERS.length+2;
    
    return MULTIPLIERS.map((multiplier, index) => {
      // Material You accent colors based on multiplier value
      let colorClasses = "";
      let borderColor = "";
      
      if (multiplier >= 24) {
        // Highest values - #ff1744
        colorClasses = "bg-gradient-to-t from-red-600 to-red-500 text-red-100";
        borderColor = "border-red-400";
      } else if (multiplier >= 8) {
        // High values - #ff5722
        colorClasses = "bg-gradient-to-t from-orange-600 to-orange-500 text-orange-100";
        borderColor = "border-orange-400";
      } else if (multiplier >= 3) {
        // Medium-high - #ff9800
        colorClasses = "bg-gradient-to-t from-amber-600 to-amber-500 text-amber-100";
        borderColor = "border-amber-400";
      } else if (multiplier > 1) {
        // Medium - #ffc107, #ffeb3b
        colorClasses = "bg-gradient-to-t from-yellow-600 to-yellow-500 text-yellow-100";
        borderColor = "border-yellow-400";
      } else {
        // Lowest - #4caf50
        colorClasses = "bg-gradient-to-t from-green-600 to-green-500 text-green-100";
        borderColor = "border-green-400";
      }
      
      return (
        <div
          key={`zone-${index}`}
          className={cn(
            "absolute flex items-center justify-center text-xs font-bold rounded-t-lg transition-all duration-300",
            colorClasses,
            borderColor,
            "border-t border-opacity-40"
          )}
          style={{
            left: `${index * zoneWidth + (zoneWidth * 0.025)}px`, // 2.5% margin for clean spacing
            top: `${zoneY}px`,
            width: `${zoneWidth * 0.95}px`, // 95% of zone width for small gaps
            height: '48px',
            boxShadow: multiplier >= 8 ? '0 0 15px rgba(251, 191, 36, 0.5)' : '0 2px 8px rgba(0, 0, 0, 0.3)'
          }}
        >
          {multiplier}x
        </div>
      );
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