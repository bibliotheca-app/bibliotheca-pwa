import * as Rx from 'bibliotheca/rx';
import { authService } from 'bibliotheca/services/ServiceContainer';
import React from 'react';
import { LoginView } from './components/LoginView';
import { handle, LoginActions } from './interface';

// --- Epic ---
export const epic = handle.epic().on(LoginActions.auth, () => {
  return Rx.fromPromise(authService.login()).pipe(Rx.ignoreElements());
});

// --- Module ---
export const LoginModule = () => {
  handle();
  return <LoginView />;
};
