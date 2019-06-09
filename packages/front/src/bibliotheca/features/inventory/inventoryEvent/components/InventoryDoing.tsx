import { Link } from 'bibliotheca/components/Link';
import { InventoryEventDoing } from 'bibliotheca/types';
import { Button, DataTable, RadioButton, Text } from 'grommet';
import React from 'react';
import { useActions, useMappedState } from 'typeless';
import { InventoryEventActions } from '../interface';
import { findUncheckedOnlyList } from 'bibliotheca/services/inventory/query';

export const InventoryDoing = () => {
  const { changeView, toMissingAll } = useActions(InventoryEventActions);
  const { canChangeMissingAll, books, viewType } = useMappedState(
    ({ inventoryBookModule: { booksInList, event }, InventoryEvent }) => {
      const uncheckedBooks = findUncheckedOnlyList(
        (event as InventoryEventDoing).inventoryBooks,
        booksInList,
      );
      const canChangeMissingAll = uncheckedBooks.length === 0;
      const books = ((e: InventoryEventDoing) => {
        switch (InventoryEvent.viewType) {
          case 'checkedOnly':
            return e.inventoryBooks.map(({ status, bookId }) => ({
              status,
              ...booksInList.find(b => b.id === bookId)!,
            }));
          case 'all':
            return booksInList.map(b => {
              const inventoryBook = e.inventoryBooks.find(ib => ib.bookId === b.id);
              if (inventoryBook) {
                return { status: inventoryBook.status, ...b };
              } else {
                return { status: 'unchecked', ...b };
              }
            });
          case 'uncheckedOnly': {
            return uncheckedBooks;
          }
          default:
            throw new Error('unknown mode');
        }
      })(event as InventoryEventDoing);
      return {
        ...InventoryEvent,
        books: books.map((b, i) => ({ ...b, key: i })),
        canChangeMissingAll,
      };
    },
  );
  return (
    <>
      <Link href={`/inventory-event/register-book`}>
        <Button label="本を棚卸す" />
      </Link>
      <Button
        label="未チェックを全て紛失ステータスへ変更する"
        disabled={canChangeMissingAll}
        onClick={toMissingAll}
      />
      <Button label="棚卸しを完了する" onClick={() => alert('todo: 未実装')} />
      <RadioButton
        label="棚卸し済のみ"
        name="viewType"
        value="checkedOnly"
        checked={viewType === 'checkedOnly'}
        onChange={() => changeView('checkedOnly')}
      />
      <RadioButton
        label="全て"
        name="viewType"
        value="all"
        checked={viewType === 'all'}
        onChange={() => changeView('all')}
      />
      <RadioButton
        label="未チェック"
        name="viewType"
        value="uncheckedOnly"
        checked={viewType === 'uncheckedOnly'}
        onChange={() => changeView('uncheckedOnly')}
      />
      <DataTable
        size="large"
        primaryKey="key"
        data={books}
        columns={[
          {
            property: 'title',
            header: 'タイトル',
            search: true,
            render: (book: { id: string; title: string }) => {
              return (
                <Link href={`/books/${book.id}`}>
                  <Text>{book.title}</Text>
                </Link>
              );
            },
          },
          { property: 'isbn', header: 'ISBN' },
          { property: 'status', header: '棚卸しステータス' },
        ]}
        sortable
      />
    </>
  );
};
