import { lazy } from 'navi';
import { RouteEntry } from 'bibliotheca/types';

// --- Routing ---
export const routeEntry: RouteEntry = {
  path: '/inventory-event',
  routes: lazy(() => import('./routes')),
};
