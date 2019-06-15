import { createModule } from 'typeless';

// --- Constants ---
export const MODULE = Symbol('InventoryEvent');

// --- Actions ---
const modules = createModule(MODULE)
  .withActions({
    changeView: (type: ViewType) => ({ payload: { type } }),
    toMissingAll: null,
    submitInventory: null,
  })
  .withState<InventoryEventState>();

export const handle = modules[0];
export const InventoryEventActions = modules[1];
export const getInventoryEventState = modules[2];

// --- Types ---
export interface InventoryEventState {
  viewType: ViewType;
}
export type ViewType = 'all' | 'checkedOnly' | 'uncheckedOnly';
