import { RouteEntry } from 'bibliotheca/types';
import { createModule } from 'typeless';
import { lazy } from 'navi';
import { ManagementSymbol } from './symbol';

// --- Actions ---
const modules = createModule(ManagementSymbol).withActions({
  downloadBookListAsCsv: null,
  downloadBookListAsCsvFulfilled: null,
});

export const handle = modules[0];
export const ManagementActions = modules[1];

// --- Routing ---
export const routeEntry: RouteEntry = {
  path: '/management',
  routes: lazy(() => import('./routes')),
};
