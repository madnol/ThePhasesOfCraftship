import { auth } from 'firebase-admin';
import { Request, Response, NextFunction } from 'express';
import { Config } from '@dddforum/config';

export function createJwtCheck(config: Config) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      console.log('No Bearer token found in Authorization header');
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split('Bearer ')[1];
    console.log('Token received:', token.substring(0, 10) + '...'); // Log first 10 chars for security
    
    try {
      console.log('Attempting to verify ID token...');
      const decodedToken = await auth().verifyIdToken(token);
      console.log('Token successfully verified. User ID:', decodedToken.uid);
      (req as any).user = decodedToken;
      next();
    } catch (error) {
      console.error('Token verification failed:', error);
      return res.status(401).json({ 
        error: 'Invalid token',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };
}
