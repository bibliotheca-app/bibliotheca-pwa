import { createActions } from 'typeless';

// --- Constants ---
export const MODULE = 'InventoryEvent';

// --- Actions ---
export const InventoryEventActions = createActions(MODULE, {
  changeView: (type: ViewType) => ({ payload: { type } }),
  toMissingAll: null,
});

// --- Types ---
export interface InventoryEventState {
  viewType: ViewType;
}
export type ViewType = 'all' | 'checkedOnly' | 'uncheckedOnly';

declare module 'typeless/types' {
  export interface DefaultState {
    InventoryEvent: InventoryEventState;
  }
}
