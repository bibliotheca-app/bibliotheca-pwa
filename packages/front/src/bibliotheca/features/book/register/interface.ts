import { Book, BookData } from 'bibliotheca/types';
import { createModule } from 'typeless';
import { BookRegisterSymbol } from './symbol';
import { RefObject } from 'react';

// --- Actions ---
export const [handle, BookRegisterActions, getBookRegisterState] = createModule(BookRegisterSymbol)
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

// --- Types ---
export interface BookRegisterState {
  registeredBook?: Book;
  isProcessingBook: boolean;
  bookData: Partial<BookData>;
  resetButtonRef: RefObject<HTMLButtonElement>;
}
