import { Book, InventoryEvent } from 'bibliotheca/types';
import { createModule } from 'typeless';
import { InventoryBookModuleSymbol } from './symbol';

// --- Actions ---
export const [handle, InventoryBookModuleActions, getInventoryBookModuleState] = createModule(
  InventoryBookModuleSymbol,
)
  .withActions({
    $mounted: null,
    $unmounting: null,
    setEventBooksSubscription: null,
    fetchBookListFullfilled: (books: Book[]) => ({ payload: { books } }),
    fetchInventoryEventFullfilled: (event: InventoryEvent) => ({ payload: { event } }),
    start: null,
  })
  .withState<InventoryBookModuleState>();

// --- Types ---
export interface InventoryBookModuleState {
  booksInList: Book[];
  event?: InventoryEvent;
}
