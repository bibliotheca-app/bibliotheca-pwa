import React from 'react';
import { Dashboard } from 'src/components/Dashboard';
import { useActions, useMappedState } from 'typeless';
import { RegisterInventoryBookActions } from '../interface';
import { RegistrationFromCamera } from './RegistrationFromCamera';

export const RegisterInventoryBookView = () => {
  const { registerBook } = useMappedState(state => state.registerInventoryBook);
  const { submit } = useActions(RegisterInventoryBookActions);

  return (
    <Dashboard>
      蔵書登録フォーム
      <RegistrationFromCamera targetBook={registerBook} submit={submit} />
    </Dashboard>
  );
};
