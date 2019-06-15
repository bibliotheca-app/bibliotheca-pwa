import { InventoryEventStatus } from 'bibliotheca/types';
import React from 'react';
import { useActions, useMappedState } from 'typeless';
import { RegisterInventoryBookActions, getRegisterInventoryBookState } from '../interface';
import { RegistrationFromCamera } from './RegistrationFromCamera';
import { getInventoryBookModuleState } from 'bibliotheca/features/inventory/inventoryBookModule/interface';

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
      蔵書登録フォーム
      {component}
    </>
  );
};
