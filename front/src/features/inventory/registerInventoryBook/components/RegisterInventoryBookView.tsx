import React from 'react';
import { Dashboard } from 'src/components/Dashboard';
import { RegistrationFromCamera } from './RegistrationFromCamera';

export const RegisterInventoryBookView = () => {
  return (
    <Dashboard>
      蔵書登録フォーム
      <RegistrationFromCamera />
    </Dashboard>
  );
};
