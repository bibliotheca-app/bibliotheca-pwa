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
  isbn?: number;
  title: string;
  borrowedBy?: string;
}
