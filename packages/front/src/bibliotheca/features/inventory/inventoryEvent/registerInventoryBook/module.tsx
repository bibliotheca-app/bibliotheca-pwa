import { NotificationActions } from 'bibliotheca/features/notification/interface';
import { bookRepository, inventoryEventRepository } from 'bibliotheca/services/ServiceContainer';
import { InventoryEventDoing } from 'bibliotheca/types';
import React from 'react';
import * as Rx from 'typeless/rx';
import { BarcodeLoaderActions } from '../../../barcodeLoader/interface';
import { useInventoryBookModule } from '../../inventoryBookModule/module';
import { RegisterInventoryBookView } from './components/RegisterInventoryBookView';
import {
  handle,
  RegisterInventoryBookActions,
  RegisterInventoryBookState,
  getRegisterInventoryBookState,
} from './interface';
import { getInventoryBookModuleState } from '../../inventoryBookModule/interface';

// --- Epic ---
export const epic = handle
  .epic()
  .on(BarcodeLoaderActions.emitBarcode, ({ barcode }) =>
    Rx.from(bookRepository.findBooksByIsbn(barcode)).pipe(
      Rx.map(books => {
        if (books.length === 0) {
          return NotificationActions.notifyMessage('蔵書に存在しない本です');
        } else {
          const { event, booksInList } = getInventoryBookModuleState();

          const checkedBookIds = (event as InventoryEventDoing).inventoryBooks
            .filter(b => b.status === 'checked')
            .map(b => b.bookId);
          const checkedBooks = checkedBookIds
            .map(bid => booksInList.find(b => b.id === bid)!)
            .filter(b => b != null && b.isbn === barcode);

          const checkedAll = books.length === checkedBooks.length;
          const uncheckedBook = books.find(b => !!checkedBookIds.find(bid => bid !== b.id));
          const target = uncheckedBook ? uncheckedBook : books[0];
          return RegisterInventoryBookActions.fetchBookFullfilled(target, checkedAll);
        }
      }),
    ),
  )
  .on(RegisterInventoryBookActions.submit, () => {
    const { registerBook } = getRegisterInventoryBookState();
    return Rx.from(
      inventoryEventRepository.addInventoryBook({ status: 'checked', bookId: registerBook!.id }),
    ).pipe(
      Rx.tap(() => {
        // todo: remove registerBook when checked
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

export const reducer = handle
  .reducer(initialState)
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
  handle();
  return <RegisterInventoryBookView />;
};
