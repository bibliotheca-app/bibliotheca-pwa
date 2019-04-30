import React from 'react';
import { RouterActions } from 'src/features/router/interface';
import { inventoryBookRepository } from 'src/services/ServiceContainer';
import { createEpic, createReducer, useModule } from 'typeless';
import * as Rx from 'typeless/rx';
import { InventoryBookListView } from './components/InventoryBookListView';
import { InventoryBookListActions, InventoryBookListState, MODULE } from './interface';

// --- Epic ---
export const epic = createEpic(MODULE)
  .on(InventoryBookListActions.$mounted, (_, { getState }) => {
    const location = getState().router.location!;
    const param = new URLSearchParams(location.search);
    const eventId = param.get('eventId');
    return !eventId
      ? Rx.of(RouterActions.locationChange({ ...location, pathname: '/' }))
      : Rx.of(InventoryBookListActions.fetchInventoryBookList(eventId));
  })
  .on(InventoryBookListActions.fetchInventoryBookList, ({ eventId }) =>
    Rx.fromPromise(inventoryBookRepository.findAllInventoryBookByEventId(eventId)).pipe(
      Rx.map(b => InventoryBookListActions.fetchInventoryBookListFullfilled(b)),
    ),
  );

// --- Reducer ---
const initialState: InventoryBookListState = {
  inventoryBooks: [],
};

export const reducer = createReducer(initialState)
  .on(InventoryBookListActions.fetchInventoryBookListFullfilled, (state, { books }) => {
    state.inventoryBooks = books;
  })
  .on(InventoryBookListActions.fetchInventoryBookList, (state, { eventId }) => {
    state.eventId = eventId;
  });

// --- Module ---
export default () => {
  useModule({
    epic,
    reducer,
    reducerPath: ['inventoryBookList'],
    actions: InventoryBookListActions,
  });
  return <InventoryBookListView />;
};
