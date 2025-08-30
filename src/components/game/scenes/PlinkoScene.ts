import * as Phaser from 'phaser';

export class PlinkoScene extends Phaser.Scene {
  private onBallComplete: (multiplier: number) => void;
  private onBallDrop: () => void;
  private betAmount: number;
  
  // Game objects
  private balls: Phaser.GameObjects.Image[] = [];
  private pegs: Phaser.GameObjects.Container[] = [];
  private multipliers: {
    zone: Phaser.Types.Physics.Matter.MatterBody;
    value: number;
    container: Phaser.GameObjects.Container;
    text: Phaser.GameObjects.Text;
  }[] = [];
  
  // Visual elements
  private backgroundGradient!: Phaser.GameObjects.Graphics;
  private titleContainer!: Phaser.GameObjects.Container;
  
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

  create() {
    // Create professional gradient background
    this.createBackground();
    
    // Create elegant title with effects
    this.createTitle();
    
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
    this.backgroundGradient = this.add.graphics();
    
    // Create sophisticated gradient background using fillGradientStyle
    this.backgroundGradient.fillGradientStyle(0x0f1419, 0x0f1419, 0x2d1b69, 0x2d1b69);
    this.backgroundGradient.fillRect(0, 0, 800, 600);
    
    // Add subtle pattern overlay
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * 800;
      const y = Math.random() * 600;
      const star = this.add.circle(x, y, 1, 0x6366f1, 0.3);
      star.setBlendMode(Phaser.BlendModes.ADD);
    }
  }
  
  private createTitle() {
    this.titleContainer = this.add.container(400, 40);
    
    // Main title with premium styling
    const titleText = this.add.text(0, 0, 'PLINKO PREMIUM', {
      fontFamily: 'Arial Black',
      fontSize: '32px',
      color: '#fbbf24',
      stroke: '#92400e',
      strokeThickness: 2,
      shadow: {
        offsetX: 2,
        offsetY: 2,
        color: '#000000',
        blur: 4,
        fill: true
      }
    }).setOrigin(0.5);
    
    // Glow effect
    const glow = this.add.text(0, 0, 'PLINKO PREMIUM', {
      fontFamily: 'Arial Black',
      fontSize: '32px',
      color: '#fbbf24'
    }).setOrigin(0.5);
    glow.setScale(1.1);
    glow.setAlpha(0.5);
    glow.setBlendMode(Phaser.BlendModes.ADD);
    
    this.titleContainer.add([glow, titleText]);
    
    // Pulsing animation
    this.tweens.add({
      targets: this.titleContainer,
      scaleX: 1.05,
      scaleY: 1.05,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }
  
  private createBoundaries() {
    // Invisible physics boundaries
    this.matter.add.rectangle(0, 300, 20, 600, { isStatic: true });
    this.matter.add.rectangle(800, 300, 20, 600, { isStatic: true });
    this.matter.add.rectangle(400, 600, 800, 20, { isStatic: true });
    
    // Visual side walls
    const leftWall = this.add.graphics();
    leftWall.fillGradientStyle(0x4338ca, 0x4338ca, 0x1e1b4b, 0x1e1b4b);
    leftWall.fillRect(0, 0, 10, 600);
    
    const rightWall = this.add.graphics();
    rightWall.fillGradientStyle(0x4338ca, 0x4338ca, 0x1e1b4b, 0x1e1b4b);
    rightWall.fillRect(790, 0, 10, 600);
  }
  
  private createProfessionalPegs() {
    const pegRadius = 8;
    const rows = 12;
    const startY = 100;
    const rowSpacing = 45;
    
    for (let row = 0; row < rows; row++) {
      const pegsInRow = row + 3;
      const totalWidth = (pegsInRow - 1) * 65;
      const startX = 400 - totalWidth / 2;
      
      for (let col = 0; col < pegsInRow; col++) {
        const x = startX + col * 65;
        const y = startY + row * rowSpacing;
        
        // Physics body
        this.matter.add.circle(x, y, pegRadius, {
           isStatic: true,
           restitution: 0.9,
           friction: 0.1
         });
        
        // Visual container
        const pegContainer = this.add.container(x, y);
        
        // Outer glow
        const outerGlow = this.add.circle(0, 0, pegRadius + 4, 0x6366f1, 0.3);
        outerGlow.setBlendMode(Phaser.BlendModes.ADD);
        
        // Main peg with gradient effect
        const pegGraphics = this.add.graphics();
        pegGraphics.fillGradientStyle(0xfbbf24, 0xfbbf24, 0xd97706, 0xd97706);
        pegGraphics.fillCircle(0, 0, pegRadius);
        
        // Highlight
        const highlight = this.add.circle(-2, -2, 3, 0xffffff, 0.6);
        
        // Border
        const border = this.add.circle(0, 0, pegRadius);
        border.setStrokeStyle(2, 0x92400e, 0.8);
        
        pegContainer.add([outerGlow, pegGraphics, highlight, border]);
        this.pegs.push(pegContainer);
        
        // Subtle floating animation
        this.tweens.add({
          targets: pegContainer,
          y: y + 2,
          duration: 3000 + Math.random() * 2000,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        });
      }
    }
  }

  private createPremiumMultiplierZones() {
    const zoneWidth = 55;
    const zoneHeight = 70;
    const zoneY = 540;
    const multiplierValues = [0.2, 0.5, 1.0, 1.5, 2.0, 3.0, 5.0, 10.0, 5.0, 3.0, 2.0, 1.5, 1.0, 0.5, 0.2];
    
    const totalZones = multiplierValues.length;
    const totalWidth = totalZones * zoneWidth;
    const startX = 400 - totalWidth / 2;
    
    multiplierValues.forEach((value, index) => {
      const x = startX + index * zoneWidth + zoneWidth / 2;
      
      // Physics zone
      const zone = this.matter.add.rectangle(x, zoneY, zoneWidth - 4, zoneHeight, {
        isStatic: true,
        isSensor: true
      });
      
      // Visual container
      const container = this.add.container(x, zoneY);
      
      // Determine colors based on multiplier value
      let bgColor, textColor, glowColor;
      if (value >= 10) {
        bgColor = [0xff0000, 0x8b0000]; // Red gradient for highest
        textColor = '#ffffff';
        glowColor = 0xff0000;
      } else if (value >= 5) {
        bgColor = [0xffa500, 0xff6600]; // Orange gradient for high
        textColor = '#ffffff';
        glowColor = 0xffa500;
      } else if (value >= 2) {
        bgColor = [0xffd700, 0xffa500]; // Gold gradient for medium-high
        textColor = '#000000';
        glowColor = 0xffd700;
      } else if (value >= 1) {
        bgColor = [0x32cd32, 0x228b22]; // Green gradient for medium
        textColor = '#ffffff';
        glowColor = 0x32cd32;
      } else {
        bgColor = [0x4169e1, 0x191970]; // Blue gradient for low
        textColor = '#ffffff';
        glowColor = 0x4169e1;
      }
      
      // Background with gradient
      const background = this.add.graphics();
      background.fillGradientStyle(bgColor[0], bgColor[0], bgColor[1], bgColor[1]);
      background.fillRoundedRect(-zoneWidth/2 + 2, -zoneHeight/2 + 2, zoneWidth - 4, zoneHeight - 4, 8);
      
      // Glow effect
      const glow = this.add.graphics();
      glow.fillStyle(glowColor, 0.3);
      glow.fillRoundedRect(-zoneWidth/2, -zoneHeight/2, zoneWidth, zoneHeight, 10);
      glow.setBlendMode(Phaser.BlendModes.ADD);
      
      // Border
      const border = this.add.graphics();
      border.lineStyle(2, 0xffffff, 0.8);
      border.strokeRoundedRect(-zoneWidth/2 + 2, -zoneHeight/2 + 2, zoneWidth - 4, zoneHeight - 4, 8);
      
      // Multiplier text
      const text = this.add.text(0, 0, `${value}x`, {
        fontFamily: 'Arial Black',
        fontSize: value >= 10 ? '16px' : '14px',
        color: textColor,
        stroke: value >= 1 ? '#000000' : '#ffffff',
        strokeThickness: 1
      }).setOrigin(0.5);
      
      container.add([glow, background, border, text]);
      
      this.multipliers.push({
        zone,
        value,
        container,
        text
      });
      
      // Subtle pulsing for high-value zones
      if (value >= 5) {
        this.tweens.add({
          targets: container,
          scaleX: 1.1,
          scaleY: 1.1,
          duration: 1500,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        });
      }
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
          // Animate the winning zone
          this.tweens.add({
            targets: multiplier.container,
            scaleX: 1.3,
            scaleY: 1.3,
            duration: 200,
            yoyo: true,
            ease: 'Back.easeOut'
          });
          
          // Flash effect
          this.tweens.add({
            targets: multiplier.text,
            alpha: 0.3,
            duration: 100,
            yoyo: true,
            repeat: 3
          });
          
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
    
    // Create ball at random position at top
    const x = 350 + Math.random() * 100;
    const y = 80;
    
    // Create ball with premium visual effects
    const ballContainer = this.add.container(x, y);
    
    // Outer glow
    const outerGlow = this.add.circle(0, 0, 12, 0x00ffff, 0.5);
    outerGlow.setBlendMode(Phaser.BlendModes.ADD);
    
    // Main ball with gradient
    const ballGraphics = this.add.graphics();
    ballGraphics.fillGradientStyle(0xffffff, 0xffffff, 0xcccccc, 0xcccccc);
    ballGraphics.fillCircle(0, 0, 8);
    
    // Highlight
    const highlight = this.add.circle(-2, -2, 3, 0xffffff, 0.8);
    
    // Border
    const border = this.add.circle(0, 0, 8);
    border.setStrokeStyle(1, 0x666666, 0.8);
    
    ballContainer.add([outerGlow, ballGraphics, highlight, border]);
    
    // Create physics body
    const ballBody = this.matter.add.circle(x, y, 8, {
      restitution: 0.8,
      friction: 0.1,
      frictionAir: 0.01
    });

    // Create invisible image to link physics and visual
    const ball = this.add.image(x, y, '') as Phaser.GameObjects.Image;
    this.matter.add.gameObject(ball, ballBody);
    ball.setData('isBall', true);
    ball.setData('container', ballContainer);

    // Update visual position to match physics in the update loop
    // The collision detection will be handled in the existing collision event system
    
    this.balls.push(ball);
    
    // Store ball reference for cleanup
    ball.setData('ballContainer', ballContainer);
  }

  update() {
    // Update visual positions to match physics bodies
    this.balls.forEach(ball => {
      const container = ball.getData('container') as Phaser.GameObjects.Container;
      if (container && ball.body) {
        container.setPosition(ball.x, ball.y);
      }
    });
  }
}