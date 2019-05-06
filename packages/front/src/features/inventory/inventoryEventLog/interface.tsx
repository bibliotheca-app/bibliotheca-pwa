import React from 'react';
import { DefaultSuspense } from 'src/components/DefaultSuspense';
import { InventoryEventLog, RouteConfig } from 'src/types';
import { createActions } from 'typeless';

// --- Constants ---
export const MODULE = 'InventoryEventLog';

// --- Actions ---
export const InventoryEventLogActions = createActions(MODULE, {
  $mounted: null,
  fetchEventListFullfilled: (inventoryEvents: InventoryEventLog[]) => ({
    payload: { inventoryEvents },
  }),
});

// --- Routing ---
const ModuleLoader = React.lazy(() => import('./module'));

const InventoryEventLogRoute = () => (
  <DefaultSuspense>
    <ModuleLoader />
  </DefaultSuspense>
);

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: true,
  path: '/inventory-event-logs',
  component: <InventoryEventLogRoute />,
};

// --- Types ---
export interface InventoryEventLogState {
  inventoryEventLogs: InventoryEventLog[];
}

declare module 'typeless/types' {
  export interface DefaultState {
    InventoryEventLog: InventoryEventLogState;
  }
}
