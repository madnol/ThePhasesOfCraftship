import { ApplicationErrors } from "@dddforum/errors/application";
import { User } from "../../domain/user";
import { UsersServiceAPI } from "../ports/usersServiceAPI";
import { auth } from "firebase-admin";
import path from "path";
import { initializeApp, cert } from 'firebase-admin/app';
import { NextFunction, Request, Response } from "express";

export class FirebaseAuth implements UsersServiceAPI {
  private firebaseAuth: auth.Auth;

  constructor() {
    this.initialize();
    this.firebaseAuth = auth();
  }

  initialize () {
    initializeApp({
      credential: cert(require(path.join(__dirname, '../../../../../service-key.json')))
    });
  }

  async ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
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
      console.log(decodedToken);
      (req as any).user = decodedToken;
      next();
    } catch (error) {
      console.error('Token verification failed:', error);
      return res.status(401).json({ 
        error: 'Invalid token',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getUserById(userId: string): Promise<User | ApplicationErrors.NotFoundError> {
    try {
      const userRecord = await this.firebaseAuth.getUser(userId);
      return {
        id: userRecord.uid,
        email: userRecord.email || '',
        emailVerified: userRecord.emailVerified,
        name: userRecord.displayName || ''
      };
    } catch (error) {
      if ((error as any).code === 'auth/user-not-found') {
        return new ApplicationErrors.NotFoundError('user');
      }
      throw error;
    }
  }

  async findUserByEmail(email: string): Promise<User | ApplicationErrors.NotFoundError> {
    try {
      const userRecord = await this.firebaseAuth.getUserByEmail(email);
      return {
        id: userRecord.uid,
        email: userRecord.email || '',
        emailVerified: userRecord.emailVerified,
        name: userRecord.displayName || ''
      };
    } catch (error) {
      if ((error as any).code === 'auth/user-not-found') {
        return new ApplicationErrors.NotFoundError('user');
      }
      throw error;
    }
  }

  // We set the claims for the user so that on subsequent requests, we can locate 
  // the user from the token via memberId. This allows us to keep focused on the 
  // domain concepts and identifiers and prevents us from needing to polute the domain 
  // with "userId"
  async setCustomUserClaims(userId: string, claims: Record<string, any>): Promise<void> {
    this.firebaseAuth.setCustomUserClaims(userId, claims)
  }
}
