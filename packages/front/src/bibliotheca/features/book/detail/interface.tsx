import { Book } from 'bibliotheca/types';
import { createModule } from 'typeless';

// --- Constants ---
export const MODULE = Symbol('book/detail');

// --- Actions ---
const modules = createModule(MODULE)
  .withActions({
    $mounted: null,
    $unmounting: null,
    findBookById: (bookId: string) => ({ payload: { bookId } }),
    findBookByIdFulfilled: (book: Book) => ({ payload: { book } }),
    findBookByIdFailure: (error: any) => ({ payload: { error } }),
  })
  .withState<BookDetailState>();

export const handle = modules[0];
export const BookDetailActions = modules[1];
export const getBookDetailState = modules[2];

// --- Types ---
export interface BookDetailState {
  selectedBook?: Book;
  findBookError?: any;
  isProcessingBook: boolean;
}
