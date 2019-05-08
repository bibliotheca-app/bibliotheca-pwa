import { auth, User as FirebaseUser } from 'firebase/app';

export class AuthService {
  constructor(private firebaseAuth: auth.Auth) {}

  async login(): Promise<void> {
    const provider = new auth.GoogleAuthProvider();
    return this.firebaseAuth.signInWithRedirect(provider);
  }

  logout(): Promise<void> {
    return this.firebaseAuth.signOut();
  }

  getCurrentUser(): FirebaseUser | null {
    return this.firebaseAuth.currentUser;
  }

  subscribe(callback: (v: FirebaseUser | null) => void) {
    return this.firebaseAuth.onAuthStateChanged(callback);
  }
}
