import { firestore } from 'firebase';

declare module 'firebase' {
  export interface MyFirestore extends firestore.Firestore {}
}
