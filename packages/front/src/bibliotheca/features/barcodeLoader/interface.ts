import { createModule } from 'typeless';
import { BarcodeLoaderSymbol } from './symbol';

// --- Actions ---
export const [handle, BarcodeLoaderActions, getBarcodeLoaderState] = createModule(
  BarcodeLoaderSymbol,
)
  .withActions({
    $mounted: null,
    $unmounting: null,
    enableCamera: null,
    disableCamela: null,
    onDetect: (data: QuaggaJSResultObject) => ({
      payload: { data },
    }),
    emitBarcode: (barcode: string) => ({ payload: { barcode } }),
    visibilityChange: null,
  })
  .withState<BarcodeLoaderState>();

// --- Types ---
export interface BarcodeLoaderState {
  isCameraSupported: boolean;
  isCameraEnabled: boolean;
  visibilityState: string;
}
