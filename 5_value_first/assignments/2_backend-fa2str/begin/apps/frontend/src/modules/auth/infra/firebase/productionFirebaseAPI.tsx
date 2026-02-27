import { FirebaseAPI } from "./firebaseAPI";
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, UserCredential, onAuthStateChanged } from 'firebase/auth';
import { UserDm } from "../../domain/userDm";
import { toJS } from "mobx";

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string
}

export class ProductionFirebaseAPI implements FirebaseAPI {
  private auth: ReturnType<typeof getAuth>;

  constructor (config: FirebaseConfig) {
    initializeApp(config);
    this.auth = getAuth();
  }

  async signInWithGoogle(): Promise<UserDm> {

    const provider = new GoogleAuthProvider();

    const credentials: UserCredential = await signInWithPopup(this.auth, provider);

    const idToken = await credentials.user.getIdToken();
      
    const userDm = UserDm.fromFirebase(credentials, idToken);

    console.log(toJS(userDm));

    return userDm;
  }

  async getAuthenticatedUser(): Promise<UserDm | null> {
    const user = this.auth.currentUser;
    if (!user) return null;
    const idToken = await user.getIdToken();
    return UserDm.fromFirebase(user, idToken);
  }

  async waitForAuthenticatedUser(): Promise<UserDm | null> {
    return new Promise((resolve) => {
      onAuthStateChanged(this.auth, async (user) => {
        if (user) {
          const idToken = await user.getIdToken();
          console.log(idToken)
          resolve(UserDm.fromFirebase(user, idToken));
        } else {
          resolve(null);
        }
      });
    });
  }
}