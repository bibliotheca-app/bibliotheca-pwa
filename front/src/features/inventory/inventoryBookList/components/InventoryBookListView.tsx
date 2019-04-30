import { Button, DataTable, RadioButton, Text } from 'grommet';
import React from 'react';
import { Dashboard } from 'src/components/Dashboard';
import { Link } from 'src/components/Link';
import { InventoryBook } from 'src/types';
import { useActions, useMappedState } from 'typeless';
import { InventoryBookListActions } from '../interface';

export const InventoryBookListView = () => {
  const { changeView } = useActions(InventoryBookListActions);
  const { books, viewType, eventId } = useMappedState(
    ({ inventoryBookModule, inventoryBookList }) => {
      // tslint:disable-next-line:no-shadowed-variable
      const books = (() => {
        switch (inventoryBookList.viewType) {
          case 'checkedOnly':
            return inventoryBookModule.inventoryBooks;
          case 'all':
            return inventoryBookModule.booksInList;
          case 'uncheckedOnly': {
            const checked = new Set(inventoryBookModule.inventoryBooks.map(b => b.id));

            return inventoryBookModule.booksInList.filter(b => !checked.has(b.id));
          }
        }
      })();
      return { ...inventoryBookModule, ...inventoryBookList, books };
    },
  );
  return (
    <Dashboard>
      <Link href={`/register-inventory-book?eventId=${eventId}`}>
        <Button label="棚卸しする" />
      </Link>
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
        primaryKey="id"
        data={books}
        columns={[
          {
            property: 'title',
            header: 'タイトル',
            search: true,
            render: (book: InventoryBook) => {
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
    </Dashboard>
  );
};
