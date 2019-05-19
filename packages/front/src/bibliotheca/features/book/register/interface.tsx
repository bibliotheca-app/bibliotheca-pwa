import { Book, BookData } from 'bibliotheca/types';
import { createActions } from 'typeless';

// --- Constants ---
export const MODULE = 'book/register';

// --- Actions ---
export const BookRegisterActions = createActions(MODULE, {
  $mounted: null,
  changeFormValue: (key: keyof BookData, value: string) => ({ payload: { key, value } }),
  fetchBookFromOpenBd: (barcode: string) => ({ payload: { barcode } }),
  fetchBookFromOpenBdFullfilled: (bookData: Partial<BookData>) => ({ payload: { bookData } }),
  submit: null,
});

// --- Types ---
export interface BookRegisterState {
  registeredBook?: Book;
  isProcessingBook: boolean;
  bookData: Partial<BookData>;
}

declare module 'typeless/types' {
  export interface DefaultState {
    bookRegister: BookRegisterState;
  }
}
