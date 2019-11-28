import { RouteEntry } from 'bibliotheca/types';
import { createModule } from 'typeless';
import { lazy } from 'navi';
import { ManagementSymbol } from './symbol';

// --- Actions ---
export const [handle, ManagementActions] = createModule(ManagementSymbol).withActions({
  downloadBookListAsCsv: null,
  downloadBookListAsCsvFulfilled: null,
  downloadDeletedBookListAsCsv: null,
  downloadDeletedBookListAsCsvFulfilled: null,
});

// --- Routing ---
export const routeEntry: RouteEntry = {
  path: '/management',
  routes: lazy(() => import('./routes')),
};
