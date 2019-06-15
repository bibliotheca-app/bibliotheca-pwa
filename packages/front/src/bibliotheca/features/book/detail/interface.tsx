import { Book } from 'bibliotheca/types';
import { createModule } from 'typeless';
import { BookDetailSymbol } from './symbol';

// --- Actions ---
const modules = createModule(BookDetailSymbol)
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
