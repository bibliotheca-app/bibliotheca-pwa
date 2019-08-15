import { cameraRepository } from 'bibliotheca/services/CameraRepository';
import React from 'react';
import * as Rx from 'typeless/rx';
import { BarcodeLoaderActions, BarcodeLoaderState, handle } from './interface';
import { BarcodeLoaderView } from './components/BarcodeLoaderView';

// --- Epic ---
export const epic = handle
  .epic()
  .on(BarcodeLoaderActions.enableCamera, () => {
    cameraRepository.grantCameraPermission();
    return Rx.empty();
  })
  .on(BarcodeLoaderActions.onDetect, ({ data }) => {
    const prefixWhitelists = ['978', '491'];
    const { code } = data.codeResult;
    const disallowed =
      prefixWhitelists.find(prefix => code.indexOf(prefix) !== -1) === undefined &&
      code.length !== 10;

    if (disallowed) {
      return Rx.empty();
    } else {
      return Rx.of(BarcodeLoaderActions.emitBarcode(code));
    }
  });

// --- Reducer ---
const initialState: BarcodeLoaderState = {
  isCameraSupported: false,
  isCameraEnabled: cameraRepository.isCameraPermissionGranted(),
};

export const reducer = handle
  .reducer(initialState)
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
export const useBarcodeLoaderModule = () => handle();
export const BarcodeLoaderModule = () => {
  handle();
  return <BarcodeLoaderView />;
};
