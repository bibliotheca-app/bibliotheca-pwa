import React from 'react';
import { DefaultSuspense } from 'src/components/DefaultSuspense';
import { Book, RouteConfig } from 'src/types';
import { createActions } from 'typeless';

// --- Constants ---
export const MODULE = 'borrowOrReturn';

// --- Actions ---
export const BorrowOrReturnActions = createActions(MODULE, {
  $mounted: null,
  enableCamera: null,
  disableCamela: null,
  detectBarcode: (data: QuaggaJSResultObject) => ({
    payload: { data },
  }),
  fetchBookFromBarcode: (code: string) => ({ payload: { code } }),
  fetchBookFromBarcodeFullfilled: (target: BarcodeProcessTarget) => ({
    payload: { target },
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
  isCameraSupported: boolean;
  isCameraEnabled: boolean;
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
