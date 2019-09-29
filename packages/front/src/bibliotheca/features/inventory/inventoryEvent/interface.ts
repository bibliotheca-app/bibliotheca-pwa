import { createModule } from 'typeless';
import { InventoryEventSymbol } from './symbol';
import { Book, InventoryStatus } from 'bibliotheca/types';

// --- Actions ---
export const [handle, InventoryEventActions, getInventoryEventState] = createModule(
  InventoryEventSymbol,
)
  .withActions({
    changeView: (type: ViewType) => ({ payload: { type } }),
    toMissingAll: null,
    submitInventory: null,
    changeStatus: (book: Book, status: InventoryStatus) => ({
      payload: { book, status },
    }),
  })
  .withState<InventoryEventState>();

// --- Types ---
export interface InventoryEventState {
  viewType: ViewType;
}
export type ViewType = 'all' | 'checkedOnly' | 'uncheckedOnly';
