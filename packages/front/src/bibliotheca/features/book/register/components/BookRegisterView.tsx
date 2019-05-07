import { Dashboard } from 'bibliotheca/components/Dashboard';
import { Button } from 'grommet';
import React from 'react';
import { useActions, useMappedState } from 'typeless';
import { BookRegisterActions } from '../interface';
import { RegistrationFromCamera } from './RegistrationFromCamera';
import { RegistrationFromManual } from './RegistrationFromManual';

export const BookRegisterView = () => {
  const { toggleMode } = useActions(BookRegisterActions);
  const { mode } = useMappedState(state => state.bookRegister);

  const registration = (() => {
    switch (mode) {
      case 'camera':
        return (
          <>
            <Button onClick={toggleMode} label={'手動入力で登録'} />
            <RegistrationFromCamera />
          </>
        );
      case 'manual':
        return (
          <>
            <Button onClick={toggleMode} label={'カメラから登録'} />
            <RegistrationFromManual />
          </>
        );
    }
  })();
  return (
    <Dashboard>
      蔵書登録フォーム
      {registration}
    </Dashboard>
  );
};
