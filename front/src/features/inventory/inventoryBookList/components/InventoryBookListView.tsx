import { Button, DataTable, Text } from 'grommet';
import React from 'react';
import { Dashboard } from 'src/components/Dashboard';
import { Link } from 'src/components/Link';
import { InventoryBook } from 'src/types';
import { useMappedState } from 'typeless';

export const InventoryBookListView = () => {
  const { inventoryBooks } = useMappedState(state => state.inventoryBookList);
  return (
    <Dashboard>
      <Link href="/inventory-book">
        <Button label="棚卸しする" />
      </Link>
      <DataTable
        size="large"
        primaryKey="id"
        data={inventoryBooks}
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
