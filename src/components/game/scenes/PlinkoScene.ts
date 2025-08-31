import * as Phaser from 'phaser';

export class PlinkoScene extends Phaser.Scene {
  private onBallComplete: (multiplier: number) => void;
  private onBallDrop: () => void;
  private betAmount: number;
  
  // Dimensões responsivas
  private gameWidth: number = 800;
  private gameHeight: number = 600;
  
  // Configurações físicas da bola - ajuste estes valores para controlar o comportamento
  private ballPhysics = {
    // Restituição: quão "elástica" é a bola (0 = não quica, 1 = quica perfeitamente)
    // Valores menores = menos quique, mais realista
    restitution: 1,  // Reduzido de 0.85 para menos quique
    
    // Atrito: resistência ao movimento quando em contato com superfícies
    // Valores maiores = mais lento, menos deslizamento
    friction: 0.01,     // Aumentado de 0.05 para mais atrito
    
    // Atrito do ar: resistência ao movimento no ar
    // Valores maiores = bola mais pesada, cai mais devagar
    frictionAir: 0.008, // Aumentado de 0.008 para bola mais pesada
    
    // Densidade: peso da bola (valores maiores = mais pesada)
    density: 0.01      // Adicionado para controlar o peso
  };
  
  // Game objects
  private balls: Phaser.GameObjects.Arc[] = [];
  private pegs: Phaser.GameObjects.Arc[] = [];
  private multipliers: {
    zone: Phaser.Types.Physics.Matter.MatterBody;
    value: number;
    container: Phaser.GameObjects.Container;
    text: Phaser.GameObjects.Text;
  }[] = [];
  
  // Visual elements
  private backgroundGradient!: Phaser.GameObjects.Graphics;
  private titleContainer!: Phaser.GameObjects.Container;
  private ballLauncher!: Phaser.GameObjects.Container;
  private soundEnabled: boolean = true;
  private soundToggleButton!: Phaser.GameObjects.Container;
  
  constructor(onBallComplete: (multiplier: number) => void, onBallDrop: () => void, betAmount: number) {
    super({ key: 'PlinkoScene' });
    this.onBallComplete = onBallComplete;
    this.onBallDrop = onBallDrop;
    this.betAmount = betAmount;
  }

  updateCallbacks(onBallComplete: (multiplier: number) => void, onBallDrop: () => void, betAmount: number) {
    this.onBallComplete = onBallComplete;
    this.onBallDrop = onBallDrop;
    this.betAmount = betAmount;
  }

  preload() {
    // Carregar imagens de fundo
    this.load.image('background1', '/plinko/back/cena1.png');
    this.load.image('background2', '/plinko/back/cena2.png');
  }

  create() {
    // Obter dimensões da cena
    this.gameWidth = this.cameras.main.width;
    this.gameHeight = this.cameras.main.height;
    
    // Create clean background
    this.createBackground();
    
    // Create ball launcher
    this.createBallLauncher();
    
    // Create sound toggle button
    this.createSoundToggle();
    
    // Create game boundaries
    this.createBoundaries();
    
    // Create professional peg system
    this.createProfessionalPegs();
    
    // Create premium multiplier zones
    this.createPremiumMultiplierZones();
    
    // Setup physics and events
    this.setupPhysicsAndEvents();
  }

  private createBackground() {
    // Usar imagem de fundo em vez de gradiente
    const background = this.add.image(this.gameWidth / 2, this.gameHeight / 2, 'background1');
    background.setDisplaySize(this.gameWidth, this.gameHeight);
    background.setDepth(-10);
    
    // Camada escura sobre a imagem para destacar o jogo
    const darkOverlay = this.add.graphics();
    darkOverlay.fillStyle(0x000000, 0.7); // Escurecer ainda mais a imagem
    darkOverlay.fillRect(0, 0, this.gameWidth, this.gameHeight);
    darkOverlay.setDepth(-2); // Camada superior à imagem mas inferior aos elementos do jogo
  }

  private createBallLauncher() {
    // Container para o lançador
    this.ballLauncher = this.add.container(this.gameWidth / 2, 30);
    
    // Base do canhão
    const cannonBase = this.add.graphics();
    cannonBase.fillStyle(0x444444);
    cannonBase.fillRect(-25, -10, 50, 20);
    
    // Tubo do canhão
    const cannonBarrel = this.add.graphics();
    cannonBarrel.fillStyle(0x666666);
    cannonBarrel.fillRect(-8, -25, 16, 30);
    
    // Detalhe decorativo
    const cannonTip = this.add.graphics();
    cannonTip.fillStyle(0x888888);
    cannonTip.fillRect(-6, -28, 12, 8);
    
    // Adicionar elementos ao container
    this.ballLauncher.add([cannonBase, cannonBarrel, cannonTip]);
    
    // Definir profundidade
     this.ballLauncher.setDepth(2);
   }

   private createSoundToggle() {
    // Container para o botão de som
    this.soundToggleButton = this.add.container(this.gameWidth - 50, 50);
     
     // Fundo mágico do botão
     const buttonBg = this.add.graphics();
     buttonBg.fillGradientStyle(0x4a0e4e, 0x81007f, 0x4a0e4e, 0x81007f);
     buttonBg.fillCircle(0, 0, 25);
     
     // Borda brilhante
     const buttonBorder = this.add.graphics();
     buttonBorder.lineStyle(3, 0xffffff, 0.8);
     buttonBorder.strokeCircle(0, 0, 25);
     
     // Brilho mágico
     const magicGlow = this.add.graphics();
     magicGlow.fillStyle(0xffffff, 0.3);
     magicGlow.fillCircle(0, -8, 15);
     
     // Ícone de som (ondas sonoras)
     const soundWaves = this.add.graphics();
     this.updateSoundIcon(soundWaves);
     
     // Adicionar elementos ao container
     this.soundToggleButton.add([buttonBg, magicGlow, buttonBorder, soundWaves]);
     
     // Tornar interativo
     this.soundToggleButton.setSize(50, 50);
     this.soundToggleButton.setInteractive();
     
     // Evento de clique
     this.soundToggleButton.on('pointerdown', () => {
       this.soundEnabled = !this.soundEnabled;
       this.updateSoundIcon(soundWaves);
       
       // Efeito de clique
       this.tweens.add({
         targets: this.soundToggleButton,
         scaleX: 0.9,
         scaleY: 0.9,
         duration: 100,
         yoyo: true
       });
     });
     
     // Efeito hover
     this.soundToggleButton.on('pointerover', () => {
       this.tweens.add({
         targets: this.soundToggleButton,
         scaleX: 1.1,
         scaleY: 1.1,
         duration: 200
       });
     });
     
     this.soundToggleButton.on('pointerout', () => {
       this.tweens.add({
         targets: this.soundToggleButton,
         scaleX: 1,
         scaleY: 1,
         duration: 200
       });
     });
     
     // Definir profundidade
     this.soundToggleButton.setDepth(3);
   }

    private playLaunchSound() {
      if (!this.soundEnabled) return;
      
      try {
        // Criar contexto de áudio para som de lançamento
        const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.3);
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
      } catch (error) {
        console.log('Audio not supported');
      }
    }

    private playMultiplierSound(multiplier: number) {
      if (!this.soundEnabled) return;
      
      try {
        // Som diferente baseado no valor do multiplicador
        const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Frequência baseada no multiplicador
        const baseFreq = multiplier >= 10 ? 1000 : multiplier >= 5 ? 800 : multiplier >= 2 ? 600 : 400;
        
        oscillator.frequency.setValueAtTime(baseFreq, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(baseFreq * 1.5, audioContext.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(baseFreq, audioContext.currentTime + 0.2);
        
        gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.4);
      } catch (error) {
        console.log('Audio not supported');
      }
    }

   private updateSoundIcon(graphics: Phaser.GameObjects.Graphics) {
     graphics.clear();
     
     if (this.soundEnabled) {
       // Ícone de som ligado (ondas sonoras)
       graphics.lineStyle(3, 0xffffff, 1);
       graphics.strokeCircle(-5, 0, 8);
       graphics.strokeCircle(-5, 0, 12);
       graphics.strokeCircle(-5, 0, 16);
       
       // Alto-falante
       graphics.fillStyle(0xffffff);
       graphics.fillRect(-15, -8, 8, 16);
       graphics.fillTriangle(-7, -5, -7, 5, 2, 8);
       graphics.fillTriangle(-7, -5, -7, 5, 2, -8);
     } else {
       // Ícone de som desligado (X sobre o alto-falante)
       graphics.fillStyle(0xff4444);
       graphics.fillRect(-15, -8, 8, 16);
       graphics.fillTriangle(-7, -5, -7, 5, 2, 8);
       graphics.fillTriangle(-7, -5, -7, 5, 2, -8);
       
       // X vermelho
       graphics.lineStyle(4, 0xff0000, 1);
       graphics.beginPath();
       graphics.moveTo(5, -10);
       graphics.lineTo(15, 10);
       graphics.moveTo(15, -10);
       graphics.lineTo(5, 10);
       graphics.strokePath();
     }
   }
  

  
  private createBoundaries() {
    // Invisible physics boundaries only
    this.matter.add.rectangle(0, this.gameHeight / 2, 20, this.gameHeight, { isStatic: true });
    this.matter.add.rectangle(this.gameWidth, this.gameHeight / 2, 20, this.gameHeight, { isStatic: true });
    this.matter.add.rectangle(this.gameWidth / 2, this.gameHeight, this.gameWidth, 20, { isStatic: true });
  }
  
  private createProfessionalPegs() {
    // Ajustar tamanho dos pinos baseado na largura da tela
    const isMobile = this.gameWidth < 500;
    const pegRadius = isMobile ? 4 : 6; // Pinos menores no mobile
    const rows = 15;
    const startY = 60;
    
    // Calcular espaçamento responsivo baseado na largura da tela
    const availableWidth = this.gameWidth * 0.8; // 80% da largura da tela
    const maxPegsInLastRow = rows + 2; // 17 pinos na última fileira
    const pegSpacing = Math.min(isMobile ? 28 : 42, availableWidth / maxPegsInLastRow);
    const rowSpacing = Math.min(isMobile ? 18 : 25, (this.gameHeight * 0.5) / rows);
    
    for (let row = 0; row < rows; row++) {
      const pegsInRow = row + 3;
      const totalWidth = (pegsInRow - 1) * pegSpacing;
      const startX = this.gameWidth / 2 - totalWidth / 2;
      
      for (let col = 0; col < pegsInRow; col++) {
        const x = startX + col * pegSpacing;
        const y = startY + row * rowSpacing;
        
        // Physics body
        this.matter.add.circle(x, y, pegRadius, {
           isStatic: true,
           restitution: 0.95,
           friction: 0.05
         });
        
        // Simple visual peg
        const peg = this.add.circle(x, y, pegRadius, 0xffffff);
        
        // Definir profundidade neutra
        peg.setDepth(0);
        
        this.pegs.push(peg);
      }
    }
  }

  private createPremiumMultiplierZones() {
    const multiplierValues = [2.5, 2.0, 1.5, 0.5, 1.2, 1.0, 1.2, 1.1, 0.5, 1.2, 1.1, 0.5, 1.2, 1.5, 1.9, 2.0, 2.5];
    const totalZones = multiplierValues.length;
    
    // Detectar se é mobile para ajustar dimensões
    const isMobile = this.gameWidth < 500;
    
    // Calcular dimensões responsivas
    const availableWidth = this.gameWidth * 0.9; // 90% da largura da tela
    const zoneWidth = Math.min(isMobile ? 32 : 42, availableWidth / totalZones);
    const zoneHeight = Math.min(isMobile ? 40 : 50, this.gameHeight * 0.08); // 8% da altura da tela
    
    // Posicionar multiplicadores mais próximos dos pinos no mobile
    const bottomMargin = isMobile ? 15 : 30;
    const zoneY = this.gameHeight - zoneHeight - bottomMargin;
    const totalWidth = totalZones * zoneWidth;
    const startX = this.gameWidth / 2 - totalWidth / 2;
    
    multiplierValues.forEach((value, index) => {
      const x = startX + index * zoneWidth + zoneWidth / 2;
      
      // Criar física de pote real com paredes sólidas
       const wallThickness = 3;
       
       // Parede esquerda
       this.matter.add.rectangle(
         x - zoneWidth/2 + wallThickness/2, 
         zoneY, 
         wallThickness, 
         zoneHeight, 
         { isStatic: true }
       );
       
       // Parede direita
       this.matter.add.rectangle(
         x + zoneWidth/2 - wallThickness/2, 
         zoneY, 
         wallThickness, 
         zoneHeight, 
         { isStatic: true }
       );
       
       // Fundo do pote
       this.matter.add.rectangle(
         x, 
         zoneY + zoneHeight/2 - wallThickness/2, 
         zoneWidth, 
         wallThickness, 
         { isStatic: true }
       );
      
      // Zona de sensor para detectar quando a bola entra no pote
      const zone = this.matter.add.rectangle(x, zoneY - 10, zoneWidth - 6, 20, {
        isStatic: true,
        isSensor: true
      });
      
      // Simple visual container
      const container = this.add.container(x, zoneY);
      
      // Simple color scheme
      let bgColor, textColor;
      if (value >= 2.5) {
        bgColor = 0x8b0000; // Dark red for highest (2.5x)
        textColor = '#ffffff';
      } else if (value >= 2.0) {
        bgColor = 0xff0000; // Red for high (2.0x)
        textColor = '#ffffff';
      } else if (value >= 1.5) {
        bgColor = 0xff6600; // Orange for high (1.9x, 1.5x)
        textColor = '#ffffff';
      } else if (value >= 1.0) {
        bgColor = 0xffff00; // Yellow for medium-high (1.2x, 1.0x)
        textColor = '#000000';
      } else if (value >= 0.5) {
        bgColor = 0x00ff00; // Green for medium (0.9x, 0.5x)
        textColor = '#000000';
      } else {
        bgColor = 0x0066ff; // Blue for lowest (0.2x)
        textColor = '#ffffff';
      }
      
      // Design flat moderno
      const background = this.add.graphics();
      background.fillStyle(bgColor, 0.9);
      background.fillRoundedRect(-zoneWidth/2, -zoneHeight/2, zoneWidth, zoneHeight, 12);
      
      // Borda sutil
      const border = this.add.graphics();
      border.lineStyle(2, 0xffffff, 0.3);
      border.strokeRoundedRect(-zoneWidth/2, -zoneHeight/2, zoneWidth, zoneHeight, 12);
      
      // Sombra suave
      const shadow = this.add.graphics();
      shadow.fillStyle(0x000000, 0.1);
      shadow.fillRoundedRect(-zoneWidth/2 + 1, -zoneHeight/2 + 1, zoneWidth, zoneHeight, 12);
      
      // Ajustar tamanho da fonte para mobile
      const fontSize = isMobile ? '12px' : '16px';
      
      // Texto com sombra
      const textShadow = this.add.text(1, 1, `${value}x`, {
        fontFamily: 'Arial Black',
        fontSize: fontSize,
        color: '#000000'
      }).setOrigin(0.5);
      
      const text = this.add.text(0, 0, `${value}x`, {
        fontFamily: 'Arial Black',
        fontSize: fontSize,
        color: textColor
      }).setOrigin(0.5);
      
      container.add([shadow, background, border, textShadow, text]);
      
      // Adicionar interatividade hover
      container.setInteractive(new Phaser.Geom.Rectangle(-zoneWidth/2, -zoneHeight/2, zoneWidth, zoneHeight), Phaser.Geom.Rectangle.Contains);
      
      container.on('pointerover', () => {
        background.clear();
        background.fillStyle(bgColor, 1.0);
        background.fillRoundedRect(-zoneWidth/2, -zoneHeight/2, zoneWidth, zoneHeight, 12);
        border.clear();
        border.lineStyle(3, 0xffffff, 0.6);
        border.strokeRoundedRect(-zoneWidth/2, -zoneHeight/2, zoneWidth, zoneHeight, 12);
      });
      
      container.on('pointerout', () => {
         background.clear();
         background.fillStyle(bgColor, 0.9);
         background.fillRoundedRect(-zoneWidth/2, -zoneHeight/2, zoneWidth, zoneHeight, 12);
         border.clear();
         border.lineStyle(2, 0xffffff, 0.3);
         border.strokeRoundedRect(-zoneWidth/2, -zoneHeight/2, zoneWidth, zoneHeight, 12);
       });
      
      // Definir profundidade para ficar visível
      container.setDepth(1);
      
      this.multipliers.push({
        zone,
        value,
        container,
        text
      });
    });
  }

  private setupPhysicsAndEvents() {
     // Ball collision with multiplier zones
     this.matter.world.on('collisionstart', (event: { pairs: { bodyA: unknown; bodyB: unknown }[] }) => {
       event.pairs.forEach((pair: { bodyA: unknown; bodyB: unknown }) => {
        const { bodyA, bodyB } = pair;
        
        // Check if ball hit a multiplier zone
        const ball = this.balls.find(b => b.body === bodyA || b.body === bodyB);
        const multiplier = this.multipliers.find(m => m.zone === bodyA || m.zone === bodyB);
        
        if (ball && multiplier) {
          // Efeito sonoro do multiplicador
          if (this.soundEnabled) {
            this.playMultiplierSound(multiplier.value);
          }
          
          // Efeito na bola - criar um círculo visual temporário para animação
          if (ball && ball.active) {
            const ballEffect = this.add.circle(ball.x, ball.y, 8, 0xffffff, 0.8);
            ballEffect.setDepth(3);
            this.tweens.add({
              targets: ballEffect,
              scale: 2,
              alpha: 0,
              duration: 400,
              ease: 'Back.easeOut',
              onComplete: () => ballEffect.destroy()
            });
          }
          
          // Efeito de brilho na bola
          const ballGlow = this.add.circle(ball.x, ball.y, 15, 0xffffff, 0.6);
          ballGlow.setDepth(2);
          this.tweens.add({
            targets: ballGlow,
            scaleX: 2,
            scaleY: 2,
            alpha: 0,
            duration: 500,
            onComplete: () => ballGlow.destroy()
          });
          
          // Animate the winning zone
          if (multiplier.container && multiplier.container.active) {
            this.tweens.add({
              targets: multiplier.container,
              scale: 1.3,
              duration: 200,
              yoyo: true,
              ease: 'Back.easeOut'
            });
          }
          
          // Efeito de confete para valores altos
          if (multiplier.value >= 2.0) {
            this.createConfettiEffect(multiplier.container.x, multiplier.container.y);
          }
          
          // Flash effect
          if (multiplier.text && multiplier.text.active) {
            this.tweens.add({
              targets: multiplier.text,
              alpha: 0.3,
              duration: 100,
              yoyo: true,
              repeat: 3
            });
          }
          
          // Remove ball after short delay
          this.time.delayedCall(500, () => {
            if (ball && ball.destroy) {
              ball.destroy();
              const ballIndex = this.balls.indexOf(ball);
              if (ballIndex > -1) {
                this.balls.splice(ballIndex, 1);
              }
            }
            this.onBallComplete(multiplier.value);
          });
        }
      });
    });
  }

  dropBall() {
    this.onBallDrop();
    
    // Criar bola em posição aleatória no topo (responsivo)
    const centerX = this.gameWidth / 2;
    const randomRange = Math.min(80, this.gameWidth * 0.1); // 10% da largura ou 80px, o que for menor
    const x = centerX - randomRange / 2 + Math.random() * randomRange;
    const y = 75;
    
    // Efeito sonoro de lançamento
    if (this.soundEnabled) {
      // Simular som de lançamento com oscilador
      this.playLaunchSound();
    }
    
    // Ajustar tamanho da bola baseado na largura da tela
    const isMobile = this.gameWidth < 500;
    const ballRadius = isMobile ? 6 : 8; // Bola menor no mobile
    
    // Criar bola visual simples
    const ball = this.add.circle(x, y, ballRadius, 0xffffff);
    
    // Definir profundidade para ficar na frente das zonas de multiplicadores
    ball.setDepth(1);
    
    // Criar corpo físico da bola usando as configurações definidas
    const ballBody = this.matter.add.circle(x, y, ballRadius, {
      restitution: this.ballPhysics.restitution,   // Controla o quique
      friction: this.ballPhysics.friction,         // Controla o atrito com superfícies
      frictionAir: this.ballPhysics.frictionAir,   // Controla a resistência do ar (peso)
      density: this.ballPhysics.density            // Controla a densidade/massa da bola
    });

    // Conectar física e visual
    this.matter.add.gameObject(ball, ballBody);
    ball.setData('isBall', true);
    
    this.balls.push(ball);
  }

  private createConfettiEffect(x: number, y: number) {
    const colors = [0xff6b6b, 0x4ecdc4, 0x45b7d1, 0xf9ca24, 0xf0932b, 0xeb4d4b, 0x6c5ce7];
    
    for (let i = 0; i < 15; i++) {
      const confetti = this.add.rectangle(
        x + (Math.random() - 0.5) * 20,
        y + (Math.random() - 0.5) * 20,
        6,
        6,
        colors[Math.floor(Math.random() * colors.length)]
      );
      
      confetti.setDepth(3);
      
      this.tweens.add({
        targets: confetti,
        x: x + (Math.random() - 0.5) * 200,
        y: y + Math.random() * 100 + 50,
        rotation: Math.random() * Math.PI * 2,
        alpha: 0,
        duration: 1000 + Math.random() * 500,
        ease: 'Cubic.easeOut',
        onComplete: () => confetti.destroy()
      });
    }
  }

  update() {
    // Clean up balls that have fallen off screen
    this.balls = this.balls.filter(ball => {
      if (ball.y > 650) {
        ball.destroy();
        return false;
      }
      return true;
    });
  }
}