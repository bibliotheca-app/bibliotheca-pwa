import { inventoryLogRepository } from 'bibliotheca/services/ServiceContainer';
import React from 'react';
import * as Rx from 'typeless/rx';
import { InventoryEventLogView } from './components/InventoryEventLogView';
import { handle, InventoryEventLogActions, InventoryEventLogState } from './interface';

// --- Epic ---
export const epic = handle.epic().on(InventoryEventLogActions.$mounted, () => {
  return Rx.from(inventoryLogRepository.findAllEvents()).pipe(
    Rx.map(res => {
      return InventoryEventLogActions.fetchEventListFullfilled(res);
    }),
  );
});

// --- Reducer ---
const initialState: InventoryEventLogState = {
  inventoryEventLogs: [],
};

export const reducer = handle
  .reducer(initialState)
  .on(InventoryEventLogActions.fetchEventListFullfilled, (state, { inventoryEvents }) => {
    state.inventoryEventLogs = inventoryEvents;
  });

// --- Module ---
export const InventoryEventLogModule = () => {
  handle();
  return <InventoryEventLogView />;
};
