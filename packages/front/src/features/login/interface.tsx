import React from 'react';
import { DefaultSuspense } from 'src/components/DefaultSuspense';
import { RouteConfig } from 'src/types';
import { createActions } from 'typeless';

// --- Constants ---
export const MODULE = 'login';

// --- Actions ---
export const LoginActions = createActions(MODULE, { auth: null });

// --- Routing ---
const ModuleLoader = React.lazy(() => import('./module'));

const LoginRoute = () => (
  <DefaultSuspense>
    <ModuleLoader />
  </DefaultSuspense>
);

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: false,
  path: '/login',
  component: <LoginRoute />,
};

// --- Types ---
// tslint:disable-next-line:no-empty-interface
export interface LoginState {}

declare module 'typeless/types' {
  export interface DefaultState {
    ['login']: LoginState;
  }
}
