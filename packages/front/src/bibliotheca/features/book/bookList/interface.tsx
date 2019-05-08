import { DefaultSuspense } from 'bibliotheca/components/DefaultSuspense';
import { Book, RouteConfig } from 'bibliotheca/types';
import React from 'react';
import { createActions } from 'typeless';

// --- Constants ---
export const MODULE = 'bookList';

// --- Actions ---
export const BookListActions = createActions(MODULE, {
  fetchBookList: null,
  fetchBookListFulfilled: (books: Book[]) => ({ payload: { books } }),
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
