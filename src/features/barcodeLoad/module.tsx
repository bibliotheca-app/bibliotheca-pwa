import React from 'react';
import { cameraRepository } from 'src/services/CameraRepository';
import { createEpic, createReducer, useModule } from 'typeless';
import * as Rx from 'typeless/rx';
import { BarcodeLoadView } from './components/BarcodeLoadView';
import { BarcodeLoadActions, BarcodeLoadState, MODULE } from './interface';

// --- Epic ---
export const epic = createEpic(MODULE).on(BarcodeLoadActions.enableCamera, () =>
  Rx.of().pipe(
    Rx.tap(() => {
      cameraRepository.grantCameraPermission();
    }),
    Rx.ignoreElements()
  )
);

// --- Reducer ---
const initialState: BarcodeLoadState = {
  isCameraSupported: false,
  isCameraEnabled: cameraRepository.isCameraPermissionGranted(),
  targetBook: undefined,
};

export const reducer = createReducer(initialState)
  .on(BarcodeLoadActions.$mounted, state => {
    state.isCameraSupported =
      navigator.mediaDevices && !!navigator.mediaDevices.getUserMedia;
  })
  .on(BarcodeLoadActions.enableCamera, state => {
    state.isCameraEnabled = true;
  })
  .on(BarcodeLoadActions.detectBarcode, (state, { data }) => {
    state.isCameraEnabled = false;
    state.targetBook = { title: 'kari', isbn: +data.codeResult.code };
  });

// --- Module ---
export default () => {
  useModule({
    epic,
    reducer,
    reducerPath: ['barcodeLoad'],
    actions: BarcodeLoadActions,
  });
  return <BarcodeLoadView />;
};
