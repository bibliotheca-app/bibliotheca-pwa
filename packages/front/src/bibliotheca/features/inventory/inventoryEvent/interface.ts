import { createModule } from 'typeless';
import { InventoryEventSymbol } from './symbol';

// --- Actions ---
export const [handle, InventoryEventActions, getInventoryEventState] = createModule(
  InventoryEventSymbol,
)
  .withActions({
    changeView: (type: ViewType) => ({ payload: { type } }),
    toMissingAll: null,
    submitInventory: null,
  })
  .withState<InventoryEventState>();

// --- Types ---
export interface InventoryEventState {
  viewType: ViewType;
}
export type ViewType = 'all' | 'checkedOnly' | 'uncheckedOnly';
