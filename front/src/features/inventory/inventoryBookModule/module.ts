import { bookRepository, inventoryBookRepository } from 'src/services/ServiceContainer';
import { createEpic, createReducer, useModule } from 'typeless';
import * as Rx from 'typeless/rx';
import { InventoryBookModuleActions, InventoryBookModuleState, MODULE } from './interface';

// --- Epic ---
export const epic = createEpic(MODULE)
  .on(InventoryBookModuleActions.$mounted, () =>
    Rx.fromPromise(bookRepository.findAllCachedBooks()).pipe(
      Rx.map(books => InventoryBookModuleActions.fetchBookListFullfilled(books)),
    ),
  )
  .on(InventoryBookModuleActions.setEventId, ({ eventId }) =>
    InventoryBookModuleActions.setEventBooksSubscription(eventId),
  )
  .on(
    InventoryBookModuleActions.setEventBooksSubscription,
    ({ eventId }) =>
      new Rx.Observable(subscriber =>
        inventoryBookRepository.subscribeInventoryBooks(eventId, inventoryBooks => {
          subscriber.next(
            InventoryBookModuleActions.fetchInventoryBookListFullfilled(inventoryBooks),
          );
        }),
      ),
  );

// --- Reducer ---
const initialState: InventoryBookModuleState = {
  inventoryBooks: [],
  booksInList: [],
};

export const reducer = createReducer(initialState)
  .on(InventoryBookModuleActions.setEventId, (state, { eventId }) => {
    state.eventId = eventId;
  })
  .on(InventoryBookModuleActions.fetchInventoryBookListFullfilled, (state, { books }) => {
    state.inventoryBooks = books;
  })
  .on(InventoryBookModuleActions.fetchBookListFullfilled, (state, { books }) => {
    state.booksInList = books;
  });

// --- Module ---
export const useInventoryBookModule = () =>
  useModule({
    epic,
    reducer,
    reducerPath: ['inventoryBookModule'],
    actions: InventoryBookModuleActions,
  });
