import { Dashboard } from 'bibliotheca/components/Dashboard';
import { Link } from 'bibliotheca/components/Link';
import { InventoryEventStatus } from 'bibliotheca/types';
import React from 'react';
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
