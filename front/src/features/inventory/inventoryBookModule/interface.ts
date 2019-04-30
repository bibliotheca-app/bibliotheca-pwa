import { Book, InventoryBook } from 'src/types';
import { createActions } from 'typeless';

// --- Constants ---
export const MODULE = 'inventoryBookModule';

// --- Actions ---
export const InventoryBookModuleActions = createActions(MODULE, {
  $mounted: null,
  setEventBooksSubscription: (eventId: string) => ({ payload: { eventId } }),
  setEventId: (eventId: string) => ({ payload: { eventId } }),
  onSnapshot: (snapshot: firebase.firestore.QuerySnapshot) => ({ payload: { snapshot } }),
  fetchBookListFullfilled: (books: Book[]) => ({ payload: { books } }),
  fetchInventoryBookListFullfilled: (books: InventoryBook[]) => ({ payload: { books } }),
});

// --- Types ---
export interface InventoryBookModuleState {
  inventoryBooks: InventoryBook[];
  booksInList: Book[];
  eventId?: string;
}

declare module 'typeless/types' {
  export interface DefaultState {
    inventoryBookModule: InventoryBookModuleState;
  }
}
