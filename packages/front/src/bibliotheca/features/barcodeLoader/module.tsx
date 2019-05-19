import { cameraRepository } from 'bibliotheca/services/CameraRepository';
import React from 'react';
import { createEpic, createReducer, useModule } from 'typeless';
import * as Rx from 'typeless/rx';
import { BarcodeLoaderView } from './components/BarcodeLoaderView';
import { BarcodeLoaderActions, BarcodeLoaderState, MODULE } from './interface';

// --- Epic ---
export const epic = createEpic(MODULE)
  .on(BarcodeLoaderActions.enableCamera, () => {
    cameraRepository.grantCameraPermission();
    return Rx.empty();
  })
  .on(BarcodeLoaderActions.onDetect, ({ data }) => {
    const prefixWhitelists = ['978', '491'];
    const disallowed =
      prefixWhitelists.find(prefix => data.codeResult.code.indexOf(prefix) !== -1) === undefined;

    if (disallowed) {
      return Rx.empty();
    } else {
      return Rx.of(BarcodeLoaderActions.emitBarcode(data.codeResult.code));
    }
  });

// --- Reducer ---
const initialState: BarcodeLoaderState = {
  isCameraSupported: false,
  isCameraEnabled: cameraRepository.isCameraPermissionGranted(),
};

export const reducer = createReducer(initialState)
  .on(BarcodeLoaderActions.$mounted, state => {
    state.isCameraSupported = navigator.mediaDevices && !!navigator.mediaDevices.getUserMedia;
    state.isCameraEnabled = false;
  })
  .on(BarcodeLoaderActions.enableCamera, state => {
    state.isCameraEnabled = true;
  })
  .onMany([BarcodeLoaderActions.disableCamela, BarcodeLoaderActions.emitBarcode], state => {
    state.isCameraEnabled = false;
  });

// --- Module ---
export const BarcodeLoaderModule = () => {
  useModule({
    epic,
    reducer,
    reducerPath: ['barcodeLoader'],
    actions: BarcodeLoaderActions,
  });
  return <BarcodeLoaderView />;
};
