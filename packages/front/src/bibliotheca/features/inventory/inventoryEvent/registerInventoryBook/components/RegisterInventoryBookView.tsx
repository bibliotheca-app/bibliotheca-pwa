import { Dashboard } from 'bibliotheca/components/Dashboard';
import { InventoryEventStatus } from 'bibliotheca/types';
import React from 'react';
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
      default:
        throw new Error('unknown mode');
    }
  })();

  return (
    <Dashboard>
      蔵書登録フォーム
      {component}
    </Dashboard>
  );
};
