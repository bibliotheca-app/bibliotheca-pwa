import { BarcodeLoaderActions } from 'bibliotheca/features/barcodeLoader/interface';
import { NotificationActions } from 'bibliotheca/features/notification/interface';
import { openBdRepository } from 'bibliotheca/services/OpenBdRepository';
import { isBookInformation } from 'bibliotheca/types';
import React from 'react';
import * as Rx from 'typeless/rx';
import { BookActions } from '../interface';
import { BookRegisterView } from './components/BookRegisterView';
import { BookRegisterActions, BookRegisterState, handle, getBookRegisterState } from './interface';

// --- Epic ---
export const epic = handle
  .epic()
  .on(BarcodeLoaderActions.emitBarcode, ({ barcode }) => {
    if (getBookRegisterState().isProcessingBook) {
      return Rx.empty();
    } else {
      return BookRegisterActions.fetchBookFromOpenBd(barcode);
    }
  })
  .on(BookRegisterActions.fetchBookFromOpenBd, ({ barcode }) => {
    return Rx.from(openBdRepository.findBookByIsbn(barcode)).pipe(
      Rx.mergeMap(res => {
        if (isBookInformation(res)) {
          const { summary } = res[0];
          return [
            BookRegisterActions.resetForm(),
            BookRegisterActions.fetchBookFromOpenBdFullfilled(summary),
          ];
        } else {
          return [
            BookRegisterActions.fetchBookFromOpenBdFullfilled(null),
            NotificationActions.notifyMessage('ISBNコードから書籍データを取得できませんでした'),
          ];
        }
      }),
    );
  })
  .on(BookRegisterActions.changeFormValue, ({ key, value }) => {
    if (
      !getBookRegisterState().isProcessingBook &&
      key === 'isbn' &&
      [10, 13].includes(value.length)
    ) {
      return BookRegisterActions.fetchBookFromOpenBd(value);
    } else {
      return Rx.empty();
    }
  })
  .on(BookRegisterActions.submit, () => {
    const { isbn, title } = getBookRegisterState().bookData;
    if (title && title !== '') {
      return BookActions.registerBook({ title, isbn: isbn === undefined ? null : isbn });
    } else {
      return NotificationActions.notifyMessage('本のタイトルが入力されておりません');
    }
  })
  .on(BookActions.registerBookFulfilled, ({ book }) => {
    return [
      NotificationActions.notifyMessage(`${book.title}を登録しました`),
      BookRegisterActions.resetForm(),
    ];
  })
  .on(BookRegisterActions.resetForm, () => {
    const resetButton = getBookRegisterState().resetButtonRef.current;
    if (resetButton) {
      resetButton.click();
    }
    return Rx.empty();
  });

// --- Reducer ---
const initialState: BookRegisterState = {
  isProcessingBook: false,
  bookData: {},
  resetButtonRef: React.createRef(),
};

export const reducer = handle
  .reducer(initialState)
  .on(BookRegisterActions.resetForm, state => {
    state.isProcessingBook = false;
    state.bookData = { isbn: '', title: '' };
    state.registeredBook = undefined;
  })
  .on(BarcodeLoaderActions.emitBarcode, (state, { barcode }) => {
    state.bookData.isbn = barcode;
  })
  .on(BookRegisterActions.$mounted, state => {
    state.registeredBook = undefined;
  })
  .on(BookRegisterActions.changeFormValue, (state, { key, value }) => {
    state.bookData[key] = value as any;
  })
  .on(BookRegisterActions.fetchBookFromOpenBd, state => {
    state.isProcessingBook = true;
  })
  .on(BookActions.registerBookFulfilled, (state, { book }) => {
    state.registeredBook = book;
  })
  .on(BookRegisterActions.fetchBookFromOpenBdFullfilled, (state, { bookData }) => {
    if (bookData !== null) {
      state.bookData = bookData;
    }
    state.isProcessingBook = false;
  });

// --- Module ---
export const BookRegisterModule = () => {
  handle();
  return <BookRegisterView />;
};
