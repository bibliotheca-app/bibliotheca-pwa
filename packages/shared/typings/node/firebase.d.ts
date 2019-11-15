import { firestore as adminFirestore } from 'firebase-admin';

declare module 'firebase' {
  export namespace myFirestore {
    export type Firestore = adminFirestore.Firestore;
    export type DocumentSnapshot = adminFirestore.DocumentSnapshot;
    export type DocumentReference = adminFirestore.DocumentReference;
    export type Timestamp = adminFirestore.Timestamp;
  }
}
