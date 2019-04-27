import React from 'react';
import { DefaultSuspense } from 'src/components/DefaultSuspense';
import { Book, RouteConfig } from 'src/types';
import { createActions } from 'typeless';

// --- Constants ---
export const MODULE = 'borrowOrReturn';

// --- Actions ---
export const BorrowOrReturnActions = createActions(MODULE, {
  $mounted: null,
  fetchBookFromBarcode: (code: string) => ({ payload: { code } }),
  fetchBookFromBarcodeFullfilled: (books: Book[], userId: string) => ({
    payload: { books, userId },
  }),
});

// --- Routing ---
const ModuleLoader = React.lazy(() => import('./module'));

const BorrowOrReturnRoute = () => (
  <DefaultSuspense>
    <ModuleLoader />
  </DefaultSuspense>
);

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: true,
  path: '/borrow-or-return',
  component: <BorrowOrReturnRoute />,
};

// --- Types ---
export interface BorrowOrReturnState {
  target: BarcodeProcessTarget | undefined;
  isProcessingBook: boolean;
}
export type BarcodeProcessTarget = NotExistBookInList | ExistBookInList;

interface NotExistBookInList {
  existsBookInList: false;
}

interface ExistBookInList {
  book: Book;
}
declare module 'typeless/types' {
  export interface DefaultState {
    borrowOrReturn: BorrowOrReturnState;
  }
}
