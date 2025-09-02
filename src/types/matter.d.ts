/**
 * TypeScript declarations for Matter.js
 * 
 * Following project specification for strict TypeScript typing requirements.
 * Avoiding 'any' type and using explicit type annotations.
 */

declare module 'matter-js' {
  export interface Vector {
    x: number;
    y: number;
  }

  export interface Body {
    id: number;
    position: Vector;
    velocity: Vector;
    angle: number;
    angularVelocity: number;
    force: Vector;
    torque: number;
    speed: number;
    angularSpeed: number;
    motion: number;
    sleepThreshold: number;
    density: number;
    restitution: number;
    friction: number;
    frictionStatic: number;
    frictionAir: number;
    label: string;
    isStatic: boolean;
    isSensor: boolean;
    isSleeping: boolean;
    render: {
      visible: boolean;
      fillStyle?: string;
      strokeStyle?: string;
      lineWidth?: number;
    };
  }

  export interface Engine {
    world: World;
    gravity: Vector;
    timing: {
      timeScale: number;
      timestamp: number;
      delta: number;
      correction: number;
    };
  }

  export interface World {
    bodies: Body[];
    constraints: Constraint[];
    gravity: Vector;
    bounds: {
      min: Vector;
      max: Vector;
    };
  }

  export interface Constraint {
    id: number;
    label: string;
    bodyA?: Body;
    bodyB?: Body;
    pointA: Vector;
    pointB: Vector;
    length: number;
    stiffness: number;
    damping: number;
  }

  export interface BodyOptions {
    isStatic?: boolean;
    isSensor?: boolean;
    density?: number;
    restitution?: number;
    friction?: number;
    frictionStatic?: number;
    frictionAir?: number;
    label?: string;
    render?: {
      visible?: boolean;
      fillStyle?: string;
      strokeStyle?: string;
      lineWidth?: number;
    };
  }

  export interface EngineOptions {
    gravity?: {
      x?: number;
      y?: number;
      scale?: number;
    };
    timing?: {
      timeScale?: number;
    };
  }

  export const Engine: {
    create(options?: EngineOptions): Engine;
    run(engine: Engine): void;
    update(engine: Engine, delta?: number, correction?: number): void;
    clear(engine: Engine): void;
  };

  export const World: {
    add(world: World, bodies: Body | Body[]): void;
    remove(world: World, bodies: Body | Body[]): void;
    clear(world: World, keepStatic?: boolean): void;
  };

  export const Bodies: {
    rectangle(x: number, y: number, width: number, height: number, options?: BodyOptions): Body;
    circle(x: number, y: number, radius: number, options?: BodyOptions): Body;
    polygon(x: number, y: number, sides: number, radius: number, options?: BodyOptions): Body;
  };

  export const Body: {
    applyForce(body: Body, position: Vector, force: Vector): void;
    setVelocity(body: Body, velocity: Vector): void;
    setAngularVelocity(body: Body, velocity: number): void;
    set(body: Body, property: string, value: any): void;
    translate(body: Body, translation: Vector): void;
    rotate(body: Body, rotation: number): void;
    scale(body: Body, scaleX: number, scaleY: number): void;
  };

  export const Events: {
    on(object: Engine | World | Body, eventNames: string, callback: (event: any) => void): void;
    off(object: Engine | World | Body, eventNames: string, callback: (event: any) => void): void;
    trigger(object: Engine | World | Body, eventNames: string, event?: any): void;
  };

  export const Render: {
    create(options: {
      element?: HTMLElement;
      engine?: Engine;
      canvas?: HTMLCanvasElement;
      options?: {
        width?: number;
        height?: number;
        background?: string;
        wireframes?: boolean;
        showVelocity?: boolean;
        showAngleIndicator?: boolean;
      };
    }): any;
    run(render: any): void;
    stop(render: any): void;
  };

  export const Runner: {
    create(options?: { delta?: number; isFixed?: boolean }): any;
    run(runner: any, engine: Engine): void;
    stop(runner: any): void;
  };
}