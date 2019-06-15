import { bookRepository, inventoryEventRepository } from 'bibliotheca/services/ServiceContainer';
import * as Rx from 'typeless/rx';
import { handle, InventoryBookModuleActions, InventoryBookModuleState } from './interface';

// --- Epic ---
export const epic = handle
  .epic()
  .on(InventoryBookModuleActions.$mounted, () =>
    Rx.fromPromise(bookRepository.findAllCachedBooks()).pipe(
      Rx.map(books => InventoryBookModuleActions.fetchBookListFullfilled(books)),
    ),
  )
  .on(InventoryBookModuleActions.$mounted, () =>
    InventoryBookModuleActions.setEventBooksSubscription(),
  )
  .on(
    InventoryBookModuleActions.setEventBooksSubscription,
    () =>
      new Rx.Observable(subscriber =>
        inventoryEventRepository.subscribeInventoryBooks(event => {
          subscriber.next(InventoryBookModuleActions.fetchInventoryEventFullfilled(event));
        }),
      ),
  )
  .on(InventoryBookModuleActions.start, () =>
    Rx.fromPromise(inventoryEventRepository.start()).pipe(
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
    state.booksInList = books;
  });

// --- Module ---
export const useInventoryBookModule = () => handle();
