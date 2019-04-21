import * as _firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const config = {
  apiKey: 'AIzaSyAiJu6x2qleFj5uQU9iNP0mtR_Xz7BkcGs',
  authDomain: 'bibliotheca.firebaseapp.com',
  databaseURL: 'https://miscs-randd.firebaseio.com',
  projectId: 'miscs-randd',
};

_firebase.initializeApp(config);

export const firebase = _firebase;
