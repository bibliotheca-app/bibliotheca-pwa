import { Book } from 'bibliotheca/types';
import { createActions } from 'typeless';

// --- Constants ---
export const MODULE = 'registerInventoryBook';

// --- Actions ---
export const RegisterInventoryBookActions = createActions(MODULE, {
  $unmounting: null,
  fetchBookFullfilled: (book: Book, checkedAll: boolean) => ({ payload: { book, checkedAll } }),
  submit: null,
  submitFullfilled: null,
});

// --- Types ---
export interface RegisterInventoryBookState {
  registerBook?: Book;
  checkedAll: boolean;
  // todo: implements loading state
  isProcessingBook: boolean;
}

declare module 'typeless/types' {
  export interface DefaultState {
    registerInventoryBook: RegisterInventoryBookState;
  }
}
