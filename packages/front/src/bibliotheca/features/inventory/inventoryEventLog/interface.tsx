import { InventoryEventLog } from 'bibliotheca/types';
import { createModule } from 'typeless';
import { InventoryEventLogSymbol } from './symbol';

// --- Actions ---
const modules = createModule(InventoryEventLogSymbol)
  .withActions({
    $mounted: null,
    fetchEventListFullfilled: (inventoryEvents: InventoryEventLog[]) => ({
      payload: { inventoryEvents },
    }),
  })
  .withState<InventoryEventLogState>();

export const handle = modules[0];
export const InventoryEventLogActions = modules[1];
export const getInventoryEventLogState = modules[2];

// --- Types ---
export interface InventoryEventLogState {
  inventoryEventLogs: InventoryEventLog[];
}
