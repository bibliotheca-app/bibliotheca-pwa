import { bookRepository } from 'bibliotheca/services/ServiceContainer';
import React from 'react';
import { createEpic, createReducer, useModule } from 'typeless';
import * as Rx from 'typeless/rx';
import { BarcodeLoaderActions } from '../barcodeLoader/interface';
import { BookActions } from '../book/interface';
import { userIdQuery } from '../global/query';
import { BorrowOrReturnView } from './components/BorrowOrReturnView';
import { BorrowOrReturnActions, BorrowOrReturnState, MODULE } from './interface';

// --- Epic ---
export const epic = createEpic(MODULE)
  .on(BarcodeLoaderActions.emitBarcode, ({ barcode }, { getState }) => {
    return Rx.fromPromise(bookRepository.findBooksByIsbn(barcode)).pipe(
      Rx.map(books =>
        BorrowOrReturnActions.fetchBookFromBarcodeFullfilled(
          books,
          userIdQuery(getState().global),
          barcode,
        ),
      ),
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
const initialState: BorrowOrReturnState = {
  target: undefined,
  isProcessingBook: false,
};

export const reducer = createReducer(initialState)
  .on(BorrowOrReturnActions.$mounted, state => {
    state.target = undefined;
    state.isProcessingBook = false;
  })
  .onMany([BookActions.borrowBookById, BookActions.returnBookById], state => {
    state.isProcessingBook = true;
  })
  .onMany([BookActions.borrowBookByIdFulfilled, BookActions.returnBookByIdFulfilled], state => {
    state.isProcessingBook = false;
    state.target = undefined;
  })
  .on(
    BorrowOrReturnActions.fetchBookFromBarcodeFullfilled,
    (state, { books, userId, loadedCode }) => {
      if (books.length === 0) {
        state.target = { existsBookInList: false, loadedCode };
      } else {
        const borrowedByMe = books.find(b => b.borrowedBy === userId);
        const stock = books.find(b => !b.borrowedBy);
        const unStock = books.find(b => !!b.borrowedBy);
        const book = !!borrowedByMe ? borrowedByMe : stock ? stock : unStock!;

        state.target = { book, loadedCode };
      }
    },
  );

// --- Module ---
export const BorrowOrReturnModule = () => {
  useModule({
    epic,
    reducer,
    reducerPath: ['borrowOrReturn'],
    actions: BorrowOrReturnActions,
  });
  return <BorrowOrReturnView />;
};
