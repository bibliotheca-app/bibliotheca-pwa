import * as _firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/performance';

export { _firebase as firebase };

interface FirebaseConfig {
  apikey: string;
  authdomain: string;
  databaseurl: string;
  projectid: string;
  storagebucket: string;
  messagingsenderid: string;
  appid?: string;
}

try {
  const config: FirebaseConfig = JSON.parse(process.env.REACT_APP_FIREBASE_CONFIG as any);
  _firebase.initializeApp(config);
} catch {
  alert('firebaseの初期化に失敗しました。管理者まで連絡してください');
}

export const perf = _firebase.performance();
