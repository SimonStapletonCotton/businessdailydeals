// Simple token-based authentication that actually works
const activeTokens = new Map<string, any>();

export function generateAuthToken(user: any): string {
  const token = `auth_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  activeTokens.set(token, {
    user,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
  });
  return token;
}

export function validateAuthToken(token: string): any | null {
  const auth = activeTokens.get(token);
  if (!auth) return null;
  
  if (new Date() > auth.expiresAt) {
    activeTokens.delete(token);
    return null;
  }
  
  return auth.user;
}

export function clearAuthToken(token: string): void {
  activeTokens.delete(token);
}

export function simpleAuthMiddleware(req: any, res: any, next: any) {
  const token = req.headers.authorization?.replace('Bearer ', '') || 
                req.query.token ||
                req.cookies?.authToken;
  
  if (token) {
    const user = validateAuthToken(token);
    if (user) {
      req.user = user;
      req.isAuthenticated = () => true;
    }
  }
  
  next();
}