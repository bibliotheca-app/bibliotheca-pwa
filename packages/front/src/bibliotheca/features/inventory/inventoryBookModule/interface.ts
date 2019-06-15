import { Book, InventoryEvent } from 'bibliotheca/types';
import { createModule } from 'typeless';
import { InventoryBookModuleSymbol } from './symbol';

// --- Actions ---
const modules = createModule(InventoryBookModuleSymbol)
  .withActions({
    $mounted: null,
    $unmounting: null,
    setEventBooksSubscription: null,
    fetchBookListFullfilled: (books: Book[]) => ({ payload: { books } }),
    fetchInventoryEventFullfilled: (event: InventoryEvent) => ({ payload: { event } }),
    start: null,
  })
  .withState<InventoryBookModuleState>();

export const handle = modules[0];
export const InventoryBookModuleActions = modules[1];
export const getInventoryBookModuleState = modules[2];

// --- Types ---
export interface InventoryBookModuleState {
  booksInList: Book[];
  event?: InventoryEvent;
}
