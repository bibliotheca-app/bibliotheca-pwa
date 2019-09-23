import { RouteEntry } from 'bibliotheca/types';
import { lazy } from 'navi';
import { createModule } from 'typeless';
import { LoginSymbol } from './symbol';

// --- Actions ---
export const [handle, LoginActions] = createModule(LoginSymbol).withActions({ auth: null });

// --- Routing ---
export const routeEntry: RouteEntry = {
  path: '/login',
  routes: lazy(() => import('./routes')),
};
