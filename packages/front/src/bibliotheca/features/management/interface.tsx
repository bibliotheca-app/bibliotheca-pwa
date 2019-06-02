import { RouteEntry } from 'bibliotheca/types';
import { createActions } from 'typeless';
import { lazy } from 'navi';

// --- Constants ---
export const MODULE = 'management';

// --- Actions ---
export const ManagementActions = createActions(MODULE, {
  downloadBookListAsCsv: null,
  downloadBookListAsCsvFulfilled: null,
});

// --- Routing ---
export const routeEntry: RouteEntry = {
  path: '/management',
  routes: lazy(() => import('./routes')),
};

// --- Types ---
export interface ManagementState {}

declare module 'typeless/types' {
  export interface DefaultState {
    management: ManagementState;
  }
}
