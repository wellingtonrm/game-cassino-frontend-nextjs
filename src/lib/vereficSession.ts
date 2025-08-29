import { jwtVerify } from "jose";

export class VereficSession {
  static async isTokenVerefic(token: string) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret");
      const { payload } = await jwtVerify(token, secret);
      return payload as unknown;
    } catch (error) {
      console.error('Token verification failed:', error);
      return null;
    }
  }

  static isTokenExpired(exp: number): boolean {
    if (!exp) return true;
    const expirationTime = exp * 1000;
    const currentTime = Date.now();
    return currentTime >= expirationTime;
  }
}