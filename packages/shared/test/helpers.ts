import * as firebase from '@firebase/testing';
import { myFirestore } from 'firebase';

interface Auth {
  uid: string;
  email: string;
}

export class FirestoreTestProvider {
  private projectId: string;
  constructor(projectName: string) {
    this.projectId = `${projectName}-${Date.now()}`;
  }

  getFirestoreWithAuth(auth?: Auth): myFirestore.Firestore {
    return firebase
      .initializeTestApp({
        projectId: this.projectId,
        auth,
      })
      .firestore() as any;
  }

  getAdminFirestore(): myFirestore.Firestore {
    return firebase.initializeAdminApp({ projectId: this.projectId }).firestore() as any;
  }

  async cleanup() {
    return Promise.all(firebase.apps().map(app => app.delete()));
  }
}
