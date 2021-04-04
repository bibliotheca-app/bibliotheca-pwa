import _firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/performance';

import { firebaseConfig } from 'bibliotheca/const';

export { _firebase as firebase };

try {
  _firebase.initializeApp(firebaseConfig());
} catch {
  alert('firebaseの初期化に失敗しました。管理者まで連絡してください');
}

export const perf = _firebase.performance();
