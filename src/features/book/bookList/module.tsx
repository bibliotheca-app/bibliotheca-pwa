import React from 'react';
import * as Rx from 'src/rx';
import { bookRepository } from 'src/services/ServiceContainer';
import { Book } from 'src/types';
import { createEpic, createReducer, useModule } from 'typeless';
import { BookActions } from '../interface';
import { BookListView } from './components/BookListView';
import { BookListActions, BookListState, MODULE } from './interface';

// --- Epic ---
export const epic = createEpic(MODULE)
  .on(BookListActions.$mounted, () => Rx.of(BookListActions.fetchBookList()))
  .on(BookListActions.fetchBookList, () =>
    Rx.fromPromise(
      // for development
      location.host === 'localhost'
        ? bookRepository.findBooks({ limit: 20 })
        : bookRepository.findAllBooks()
    ).pipe(Rx.map(BookListActions.fetchBookListFulfilled))
  );

// --- Reducer ---
const initialState: BookListState = {
  books: [],
};

const updateBook = (
  state: BookListState,
  { book: targetBook }: { book: Book }
) => {
  state.books.forEach(book => {
    if (book.id === targetBook.id) {
      book.borrowedBy = targetBook.borrowedBy;
    }
  });
};

export const reducer = createReducer(initialState)
  .on(BookListActions.fetchBookListFulfilled, (state, { books }) => {
    state.books = books;
  })
  .on(BookActions.borrowBookByIdFulfilled, updateBook)
  .on(BookActions.returnBookByIdFulfilled, updateBook)
  .on(BookActions.borrowBookByIsbnFulfilled, updateBook)
  .on(BookActions.returnBookByIsbnFulfilled, updateBook);

// --- Module ---
export default () => {
  useModule({
    epic,
    reducer,
    reducerPath: ['bookList'],
    actions: BookListActions,
  });
  return <BookListView />;
};
