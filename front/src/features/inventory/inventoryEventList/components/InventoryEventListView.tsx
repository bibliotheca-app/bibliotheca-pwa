import { format } from 'date-fns';
import { Button, DataTable, Text } from 'grommet';
import React from 'react';
import { Dashboard } from 'src/components/Dashboard';
import { Link } from 'src/components/Link';
import { InventoryEvent } from 'src/types';
import { useActions, useMappedState } from 'typeless';
import { InventoryEventListActions } from '../interface';

export const InventoryEventListView = () => {
  const { inventoryEvents } = useMappedState(state => state.inventoryEventList);
  const { createInventoryEvent } = useActions(InventoryEventListActions);
  return (
    <Dashboard>
      棚卸し
      <Button label="棚卸し開始" onClick={createInventoryEvent} />
      <DataTable
        size="large"
        primaryKey="id"
        data={inventoryEvents}
        columns={[
          {
            property: 'date',
            header: '棚卸し日',
            render: ({ date, id }: InventoryEvent) => {
              return (
                <Link href={`/inventory-book-list?eventId=${id}`}>
                  <Text>{format(date, 'YYYY/MM/DD')}</Text>
                </Link>
              );
            },
          },
          {
            property: 'status',
            header: '棚卸しステータス',
          },
        ]}
        sortable
      />
    </Dashboard>
  );
};
