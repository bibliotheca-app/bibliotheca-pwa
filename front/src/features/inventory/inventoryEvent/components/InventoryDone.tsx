import { Button } from 'grommet';
import React from 'react';
import { useActions } from 'typeless';
import { InventoryBookModuleActions } from '../../inventoryBookModule/interface';

export const InventoryDone = () => {
  const { start } = useActions(InventoryBookModuleActions);
  return <Button label="棚卸しする" onClick={start} />;
};
