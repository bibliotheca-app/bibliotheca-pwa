import { Book } from 'bibliotheca/types';
import { createModule } from 'typeless';

// --- Constants ---
export const MODULE = Symbol('bookList');

// --- Actions ---
const modules = createModule(MODULE)
  .withActions({
    fetchBookList: null,
    fetchBookListFulfilled: (books: Book[]) => ({ payload: { books } }),
    $mounted: null,
  })
  .withState<BookListState>();

export const handle = modules[0];
export const BookListActions = modules[1];
export const getBookListState = modules[2];

// --- Types ---
export interface BookListState {
  books: Book[];
  isProcessingBook: boolean;
}
