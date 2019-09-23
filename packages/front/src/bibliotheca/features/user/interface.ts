import { Book, RouteEntry } from 'bibliotheca/types';
import { lazy } from 'navi';
import { createModule } from 'typeless';
import { UserSymbol } from './symbol';

// --- Actions ---
export const [handle, UserActions, getUserState] = createModule(UserSymbol)
  .withActions({
    $mounted: null,
    fetchBorrowedBooksByUserId: (userId: string) => ({ payload: { userId } }),
    fetchBorrowedBooksByUserIdFulfilled: (books: Book[]) => ({ payload: { books } }),
    fetchBorrowedBooksByUserIdFailure: (error: any) => ({ payload: { error } }),
  })
  .withState<UserState>();

// --- Routing ---
export const routeEntry: RouteEntry = {
  path: '/user',
  routes: lazy(() => import('./routes')),
};

// --- Types ---
export interface UserState {
  borrowedBooks: Book[];
}
