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
  isbn: string | null;
  title: string;
  borrowedBy: string | null;
  updatedAt: Date;
  createdAt: Date;
}

export type InventoryStatus = 'checked' | 'missing';
export interface InventoryBook extends Book {
  status: InventoryStatus;
}

export interface InventoryEvent extends InventoryEventBody {
  id: string;
}
export type InventoryEventStatus = 'doing' | 'done';
export interface InventoryEventBody {
  date: Date;
  status: InventoryEventStatus;
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
