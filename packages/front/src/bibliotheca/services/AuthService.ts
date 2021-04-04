import firebase from 'firebase/app';
import { allowedDomain } from 'bibliotheca/const';

export class AuthService {
  constructor(private firebaseAuth: firebase.auth.Auth) {}

  async login(): Promise<void> {
    const provider = new firebase.auth.GoogleAuthProvider();

    provider.setCustomParameters({
      hd: allowedDomain,
    });

    return this.firebaseAuth.signInWithRedirect(provider);
  }

  logout(): Promise<void> {
    return this.firebaseAuth.signOut();
  }

  getCurrentUser(): firebase.User | null {
    return this.firebaseAuth.currentUser;
  }

  subscribe(callback: (v: firebase.User | null) => void) {
    return this.firebaseAuth.onAuthStateChanged(callback);
  }
}
