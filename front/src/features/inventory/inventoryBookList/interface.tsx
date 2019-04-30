import React from 'react';
import { DefaultSuspense } from 'src/components/DefaultSuspense';
import { RouteConfig } from 'src/types';
import { createActions } from 'typeless';

// --- Constants ---
export const MODULE = 'inventoryBookList';

// --- Actions ---
export const InventoryBookListActions = createActions(MODULE, {
  $mounted: null,
  changeView: (type: ViewType) => ({ payload: { type } }),
});

// --- Routing ---
const ModuleLoader = React.lazy(() => import('./module'));

const InventoryBookListRoute = () => (
  <DefaultSuspense>
    <ModuleLoader />
  </DefaultSuspense>
);

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: true,
  path: '/inventory-book-list',
  component: <InventoryBookListRoute />,
};

// --- Types ---
export interface InventoryBookListState {
  viewType: ViewType;
}
export type ViewType = 'all' | 'checkedOnly' | 'uncheckedOnly';

declare module 'typeless/types' {
  export interface DefaultState {
    inventoryBookList: InventoryBookListState;
  }
}
