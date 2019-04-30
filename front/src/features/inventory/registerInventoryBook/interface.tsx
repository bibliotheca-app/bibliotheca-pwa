import React from 'react';
import { DefaultSuspense } from 'src/components/DefaultSuspense';
import { Book, InventoryEvent, RouteConfig } from 'src/types';
import { createActions } from 'typeless';

// --- Constants ---
export const MODULE = 'registerInventoryBook';

// --- Actions ---
export const RegisterInventoryBookActions = createActions(MODULE, {
  $mounted: null,
  fetchInventoryEvent: (eventId: string) => ({ payload: { eventId } }),
  fetchInventoryEventFullfilled: (event: InventoryEvent) => ({ payload: { event } }),
  fetchBookFullfilled: (book: Book) => ({ payload: { book } }),
  submit: null,
});

// --- Routing ---
const ModuleLoader = React.lazy(() => import('./module'));

const RegisterInventoryBookRoute = () => (
  <DefaultSuspense>
    <ModuleLoader />
  </DefaultSuspense>
);

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: true,
  path: '/register-inventory-book',
  component: <RegisterInventoryBookRoute />,
};

// --- Types ---
export interface RegisterInventoryBookState {
  registerBook?: Book;
  isProcessingBook: boolean;
  targetEvent?: InventoryEvent;
}

declare module 'typeless/types' {
  export interface DefaultState {
    registerInventoryBook: RegisterInventoryBookState;
  }
}
