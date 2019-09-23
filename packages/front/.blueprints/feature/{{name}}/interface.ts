import { createModule } from 'typeless';
import { lazy } from 'navi';
import { RouteEntry } from 'bibliotheca/types';

import { {{pascalCase name}}Symbol } from './symbol';

export const [handle,{{pascalCase name}}Actions,get{{pascalCase name}}State] = createModule(
  {{pascalCase name}}Symbol,
)
  .withActions({})
  .withState<{{pascalCase name}}State>();


// --- Routing ---
export const routeEntry: RouteEntry = {
  path: '/{{name}}',
  routes: lazy(() => import('./routes')),
};

// --- Types ---
export interface {{pascalCase name}}State {}
