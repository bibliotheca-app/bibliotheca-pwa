import * as Rx from 'bibliotheca/rx';
import { bookRepository } from 'bibliotheca/services/ServiceContainer';
import { Book } from 'bibliotheca/types';
import React from 'react';
import { createEpic, createReducer, useModule } from 'typeless';
import { BookActions } from '../interface';
import { BookListView } from './components/BookListView';
import { BookListActions, BookListState, MODULE } from './interface';

// --- Epic ---
export const epic = createEpic(MODULE)
  .on(BookListActions.$mounted, () => BookListActions.fetchBookList())
  .on(BookListActions.fetchBookList, () =>
    Rx.fromPromise(bookRepository.findAllCachedBooks()).pipe(
      Rx.map(BookListActions.fetchBookListFulfilled),
    ),
  );

// --- Reducer ---
const initialState: BookListState = {
  books: [],
  isProcessingBook: false,
};

const updateBook = (state: BookListState, { book: targetBook }: { book: Book }) => {
  state.isProcessingBook = false;
  state.books.forEach(book => {
    if (book.id === targetBook.id) {
      book.borrowedBy = targetBook.borrowedBy;
    }
  });
};
const startBookProcess = (state: BookListState) => {
  state.isProcessingBook = true;
};

export const reducer = createReducer(initialState)
  .on(BookListActions.$mounted, state => {
    state.isProcessingBook = false;
  })
  .on(BookListActions.fetchBookListFulfilled, (state, { books }) => {
    state.books = books;
  })
  .on(BookActions.borrowBookById, startBookProcess)
  .on(BookActions.returnBookById, startBookProcess)
  .on(BookActions.borrowBookByIsbn, startBookProcess)
  .on(BookActions.returnBookByIsbn, startBookProcess)
  .on(BookActions.borrowBookByIdFulfilled, updateBook)
  .on(BookActions.returnBookByIdFulfilled, updateBook)
  .on(BookActions.borrowBookByIsbnFulfilled, updateBook)
  .on(BookActions.returnBookByIsbnFulfilled, updateBook);

// --- Module ---
export const BookListModule = () => {
  useModule({
    epic,
    reducer,
    reducerPath: ['bookList'],
    actions: BookListActions,
  });
  return <BookListView />;
};
