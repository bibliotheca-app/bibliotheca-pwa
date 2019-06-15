import { NotificationActions } from 'bibliotheca/features/notification/interface';
import { findUncheckedOnlyList } from 'bibliotheca/services/inventory/query';
import {
  bookRepository,
  inventoryEventRepository,
  inventoryLogRepository,
} from 'bibliotheca/services/ServiceContainer';
import { InventoryEventDoing } from 'bibliotheca/types';
import React from 'react';
import * as Rx from 'typeless/rx';
import { useInventoryBookModule } from '../inventoryBookModule/module';
import { InventoryEventView } from './components/InventoryEventView';
import { handle, InventoryEventActions, InventoryEventState } from './interface';
import { getInventoryBookModuleState } from '../inventoryBookModule/interface';

// --- Epic ---
export const epic = handle
  .epic()
  .on(InventoryEventActions.toMissingAll, () => {
    const { booksInList, event } = getInventoryBookModuleState();

    const uncheckedBooks = findUncheckedOnlyList(
      (event as InventoryEventDoing).inventoryBooks,
      booksInList,
    );

    if (uncheckedBooks.length === 0) return Rx.empty();

    const msg =
      '以下の書籍を紛失状態にします。よろしいですか？' +
      uncheckedBooks.map(b => b.title).join('\n');
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
  })
  .on(InventoryEventActions.submitInventory, () => {
    const msg =
      '棚卸しを完了します。\n＊＊全ての紛失ステータスの書籍が削除されます＊＊\nよろしいですか？';
    if (window.confirm(msg)) {
      const { event, booksInList } = getInventoryBookModuleState();
      const { inventoryBooks, date } = event as InventoryEventDoing;
      const inventoriedBooks = inventoryBooks.map(({ bookId, status }) => {
        const b = booksInList.find(b => b.id === bookId)!;
        return { status, ...b };
      });

      const missingBooks = inventoriedBooks
        .filter(ib => ib.status === 'missing')
        .map(b => ({ ...b, deletedAt: new Date() }));

      // todo: validate submit if unchecked book exists
      return Rx.from(
        (async () => {
          await inventoryLogRepository.add({ date, status: 'done', books: inventoriedBooks });
          await inventoryEventRepository.close();
          await bookRepository.bulkUpdate(missingBooks);
        })(),
      ).pipe(Rx.map(() => NotificationActions.notifyMessage('棚卸しを完了しました')));
    } else {
      return Rx.empty();
    }
  });
// --- Reducer ---
const initialState: InventoryEventState = {
  viewType: 'checkedOnly',
};

export const reducer = handle
  .reducer(initialState)
  .on(InventoryEventActions.changeView, (state, { type }) => {
    state.viewType = type;
  });

// --- Module ---
export const InventoryEventModule = () => {
  useInventoryBookModule();
  handle();
  return <InventoryEventView />;
};
