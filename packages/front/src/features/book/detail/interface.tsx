import React from 'react';
import { DefaultSuspense } from 'src/components/DefaultSuspense';
import { Book, RouteConfig } from 'src/types';
import { createActions } from 'typeless';

// --- Constants ---
export const MODULE = 'book/detail';

// --- Actions ---
export const BookDetailActions = createActions(MODULE, {
  $mounted: null,
  $unmounting: null,
  findBookById: (bookId: string) => ({ payload: { bookId } }),
  findBookByIdFulfilled: (book: Book) => ({ payload: { book } }),
});

// --- Routing ---
const ModuleLoader = React.lazy(() => import('./module'));

const BookDetailRoute = () => (
  <DefaultSuspense>
    <ModuleLoader />
  </DefaultSuspense>
);

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: true,
  path: '/book-detail',
  component: <BookDetailRoute />,
};

// --- Types ---
export interface BookDetailState {
  selectedBook?: Book;
}

declare module 'typeless/types' {
  export interface DefaultState {
    bookDetail: BookDetailState;
  }
}
