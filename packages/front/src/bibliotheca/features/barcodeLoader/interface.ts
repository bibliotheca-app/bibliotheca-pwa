import { createModule } from 'typeless';
import { BarcodeLoaderSymbol } from './symbol';

// --- Actions ---
const modules = createModule(BarcodeLoaderSymbol)
  .withActions({
    $mounted: null,
    enableCamera: null,
    disableCamela: null,
    onDetect: (data: QuaggaJSResultObject) => ({
      payload: { data },
    }),
    emitBarcode: (barcode: string) => ({ payload: { barcode } }),
    visibilityChange: null,
  })
  .withState<BarcodeLoaderState>();

export const handle = modules[0];
export const BarcodeLoaderActions = modules[1];
export const getBarcodeLoaderState = modules[2];

// --- Types ---
export interface BarcodeLoaderState {
  isCameraSupported: boolean;
  isCameraEnabled: boolean;
  visibilityState: string;
}
