import { BarcodeLoaderActions } from 'bibliotheca/features/barcodeLoader/interface';
import { openBdRepository } from 'bibliotheca/services/OpenBdRepository';
import React from 'react';
import { createEpic, createReducer, useModule } from 'typeless';
import * as Rx from 'typeless/rx';
import { BookActions } from '../interface';
import { BookRegisterView } from './components/BookRegisterView';
import { BookRegisterActions, BookRegisterState, MODULE } from './interface';
import { isBookInformation, BookData } from 'bibliotheca/types';
import { RouterActions } from 'bibliotheca/features/router/interface';

// --- Epic ---
export const epic = createEpic(MODULE)
  .on(BarcodeLoaderActions.emitBarcode, ({ barcode }, { getState }) => {
    if (getState().bookRegister.isProcessingBook) {
      return Rx.empty();
    } else {
      return BookRegisterActions.fetchBookFromOpenBd(barcode);
    }
  })
  .on(BookRegisterActions.fetchBookFromOpenBd, ({ barcode }) => {
    return Rx.fromPromise(openBdRepository.findBookByIsbn(barcode)).pipe(
      Rx.flatMap(res => {
        const bd: Partial<BookData> = (() => {
          if (isBookInformation(res)) {
            const {
              summary: { isbn, title },
            } = res[0];
            return {
              isbn,
              title,
            };
          } else {
            alert('ISBNコードから書籍データを取得できませんでした');
            return {
              isbn: barcode,
              title: '',
            };
          }
        })();
        return Rx.of(BookRegisterActions.fetchBookFromOpenBdFullfilled(bd));
      }),
    );
  })
  .on(BookRegisterActions.submit, (_, { getState }) => {
    const { isbn, title } = getState().bookRegister.bookData;
    if (title && title !== '') {
      return BookActions.registerBook({ title, isbn: isbn === undefined ? null : isbn });
    } else {
      alert('本のタイトルが入力されておりません');
      return Rx.empty();
    }
  })
  .on(BookActions.registerBookFulfilled, ({ book }) => {
    alert(`${book.title}を登録しました`);
    return RouterActions.navigate('/books');
  });

// --- Reducer ---
const initialState: BookRegisterState = { isProcessingBook: false, bookData: {} };

export const reducer = createReducer(initialState)
  .on(BookRegisterActions.$mounted, state => {
    state.registeredBook = undefined;
  })
  .on(BookRegisterActions.changeFormValue, (state, { key, value }) => {
    state.bookData[key] = value;
  })
  .on(BookRegisterActions.fetchBookFromOpenBd, state => {
    state.bookData = {};
    state.isProcessingBook = true;
  })
  .on(BookActions.registerBookFulfilled, (state, { book }) => {
    state.registeredBook = book;
  })
  .on(BookRegisterActions.fetchBookFromOpenBdFullfilled, (state, { bookData }) => {
    state.bookData = bookData;
    state.isProcessingBook = false;
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
