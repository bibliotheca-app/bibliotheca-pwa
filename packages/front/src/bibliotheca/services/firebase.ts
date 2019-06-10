import * as _firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/performance';

interface FirebaseConfig {
  apikey: string;
  authdomain: string;
  databaseurl: string;
  projectid: string;
  storagebucket: string;
  messagingsenderid: string;
  appid?: string;
}

const config: FirebaseConfig = JSON.parse(process.env.REACT_APP_FIREBASE_CONFIG as any);

_firebase.initializeApp(config);

export const firebase = _firebase;
export const perf = _firebase.performance();
