import { auth, User as FirebaseUser } from 'firebase/app';

export class AuthService {
  constructor(private firebaseAuth: auth.Auth) {}

  public async login(): Promise<void> {
    const provider = new auth.GoogleAuthProvider();
    return this.firebaseAuth.signInWithRedirect(provider);
  }

  public logout(): Promise<void> {
    return this.firebaseAuth.signOut();
  }

  public getCurrentUser(): FirebaseUser | null {
    return this.firebaseAuth.currentUser;
  }

  public subscribe(callback: (v: FirebaseUser | null) => void) {
    return this.firebaseAuth.onAuthStateChanged(callback);
  }
}
