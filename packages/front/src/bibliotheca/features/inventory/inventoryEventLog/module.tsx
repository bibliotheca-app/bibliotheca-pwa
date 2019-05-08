import { inventoryLogRepository } from 'bibliotheca/services/ServiceContainer';
import React from 'react';
import { createEpic, createReducer, useModule } from 'typeless';
import * as Rx from 'typeless/rx';
import { InventoryEventLogView } from './components/InventoryEventLogView';
import { InventoryEventLogActions, InventoryEventLogState, MODULE } from './interface';

// --- Epic ---
export const epic = createEpic(MODULE).on(InventoryEventLogActions.$mounted, () => {
  return Rx.fromPromise(inventoryLogRepository.findAllEvents()).pipe(
    Rx.map(res => {
      return InventoryEventLogActions.fetchEventListFullfilled(res);
    }),
  );
});

// --- Reducer ---
const initialState: InventoryEventLogState = {
  inventoryEventLogs: [],
};

export const reducer = createReducer(initialState).on(
  InventoryEventLogActions.fetchEventListFullfilled,
  (state, { inventoryEvents }) => {
    state.inventoryEventLogs = inventoryEvents;
  },
);

// --- Module ---
export const InventoryEventLogModule = () => {
  useModule({
    epic,
    reducer,
    reducerPath: ['InventoryEventLog'],
    actions: InventoryEventLogActions,
  });
  return <InventoryEventLogView />;
};
