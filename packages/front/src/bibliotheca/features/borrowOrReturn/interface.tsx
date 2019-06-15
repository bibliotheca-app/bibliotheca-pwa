import { Book, RouteEntry } from 'bibliotheca/types';
import { lazy } from 'navi';
import { createModule } from 'typeless';
import { BorrowOrReturnSymbol } from './symbol';

// --- Actions ---
const modules = createModule(BorrowOrReturnSymbol)
  .withActions({
    $mounted: null,
    fetchBookFromBarcode: (code: string) => ({ payload: { code } }),
    fetchBookFromBarcodeFullfilled: (books: Book[], userId: string, loadedCode: string) => ({
      payload: { books, userId, loadedCode },
    }),
  })
  .withState<BorrowOrReturnState>();

// --- Routing ---
export const routeEntry: RouteEntry = {
  path: '/borrow-or-return',
  routes: lazy(() => import('./routes')),
};

export const handle = modules[0];
export const BorrowOrReturnActions = modules[1];
export const getBorrowOrReturnState = modules[2];

// --- Types ---
export interface BorrowOrReturnState {
  target: BarcodeProcessTarget | undefined;
  isProcessingBook: boolean;
}
export type BarcodeProcessTarget = NotExistBookInList | ExistBookInList;

interface NotExistBookInList {
  loadedCode: string;
  existsBookInList: false;
}

interface ExistBookInList {
  loadedCode: string;
  book: Book;
}
