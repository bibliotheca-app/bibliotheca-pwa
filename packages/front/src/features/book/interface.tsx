import { Book } from 'src/types';
import { createActions } from 'typeless';

// --- Constants ---
export const MODULE = 'book';

// --- Actions ---
export const BookActions = createActions(MODULE, {
  borrowBookById: (bookId: string) => ({ payload: { bookId } }),
  borrowBookByIdFulfilled: (book: Book) => ({ payload: { book } }),
  borrowBookByIsbn: (isbn: string) => ({ payload: { isbn } }),
  borrowBookByIsbnFulfilled: (book: Book) => ({ payload: { book } }),
  returnBookById: (bookId: string) => ({ payload: { bookId } }),
  returnBookByIdFulfilled: (book: Book) => ({ payload: { book } }),
  returnBookByIsbn: (isbn: string) => ({ payload: { isbn } }),
  returnBookByIsbnFulfilled: (book: Book) => ({ payload: { book } }),
  registerBook: (bookData: { title: string; isbn: string | null }) => ({
    payload: { bookData },
  }),
  registerBookFulfilled: (book: Book) => ({ payload: { book } }),
  deleteBookById: (bookId: string) => ({ payload: { bookId } }),
  deleteBookByIdFulfilled: (book: Book) => ({ payload: { book } }),
});

// --- Types ---
export interface BookState {}

declare module 'typeless/types' {
  export interface DefaultState {
    book: BookState;
  }
}
