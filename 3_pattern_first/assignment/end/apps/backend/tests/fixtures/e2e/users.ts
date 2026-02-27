
import { auth } from 'firebase-admin';
import { randomUUID } from "node:crypto";

/**
 * Creates a fake Firebase auth token for testing purposes.
 * This should only be used in development and test environments.
 */
export async function createFakeAuthTokenAndUser(): Promise<{ token: string; userId: string }> {
  const userId = randomUUID();
  
  // In test/development mode, we can use Firebase's createCustomToken
  // This will generate a token that can be verified by the JWT middleware
  const token = await auth().createCustomToken(userId, {
    // Add any additional claims needed for testing. We won't be using these now.
    permissions: ['create:members', 'create:posts']
  });

  return { token, userId };
}

/**
 * Creates a fake Firebase ID token for testing purposes.
 * This should only be used in development and test environments.
 */
export async function createFakeIdToken(): Promise<{ token: string; userId: string }> {
  const { token, userId } = await createFakeAuthTokenAndUser();
  
  // In a real environment, you would exchange the custom token for an ID token
  // For testing purposes, we'll just return the custom token
  return { token, userId };
}
