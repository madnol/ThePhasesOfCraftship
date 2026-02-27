import { ApplicationErrors } from "@dddforum/errors/application";
import { User } from "../../domain/user";
import { NextFunction } from "express";

export interface UsersServiceAPI {
  ensureAuthenticated (req: Express.Request, res: Express.Response, next: NextFunction): void;
  getUserById (userId: string): Promise<User | ApplicationErrors.NotFoundError>
  findUserByEmail (email: string): Promise<User | ApplicationErrors.NotFoundError>;
  setCustomUserClaims(userId: string, claims: Record<string, any>): Promise<void>;
}