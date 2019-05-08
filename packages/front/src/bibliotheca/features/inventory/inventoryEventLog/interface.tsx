import { InventoryEventLog } from 'bibliotheca/types';
import { createActions } from 'typeless';

// --- Constants ---
export const MODULE = 'InventoryEventLog';

// --- Actions ---
export const InventoryEventLogActions = createActions(MODULE, {
  $mounted: null,
  fetchEventListFullfilled: (inventoryEvents: InventoryEventLog[]) => ({
    payload: { inventoryEvents },
  }),
});

// --- Types ---
export interface InventoryEventLogState {
  inventoryEventLogs: InventoryEventLog[];
}

declare module 'typeless/types' {
  export interface DefaultState {
    InventoryEventLog: InventoryEventLogState;
  }
}
