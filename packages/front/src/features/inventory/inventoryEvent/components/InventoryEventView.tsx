import React from 'react';
import { Dashboard } from 'src/components/Dashboard';
import { Link } from 'src/components/Link';
import { InventoryEventStatus } from 'src/types';
import { useMappedState } from 'typeless';
import { InventoryDoing } from './InventoryDoing';
import { InventoryDone } from './InventoryDone';

export const InventoryEventView = () => {
  const { event } = useMappedState(state => state.inventoryBookModule);

  const component = (() => {
    if (event == null) {
      return 'Loading...';
    }
    switch (event.status) {
      case InventoryEventStatus.Doing:
        return <InventoryDoing />;
      case InventoryEventStatus.Done:
        return <InventoryDone />;
    }
  })();
  return (
    <Dashboard>
      <Link href="/inventory-event-logs">過去の棚卸し履歴</Link>
      {component}
    </Dashboard>
  );
};
