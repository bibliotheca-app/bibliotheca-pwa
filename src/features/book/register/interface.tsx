import React from 'react';
import { DefaultSuspense } from 'src/components/DefaultSuspense';
import { Book, RouteConfig } from 'src/types';
import { createActions } from 'typeless';

// --- Constants ---
export const MODULE = 'book/register';

// --- Actions ---
export const BookRegisterActions = createActions(MODULE, { $mounted: null });

// --- Routing ---
const ModuleLoader = React.lazy(() => import('./module'));

const BookRegisterRoute = () => (
  <DefaultSuspense>
    <ModuleLoader />
  </DefaultSuspense>
);

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: true,
  path: '/book-register',
  component: <BookRegisterRoute />,
};

// --- Types ---
export interface BookRegisterState {
  registeredBook?: Book;
}

declare module 'typeless/types' {
  export interface DefaultState {
    bookRegister: BookRegisterState;
  }
}
