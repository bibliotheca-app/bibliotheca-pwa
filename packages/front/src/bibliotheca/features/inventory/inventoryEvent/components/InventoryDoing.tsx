import { Link } from 'bibliotheca/components/Link';
import { InventoryEventDoing } from 'bibliotheca/types';
import { Button, DataTable, RadioButton, Text } from 'grommet';
import React from 'react';
import { useActions, useMappedState } from 'typeless';
import { InventoryEventActions } from '../interface';

export const InventoryDoing = () => {
  const { changeView } = useActions(InventoryEventActions);
  const { books, viewType } = useMappedState(
    ({ inventoryBookModule: { booksInList, event }, InventoryEvent }) => {
      // tslint:disable-next-line:no-shadowed-variable
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
            const checked = new Set(e.inventoryBooks.map(b => b.bookId));

            return booksInList
              .filter(b => !checked.has(b.id))
              .map(b => ({ status: 'unchecked', ...b }));
          }
          default:
            throw new Error('unknown mode');
        }
      })(event as InventoryEventDoing);
      return { ...InventoryEvent, books: books.map((b, i) => ({ ...b, key: i })) };
    },
  );
  return (
    <>
      <Link href={`/register-inventory-book`}>
        <Button label="本を棚卸す" />
      </Link>
      <Button
        label="未チェックを全て紛失ステータスへ変更する"
        onClick={() => alert('todo: 未実装')}
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
                <Link href={`/book-detail?bookId=${book.id}`}>
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
