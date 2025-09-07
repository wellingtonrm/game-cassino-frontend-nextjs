"use client";

import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import * as planck from 'planck-js';
import { usePlinkoStore } from '@/stores/plinkoStore';
import LoadingPlinko from './loadingPlinko';

interface PlinkoComponentProps {
  rows?: number;
}

interface BallPosition {
  x: number;
  y: number;
}

interface BinResult {
  index: number;
  multiplier: number;
}

export default function PlinkoComponent({ rows = 8 }: PlinkoComponentProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const worldRef = useRef<planck.World | null>(null);
  const ballRef = useRef<planck.Body | null>(null);
  const animationRef = useRef<number | null>(null);
  
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [gameResult, setGameResult] = useState<BinResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Conectar com a store Zustand
  const { isPlaying, isAnimating, balls, launchPosition, setIsPlaying, setIsAnimating, addBall, clearBalls } = usePlinkoStore();

  // Configurações do jogo (memoizado para evitar re-renders)
  const config = useMemo(() => ({
    rows,
    ballRadius: 7,
    obstacleRadius: 3,
    obstacleSpacing: 70,
    topMargin: 80,
    bottomMargin: 0,
    gravity: 12,
    restitution: 0.7,
    friction: 0.2,
    bins: rows + 1,
  }), [rows]);

  // Calcular posições responsivas com pirâmide aumentada
  const calculateResponsiveConfig = useCallback(() => {
    const { width, height } = dimensions;
    
    // Calcular espaçamento aumentado para pirâmide maior
    const maxObstaclesInRow = 3 + (config.rows - 1);
    const availableWidth = width * 0.9; // Usar mais espaço horizontal
    const calculatedSpacing = (availableWidth / (maxObstaclesInRow + 1)) * 1.3; // Aumentar espaçamento em 30%
    
    // Aumentar altura da pirâmide
    const pyramidHeight = height * 0.75; // Usar 75% da altura para a pirâmide
    const calculatedRowHeight = pyramidHeight / (config.rows + 1);
    
    // Aumentar escala geral para elementos maiores
    const spacing = Math.min(calculatedSpacing, calculatedRowHeight) * 1.2; // Aumentar espaçamento
    const scale = Math.min(width / 400, height / 400, spacing / 50) * 1.4; // Aumentar escala em 40%
    
    return {
      ballRadius: config.ballRadius * scale * 1.2, // Aumentar raio da bola
      obstacleRadius: config.obstacleRadius * scale * 1.5, // Aumentar raio dos obstáculos em 50%
      obstacleSpacing: spacing,
      topMargin: config.topMargin * scale * 0.8, // Margem superior ajustada
      bottomMargin: config.bottomMargin * scale * 0.2, // Reduzir margem inferior para caber a pirâmide
    };
  }, [dimensions, config]);

  // Inicializar mundo de física
  const initPhysics = useCallback(() => {
    if (!canvasRef.current || dimensions.width === 0 || dimensions.height === 0) return;
    
    const { width, height } = dimensions;
    
    // Criar mundo com gravidade
    const world = planck.World(planck.Vec2(0, config.gravity));
    worldRef.current = world;

    const responsive = calculateResponsiveConfig();
    
    // Criar obstáculos em forma de pirâmide aumentada e centralizada
    const obstacles: planck.Body[] = [];
    const centerX = width / 2;
    
    for (let row = 0; row < config.rows; row++) {
      const obstaclesInRow = 3 + row;
      const rowWidth = (obstaclesInRow - 1) * responsive.obstacleSpacing;
      const startX = centerX - (rowWidth / 2);
      
      for (let i = 0; i < obstaclesInRow; i++) {
        const x = startX + (i * responsive.obstacleSpacing);
        const y = responsive.topMargin + (row * responsive.obstacleSpacing * 0.9); // Aumentar espaçamento vertical
        
        const obstacle = world.createBody({
          type: 'static',
          position: planck.Vec2(x / 30, y / 30),
        });
        
        obstacle.createFixture({
          shape: planck.Circle(responsive.obstacleRadius / 30),
          density: 1,
          friction: config.friction,
          restitution: config.restitution,
        });
        
        // Marcar como obstáculo para renderização
        obstacle.setUserData({ type: 'obstacle' });
        
        obstacles.push(obstacle);
      }
    }

    // Criar compartimentos (bins) alinhados com os obstáculos da última linha da pirâmide
    const bins: planck.Body[] = [];
    const lastRow = config.rows - 1;
    const obstaclesInLastRow = 3 + lastRow;
    const lastRowWidth = (obstaclesInLastRow - 1) * responsive.obstacleSpacing;
    const lastRowStartX = centerX - (lastRowWidth / 2);
    
    // Calcular posições dos bins alinhados com os obstáculos (removendo extremidades)
    const binWidth = responsive.obstacleSpacing * 0.8;
    const binHeight = responsive.bottomMargin * 0.4;
    
    // O número de bins é igual ao número de obstáculos da última linha
    const actualBins = obstaclesInLastRow;
    
    for (let i = 0; i < actualBins; i++) {
      // Posicionar bins alinhados com os obstáculos da última linha
      const binX = lastRowStartX + (i * responsive.obstacleSpacing);
      const binY = height - binHeight / 2;
      
      const bin = world.createBody({
        type: 'static',
        position: planck.Vec2(binX / 30, binY / 30),
      });
      
      bin.createFixture({
        shape: planck.Box(binWidth / 60, binHeight / 60),
        isSensor: true,
      });
      
      bin.setUserData({ type: 'bin', index: i });
      bins.push(bin);
    }

    // Criar paredes
    const walls: planck.Body[] = [];
    
    // Parede esquerda
    const leftWall = world.createBody({
      type: 'static',
      position: planck.Vec2(0, height / 60),
    });
    leftWall.createFixture({
      shape: planck.Box(1 / 60, height / 30),
    });
    walls.push(leftWall);

    // Parede direita
    const rightWall = world.createBody({
      type: 'static',
      position: planck.Vec2(width / 30, height / 60),
    });
    rightWall.createFixture({
      shape: planck.Box(1 / 60, height / 30),
    });
    walls.push(rightWall);

    // Chão
    const floor = world.createBody({
      type: 'static',
      position: planck.Vec2(width / 60, height / 30),
    });
    floor.createFixture({
      shape: planck.Box(width / 30, 1 / 60),
    });
    walls.push(floor);

  }, [config, calculateResponsiveConfig, dimensions]);

  // Função para soltar a bola usando a store Zustand
  const dropBall = useCallback(() => {
    if (!worldRef.current || isAnimating || !dimensions.width) return;
    
    setGameResult(null);
    setIsPlaying(true);
    setIsAnimating(true);
    
    const responsive = calculateResponsiveConfig();
    const world = worldRef.current;
    
    // Criar nova bola na posição do lançamento
    const ballX = (launchPosition * dimensions.width) / 30;
    const ballY = responsive.topMargin / 30 - 1;
    
    const newBall = world.createBody({
      type: 'dynamic',
      position: planck.Vec2(ballX, ballY),
      bullet: true,
    });
    
    newBall.createFixture({
      shape: planck.Circle(responsive.ballRadius / 30),
      density: 1,
      restitution: config.restitution,
      friction: config.friction,
    });
    
    newBall.setUserData({ type: 'ball' });
    
    // Adicionar referência à bola na store
    ballRef.current = newBall;
    
    // Adicionar bola à store para tracking de múltiplas bolas
    addBall({
      x: ballX * 30,
      y: ballY * 30,
      vx: 0,
      vy: 0,
      isActive: true,
    });
    
  }, [isAnimating, launchPosition, dimensions.width, calculateResponsiveConfig, config, setIsPlaying, setIsAnimating, addBall]);

  const updateDimensions = useCallback(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    // Definir dimensões mais compactas
    const width = Math.min(window.innerWidth, 400); // Reduzir largura máxima
    const height = 320; // Reduzir altura do canvas
    
    // Atualizar dimensões do canvas
    canvas.width = width;
    canvas.height = height;
    
    // Atualizar estado das dimensões
    setDimensions({ width, height });
  }, []);

  // Inicializar dimensões
  useEffect(() => {
    window.addEventListener('resize', updateDimensions);
    updateDimensions();
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, [updateDimensions]);

  // Inicializar física quando dimensões estão prontas
  useEffect(() => {
    if (dimensions.width > 0 && dimensions.height > 0) {
      setIsLoading(false);
      initPhysics();
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (worldRef.current && ballRef.current) {
        worldRef.current.destroyBody(ballRef.current);
      }
    };
  }, [dimensions, initPhysics]);

  // Start animation loop when world is ready
  useEffect(() => {
    if (worldRef.current && dimensions.width > 0 && dimensions.height > 0) {
      const animationLoop = () => {
        if (!worldRef.current || !canvasRef.current) return;
        
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        const { width, height } = dimensions;
        const responsive = calculateResponsiveConfig();
        
        // Limpar canvas
        ctx.clearRect(0, 0, width, height);
        
        // Desenhar fundo escuro simples como na imagem
        ctx.fillStyle = 'transparent';
        ctx.fillRect(0, 0, width, height);
        
        // Remover padrão de estrelas para manter simplicidade
        
        // Desenhar obstáculos com gradiente
        const obstacles = worldRef.current.getBodyList();
        for (let body = obstacles; body; body = body.getNext()) {
          const pos = body.getPosition();
          const userData = body.getUserData();
          if (userData && userData.type === 'obstacle') {
            const x = pos.x * 30;
            const y = pos.y * 30;
            const radius = responsive.obstacleRadius;
            
            // Desenhar obstáculos roxos maiores e mais visíveis
            ctx.fillStyle = '#8b5cf6';
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
            
            // Adicionar borda para destacar obstáculos
            ctx.strokeStyle = '#a78bfa';
            ctx.lineWidth = 2;
            ctx.stroke();
          }
        }
        
        // Desenhar bins alinhados com os espaços da última linha da pirâmide - ajustados para pirâmide aumentada
        const lastRow = config.rows - 1;
        const obstaclesInLastRow = 3 + lastRow;
        const lastRowWidth = (obstaclesInLastRow - 1) * responsive.obstacleSpacing;
        const lastRowStartX = (width / 2) - (lastRowWidth / 2);
        const binWidth = responsive.obstacleSpacing * 0.75; // Ajustar largura dos bins para 9 espaços
        const binHeight = 30; // Altura ajustada para bins
        
        // Posicionar bins com espaçamento de 15px da última linha da pirâmide
        const lastObstacleY = responsive.topMargin + (lastRow * responsive.obstacleSpacing * 0.9);
        const binY = lastObstacleY + responsive.obstacleRadius + 15; // 15px de espaçamento da última linha
        
        // Calcular posição para alinhar cada bin exatamente abaixo dos espaços ENTRE os obstáculos da última linha
        // 8 linhas = 10 obstáculos na última linha criam 9 espaços entre eles
        const multipliers = [0.2, 0.5, 1, 2, 5, 2, 1, 0.5, 0.2];
        
        for (let i = 0; i < obstaclesInLastRow - 1; i++) {
          // Posicionar cada bin centralizado abaixo do espaço entre obstáculos
          // O espaço entre obstáculos está entre (i) e (i+1), então o centro é (i + 0.5)
          const x = lastRowStartX + ((i + 0.5) * responsive.obstacleSpacing) - binWidth / 2;
          const multiplier = multipliers[i] || 1;
          
          // Cores vibrantes estilo termômetro - gradiente de vermelho para amarelo
          let gradientColor;
          if (i === 0 || i === 8) {
            // Extremidades vermelhas vibrantes
            gradientColor = ctx.createLinearGradient(x, binY, x, binY + binHeight);
            gradientColor.addColorStop(0, '#ff0000');
            gradientColor.addColorStop(1, '#cc0000');
          } else if (i === 1 || i === 7) {
            // Laranja vibrante
            gradientColor = ctx.createLinearGradient(x, binY, x, binY + binHeight);
            gradientColor.addColorStop(0, '#ff6600');
            gradientColor.addColorStop(1, '#ff3300');
          } else if (i === 2 || i === 6) {
            // Amarelo-laranja
            gradientColor = ctx.createLinearGradient(x, binY, x, binY + binHeight);
            gradientColor.addColorStop(0, '#ffcc00');
            gradientColor.addColorStop(1, '#ff9900');
          } else if (i === 3 || i === 5) {
            // Amarelo claro
            gradientColor = ctx.createLinearGradient(x, binY, x, binY + binHeight);
            gradientColor.addColorStop(0, '#ffff00');
            gradientColor.addColorStop(1, '#ffcc00');
          } else {
            // Centro amarelo dourado vibrante
            gradientColor = ctx.createLinearGradient(x, binY, x, binY + binHeight);
            gradientColor.addColorStop(0, '#ffff33');
            gradientColor.addColorStop(1, '#ffcc00');
          }
          
          // Aumentar largura da caixa em 1px
          const adjustedBinWidth = binWidth + 1;
          
          // Desenhar caixa com cantos arredondados e gradiente vibrante
          ctx.fillStyle = gradientColor;
          ctx.beginPath();
          ctx.roundRect(x, binY, adjustedBinWidth, binHeight, 8);
          ctx.fill();
          
          // Bordas em tons da cor da caixa (amarelo) para efeito harmônico
          const borderGradient = ctx.createLinearGradient(x, binY, x + binWidth, binY);
          if (i === 0 || i === 8) {
            borderGradient.addColorStop(0, '#CC3333');
            borderGradient.addColorStop(0.5, '#FF6600');
            borderGradient.addColorStop(1, '#CC3333');
          } else if (i === 1 || i === 7) {
            borderGradient.addColorStop(0, '#CC5522');
            borderGradient.addColorStop(0.5, '#FF8800');
            borderGradient.addColorStop(1, '#CC5522');
          } else if (i === 2 || i === 6) {
            borderGradient.addColorStop(0, '#CC7722');
            borderGradient.addColorStop(0.5, '#FFAA00');
            borderGradient.addColorStop(1, '#CC7722');
          } else if (i === 3 || i === 5) {
            borderGradient.addColorStop(0, '#CC9922');
            borderGradient.addColorStop(0.5, '#FFCC00');
            borderGradient.addColorStop(1, '#CC9922');
          } else {
            borderGradient.addColorStop(0, '#CCBB22');
            borderGradient.addColorStop(0.5, '#FFDD00');
            borderGradient.addColorStop(1, '#CCBB22');
          }
          
          ctx.strokeStyle = borderGradient;
          ctx.lineWidth = 3;
          ctx.strokeRect(x, binY, binWidth, binHeight);
          
          // Segunda borda mais clara para realce
          const highlightGradient = ctx.createLinearGradient(x, binY, x + binWidth, binY);
          if (i === 0 || i === 8) {
            highlightGradient.addColorStop(0, '#FF6666');
            highlightGradient.addColorStop(0.5, '#FF9966');
            highlightGradient.addColorStop(1, '#FF6666');
          } else if (i === 1 || i === 7) {
            highlightGradient.addColorStop(0, '#FF8866');
            highlightGradient.addColorStop(0.5, '#FFAA66');
            highlightGradient.addColorStop(1, '#FF8866');
          } else if (i === 2 || i === 6) {
            highlightGradient.addColorStop(0, '#FFAA66');
            highlightGradient.addColorStop(0.5, '#FFCC66');
            highlightGradient.addColorStop(1, '#FFAA66');
          } else if (i === 3 || i === 5) {
            highlightGradient.addColorStop(0, '#FFCC66');
            highlightGradient.addColorStop(0.5, '#FFEE66');
            highlightGradient.addColorStop(1, '#FFCC66');
          } else {
            highlightGradient.addColorStop(0, '#FFDD66');
            highlightGradient.addColorStop(0.5, '#FFFF66');
            highlightGradient.addColorStop(1, '#FFDD66');
          }
          
          ctx.strokeStyle = highlightGradient;
          ctx.lineWidth = 1;
          ctx.strokeRect(x + 1, binY + 1, binWidth - 2, binHeight - 2);
          
          // Adicionar sombra sutil para efeito 3D
          ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
          ctx.fillRect(x + 2, binY + 2, binWidth, binHeight);
          
          // Desenhar texto preto em negrito
          ctx.fillStyle = '#000000';
          ctx.font = `bold 12px Arial, sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(`${multiplier}x`, x + binWidth / 2, binY + binHeight / 2);
        }
        
        // Resetar estilo para próximos desenhos
        ctx.fillStyle = '#374151';
        
        // Desenhar bola com gradiente
        if (ballRef.current) {
          const pos = ballRef.current.getPosition();
          const x = pos.x * 30;
          const y = pos.y * 30;
          const radius = responsive.ballRadius;
          
          // Criar gradiente radial sofisticado para a bola
          const ballGradient = ctx.createRadialGradient(x - radius * 0.4, y - radius * 0.4, 0, x, y, radius * 1.3);
          ballGradient.addColorStop(0, '#f472b6');
          ballGradient.addColorStop(0.3, '#ec4899');
          ballGradient.addColorStop(0.7, '#db2777');
          ballGradient.addColorStop(1, '#9d174d');
          
          // Desenhar sombra mais realista da bola
          ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
          ctx.beginPath();
          ctx.arc(x + 4, y + 4, radius * 1.1, 0, Math.PI * 2);
          ctx.fill();
          
          // Desenhar anel externo da bola
          ctx.fillStyle = 'rgba(244, 114, 182, 0.4)';
          ctx.beginPath();
          ctx.arc(x, y, radius * 1.2, 0, Math.PI * 2);
          ctx.fill();
          
          // Desenhar bola principal
          ctx.fillStyle = ballGradient;
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
          
          // Adicionar brilho principal na bola
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.beginPath();
          ctx.arc(x - radius * 0.4, y - radius * 0.4, radius * 0.3, 0, Math.PI * 2);
          ctx.fill();
          
          // Adicionar brilho secundário
          ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.beginPath();
          ctx.arc(x + radius * 0.2, y - radius * 0.2, radius * 0.15, 0, Math.PI * 2);
          ctx.fill();
          
          // Adicionar reflexo sutil
          ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
          ctx.beginPath();
          ctx.arc(x - radius * 0.1, y + radius * 0.3, radius * 0.1, 0, Math.PI * 2);
          ctx.fill();
        
          
          // setBallPosition({ x: pos.x * 30, y: pos.y * 30 }); // Removido para evitar re-renders infinitos
          
          // Verificar se a bola parou
          const velocity = ballRef.current.getLinearVelocity();
          if (Math.abs(velocity.x) < 0.1 && Math.abs(velocity.y) < 0.1 && pos.y > height / 30 - 2) {
            const lastRow = config.rows - 1;
            const obstaclesInLastRow = 3 + lastRow;
            const binWidth = responsive.obstacleSpacing * 0.75; // Mesma largura dos bins desenhados
            
            // Calcular índice baseado nos espaços entre obstáculos (centro do espaço)
            const binIndex = Math.floor((pos.x * 30 - lastRowStartX) / responsive.obstacleSpacing);
            const multipliers = [0.2, 0.5, 1, 2, 5, 2, 1, 0.5, 0.2];
            const multiplier = multipliers[Math.max(0, Math.min(binIndex, obstaclesInLastRow - 2))] || 1;
            setGameResult({ index: Math.max(0, Math.min(binIndex, obstaclesInLastRow - 2)), multiplier });
            setIsPlaying(false);
          }
        }
        
        // Atualizar física
        worldRef.current.step(1/60);
        
        // Continuar animação apenas se estiver jogando
        if (isAnimating || ballRef.current) {
          animationRef.current = requestAnimationFrame(animationLoop);
        }
      };
      
      animationLoop();
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dimensions, calculateResponsiveConfig, config.bins, isPlaying]);

  return (
     <div className="w-full flex flex-col relative h-[400px] bg-gray-900 bg-opacity-95">
       <LoadingPlinko isLoading={isLoading} />
       
       <canvas
         ref={canvasRef}
         className="w-full h-auto"
         style={{ width: '100%' }}
       />
       
       {gameResult && (
         <div className=" top-4 left-1/2 transform -translate-x-1/2 z-10 animate-in slide-in-from-top-4 fade-in duration-700">
           <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white px-4 py-2 rounded-full shadow-lg text-sm font-bold">
             {gameResult.multiplier}x WIN!
           </div>
         </div>
       )}
     </div>
   );
}
