import { RouteEntry, Book } from 'bibliotheca/types';
import { createModule } from 'typeless';
import { lazy } from 'navi';
import { UserSymbol } from './symbol';

// --- Actions ---
const modules = createModule(UserSymbol)
  .withActions({
    $mounted: null,
    fetchBorrowedBooksByUserId: (userId: string) => ({ payload: { userId } }),
    fetchBorrowedBooksByUserIdFulfilled: (books: Book[]) => ({ payload: { books } }),
    fetchBorrowedBooksByUserIdFailure: (error: any) => ({ payload: { error } }),
  })
  .withState<UserState>();

export const handle = modules[0];
export const UserActions = modules[1];
export const getUserState = modules[2];

// --- Routing ---
export const routeEntry: RouteEntry = {
  path: '/user',
  routes: lazy(() => import('./routes')),
};

// --- Types ---
export interface UserState {
  borrowedBooks: Book[];
}
