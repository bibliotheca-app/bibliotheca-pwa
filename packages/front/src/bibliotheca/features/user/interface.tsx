import { RouteEntry, Book } from 'bibliotheca/types';
import { createActions } from 'typeless';
import { lazy } from 'navi';

// --- Constants ---
export const MODULE = 'user';

// --- Actions ---
export const UserActions = createActions(MODULE, {
  $mounted: null,
  fetchBorrowedBooksByUserId: (userId: string) => ({ payload: { userId } }),
  fetchBorrowedBooksByUserIdFulfilled: (books: Book[]) => ({ payload: { books } }),
  fetchBorrowedBooksByUserIdFailure: (error: any) => ({ payload: { error } }),
});

// --- Routing ---
export const routeEntry: RouteEntry = {
  path: '/user',
  routes: lazy(() => import('./routes')),
};

// --- Types ---
export interface UserState {
  borrowedBooks: Book[];
}

declare module 'typeless/types' {
  export interface DefaultState {
    user: UserState;
  }
}
