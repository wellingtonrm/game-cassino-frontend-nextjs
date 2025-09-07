declare module 'planck-js' {
  export interface Vec2 {
    x: number;
    y: number;
  }

  export interface BodyDef {
    type?: 'static' | 'kinematic' | 'dynamic';
    position?: Vec2;
    angle?: number;
    linearVelocity?: Vec2;
    angularVelocity?: number;
    linearDamping?: number;
    angularDamping?: number;
    allowSleep?: boolean;
    awake?: boolean;
    fixedRotation?: boolean;
    bullet?: boolean;
    active?: boolean;
    userData?: any;
    gravityScale?: number;
  }

  export interface FixtureDef {
    shape?: Shape;
    userData?: any;
    friction?: number;
    restitution?: number;
    density?: number;
    isSensor?: boolean;
    filter?: {
      categoryBits?: number;
      maskBits?: number;
      groupIndex?: number;
    };
  }

  export interface Shape {
    getType(): string;
    getRadius?(): number;
    getVertex?(index: number): Vec2;
    getVertexCount?(): number;
  }

  export interface CircleShape extends Shape {
    m_radius: number;
    m_p: Vec2;
  }

  export interface PolygonShape extends Shape {
    m_vertices: Vec2[];
    m_count: number;
  }

  export interface EdgeShape extends Shape {
    m_vertex1: Vec2;
    m_vertex2: Vec2;
  }

  export interface Body {
    createFixture(def: FixtureDef): Fixture;
    createFixture(shape: Shape, density?: number): Fixture;
    destroyFixture(fixture: Fixture): void;
    setTransform(position: Vec2, angle: number): void;
    getTransform(): Transform;
    getPosition(): Vec2;
    getAngle(): number;
    getWorldCenter(): Vec2;
    getLocalCenter(): Vec2;
    setLinearVelocity(v: Vec2): void;
    getLinearVelocity(): Vec2;
    setAngularVelocity(omega: number): void;
    getAngularVelocity(): number;
    applyForce(force: Vec2, point: Vec2, wake?: boolean): void;
    applyForceToCenter(force: Vec2, wake?: boolean): void;
    applyTorque(torque: number, wake?: boolean): void;
    applyLinearImpulse(impulse: Vec2, point: Vec2, wake?: boolean): void;
    applyAngularImpulse(impulse: number, wake?: boolean): void;
    getMass(): number;
    getInertia(): number;
    getMassData(): MassData;
    setMassData(massData: MassData): void;
    resetMassData(): void;
    getWorldPoint(localPoint: Vec2): Vec2;
    getWorldVector(localVector: Vec2): Vec2;
    getLocalPoint(worldPoint: Vec2): Vec2;
    getLocalVector(worldVector: Vec2): Vec2;
    getLinearVelocityFromWorldPoint(worldPoint: Vec2): Vec2;
    getLinearVelocityFromLocalPoint(localPoint: Vec2): Vec2;
    getLinearDamping(): number;
    setLinearDamping(linearDamping: number): void;
    getAngularDamping(): number;
    setAngularDamping(angularDamping: number): void;
    getGravityScale(): number;
    setGravityScale(scale: number): void;
    setType(type: 'static' | 'kinematic' | 'dynamic'): void;
    getType(): 'static' | 'kinematic' | 'dynamic';
    setBullet(flag: boolean): void;
    isBullet(): boolean;
    setSleepingAllowed(flag: boolean): void;
    isSleepingAllowed(): boolean;
    setAwake(flag: boolean): void;
    isAwake(): boolean;
    setActive(flag: boolean): void;
    isActive(): boolean;
    setFixedRotation(flag: boolean): void;
    isFixedRotation(): boolean;
    getFixtureList(): Fixture | null;
    getJointList(): JointEdge | null;
    getContactList(): ContactEdge | null;
    getNext(): Body | null;
    getUserData(): any;
    setUserData(data: any): void;
    getWorld(): World;
    isDynamic(): boolean;
    isKinematic(): boolean;
    isStatic(): boolean;
  }

  export interface Fixture {
    getType(): string;
    getShape(): Shape;
    setSensor(sensor: boolean): void;
    isSensor(): boolean;
    setFilterData(filter: { categoryBits?: number; maskBits?: number; groupIndex?: number }): void;
    getFilterData(): { categoryBits: number; maskBits: number; groupIndex: number };
    refilter(): void;
    getBody(): Body;
    getNext(): Fixture | null;
    getUserData(): any;
    setUserData(data: any): void;
    testPoint(p: Vec2): boolean;
    raycast(output: RayCastOutput, input: RayCastInput, childIndex: number): boolean;
    getMassData(): MassData;
    setDensity(density: number): void;
    getDensity(): number;
    getFriction(): number;
    setFriction(friction: number): void;
    getRestitution(): number;
    setRestitution(restitution: number): void;
    getAABB(childIndex: number): AABB;
  }

  export interface Transform {
    p: Vec2;
    q: Rot;
  }

  export interface Rot {
    s: number;
    c: number;
  }

  export interface MassData {
    mass: number;
    center: Vec2;
    I: number;
  }

  export interface AABB {
    lowerBound: Vec2;
    upperBound: Vec2;
  }

  export interface RayCastInput {
    p1: Vec2;
    p2: Vec2;
    maxFraction: number;
  }

  export interface RayCastOutput {
    normal: Vec2;
    fraction: number;
  }

  export interface JointEdge {
    other: Body;
    joint: Joint;
    prev: JointEdge | null;
    next: JointEdge | null;
  }

  export interface ContactEdge {
    other: Body;
    contact: Contact;
    prev: ContactEdge | null;
    next: ContactEdge | null;
  }

  export interface Joint {
    getType(): string;
    getBodyA(): Body;
    getBodyB(): Body;
    getAnchorA(): Vec2;
    getAnchorB(): Vec2;
    getReactionForce(inv_dt: number): Vec2;
    getReactionTorque(inv_dt: number): number;
    getNext(): Joint | null;
    getUserData(): any;
    setUserData(data: any): void;
    isActive(): boolean;
    getCollideConnected(): boolean;
  }

  export interface Contact {
    getManifold(): Manifold;
    getWorldManifold(): WorldManifold;
    isTouching(): boolean;
    setEnabled(flag: boolean): void;
    isEnabled(): boolean;
    getNext(): Contact | null;
    getFixtureA(): Fixture;
    getChildIndexA(): number;
    getFixtureB(): Fixture;
    getChildIndexB(): number;
    setFriction(friction: number): void;
    getFriction(): number;
    resetFriction(): void;
    setRestitution(restitution: number): void;
    getRestitution(): number;
    resetRestitution(): void;
    setTangentSpeed(speed: number): void;
    getTangentSpeed(): number;
  }

  export interface Manifold {
    points: ManifoldPoint[];
    localNormal: Vec2;
    localPoint: Vec2;
    type: number;
    pointCount: number;
  }

  export interface ManifoldPoint {
    localPoint: Vec2;
    normalImpulse: number;
    tangentImpulse: number;
    id: ContactID;
  }

  export interface ContactID {
    key: number;
  }

  export interface WorldManifold {
    normal: Vec2;
    points: Vec2[];
    separations: number[];
  }

  export interface World {
    setGravity(gravity: Vec2): void;
    getGravity(): Vec2;
    isLocked(): boolean;
    setAutoClearForces(flag: boolean): void;
    getAutoClearForces(): boolean;
    setContactFilter(filter: ContactFilter): void;
    setContactListener(listener: ContactListener): void;
    setDebugDraw(debugDraw: DebugDraw): void;
    createBody(def?: BodyDef): Body;
    destroyBody(body: Body): void;
    createJoint(def: JointDef): Joint;
    destroyJoint(joint: Joint): void;
    step(timeStep: number, velocityIterations?: number, positionIterations?: number): void;
    clearForces(): void;
    drawDebugData(): void;
    queryAABB(callback: (fixture: Fixture) => boolean, aabb: AABB): void;
    rayCast(callback: (fixture: Fixture, point: Vec2, normal: Vec2, fraction: number) => number, point1: Vec2, point2: Vec2): void;
    getBodyList(): Body | null;
    getJointList(): Joint | null;
    getContactList(): Contact | null;
    setAllowSleeping(flag: boolean): void;
    getAllowSleeping(): boolean;
    setWarmStarting(flag: boolean): void;
    getWarmStarting(): boolean;
    setContinuousPhysics(flag: boolean): void;
    getContinuousPhysics(): boolean;
    setSubStepping(flag: boolean): void;
    getSubStepping(): boolean;
    getProxyCount(): number;
    getBodyCount(): number;
    getJointCount(): number;
    getContactCount(): number;
    getTreeHeight(): number;
    getTreeBalance(): number;
    getTreeQuality(): number;
    shiftOrigin(newOrigin: Vec2): void;
  }

  export interface ContactFilter {
    shouldCollide(fixtureA: Fixture, fixtureB: Fixture): boolean;
  }

  export interface ContactListener {
    beginContact?(contact: Contact): void;
    endContact?(contact: Contact): void;
    preSolve?(contact: Contact, oldManifold: Manifold): void;
    postSolve?(contact: Contact, impulse: ContactImpulse): void;
  }

  export interface ContactImpulse {
    normalImpulses: number[];
    tangentImpulses: number[];
    count: number;
  }

  export interface DebugDraw {
    setFlags(flags: number): void;
    getFlags(): number;
    appendFlags(flags: number): void;
    clearFlags(flags: number): void;
    drawPolygon(vertices: Vec2[], vertexCount: number, color: Color): void;
    drawSolidPolygon(vertices: Vec2[], vertexCount: number, color: Color): void;
    drawCircle(center: Vec2, radius: number, color: Color): void;
    drawSolidCircle(center: Vec2, radius: number, axis: Vec2, color: Color): void;
    drawSegment(p1: Vec2, p2: Vec2, color: Color): void;
    drawTransform(xf: Transform): void;
    drawPoint(p: Vec2, size: number, color: Color): void;
  }

  export interface Color {
    r: number;
    g: number;
    b: number;
    a?: number;
  }

  export interface JointDef {
    type?: string;
    userData?: any;
    bodyA?: Body;
    bodyB?: Body;
    collideConnected?: boolean;
  }

  // Static methods and constructors
  export function World(gravity?: Vec2): World;
  export function Vec2(x?: number, y?: number): Vec2;
  export function Circle(radius?: number): CircleShape;
  export function Circle(center: Vec2, radius?: number): CircleShape;
  export function Box(hx: number, hy: number, center?: Vec2, angle?: number): PolygonShape;
  export function Polygon(vertices: Vec2[]): PolygonShape;
  export function Edge(v1: Vec2, v2: Vec2): EdgeShape;

  // Math utilities
  export namespace Math {
    function clamp(a: number, low: number, high: number): number;
    function random(low?: number, high?: number): number;
  }

  // Constants
  export const DYNAMIC: 'dynamic';
  export const STATIC: 'static';
  export const KINEMATIC: 'kinematic';
}