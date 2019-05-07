import { Book } from 'bibliotheca/types';
import { createActions } from 'typeless';

// --- Constants ---
export const MODULE = 'book/register';

// --- Actions ---
export const BookRegisterActions = createActions(MODULE, {
  $mounted: null,
  fetchBookFromOpenBdFullfilled: (bookData: BookData) => ({ payload: { bookData } }),
  submit: null,
  toggleMode: null,
});

// --- Types ---
export interface BookRegisterState {
  registeredBook?: Book;
  isProcessingBook: boolean;
  bookData?: BookData;
  mode: RegistrationMode;
}
interface BookData {
  title: string;
  isbn: string;
}
export type RegistrationMode = 'camera' | 'manual';
declare module 'typeless/types' {
  export interface DefaultState {
    bookRegister: BookRegisterState;
  }
}
