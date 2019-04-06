import React from 'react';
import { DefaultSuspense } from 'src/components/DefaultSuspense';
import { Book, RouteConfig } from 'src/types';
import { createActions } from 'typeless';

// --- Constants ---
export const MODULE = 'bookList';

// --- Actions ---
export const BookListActions = createActions(MODULE, {
  fetchBookList: null,
  fetchBookListFullfilled: (books: Book[]) => ({ payload: { books } }),
  borrowBook: (isbn: string) => ({ payload: { isbn } }),
  returnBook: (isbn: string) => ({ payload: { isbn } }),
  $mounted: null,
});

// --- Routing ---
const ModuleLoader = React.lazy(() => import('./module'));

const BookListRoute = () => (
  <DefaultSuspense>
    <ModuleLoader />
  </DefaultSuspense>
);

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: true,
  path: '/book-list',
  component: <BookListRoute />,
};

// --- Types ---
export interface BookListState {
  books: Book[];
}

declare module 'typeless/types' {
  export interface DefaultState {
    bookList: BookListState;
  }
}
