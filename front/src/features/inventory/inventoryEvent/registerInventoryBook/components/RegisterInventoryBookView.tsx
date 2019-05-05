import React from 'react';
import { Dashboard } from 'src/components/Dashboard';
import { InventoryEventStatus } from 'src/types';
import { useActions, useMappedState } from 'typeless';
import { RegisterInventoryBookActions } from '../interface';
import { RegistrationFromCamera } from './RegistrationFromCamera';

export const RegisterInventoryBookView = () => {
  const { registerBook, event } = useMappedState(
    ({ registerInventoryBook, inventoryBookModule }) => ({
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
        return <RegistrationFromCamera targetBook={registerBook} submit={submit} />;
      case InventoryEventStatus.Done:
        return '棚卸し作業は棚卸しを開始状態にしてから実施してください';
    }
  })();

  return (
    <Dashboard>
      蔵書登録フォーム
      {component}
    </Dashboard>
  );
};
