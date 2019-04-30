import React from 'react';
import {
  bookRepository,
  inventoryBookRepository,
  inventoryEventRepository,
} from 'src/services/ServiceContainer';
import { createEpic, createReducer, useModule } from 'typeless';
import * as Rx from 'typeless/rx';
import { BarcodeLoaderActions } from '../../barcodeLoader/interface';
import { RouterActions } from '../../router/interface';
import { RegisterInventoryBookView } from './components/RegisterInventoryBookView';
import { MODULE, RegisterInventoryBookActions, RegisterInventoryBookState } from './interface';

// --- Epic ---
export const epic = createEpic(MODULE)
  .on(RegisterInventoryBookActions.$mounted, (_, { getState }) => {
    const location = getState().router.location!;
    const param = new URLSearchParams(location.search);
    const eventId = param.get('eventId');
    return !eventId
      ? Rx.of(RouterActions.locationChange({ ...location, pathname: '/' }))
      : Rx.of(RegisterInventoryBookActions.fetchInventoryEvent(eventId));
  })
  .on(RegisterInventoryBookActions.fetchInventoryEvent, ({ eventId }) =>
    Rx.fromPromise(inventoryEventRepository.findInventoryEventById(eventId)).pipe(
      Rx.map(e => RegisterInventoryBookActions.fetchInventoryEventFullfilled(e)),
    ),
  )
  .on(BarcodeLoaderActions.emitBarcode, ({ barcode }) =>
    Rx.fromPromise(bookRepository.findBooksByIsbn(barcode)).pipe(
      Rx.flatMap(books => {
        if (books.length === 0) {
          alert('ないよ');
          return Rx.empty();
        } else {
          return Rx.of(RegisterInventoryBookActions.fetchBookFullfilled(books[0]));
        }
      }),
    ),
  )
  .on(RegisterInventoryBookActions.submit, (_, { getState }) => {
    const { targetEvent, registerBook } = getState().registerInventoryBook;
    return Rx.fromPromise(
      inventoryBookRepository.addInventoriedItem(targetEvent!.id, registerBook!, 'checked'),
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
  .on(RegisterInventoryBookActions.fetchInventoryEventFullfilled, (state, { event }) => {
    state.targetEvent = event;
  });

// --- Module ---
export default () => {
  useModule({
    epic,
    reducer,
    reducerPath: ['registerInventoryBook'],
    actions: RegisterInventoryBookActions,
  });
  return <RegisterInventoryBookView />;
};
