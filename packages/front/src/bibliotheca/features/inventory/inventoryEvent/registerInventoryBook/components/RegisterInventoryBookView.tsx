import { Link } from 'bibliotheca/components/Link';
import { getInventoryBookModuleState } from 'bibliotheca/features/inventory/inventoryBookModule/interface';
import { InventoryEventStatus } from 'bibliotheca/types';
import { Box, Button } from 'grommet';
import React from 'react';
import { useActions, useMappedState } from 'typeless';
import { getRegisterInventoryBookState, RegisterInventoryBookActions } from '../interface';
import { RegistrationFromCamera } from './RegistrationFromCamera';

export const RegisterInventoryBookView = () => {
  const { checkedAll, registerBook, event } = useMappedState(
    [getRegisterInventoryBookState, getInventoryBookModuleState],
    (registerInventoryBook, inventoryBookModule) => ({
      ...registerInventoryBook,
      ...inventoryBookModule,
    }),
  );
  const { submit } = useActions(RegisterInventoryBookActions);

  const component = (() => {
    if (event == null) {
      return 'Loading...';
    }
    switch (event.status) {
      case InventoryEventStatus.Doing:
        return (
          <RegistrationFromCamera
            targetBook={registerBook}
            checkedAll={checkedAll}
            submit={submit}
          />
        );
      case InventoryEventStatus.Done:
        return '棚卸し作業は棚卸しを開始状態にしてから実施してください';
      default:
        throw new Error('unknown mode');
    }
  })();

  return (
    <>
      <Link href="/inventory-event">
        <Button label="戻る"></Button>
      </Link>
      <Box>棚卸し</Box>

      {component}
    </>
  );
};
