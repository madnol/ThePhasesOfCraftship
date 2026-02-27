import { UsersServiceAPI } from "../ports/usersServiceAPI";
import { auth } from "firebase-admin";
import path from "path";
import { initializeApp, cert } from 'firebase-admin/app';
import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { Types } from "@dddforum/api/users";


export class MockFirebaseAuth implements UsersServiceAPI {
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
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split('Bearer ')[1];
    
    try {
      // Just decode the token without verification
      const decoded = jwt.decode(token) as { uid: string, claims: { email: string } }

      console.log(`Here's the fake decoded token we're using for testing :)`);
      console.log(decoded)

      const userIdToken: Types.DecodedIdToken = {
        uid: decoded.uid,
        email: decoded.claims.email
      };
      
      req.user = userIdToken;

      return next();
    } catch (error) {
      return res.status(401).json({ 
        error: 'Invalid token',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getUserById(id: string): Promise<any> {
    throw new Error('not yet implemented')
  }

  async findUserByEmail(email: string): Promise<any> {
    throw new Error('not yet implemented')
  }

  async setCustomUserClaims(userId: string, claims: Record<string, any>): Promise<void> {
    // Mock implementation - just log the claims
    console.log(`Setting custom claims for user ${userId}:`, claims);
  }
}