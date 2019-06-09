import { bookRepository, inventoryEventRepository } from 'bibliotheca/services/ServiceContainer';
import React from 'react';
import { createEpic, createReducer, useModule } from 'typeless';
import * as Rx from 'typeless/rx';
import { BarcodeLoaderActions } from '../../../barcodeLoader/interface';
import { useInventoryBookModule } from '../../inventoryBookModule/module';
import { RegisterInventoryBookView } from './components/RegisterInventoryBookView';
import { MODULE, RegisterInventoryBookActions, RegisterInventoryBookState } from './interface';
import { NotificationActions } from 'bibliotheca/features/notification/interface';
import { InventoryEventDoing } from 'bibliotheca/types';

// --- Epic ---
export const epic = createEpic(MODULE)
  .on(BarcodeLoaderActions.emitBarcode, ({ barcode }, { getState }) =>
    Rx.fromPromise(bookRepository.findBooksByIsbn(barcode)).pipe(
      Rx.map(books => {
        if (books.length === 0) {
          return NotificationActions.notifyMessage('蔵書に存在しない本です');
        } else {
          // todo: filter books that has already registered
          // todo: can update status `missing` -> `checked`
          const { event, booksInList } = getState().inventoryBookModule;

          const checkedBookIds = (event as InventoryEventDoing).inventoryBooks.map(b => b.bookId);
          const checked = checkedBookIds
            .map(bid => booksInList.find(b => b.id === bid)!)
            .filter(b => b != null);
          const checkedBooks = checked.filter(b => b.isbn === barcode);

          const checkedAll = books.length === checkedBooks.length;
          return RegisterInventoryBookActions.fetchBookFullfilled(books[0], checkedAll);
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
  checkedAll: false,
};

export const reducer = createReducer(initialState)
  .on(RegisterInventoryBookActions.fetchBookFullfilled, (state, { book, checkedAll }) => {
    state.registerBook = book;
    state.checkedAll = checkedAll;
  })
  .onMany(
    [RegisterInventoryBookActions.$unmounting, RegisterInventoryBookActions.submitFullfilled],
    state => {
      state.registerBook = undefined;
    },
  );

// --- Module ---
export const RegisterInventoryBookModule = () => {
  useInventoryBookModule();
  useModule({
    epic,
    reducer,
    reducerPath: ['registerInventoryBook'],
    actions: RegisterInventoryBookActions,
  });
  return <RegisterInventoryBookView />;
};
