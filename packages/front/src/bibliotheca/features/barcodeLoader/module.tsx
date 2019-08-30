import { cameraRepository } from 'bibliotheca/services/CameraRepository';
import React from 'react';
import * as Rx from 'typeless/rx';
import {
  BarcodeLoaderActions,
  BarcodeLoaderState,
  handle,
  getBarcodeLoaderState,
} from './interface';
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
    const disallowed =
      prefixWhitelists.find(prefix => data.codeResult.code.indexOf(prefix) !== -1) === undefined;

    if (disallowed) {
      return Rx.empty();
    } else {
      return Rx.of(BarcodeLoaderActions.emitBarcode(data.codeResult.code));
    }
  })
  .on(BarcodeLoaderActions.visibilityChange, () => {
    const { isCameraEnabled, visibilityState } = getBarcodeLoaderState();
    if (isCameraEnabled && visibilityState === 'hidden') {
      return BarcodeLoaderActions.disableCamela();
    } else {
      return Rx.empty();
    }
  });

// --- Reducer ---
const initialState: BarcodeLoaderState = {
  isCameraSupported: false,
  isCameraEnabled: cameraRepository.isCameraPermissionGranted(),
  visibilityState: '',
};

export const reducer = handle
  .reducer(initialState)
  .on(BarcodeLoaderActions.$mounted, state => {
    state.isCameraSupported = navigator.mediaDevices && !!navigator.mediaDevices.getUserMedia;
    state.isCameraEnabled = false;
    state.visibilityState = document.visibilityState;
  })
  .on(BarcodeLoaderActions.enableCamera, state => {
    state.isCameraEnabled = true;
  })
  .onMany([BarcodeLoaderActions.disableCamela, BarcodeLoaderActions.emitBarcode], state => {
    state.isCameraEnabled = false;
  })
  .on(BarcodeLoaderActions.visibilityChange, state => {
    state.visibilityState = document.visibilityState;
  });

// --- Module ---
export const useBarcodeLoaderModule = () => handle();
export const BarcodeLoaderModule = () => {
  handle();
  return <BarcodeLoaderView />;
};
