import { User as FirebaseUser } from 'firebase/app';
import { Matcher } from 'navi';
import React from 'react';

export interface AppContext {
  user: User | null;
  isLoadedAsync: Promise<void>;
}

export interface RouteEntry<
  Context extends object = AppContext,
  ChildContext extends object = Context
> {
  path: string;
  routes: Matcher<Context, ChildContext>;
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

export type BookData = Omit<Book, 'id'>;

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
