import React from 'react';
import { useActions } from 'typeless';
import { LoginActions } from '../interface';

export const LoginView = () => {
  const { auth } = useActions(LoginActions);
  return (
    <div>
      <button onClick={auth}>auth</button>
    </div>
  );
};
