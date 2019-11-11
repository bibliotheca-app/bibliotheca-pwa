import { bookRepository, inventoryEventRepository } from 'bibliotheca/services/ServiceContainer';
import { Nullable } from 'bibliotheca/types';
import * as Rx from 'typeless/rx';
import { handle, InventoryBookModuleActions, InventoryBookModuleState } from './interface';

let unsubscriber: Nullable<() => void> = null;

// --- Epic ---
export const epic = handle
  .epic()
  .on(InventoryBookModuleActions.$mounted, () =>
    Rx.from(bookRepository.findAllCachedBooks()).pipe(
      Rx.map(books => InventoryBookModuleActions.fetchBookListFullfilled(books)),
    ),
  )
  .on(InventoryBookModuleActions.$mounted, () =>
    InventoryBookModuleActions.setEventBooksSubscription(),
  )
  .on(
    InventoryBookModuleActions.setEventBooksSubscription,
    () =>
      new Rx.Observable(subscriber => {
        unsubscriber = inventoryEventRepository.subscribeInventoryBooks(event => {
          subscriber.next(InventoryBookModuleActions.fetchInventoryEventFullfilled(event));
        });
      }),
  )
  .on(InventoryBookModuleActions.$unmounting, () => {
    if (unsubscriber) unsubscriber();
    return Rx.empty();
  })
  .on(InventoryBookModuleActions.start, () =>
    Rx.from(inventoryEventRepository.start()).pipe(
      Rx.map(event => InventoryBookModuleActions.fetchInventoryEventFullfilled(event)),
    ),
  );

// --- Reducer ---
const initialState: InventoryBookModuleState = {
  booksInList: [],
};

export const reducer = handle
  .reducer(initialState)
  .on(InventoryBookModuleActions.fetchInventoryEventFullfilled, (state, { event }) => {
    state.event = event;
  })
  .on(InventoryBookModuleActions.fetchBookListFullfilled, (state, { books }) => {
    state.booksInList = books.filter(b => b.deletedAt == null);
  });

// --- Module ---
export const useInventoryBookModule = () => handle();
