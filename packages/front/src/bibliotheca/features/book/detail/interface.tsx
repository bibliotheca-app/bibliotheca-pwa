import { Book } from 'bibliotheca/types';
import { createActions } from 'typeless';

// --- Constants ---
export const MODULE = 'book/detail';

// --- Actions ---
export const BookDetailActions = createActions(MODULE, {
  $mounted: null,
  $unmounting: null,
  findBookById: (bookId: string) => ({ payload: { bookId } }),
  findBookByIdFulfilled: (book: Book) => ({ payload: { book } }),
});

// --- Types ---
export interface BookDetailState {
  selectedBook?: Book;
}

declare module 'typeless/types' {
  export interface DefaultState {
    bookDetail: BookDetailState;
  }
}
