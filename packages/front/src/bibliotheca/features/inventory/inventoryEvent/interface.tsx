import { DefaultSuspense } from 'bibliotheca/components/DefaultSuspense';
import { RouteConfig } from 'bibliotheca/types';
import React from 'react';
import { createActions } from 'typeless';

// --- Constants ---
export const MODULE = 'InventoryEvent';

// --- Actions ---
export const InventoryEventActions = createActions(MODULE, {
  changeView: (type: ViewType) => ({ payload: { type } }),
});

// --- Routing ---
const ModuleLoader = React.lazy(() => import('./module'));

const InventoryEventRoute = () => (
  <DefaultSuspense>
    <ModuleLoader />
  </DefaultSuspense>
);

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: true,
  path: '/inventory-event',
  component: <InventoryEventRoute />,
};

// --- Types ---
export interface InventoryEventState {
  viewType: ViewType;
}
export type ViewType = 'all' | 'checkedOnly' | 'uncheckedOnly';

declare module 'typeless/types' {
  export interface DefaultState {
    InventoryEvent: InventoryEventState;
  }
}
