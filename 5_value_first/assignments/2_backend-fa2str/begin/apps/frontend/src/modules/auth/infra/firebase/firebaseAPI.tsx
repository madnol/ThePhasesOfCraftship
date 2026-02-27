import { UserDm } from "../../domain/userDm";

export interface FirebaseAPI {
  signInWithGoogle (): Promise<UserDm>;
  waitForAuthenticatedUser(): Promise<UserDm | null>;
}