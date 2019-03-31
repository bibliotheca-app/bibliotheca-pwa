import React from 'react';
import { authService } from 'src/index';
import * as Rx from 'src/rx';
import { createEpic, createReducer, useModule } from 'typeless';
import { LoginView } from './components/LoginView';
import { LoginActions, LoginState, MODULE } from './interface';

// --- Epic ---
export const epic = createEpic(MODULE).on(LoginActions.auth, () => {
  return Rx.fromPromise(authService.login()).pipe(Rx.ignoreElements());
});

// --- Reducer ---
const initialState: LoginState = {};

export const reducer = createReducer(initialState);

// --- Module ---
export default () => {
  useModule({
    epic,
    reducer,
    reducerPath: ['login'],
    actions: LoginActions,
  });
  return <LoginView />;
};
