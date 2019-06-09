import { NotificationActions } from 'bibliotheca/features/notification/interface';
import { findUncheckedOnlyList } from 'bibliotheca/services/inventory/query';
import { inventoryEventRepository } from 'bibliotheca/services/ServiceContainer';
import { InventoryEventDoing } from 'bibliotheca/types';
import React from 'react';
import { createEpic, createReducer, useModule } from 'typeless';
import * as Rx from 'typeless/rx';
import { useInventoryBookModule } from '../inventoryBookModule/module';
import { InventoryEventView } from './components/InventoryEventView';
import { InventoryEventActions, InventoryEventState, MODULE } from './interface';

// --- Epic ---
export const epic = createEpic(MODULE).on(InventoryEventActions.toMissingAll, (_, { getState }) => {
  const { booksInList, event } = getState().inventoryBookModule;

  const uncheckedBooks = findUncheckedOnlyList(
    (event as InventoryEventDoing).inventoryBooks,
    booksInList,
  );

  if (uncheckedBooks.length === 0) return Rx.empty();

  const msg =
    '以下の書籍を紛失状態にします。よろしいですか？' + uncheckedBooks.map(b => b.title).join('\n');
  if (window.confirm(msg)) {
    return Rx.from(
      inventoryEventRepository.addInventoryBook(
        uncheckedBooks.map(b => ({ status: 'missing' as const, bookId: b.id })),
      ),
    ).pipe(
      Rx.map(() => {
        return NotificationActions.notifyMessage('全て紛失ステータスに変えました');
      }),
    );
  } else {
    return Rx.empty();
  }
});
// --- Reducer ---
const initialState: InventoryEventState = {
  viewType: 'checkedOnly',
};

export const reducer = createReducer(initialState).on(
  InventoryEventActions.changeView,
  (state, { type }) => {
    state.viewType = type;
  },
);

// --- Module ---
export const InventoryEventModule = () => {
  useInventoryBookModule();
  useModule({
    epic,
    reducer,
    reducerPath: ['InventoryEvent'],
    actions: InventoryEventActions,
  });
  return <InventoryEventView />;
};
