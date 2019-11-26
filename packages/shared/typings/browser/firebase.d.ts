import 'firebase';

declare module 'firebase' {
  export namespace myFirestore {
    export type Firestore = firestore.Firestore;
    export type DocumentSnapshot = firestore.DocumentSnapshot;
    export type DocumentReference = firestore.DocumentReference;
    export type Timestamp = firestore.Timestamp;
  }
}
