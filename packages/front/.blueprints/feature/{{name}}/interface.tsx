import { RouteEntry } from 'bibliotheca/types';
import { createActions } from 'typeless';
import { lazy } from 'navi';

// --- Constants ---
export const MODULE = '{{name}}';

// --- Actions ---
export const {{pascalCase name}}Actions = createActions(MODULE, {});

// --- Routing ---
export const routeEntry: RouteEntry = {
  path: '/{{name}}',
  routes: lazy(() => import('./routes')),
};

// --- Types ---
export interface {{pascalCase name}}State {}

declare module 'typeless/types' {
  export interface DefaultState {
    {{name}}: {{pascalCase name}}State;
  }
}
