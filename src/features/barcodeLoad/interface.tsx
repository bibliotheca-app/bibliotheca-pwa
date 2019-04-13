import React from 'react';
import { DefaultSuspense } from 'src/components/DefaultSuspense';
import { Book, RouteConfig } from 'src/types';
import { createActions } from 'typeless';

// --- Constants ---
export const MODULE = 'barcodeLoad';

// --- Actions ---
export const BarcodeLoadActions = createActions(MODULE, {
  $mounted: null,
  enableCamera: null,
  detectBarcode: (data: QuaggaJSResultObject) => ({ payload: { data } }),
  fetchBookFromBarcode: (code: string) => ({ payload: { code } }),
  fetchBookFromBarcodeFullfilled: (book: Book | undefined) => ({
    payload: { book },
  }),
});

// --- Routing ---
const ModuleLoader = React.lazy(() => import('./module'));

const BarcodeLoadRoute = () => (
  <DefaultSuspense>
    <ModuleLoader />
  </DefaultSuspense>
);

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: true,
  path: '/barcode-load',
  component: <BarcodeLoadRoute />,
};

// --- Types ---
export interface BarcodeLoadState {
  isCameraSupported: boolean;
  isCameraEnabled: boolean;
  targetBook: undefined | Book;
  isProcessingBook: boolean;
}

declare module 'typeless/types' {
  export interface DefaultState {
    barcodeLoad: BarcodeLoadState;
  }
}
