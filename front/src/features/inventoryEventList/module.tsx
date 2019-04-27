import React from 'react';
import { inventoryEventRepository } from 'src/services/ServiceContainer';
import { createEpic, createReducer, useModule } from 'typeless';
import * as Rx from 'typeless/rx';
import { InventoryEventListView } from './components/InventoryEventListView';
import { InventoryEventListActions, InventoryEventListState, MODULE } from './interface';

// --- Epic ---
export const epic = createEpic(MODULE)
  .onMany([InventoryEventListActions.$mounted, InventoryEventListActions.fetchEventList], () => {
    return Rx.fromPromise(inventoryEventRepository.findAllEvents()).pipe(
      Rx.map(res => {
        return InventoryEventListActions.fetchEventListFullfilled(res);
      }),
    );
  })
  .on(InventoryEventListActions.createInventoryEvent, () =>
    Rx.fromPromise(inventoryEventRepository.createInventoryEvent()).pipe(
      Rx.map(() => InventoryEventListActions.fetchEventList()),
    ),
  );

// --- Reducer ---
const initialState: InventoryEventListState = {
  inventoryEvents: [],
};

export const reducer = createReducer(initialState).on(
  InventoryEventListActions.fetchEventListFullfilled,
  (state, { inventoryEvents }) => {
    state.inventoryEvents = inventoryEvents;
  },
);

// --- Module ---
export default () => {
  useModule({
    epic,
    reducer,
    reducerPath: ['inventoryEventList'],
    actions: InventoryEventListActions,
  });
  return <InventoryEventListView />;
};
