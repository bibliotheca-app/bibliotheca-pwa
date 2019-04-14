import { User as FirebaseUser } from 'firebase/app';

export interface RouteConfig {
  type: 'route';
  path: string;
  exact?: boolean;
  auth: boolean;
  component: React.ReactElement<any>;
}

export interface User {
  firebaseAuth: FirebaseUser;
}

export interface Book {
  id: string;
  isbn?: string;
  title: string;
  borrowedBy?: string;
  updatedAt: Date;
  createdAt: Date;
}

export type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
