import React from 'react';
import { DefaultSuspense } from 'src/components/DefaultSuspense';
import { Book, RouteConfig } from 'src/types';
import { createActions } from 'typeless';

// --- Constants ---
export const MODULE = 'bookList';

// --- Actions ---
export const BookListActions = createActions(MODULE, {
  fetchBookList: null,
  fetchBookListFulfilled: (books: Book[]) => ({ payload: { books } }),
  borrowBookById: (bookId: string) => ({ payload: { bookId } }),
  borrowBookByIdFulfilled: (book: Book) => ({ payload: { book } }),
  borrowBookByIsbn: (isbn: string) => ({ payload: { isbn } }),
  borrowBookByIsbnFulfilled: (book: Book) => ({ payload: { book } }),
  returnBookById: (bookId: string) => ({ payload: { bookId } }),
  returnBookByIdFulfilled: (book: Book) => ({ payload: { book } }),
  returnBookByIsbn: (isbn: string) => ({ payload: { isbn } }),
  returnBookByIsbnFulfilled: (book: Book) => ({ payload: { book } }),
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
