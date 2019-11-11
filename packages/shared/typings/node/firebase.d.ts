import { firestore as adminFirestore } from 'firebase-admin';

declare module 'firebase' {
  export interface MyFirestore extends adminFirestore.Firestore {}
}
