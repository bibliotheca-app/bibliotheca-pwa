import React from 'react';
import { DefaultSuspense } from 'src/components/DefaultSuspense';
import { RouteConfig, Book } from 'src/types';
import { createActions } from 'typeless';

// --- Constants ---
export const MODULE = 'book';

// --- Actions ---
export const BookActions = createActions(MODULE, {
  borrowBookById: (bookId: string) => ({ payload: { bookId } }),
  borrowBookByIdFulfilled: (book: Book) => ({ payload: { book } }),
  borrowBookByIsbn: (isbn: string) => ({ payload: { isbn } }),
  borrowBookByIsbnFulfilled: (book: Book) => ({ payload: { book } }),
  returnBookById: (bookId: string) => ({ payload: { bookId } }),
  returnBookByIdFulfilled: (book: Book) => ({ payload: { book } }),
  returnBookByIsbn: (isbn: string) => ({ payload: { isbn } }),
  returnBookByIsbnFulfilled: (book: Book) => ({ payload: { book } }),
});

// --- Routing ---
const ModuleLoader = React.lazy(() => import('./module'));

const BookRoute = () => (
  <DefaultSuspense>
    <ModuleLoader />
  </DefaultSuspense>
);

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: true,
  path: '/book',
  component: <BookRoute />,
};

// --- Types ---
export interface BookState {
  foo: string;
}

declare module 'typeless/types' {
  export interface DefaultState {
    book: BookState;
  }
}
