import React from 'react';
import { BarcodeLoaderActions } from 'src/features/barcodeLoader/interface';
import { openBdRepository } from 'src/services/OpenBdRepository';
import { createEpic, createReducer, useModule } from 'typeless';
import * as Rx from 'typeless/rx';
import { BookActions } from '../interface';
import { BookRegisterView } from './components/BookRegisterView';
import { BookRegisterActions, BookRegisterState, MODULE } from './interface';

// --- Epic ---
export const epic = createEpic(MODULE)
  .on(BarcodeLoaderActions.emitBarcode, ({ barcode }) => {
    return Rx.fromPromise(openBdRepository.findBookByIsbn(barcode)).pipe(
      Rx.flatMap(res => {
        if (res.length === 0) {
          alert('不正なisbnコードです');
          return Rx.empty();
        } else {
          const {
            summary: { isbn, title },
          } = res[0];
          return Rx.of(
            BookRegisterActions.fetchBookFromOpenBdFullfilled({
              isbn,
              title,
            }),
          );
        }
      }),
    );
  })
  .on(BookRegisterActions.submit, (_, { getState }) => {
    const { bookData } = getState().bookRegister;
    return BookActions.registerBook(bookData!);
  });

// --- Reducer ---
const initialState: BookRegisterState = { isProcessingBook: false, mode: 'camera' };

export const reducer = createReducer(initialState)
  .on(BookRegisterActions.$mounted, state => {
    state.registeredBook = undefined;
  })
  .on(BookActions.registerBookFulfilled, (state, { book }) => {
    state.registeredBook = book;
  })
  .on(BookRegisterActions.fetchBookFromOpenBdFullfilled, (state, { bookData }) => {
    state.bookData = bookData;
  })
  .on(BookRegisterActions.toggleMode, state => {
    switch (state.mode) {
      case 'manual':
        state.mode = 'camera';
        break;
      case 'camera':
        state.mode = 'manual';
    }
  });

// --- Module ---
export default () => {
  useModule({
    epic,
    reducer,
    reducerPath: ['bookRegister'],
    actions: BookRegisterActions,
  });
  return <BookRegisterView />;
};
