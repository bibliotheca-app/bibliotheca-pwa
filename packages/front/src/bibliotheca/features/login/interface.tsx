import { RouteEntry } from 'bibliotheca/types';
import { lazy } from 'navi';
import { createModule } from 'typeless';
import { LoginSymbol } from './symbol';

// --- Actions ---
const modules = createModule(LoginSymbol).withActions({ auth: null });
export const handle = modules[0];
export const LoginActions = modules[1];

// --- Routing ---
export const routeEntry: RouteEntry = {
  path: '/login',
  routes: lazy(() => import('./routes')),
};
