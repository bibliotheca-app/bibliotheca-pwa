import { Download as DownloadIcon } from 'grommet-icons';
import { InventoryEventLog } from 'bibliotheca/types';
import { format } from 'date-fns';
import { DataTable, Text, Button } from 'grommet';
import { getInventoryEventLogState, InventoryEventLogActions } from '../interface';
import { useActions } from 'typeless';

export const InventoryEventLogView = () => {
  const { inventoryEventLogs } = getInventoryEventLogState.useState();
  const { downloadCsv } = useActions(InventoryEventLogActions);
  return (
    <>
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
          {
            property: 'csv',
            header: 'CSV出力',
            render: ({ id }: InventoryEventLog) => {
              return (
                <Button
                  icon={<DownloadIcon />}
                  plain={false}
                  onClick={() => downloadCsv(id)}
                ></Button>
              );
            },
          },
        ]}
        sortable
      />
    </>
  );
};
