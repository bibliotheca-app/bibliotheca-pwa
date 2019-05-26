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
  findBookByIdFailure: (error: any) => ({ payload: { error } }),
});

// --- Types ---
export interface BookDetailState {
  selectedBook?: Book;
  findBookError?: any;
  isProcessingBook: boolean;
}

declare module 'typeless/types' {
  export interface DefaultState {
    bookDetail: BookDetailState;
  }
}
