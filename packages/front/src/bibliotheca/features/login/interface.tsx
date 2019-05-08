import { RouteEntry } from 'bibliotheca/types';
import { lazy } from 'navi';
import { createActions } from 'typeless';

// --- Constants ---
export const MODULE = 'login';

// --- Actions ---
export const LoginActions = createActions(MODULE, { auth: null });

// --- Routing ---
export const routeEntry: RouteEntry = {
  path: '/login',
  routes: lazy(() => import('./routes')),
};

// --- Types ---
// tslint:disable-next-line:no-empty-interface
export interface LoginState {}

declare module 'typeless/types' {
  export interface DefaultState {
    ['login']: LoginState;
  }
}
