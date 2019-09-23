import { Book } from 'bibliotheca/types';
import { createModule } from 'typeless';
import { BookListSymbol } from './symbol';

// --- Actions ---
export const [handle, BookListActions, getBookListState] = createModule(BookListSymbol)
  .withActions({
    fetchBookList: null,
    fetchBookListFulfilled: (books: Book[]) => ({ payload: { books } }),
    $mounted: null,
  })
  .withState<BookListState>();

// --- Types ---
export interface BookListState {
  books: Book[];
  isProcessingBook: boolean;
}
