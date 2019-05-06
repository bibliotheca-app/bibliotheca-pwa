import { createActions } from 'typeless';

// --- Constants ---
export const MODULE = 'barcodeLoader';

// --- Actions ---
export const BarcodeLoaderActions = createActions(MODULE, {
  $mounted: null,
  enableCamera: null,
  disableCamela: null,
  onDetect: (data: QuaggaJSResultObject) => ({
    payload: { data },
  }),
  emitBarcode: barcode => ({ payload: { barcode } }),
});

// --- Types ---
export interface BarcodeLoaderState {
  isCameraSupported: boolean;
  isCameraEnabled: boolean;
}

declare module 'typeless/types' {
  export interface DefaultState {
    barcodeLoader: BarcodeLoaderState;
  }
}
