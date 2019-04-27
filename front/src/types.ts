import { User as FirebaseUser } from 'firebase/app';
import React from 'react';

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

export interface BookInventoryItem extends Book {
  status: 'checked' | 'missing';
}

export interface InventoryEvent extends InventoryEventBody {
  id: string;
}
export interface InventoryEventBody {
  date: Date;
  status: 'doing' | 'done';
}

export type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
export type GrommetFormEvent<T> = React.FormEvent<HTMLFormElement> & {
  value: T;
};
export type GrommetFormHandler<T> = React.EventHandler<GrommetFormEvent<T>>;

export interface OpenBDBookItem {
  summary: {
    isbn: string;
    title: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}
export type OpenBDBookResponse = OpenBDBookItem[];
