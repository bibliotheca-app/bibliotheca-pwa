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

type InventoryStatus = 'checked' | 'missing';

export interface InventoryEventDone {
  status: typeof InventoryEventStatus.Done;
}
export interface InventoryBook {
  status: InventoryStatus;
  bookId: string;
  // inventoriedAt: Date; // todo: implement this field
  // inventoriedBy: string;
}
export interface InventoryEventDoing {
  date: Date;
  status: typeof InventoryEventStatus.Doing;
  inventoryBooks: InventoryBook[];
}
export type InventoryEvent = InventoryEventDoing | InventoryEventDone;

export const InventoryEventStatus = {
  Doing: 'doing',
  Done: 'done',
} as const;

export type InventoryEventStatus = typeof InventoryEventStatus[keyof typeof InventoryEventStatus];
export const isDoneEvent = (e: InventoryEvent): e is InventoryEventDone =>
  e.status === InventoryEventStatus.Done;

export interface InventoryEventLog extends InventoryEventLogBody {
  id: string;
}

export interface InventoryEventLogBody {
  date: Date;
  status: typeof InventoryEventStatus.Done;
  // books: InventoryBook[] // todo
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
