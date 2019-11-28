import { NotificationActions } from 'bibliotheca/features/notification/interface';
import { findUncheckedOnlyList } from 'bibliotheca/services/inventory/query';
import {
  inventoryEventRepository,
  inventoryLogRepository,
  deletedBookRepository,
} from 'bibliotheca/services/ServiceContainer';
import { InventoryEventDoing, InventoryStatusText } from 'bibliotheca/types';
import React from 'react';
import { getInventoryBookModuleState } from '../inventoryBookModule/interface';
import { useInventoryBookModule } from '../inventoryBookModule/module';
import { InventoryEventView } from './components/InventoryEventView';
import { handle, InventoryEventActions, InventoryEventState } from './interface';
import { userIdQuery } from 'bibliotheca/features/global/query';
import { getGlobalState } from 'bibliotheca/features/global/interface';
import { DeletedBook } from 'shared/src';

// --- Epic ---
export const epic = handle
  .epic()
  .on(InventoryEventActions.toMissingAll, async () => {
    const { booksInList, event } = getInventoryBookModuleState();

    const uncheckedBooks = findUncheckedOnlyList(
      (event as InventoryEventDoing).inventoryBooks,
      booksInList,
    );

    if (uncheckedBooks.length === 0) return null;

    const msg =
      '以下の書籍を紛失状態にします。よろしいですか？' +
      uncheckedBooks.map(b => b.title).join('\n');
    if (window.confirm(msg)) {
      const userId = userIdQuery(getGlobalState());

      await inventoryEventRepository.addInventoryBook(
        uncheckedBooks.map(b => ({
          status: 'missing' as const,
          bookId: b.id,
          inventoriedAt: new Date(),
          inventoriedBy: userId,
        })),
      );
      return NotificationActions.notifyMessage('全て紛失ステータスに変えました');
    } else {
      return null;
    }
  })
  .on(InventoryEventActions.changeStatus, async ({ book, status }) => {
    const { event } = getInventoryBookModuleState();
    const target = (event as InventoryEventDoing).inventoryBooks.find(ib => ib.bookId === book.id);

    if (target && target.status === status) {
      return null;
    }
    const msg = `${book.title} を${InventoryStatusText[status]}状態にします。よろしいですか？`;
    if (window.confirm(msg)) {
      const userId = userIdQuery(getGlobalState());
      await inventoryEventRepository.upsertInventoryBook({
        status,
        bookId: book.id,
        inventoriedAt: new Date(),
        inventoriedBy: userId,
      });
      return NotificationActions.notifyMessage(
        `${book.title} を${InventoryStatusText[status]}状態にしました`,
      );
    } else {
      return null;
    }
  })
  .on(InventoryEventActions.submitInventory, async () => {
    const msg =
      '棚卸しを完了します。\n＊＊全ての紛失ステータスの書籍が削除されます＊＊\nよろしいですか？';
    if (window.confirm(msg)) {
      const { event, booksInList } = getInventoryBookModuleState();
      const { inventoryBooks, date } = event as InventoryEventDoing;
      const inventoriedBooks = inventoryBooks.map(({ bookId, ...other }) => {
        const b = booksInList.find(b => b.id === bookId)!;
        return { ...other, ...b };
      });

      const missingBooks: DeletedBook[] = inventoriedBooks
        .filter(ib => ib.status === 'missing')
        .map(({ status: _, inventoriedBy, ...b }) => ({ ...b, deletedBy: inventoriedBy }));

      // todo: validate submit if unchecked book exists
      await inventoryLogRepository.add({ date, status: 'done', books: inventoriedBooks });
      await inventoryEventRepository.close();
      await deletedBookRepository.bulkDelete(missingBooks);
      return NotificationActions.notifyMessage('棚卸しを完了しました');
    } else {
      return null;
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
