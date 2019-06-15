import { createModule } from 'typeless';

// --- Constants ---
export const MODULE = Symbol('barcodeLoader');

// --- Actions ---
const modules = createModule(MODULE)
  .withActions({
    $mounted: null,
    enableCamera: null,
    disableCamela: null,
    onDetect: (data: QuaggaJSResultObject) => ({
      payload: { data },
    }),
    emitBarcode: (barcode: string) => ({ payload: { barcode } }),
  })
  .withState<BarcodeLoaderState>();

export const handle = modules[0];
export const BarcodeLoaderActions = modules[1];
export const getBarcodeLoaderState = modules[2];

// --- Types ---
export interface BarcodeLoaderState {
  isCameraSupported: boolean;
  isCameraEnabled: boolean;
}
