"use client";

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
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
const PlinkoComponent = React.forwardRef<{ dropBall: () => void }, PlinkoComponentProps>(({ rows = 8 }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const worldRef = useRef<planck.World | null>(null);
  
  // Definindo a interface para o objeto de contato do planck-js
  interface Contact {
    getFixtureA: () => planck.Fixture;
    getFixtureB: () => planck.Fixture;
  }
  const ballRef = useRef<planck.Body | null>(null);
  const animationRef = useRef<number | null>(null);
  const dropBallRef = useRef<() => void>(() => {});
  
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [gameResult, setGameResult] = useState<BinResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // Estado para bins brilhando
  const [glowingBin, setGlowingBin] = useState<number | null>(null);
  const [ballCount, setBallCount] = useState(0);
  // Estados para animação
  const [winningBin, setWinningBin] = useState<number | null>(null);
  const [bounceBin, setBounceBin] = useState<number | null>(null);
  const [bounceOffset, setBounceOffset] = useState(0);
  const [glowIntensity, setGlowIntensity] = useState(0); // Controlar o brilho da animação
  const [particles, setParticles] = useState<{x: number, y: number, vx: number, vy: number, life: number, color: string}[]>([]); // Partículas para efeito de colisão

  
  // Conectar com a store Zustand
  const { isPlaying, isAnimating, balls, launchPosition, setIsPlaying, setIsAnimating, addBall, clearBalls, settings, balance, setBalance } = usePlinkoStore();
  


  // Configurações do jogo (memoizado para evitar re-renders)
  const config = useMemo(() => ({
    rows,
    ballRadius: 7,
    obstacleRadius: 3,
    obstacleSpacing: 70,
    topMargin: 80,
    bottomMargin: 0,
    gravity: 20,      // Aumentar gravidade para a bola cair mais rápido
    restitution: 0.4,  // Aumentar para mais quique
    friction: 0.15,    // Reduzir atrito para deslizar melhor
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
          friction: 0.2, // Aumentar atrito para rolar suave
          restitution: 0.3, // Reduzir para menos quique
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
    const binHeight = responsive.bottomMargin * 0.2;
    
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

    // Posicionar as caixas no fundo do canvas para serem alcançáveis
      const binY = height - 35; // Caixas na parte inferior do canvas

    // Criar paredes divisorias entre os bins (caixas multiplicadoras)
    const numBins = 9; // Número fixo de bins baseado nos multiplicadores
    const dividerBinWidth = width / numBins;
    
    for (let i = 1; i < numBins; i++) {
      const dividerX = (i * dividerBinWidth - width / 2) / 30;
      const binY = height - 35; // Posição Y das caixas
      
      const divider = world.createBody({
        type: 'static',
        position: planck.Vec2(dividerX, binY / 30),
      });
      divider.createFixture({
        shape: planck.Box(0.5 / 30, 15 / 30), // Parede fina entre bins
        friction: 0.1,
        restitution: 0.1,
      });
      divider.setUserData({ type: 'divider' });
      walls.push(divider);
    }

    // Adicionar sensores no topo das caixas para detectar colisões
    const binSensorY = (dimensions.height - 65) / 30;
    for (let i = 0; i < 9; i++) {
      const binX = (dimensions.width / 9) * i + (dimensions.width / 18);
      const binSensor = world.createBody({
        type: 'static',
        position: planck.Vec2(binX / 30, binSensorY),
      });
      binSensor.createFixture({
        shape: planck.Box(((dimensions.width / 9) * 0.4) / 30, 1 / 30),
        isSensor: true, // Usar sensor para não afetar a física da bola
        userData: { type: 'binSensor', index: i }
      });
      binSensor.setUserData({ type: 'binSensor', index: i });
    }

  }, [config, calculateResponsiveConfig, dimensions]);

  // Função para limpar o mundo físico
  const clearPhysicsWorld = useCallback(() => {
    if (!worldRef.current) return;
    
    // Limpar todas as bolas existentes
    const bodies = worldRef.current.getBodyList();
    const bodiesToDestroy: planck.Body[] = [];
    
    for (let body = bodies; body; body = body.getNext()) {
      const userData = body.getUserData();
      if (userData && (userData.type === 'ball' || userData.type === 'temp_ball')) {
        bodiesToDestroy.push(body);
      }
    }
    
    // Destruir todas as bolas acumuladas
    bodiesToDestroy.forEach(body => {
      try {
        worldRef.current?.destroyBody(body);
      } catch (error) {
        console.warn('Erro ao destruir corpo:', error);
      }
    });
    
    // Limpar a store de bolas
    clearBalls();
  }, [clearBalls]);

  // Expor dropBall via ref para que o componente pai possa chamá-lo
  React.useImperativeHandle(ref, () => ({
    dropBall,
  }));

  // Função para soltar a bola usando a store Zustand - agora conectada com launchBall
  const dropBall = useCallback(() => {
    if (!worldRef.current || !dimensions.width || balance < settings.betAmount) return;
    
    // Limpar bola anterior e garantir estado limpo
    if (ballRef.current && worldRef.current) {
      try {
        worldRef.current.destroyBody(ballRef.current);
      } catch (error) {
        console.warn('Erro ao destruir bola anterior:', error);
      }
    }
    ballRef.current = null;
    
    setGameResult(null);
    setIsPlaying(true);
    setGlowingBin(null);
    setWinningBin(null);
    setBalance(balance - settings.betAmount);
    
    const responsive = calculateResponsiveConfig();
    const world = worldRef.current;
    
    // Calcular posição inicial para espaços entre obstáculos
    const lastRow = config.rows - 1;
    const obstaclesInLastRow = 3 + lastRow;
    const lastRowWidth = (obstaclesInLastRow - 1) * responsive.obstacleSpacing;
    
    // Alternar entre os dois espaços centrais disponíveis
        const firstRowObstacles = 3;
        const firstRowWidth = (firstRowObstacles - 1) * responsive.obstacleSpacing;
        const firstRowStartX = (dimensions.width / 2) - (firstRowWidth / 2);
        
        // Alternar entre os 2 espaços disponíveis: entre obstáculo 0-1 e 1-2
        const spaceIndex = ballCount % 2;
        const spaceX = firstRowStartX + ((spaceIndex + 0.5) * responsive.obstacleSpacing);
        const ballX = spaceX / 30;
        const ballY = (responsive.topMargin - 20) / 30; // Posição inicial acima da primeira linha
        
        // Incrementar contador para próxima bola alternar posição
        setBallCount(prev => prev + 1);
    
    const newBall = world.createBody({
      type: 'dynamic',
      position: planck.Vec2(ballX, ballY),
      bullet: true,
      linearVelocity: planck.Vec2((Math.random() - 0.5) * 0.1, 2), // Adicionar velocidade vertical inicial
    });
    
    newBall.createFixture({
      shape: planck.Circle(responsive.ballRadius / 30),
      density: 1.5,       // Aumentar densidade para mais peso
      restitution: 0.5,   // Aumentar restituição para mais quique
      friction: 0.2,      // Reduzir fricção para deslizar melhor
    });
    
    newBall.setUserData({ type: 'temp_ball' });
    
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
    
    // Usar o loop de animação para detectar colisões em vez de intervalo separado
    
  }, [launchPosition, dimensions.width, dimensions.height, calculateResponsiveConfig, config, setIsPlaying, addBall, glowingBin, balance, settings.betAmount, setBalance]);

  const updateDimensions = useCallback(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    // Definir dimensões mais compactas
    const width = Math.min(window.innerWidth, 400); // Reduzir largura máxima
    const height = 400; // Reduzir altura do canvas
    
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

  // Estado para controlar animação de toque no sensor
  const [touchedBinIndex, setTouchedBinIndex] = useState<number | null>(null);
  const [touchOffset, setTouchOffset] = useState(0);

  // Inicializar física quando dimensões estão prontas
  useEffect(() => {
    if (dimensions.width > 0 && dimensions.height > 0) {
      setIsLoading(false);
      initPhysics();
      
      // Configurar manipulador de contato para detectar colisões com sensores
      if (worldRef.current) {
        // @ts-ignore - O método 'on' existe no planck-js mas não está definido no tipo
        worldRef.current.on('begin-contact', (contact: Contact) => {
          const fixtureA = contact.getFixtureA();
          const fixtureB = contact.getFixtureB();
          const bodyA = fixtureA.getBody();
          const bodyB = fixtureB.getBody();
          
          const userDataA = bodyA.getUserData();
          const userDataB = bodyB.getUserData();
          
          // Verificar se um dos corpos é um sensor de caixa e o outro é uma bola
          if (userDataA && userDataA.type === 'binSensor' && userDataB && userDataB.type === 'ball') {
            // Aplicar animação leve na caixa tocada
            setTouchedBinIndex(userDataA.index);
            
            // Iniciar animação de toque
            let touchFrame = 0;
            const touchMaxFrames = 15; // Animação mais curta e sutil
            
            const touchInterval = setInterval(() => {
              touchFrame++;
              const progress = touchFrame / touchMaxFrames;
              // Animação sutil de compressão e retorno
              const offset = Math.sin(progress * Math.PI) * -15; // Apenas 15px de movimento
              setTouchOffset(offset);
              
              if (touchFrame >= touchMaxFrames) {
                clearInterval(touchInterval);
                setTouchOffset(0);
                setTouchedBinIndex(null);
              }
            }, 16);
          } else if (userDataB && userDataB.type === 'binSensor' && userDataA && userDataA.type === 'ball') {
            // Mesma lógica, mas com os corpos invertidos
            setTouchedBinIndex(userDataB.index);
            
            let touchFrame = 0;
            const touchMaxFrames = 15;
            
            const touchInterval = setInterval(() => {
              touchFrame++;
              const progress = touchFrame / touchMaxFrames;
              const offset = Math.sin(progress * Math.PI) * -15;
              setTouchOffset(offset);
              
              if (touchFrame >= touchMaxFrames) {
                clearInterval(touchInterval);
                setTouchOffset(0);
                setTouchedBinIndex(null);
              }
            }, 16);
          }
        });
      }
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      // Não limpar bolas ao desmontar para permitir múltiplas jogadas
      if (worldRef.current) {
        worldRef.current = null;
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
        
        // Calcular offset de balanço para animação
        const bounceAnimation = bounceOffset;
        
        // Desenhar bins com fundo para evitar vazamento da bola
        const lastRow = config.rows - 1;
        const obstaclesInLastRow = 3 + lastRow;
        const lastRowWidth = (obstaclesInLastRow - 1) * responsive.obstacleSpacing;
        const lastRowStartX = (width / 2) - (lastRowWidth / 2);
        const binWidth = responsive.obstacleSpacing * 0.75;
        const binHeight = 25;
        
        const binY = dimensions.height - 35; // Caixas na parte inferior
        
        for (let i = 0; i < obstaclesInLastRow - 1; i++) {
          const isGlowing = glowingBin === i;
          const x = lastRowStartX + ((i + 0.5) * responsive.obstacleSpacing) - binWidth / 2;
          const multipliers = [2.5, 1.7, 1.3, 0.6, 0.3, 0.6, 1.3, 1.7, 2.5];
          const multiplier = multipliers[i] || 1;
          
          // Aplicar offset de balanço para a caixa atingida ou tocada pelo sensor
          const currentBinY = binY + 
            (bounceBin === i ? bounceOffset : 0) + 
            (touchedBinIndex === i ? touchOffset : 0);
          
          // Adicionar efeito de brilho quando a caixa é atingida
          const isHit = bounceBin === i;
          
          // Fundo da caixa (mais alto para evitar vazamento)
          ctx.fillStyle = isHit ? `rgba(50, 50, 100, ${0.8 + glowIntensity * 0.2})` : '#1a1a2e';
          ctx.fillRect(x - 2, currentBinY - 5, binWidth + 4, binHeight + 10);
          
          // Borda da caixa com efeito de brilho quando atingida
          if (isHit) {
            // Borda externa brilhante
            ctx.strokeStyle = `rgba(255, 215, 0, ${0.5 + glowIntensity * 0.5})`; // Dourado brilhante
            ctx.lineWidth = 3;
            ctx.strokeRect(x - 3, currentBinY - 6, binWidth + 6, binHeight + 12);
            
            // Borda interna
            ctx.strokeStyle = `rgba(255, 255, 255, ${glowIntensity})`; // Branco brilhante
            ctx.lineWidth = 2;
            ctx.strokeRect(x - 1, currentBinY - 3, binWidth + 2, binHeight + 6);
          } else {
            // Borda normal
            ctx.strokeStyle = '#16213e';
            ctx.lineWidth = 2;
            ctx.strokeRect(x - 2, currentBinY - 5, binWidth + 4, binHeight + 10);
          }
          
          // Cores vibrantes estilo termômetro
          let gradientColor;
          if (i === 0 || i === 8) {
            gradientColor = ctx.createLinearGradient(x, currentBinY, x, currentBinY + binHeight);
            gradientColor.addColorStop(0, '#ff0000');
            gradientColor.addColorStop(1, '#cc0000');
          } else if (i === 1 || i === 7) {
            gradientColor = ctx.createLinearGradient(x, currentBinY, x, currentBinY + binHeight);
            gradientColor.addColorStop(0, '#ff6600');
            gradientColor.addColorStop(1, '#ff3300');
          } else if (i === 2 || i === 6) {
            gradientColor = ctx.createLinearGradient(x, currentBinY, x, currentBinY + binHeight);
            gradientColor.addColorStop(0, '#ffcc00');
            gradientColor.addColorStop(1, '#ff9900');
          } else if (i === 3 || i === 5) {
            gradientColor = ctx.createLinearGradient(x, currentBinY, x, currentBinY + binHeight);
            gradientColor.addColorStop(0, '#ffff00');
            gradientColor.addColorStop(1, '#ffcc00');
          } else {
            gradientColor = ctx.createLinearGradient(x, currentBinY, x, currentBinY + binHeight);
            gradientColor.addColorStop(0, '#ffff33');
            gradientColor.addColorStop(1, '#ffcc00');
          }
          
          const adjustedBinWidth = binWidth + 1;
          const isWinning = winningBin === i;
            
            const scale = isWinning ? 1.3 : (isGlowing ? 1.1 : 1);
            const centerX = x + adjustedBinWidth / 2;
            const centerY = currentBinY + binHeight / 2;
            
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.scale(scale, scale);
            ctx.translate(-centerX, -centerY);
            
            if (isWinning) {
              ctx.shadowColor = '#FFD700';
              ctx.shadowBlur = 20;
              ctx.shadowOffsetX = 0;
              ctx.shadowOffsetY = 0;
              
              ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
              ctx.fillRect(x - 5, currentBinY - 5, adjustedBinWidth + 10, binHeight + 10);
            }
            
            ctx.fillStyle = isWinning ? '#FFD700' : gradientColor;
            ctx.beginPath();
            ctx.roundRect(x, currentBinY, adjustedBinWidth, binHeight, 8);
            ctx.fill();
          
          const borderGradient = ctx.createLinearGradient(x, currentBinY, x + binWidth, currentBinY);
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
          
          const cornerRadius = 2;
          
          // Desenhar caixa arredondada com gradiente
          ctx.strokeStyle = borderGradient;
          ctx.lineWidth = isGlowing ? 4 : 3;
          ctx.beginPath();
          ctx.roundRect(x, currentBinY, binWidth, binHeight, cornerRadius);
          ctx.stroke();
          
          const highlightGradient = ctx.createLinearGradient(x, currentBinY, x + binWidth, currentBinY);
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
          ctx.lineWidth = isGlowing ? 2 : 1;
          ctx.beginPath();
          ctx.roundRect(x + 1, currentBinY + 1, binWidth - 2, binHeight - 2, cornerRadius - 1);
          ctx.stroke();
          
          ctx.fillStyle = isGlowing ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.15)';
          ctx.beginPath();
          ctx.roundRect(x + 2, currentBinY + 2, binWidth - 4, binHeight - 4, cornerRadius - 2);
          ctx.fill();
          
          ctx.restore();
          
          ctx.fillStyle = winningBin === i ? '#FFFFFF' : '#000000';
          ctx.font = `bold ${isWinning ? '18px' : (isGlowing ? '14px' : '12px')} Arial, sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          
          // Efeito pulsante intenso para caixa vencedora
          if (isWinning) {
            // Adicionar brilho extra ao redor da caixa vencedora
            const glowIntensity = Math.sin(Date.now() * 0.02) * 0.5 + 0.5;
            ctx.shadowColor = '#FFD700';
            ctx.shadowBlur = 20 + glowIntensity * 10;
            
            const pulse = Math.sin(Date.now() * 0.01) * 0.15 + 1;
            ctx.save();
            ctx.translate(x + binWidth / 2, currentBinY + binHeight / 2);
            ctx.scale(pulse, pulse);
            ctx.fillText(`${multiplier}x`, 0, 0);
            ctx.restore();
            
            // Resetar sombra
            ctx.shadowBlur = 0;
            ctx.shadowColor = 'transparent';
          } else {
            ctx.fillText(`${multiplier}x`, x + binWidth / 2, currentBinY + binHeight / 2);
          }
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
        
          
          // Verificar se a bola está em uma caixa (detectar imediatamente ao tocar)
          const velocity = ballRef.current.getLinearVelocity();
          const isInBinArea = pos.y > (height - 45) / 30; // Área das caixas (ajustado para detecção ainda mais precoce)
          
          if (isInBinArea && !gameResult) { // Garantir que só detecta uma vez
            const numBins = 9;
            const binWidth = dimensions.width / numBins;
            const binIndex = Math.floor(pos.x * 30 / binWidth);
            const clampedBinIndex = Math.max(0, Math.min(numBins - 1, binIndex));
            const multipliers = [2.5, 1.7, 1.3, 0.6, 0.3, 0.6, 1.3, 1.7, 2.5];
            const multiplier = multipliers[clampedBinIndex] || 1;
            
            setGameResult({ index: clampedBinIndex, multiplier });
            setWinningBin(clampedBinIndex);
            
            // Destruir a bola imediatamente ao tocar a caixa
            if (ballRef.current && worldRef.current) {
              worldRef.current.destroyBody(ballRef.current);
              ballRef.current = null;
            }
            clearBalls();
            setIsAnimating(false);
            
            // Iniciar animação de empurrar para baixo e voltar quando a bola colide
            setBounceBin(clampedBinIndex);
            let bounceFrame = 0;
            const maxFrames = 40; // Duração ainda mais longa para ser mais perceptível
            
            // Iniciar com brilho sutil para destacar a caixa atingida
            setGlowIntensity(0.7); // Brilho mais sutil conforme solicitado
            
            // Criar partículas para efeito de colisão (quantidade moderada)
            const numParticles = 15; // Quantidade moderada de partículas para efeito sutil
            const newParticles = [];
            const binX = (dimensions.width / 9) * clampedBinIndex + (dimensions.width / 18);
            const binY = dimensions.height - 35;
            
            for (let i = 0; i < numParticles; i++) {
              const angle = Math.random() * Math.PI * 2;
              const speed = 1 + Math.random() * 2; // Velocidade moderada para movimento sutil
              newParticles.push({
                x: binX,
                y: binY,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 1.5, // Bias upward moderado
                life: 20 + Math.random() * 15, // Vida mais curta
                color: `hsl(${Math.random() * 60 + 30}, 90%, 60%)`  // Cores douradas/amarelas menos intensas
              });
            }
            setParticles(newParticles);
            
            const bounceInterval = setInterval(() => {
              bounceFrame++;
              const progress = bounceFrame / maxFrames;
              // Animação com dois movimentos: para baixo e depois para cima com efeito de mola
              const bounce = Math.sin(progress * Math.PI) * -20; // Distância moderada para 20px (efeito sutil)
              setBounceOffset(bounce);
              
              // Diminuir gradualmente o brilho
              setGlowIntensity(Math.max(0, 1.0 - (progress * 1.2)));
              
              if (bounceFrame >= maxFrames) {
                clearInterval(bounceInterval);
                setBounceOffset(0);
                setBounceBin(null);
                setGlowIntensity(0); // Resetar brilho
              }
            }, 12); // Intervalo ainda mais rápido para animação mais suave
            
            setTimeout(() => setWinningBin(null), 2000);
          }
        }
        
        // Atualizar física
        worldRef.current.step(1/60);
        
        // Atualizar e renderizar partículas
        if (particles.length > 0) {
          const updatedParticles = particles.map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.1, // Gravidade
            life: p.life - 1
          })).filter(p => p.life > 0);
          
          // Renderizar partículas (tamanho moderado e brilho sutil)
          updatedParticles.forEach(p => {
            const alpha = p.life / 50; // Desvanecer gradualmente
            ctx.fillStyle = p.color.replace('hsl', 'hsla').replace(')', `, ${alpha})`);
            ctx.beginPath();
            ctx.arc(p.x, p.y, 2 + (p.life / 10), 0, Math.PI * 2); // Partículas menores
            ctx.fill();
            
            // Adicionar brilho sutil ao redor das partículas
            ctx.fillStyle = p.color.replace('hsl', 'hsla').replace(')', `, ${alpha * 0.3})`);
            ctx.beginPath();
            ctx.arc(p.x, p.y, 3 + (p.life / 8), 0, Math.PI * 2);
            ctx.fill();
          });
          
          setParticles(updatedParticles);
        }
        
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
      
     </div>
  );
});

export default PlinkoComponent;
