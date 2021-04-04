import firebase from 'firebase/app';

declare module 'firebase' {
  export namespace myFirestore {
    export type Firestore = firebase.firestore.Firestore;
    export type DocumentSnapshot = firebase.firestore.DocumentSnapshot;
    export type DocumentReference = firebase.firestore.DocumentReference;
    export type Timestamp = firebase.firestore.Timestamp;
  }
}
