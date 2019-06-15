import { createModule } from 'typeless';
import { lazy } from 'navi';
import { RouteEntry } from 'bibliotheca/types';

import { {{pascalCase name}}Symbol } from './symbol';

const modules = createModule({{pascalCase name}}Symbol)
  .withActions({})
  .withState<{{pascalCase name}}State>();

export const handle = modules[0];
export const {{pascalCase name}}Actions = modules[1];
export const get{{pascalCase name}}State = modules[2];

// --- Routing ---
export const routeEntry: RouteEntry = {
  path: '/{{name}}',
  routes: lazy(() => import('./routes')),
};

// --- Types ---
export interface {{pascalCase name}}State {}
