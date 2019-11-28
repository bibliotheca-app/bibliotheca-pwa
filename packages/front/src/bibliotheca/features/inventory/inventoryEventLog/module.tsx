import { InventoriedBook } from 'bibliotheca/types';
import { inventoryLogRepository } from 'bibliotheca/services/ServiceContainer';
import React from 'react';
import * as Papa from 'papaparse';
import * as Rx from 'typeless/rx';
import { InventoryEventLogView } from './components/InventoryEventLogView';
import { handle, InventoryEventLogActions, InventoryEventLogState } from './interface';
import { downloadFile } from 'bibliotheca/services/downloadFile';

// --- Epic ---
export const epic = handle
  .epic()
  .on(InventoryEventLogActions.$mounted, () => {
    return Rx.from(inventoryLogRepository.findAllEvents()).pipe(
      Rx.map(res => {
        return InventoryEventLogActions.fetchEventListFullfilled(res);
      }),
    );
  })
  .on(InventoryEventLogActions.downloadCsv, async ({ id }) => {
    const fields = [
      'id',
      'isbn',
      'title',
      'borrowedBy',
      'inventoriedBy',
      'inventoriedAt',
      'updatedAt',
      'createdAt',
    ] as Array<keyof InventoriedBook>;
    const res = await inventoryLogRepository.findById(id);
    const csv = Papa.unparse({ fields, data: res.books });
    downloadFile({
      content: csv,
      type: 'text/csv;charset=utf-8',
      fileName: 'inventoried-book-list.csv',
    });
    return null;
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
