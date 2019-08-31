import { Book, BookData } from 'bibliotheca/types';
import { createModule } from 'typeless';
import { BookRegisterSymbol } from './symbol';
import { RefObject } from 'react';

// --- Actions ---
const modules = createModule(BookRegisterSymbol)
  .withActions({
    $mounted: null,
    resetForm: null,
    changeFormValue: (key: keyof BookData, value: string) => ({ payload: { key, value } }),
    fetchBookFromOpenBd: (barcode: string) => ({ payload: { barcode } }),
    fetchBookFromOpenBdFullfilled: (bookData: Partial<BookData> | null) => ({
      payload: { bookData },
    }),
    submit: null,
  })
  .withState<BookRegisterState>();

export const handle = modules[0];
export const BookRegisterActions = modules[1];
export const getBookRegisterState = modules[2];

// --- Types ---
export interface BookRegisterState {
  registeredBook?: Book;
  isProcessingBook: boolean;
  bookData: Partial<BookData>;
  resetButtonRef: RefObject<HTMLButtonElement>;
}
