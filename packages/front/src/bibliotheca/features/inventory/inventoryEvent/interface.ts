import { createModule } from 'typeless';
import { InventoryEventSymbol } from './symbol';
import { Book } from 'bibliotheca/types';

// --- Actions ---
export const [handle, InventoryEventActions, getInventoryEventState] = createModule(
  InventoryEventSymbol,
)
  .withActions({
    changeView: (type: ViewType) => ({ payload: { type } }),
    toMissingAll: null,
    submitInventory: null,
    toCheckStatus: (book: Book) => ({ payload: { book } }),
  })
  .withState<InventoryEventState>();

// --- Types ---
export interface InventoryEventState {
  viewType: ViewType;
}
export type ViewType = 'all' | 'checkedOnly' | 'uncheckedOnly';
