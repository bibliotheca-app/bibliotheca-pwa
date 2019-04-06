import React from 'react';
import { DefaultSuspense } from 'src/components/DefaultSuspense';
import { RouteConfig } from 'src/types';
import { createActions } from 'typeless';

// --- Constants ---
export const MODULE = 'barcodeLoad';

// --- Actions ---
export const BarcodeLoadActions = createActions(MODULE, {
  $mounted: null,
  enableCamera: null,
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
}

declare module 'typeless/types' {
  export interface DefaultState {
    barcodeLoad: BarcodeLoadState;
  }
}
