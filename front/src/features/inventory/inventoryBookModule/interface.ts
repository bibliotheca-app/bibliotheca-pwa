import { Book } from 'shared/types';
import { InventoryEvent } from 'src/types';
import { createActions } from 'typeless';

// --- Constants ---
export const MODULE = 'inventoryBookModule';

// --- Actions ---
export const InventoryBookModuleActions = createActions(MODULE, {
  $mounted: null,
  setEventBooksSubscription: null,
  fetchBookListFullfilled: (books: Book[]) => ({ payload: { books } }),
  fetchInventoryEventFullfilled: (event: InventoryEvent) => ({ payload: { event } }),
  start: null,
});

// --- Types ---
export interface InventoryBookModuleState {
  booksInList: Book[];
  event?: InventoryEvent;
}

declare module 'typeless/types' {
  export interface DefaultState {
    inventoryBookModule: InventoryBookModuleState;
  }
}
