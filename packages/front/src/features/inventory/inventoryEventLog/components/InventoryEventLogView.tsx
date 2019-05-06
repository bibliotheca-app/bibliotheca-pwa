import { format } from 'date-fns';
import { DataTable, Text } from 'grommet';
import React from 'react';
import { Dashboard } from 'src/components/Dashboard';
import { InventoryEventLog } from 'src/types';
import { useMappedState } from 'typeless';

export const InventoryEventLogView = () => {
  const { inventoryEventLogs } = useMappedState(state => state.InventoryEventLog);
  return (
    <Dashboard>
      棚卸し
      <DataTable
        size="large"
        primaryKey="id"
        data={inventoryEventLogs}
        columns={[
          {
            property: 'date',
            header: '棚卸し日',
            render: ({ date }: InventoryEventLog) => {
              // todo: goto inventory result page
              return <Text>{format(date, 'YYYY/MM/DD')}</Text>;
            },
          },
        ]}
        sortable
      />
    </Dashboard>
  );
};
