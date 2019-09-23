import { authService } from 'bibliotheca/services/ServiceContainer';
import React from 'react';
import { LoginView } from './components/LoginView';
import { handle, LoginActions } from './interface';

// --- Epic ---
export const epic = handle.epic().on(LoginActions.auth, async () => {
  await authService.login();
  return null;
});

// --- Module ---
export const LoginModule = () => {
  handle();
  return <LoginView />;
};
