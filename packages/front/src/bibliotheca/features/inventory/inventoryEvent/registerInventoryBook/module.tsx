import { bookRepository, inventoryEventRepository } from 'bibliotheca/services/ServiceContainer';
import React from 'react';
import { createEpic, createReducer, useModule } from 'typeless';
import * as Rx from 'typeless/rx';
import { BarcodeLoaderActions } from '../../../barcodeLoader/interface';
import { useInventoryBookModule } from '../../inventoryBookModule/module';
import { RegisterInventoryBookView } from './components/RegisterInventoryBookView';
import { MODULE, RegisterInventoryBookActions, RegisterInventoryBookState } from './interface';

// --- Epic ---
export const epic = createEpic(MODULE)
  .on(BarcodeLoaderActions.emitBarcode, ({ barcode }) =>
    Rx.fromPromise(bookRepository.findBooksByIsbn(barcode)).pipe(
      Rx.flatMap(books => {
        if (books.length === 0) {
          alert('ないよ');
          return Rx.empty();
        } else {
          // todo: alert all stocks are checked
          // todo: filter books that has already registered
          // todo: can update status `missing` -> `checked`
          return Rx.of(RegisterInventoryBookActions.fetchBookFullfilled(books[0]));
        }
      }),
    ),
  )
  .on(RegisterInventoryBookActions.submit, (_, { getState }) => {
    const { registerBook } = getState().registerInventoryBook;
    return Rx.fromPromise(
      inventoryEventRepository.addInventoryBook({ status: 'checked', bookId: registerBook!.id }),
    ).pipe(
      Rx.tap(() => {
        alert('とうろくしました');
      }),
      Rx.ignoreElements(),
    );
  });

// --- Reducer ---
const initialState: RegisterInventoryBookState = {
  isProcessingBook: false,
};

export const reducer = createReducer(initialState)
  .on(RegisterInventoryBookActions.fetchBookFullfilled, (state, { book }) => {
    state.registerBook = book;
  })
  .onMany(
    [RegisterInventoryBookActions.$unmounting, RegisterInventoryBookActions.submitFullfilled],
    state => {
      state.registerBook = undefined;
    },
  );

// --- Module ---
export default () => {
  useInventoryBookModule();
  useModule({
    epic,
    reducer,
    reducerPath: ['registerInventoryBook'],
    actions: RegisterInventoryBookActions,
  });
  return <RegisterInventoryBookView />;
};
