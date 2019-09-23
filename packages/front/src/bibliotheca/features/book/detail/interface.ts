import { Book } from 'bibliotheca/types';
import { createModule } from 'typeless';
import { BookDetailSymbol } from './symbol';

// --- Actions ---
export const [handle, BookDetailActions, getBookDetailState] = createModule(BookDetailSymbol)
  .withActions({
    $mounted: null,
    $unmounting: null,
    findBookById: (bookId: string) => ({ payload: { bookId } }),
    findBookByIdFulfilled: (book: Book) => ({ payload: { book } }),
    findBookByIdFailure: (error: any) => ({ payload: { error } }),
  })
  .withState<BookDetailState>();

// --- Types ---
export interface BookDetailState {
  selectedBook?: Book;
  findBookError?: any;
  isProcessingBook: boolean;
}
