import * as _firebase from 'firebase/app';
import 'firebase/auth';

const config = {
  apiKey: 'AIzaSyAiJu6x2qleFj5uQU9iNP0mtR_Xz7BkcGs',
  authDomain: 'miscs-randd.firebaseapp.com',
};

_firebase.initializeApp(config);

export const firebase = _firebase;
