import { Book } from 'bibliotheca/types';
import { createActions } from 'typeless';

// --- Constants ---
export const MODULE = 'bookList';

// --- Actions ---
export const BookListActions = createActions(MODULE, {
  fetchBookList: null,
  fetchBookListFulfilled: (books: Book[]) => ({ payload: { books } }),
  $mounted: null,
});

// --- Types ---
export interface BookListState {
  books: Book[];
  isProcessingBook: boolean;
}

declare module 'typeless/types' {
  export interface DefaultState {
    bookList: BookListState;
  }
}
