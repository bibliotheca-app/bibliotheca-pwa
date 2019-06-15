import { Link } from 'bibliotheca/components/Link';
import { InventoryEventStatus } from 'bibliotheca/types';
import React from 'react';
import { getInventoryBookModuleState } from '../../inventoryBookModule/interface';
import { InventoryDoing } from './InventoryDoing';
import { InventoryDone } from './InventoryDone';

export const InventoryEventView = () => {
  const { event } = getInventoryBookModuleState.useState();

  const component = (() => {
    if (event == null) {
      return 'Loading...';
    }
    switch (event.status) {
      case InventoryEventStatus.Doing:
        return <InventoryDoing />;
      case InventoryEventStatus.Done:
        return <InventoryDone />;
      default:
        throw new Error('unknown mode');
    }
  })();
  return (
    <>
      <Link href="/inventory-event/logs">過去の棚卸し履歴</Link>
      {component}
    </>
  );
};
