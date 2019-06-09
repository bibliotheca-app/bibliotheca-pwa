import * as _firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/performance';

const config = (() => {
  switch (process.env.REACT_APP_TARGET) {
    case 'prod':
      return {
        apiKey: 'AIzaSyCcEk8gybo6OgSoTpfi_E7rmFaEb8ef5cs',
        authDomain: 'bibliotheca-238406.firebaseapp.com',
        databaseURL: 'https://bibliotheca-238406.firebaseio.com',
        projectId: 'bibliotheca-238406',
        storageBucket: 'bibliotheca-238406.appspot.com',
        messagingSenderId: '27494100207',
        appId: '1:27494100207:web:90ca4fa048f8caa9',
      };
    default:
      return {
        apiKey: 'AIzaSyCwkZrNBPiknXHpMxC0ij2X9Ihk15Mb-RI',
        authDomain: 'bibliotheca-test.firebaseapp.com',
        databaseURL: 'https://bibliotheca-test.firebaseio.com',
        projectId: 'bibliotheca-test',
        storageBucket: 'bibliotheca-test.appspot.com',
        messagingSenderId: '236517784800',
        appId: '1:236517784800:web:dc5eee4041fbf1ce',
      };
  }
})();

_firebase.initializeApp(config);

export const firebase = _firebase;
export const perf = _firebase.performance();
