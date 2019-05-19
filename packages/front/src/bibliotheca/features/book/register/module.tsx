import { BarcodeLoaderActions } from 'bibliotheca/features/barcodeLoader/interface';
import { openBdRepository } from 'bibliotheca/services/OpenBdRepository';
import React from 'react';
import { createEpic, createReducer, useModule } from 'typeless';
import * as Rx from 'typeless/rx';
import { BookActions } from '../interface';
import { BookRegisterView } from './components/BookRegisterView';
import { BookRegisterActions, BookRegisterState, MODULE } from './interface';
import { isBookInformation } from 'bibliotheca/types';

// --- Epic ---
export const epic = createEpic(MODULE)
  .on(BarcodeLoaderActions.emitBarcode, ({ barcode }) => {
    return Rx.fromPromise(openBdRepository.findBookByIsbn(barcode)).pipe(
      Rx.flatMap(res => {
        if (!isBookInformation(res)) {
          alert('ISBNコードから書籍データを取得できませんでした');
          return Rx.empty();
        } else {
          const {
            summary: { isbn, title },
          } = res[0];
          return Rx.of(
            BookRegisterActions.fetchBookFromOpenBdFullfilled({
              isbn,
              title,
              // dummy
              borrowedBy: null,
              createdAt: new Date(),
              updatedAt: new Date(),
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
        break;
      default:
        throw new Error('unknown mode');
    }
  });

// --- Module ---
export const BookRegisterModule = () => {
  useModule({
    epic,
    reducer,
    reducerPath: ['bookRegister'],
    actions: BookRegisterActions,
  });
  return <BookRegisterView />;
};
