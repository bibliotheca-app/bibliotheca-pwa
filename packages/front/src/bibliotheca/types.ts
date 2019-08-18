import { User as FirebaseUser } from 'firebase/app';
import { Matcher } from 'navi';
import React from 'react';

export interface RouteEntry {
  path: string;
  routes: Matcher<object>;
}

export interface User {
  firebaseAuth: FirebaseUser;
  email: string;
}

export interface Book {
  id: string;
  isbn: string | null;
  title: string;
  borrowedBy: string | null;
  updatedAt: Date;
  createdAt: Date;
  deletedAt?: Date;
}

export const isBook = (book: any): book is Book => {
  if (book == null) {
    return false;
  }

  return (
    typeof book.id === 'string' &&
    typeof book.title === 'string' &&
    book.updatedAt &&
    book.createdAt
  );
};

export type BookData = Omit<Book, 'id'>;

export interface BookEditData {
  id: string;
  isbn: string;
  title: string;
}

export type InventoryStatus = 'checked' | 'missing';

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

interface InventoriedBook extends Book {
  status: InventoryStatus;
}
export interface InventoryEventLog extends InventoryEventLogBody {
  id: string;
}

export interface InventoryEventLogBody {
  date: Date;
  // todo
  // eventDate: Date
  // eventCompletionDate: Date
  status: typeof InventoryEventStatus.Done;
  books: InventoriedBook[];
}

export type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
export type Nullable<T> = T | null;
export type Parameters<T> = T extends (...args: infer T) => any ? T : never;
export type ReturnType<T> = T extends (...args: any[]) => infer T ? T : never;

export type GrommetFormEvent<T> = React.FormEvent<HTMLFormElement> & {
  value: T;
};
export type GrommetFormHandler<T> = React.EventHandler<GrommetFormEvent<T>>;

export type OpenBDBookItem = BookInformation & {
  [key: string]: unknown;
};
export type BookInformation = {
  summary: { isbn: string; title: string };
};
export function isBookInformation(res: unknown): res is [BookInformation] {
  if (!Array.isArray(res)) {
    return false;
  }
  if (res.length === 0) {
    return false;
  }
  const body = res[0];
  return body && body.summary && body.summary.isbn && body.summary.title;
}
export type OpenBDBookResponse = OpenBDBookItem[];
