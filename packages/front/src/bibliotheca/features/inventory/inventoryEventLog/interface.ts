import { InventoryEventLog } from 'bibliotheca/types';
import { createModule } from 'typeless';
import { InventoryEventLogSymbol } from './symbol';

// --- Actions ---
export const [handle, InventoryEventLogActions, getInventoryEventLogState] = createModule(
  InventoryEventLogSymbol,
)
  .withActions({
    $mounted: null,
    fetchEventListFullfilled: (inventoryEvents: InventoryEventLog[]) => ({
      payload: { inventoryEvents },
    }),
  })
  .withState<InventoryEventLogState>();

// --- Types ---
export interface InventoryEventLogState {
  inventoryEventLogs: InventoryEventLog[];
}
