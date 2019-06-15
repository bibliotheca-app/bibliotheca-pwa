import { RouteEntry } from 'bibliotheca/types';
import { lazy } from 'navi';
import { createModule } from 'typeless';

// --- Constants ---
export const MODULE = Symbol('login');

// --- Actions ---
const modules = createModule(MODULE).withActions({ auth: null });
export const handle = modules[0];
export const LoginActions = modules[1];

// --- Routing ---
export const routeEntry: RouteEntry = {
  path: '/login',
  routes: lazy(() => import('./routes')),
};
