import React from 'react';
import { DefaultSuspense } from 'src/components/DefaultSuspense';
import { InventoryEvent, RouteConfig } from 'src/types';
import { createActions } from 'typeless';

// --- Constants ---
export const MODULE = 'inventoryEventList';

// --- Actions ---
export const InventoryEventListActions = createActions(MODULE, {
  $mounted: null,
  fetchEventList: null,
  fetchEventListFullfilled: (inventoryEvents: InventoryEvent[]) => ({
    payload: { inventoryEvents },
  }),
  createInventoryEvent: null,
});

// --- Routing ---
const ModuleLoader = React.lazy(() => import('./module'));

const InventoryEventListRoute = () => (
  <DefaultSuspense>
    <ModuleLoader />
  </DefaultSuspense>
);

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: true,
  path: '/inventory-event-list',
  component: <InventoryEventListRoute />,
};

// --- Types ---
export interface InventoryEventListState {
  inventoryEvents: InventoryEvent[];
}

declare module 'typeless/types' {
  export interface DefaultState {
    inventoryEventList: InventoryEventListState;
  }
}
