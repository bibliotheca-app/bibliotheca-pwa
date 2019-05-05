import React from 'react';
import { Book } from 'shared/types';
import { DefaultSuspense } from 'src/components/DefaultSuspense';
import { RouteConfig } from 'src/types';
import { createActions } from 'typeless';

// --- Constants ---
export const MODULE = 'book/register';

// --- Actions ---
export const BookRegisterActions = createActions(MODULE, {
  $mounted: null,
  fetchBookFromOpenBdFullfilled: (bookData: BookData) => ({ payload: { bookData } }),
  submit: null,
  toggleMode: null,
});

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
  isProcessingBook: boolean;
  bookData?: BookData;
  mode: RegistrationMode;
}
interface BookData {
  title: string;
  isbn: string;
}
export type RegistrationMode = 'camera' | 'manual';
declare module 'typeless/types' {
  export interface DefaultState {
    bookRegister: BookRegisterState;
  }
}
