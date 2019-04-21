import React from 'react';
import { cameraRepository } from 'src/services/CameraRepository';
import { bookRepository } from 'src/services/ServiceContainer';
import { createEpic, createReducer, useModule } from 'typeless';
import * as Rx from 'typeless/rx';
import { BookActions } from '../book/interface';
import { userIdQuery } from '../global/query';
import { BarcodeLoadView } from './components/BarcodeLoadView';
import { BarcodeLoadActions, BarcodeLoadState, MODULE } from './interface';

// --- Epic ---
export const epic = createEpic(MODULE)
  .on(BarcodeLoadActions.enableCamera, () =>
    Rx.of().pipe(
      Rx.tap(() => {
        cameraRepository.grantCameraPermission();
      }),
      Rx.ignoreElements(),
    ),
  )
  .on(BarcodeLoadActions.detectBarcode, ({ data }) => {
    const isbnCodePrefix = '978';
    if (data.codeResult.code.indexOf(isbnCodePrefix) === -1) {
      return Rx.empty();
    } else {
      return Rx.of(BarcodeLoadActions.fetchBookFromBarcode(data.codeResult.code));
    }
  })
  .on(BarcodeLoadActions.fetchBookFromBarcode, ({ code }, { getState }) => {
    return Rx.fromPromise(bookRepository.findBooksByIsbn(code)).pipe(
      Rx.map(books => {
        if (books.length === 0) {
          return BarcodeLoadActions.fetchBookFromBarcodeFullfilled({
            existsBookInList: false,
          });
        }

        const userId = userIdQuery(getState().global);
        const borrowedByMe = books.find(b => b.borrowedBy === userId);
        const stock = books.find(b => !b.borrowedBy);
        const unStock = books.find(b => !!b.borrowedBy);
        const book = !!borrowedByMe ? borrowedByMe : stock ? stock : unStock!;

        return BarcodeLoadActions.fetchBookFromBarcodeFullfilled({ book });
      }),
    );
  })
  .on(BookActions.borrowBookByIdFulfilled, ({ book }) => {
    alert(`${book.title}を借りました`);
    return Rx.empty();
  })
  .on(BookActions.returnBookByIdFulfilled, ({ book }) => {
    alert(`${book.title}を返却しました`);
    return Rx.empty();
  });

// --- Reducer ---
const initialState: BarcodeLoadState = {
  isCameraSupported: false,
  isCameraEnabled: cameraRepository.isCameraPermissionGranted(),
  target: undefined,
  isProcessingBook: false,
};

export const reducer = createReducer(initialState)
  .on(BarcodeLoadActions.$mounted, state => {
    state.isCameraSupported = navigator.mediaDevices && !!navigator.mediaDevices.getUserMedia;
    state.target = undefined;
    state.isProcessingBook = false;
  })
  .on(BarcodeLoadActions.enableCamera, state => {
    state.isCameraEnabled = true;
  })
  .onMany([BarcodeLoadActions.fetchBookFromBarcode, BarcodeLoadActions.disableCamela], state => {
    state.isCameraEnabled = false;
  })
  .onMany([BookActions.borrowBookById, BookActions.returnBookById], state => {
    state.isProcessingBook = true;
  })
  .onMany([BookActions.borrowBookByIdFulfilled, BookActions.returnBookByIdFulfilled], state => {
    state.isProcessingBook = false;
    state.target = undefined;
  })
  .on(BarcodeLoadActions.fetchBookFromBarcodeFullfilled, (state, { target }) => {
    state.target = target;
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
