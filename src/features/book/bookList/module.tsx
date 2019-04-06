import React from 'react';
import * as Rx from 'src/rx';
import { bookRepository } from 'src/services/ServiceContainer';
import { createEpic, createReducer, useModule } from 'typeless';
import { BookListView } from './components/BookListView';
import { BookListActions, BookListState, MODULE } from './interface';

// --- Epic ---
export const epic = createEpic(MODULE)
  .on(BookListActions.$mounted, () => Rx.of(BookListActions.fetchBookList()))
  .on(BookListActions.fetchBookList, () =>
    Rx.fromPromise(bookRepository.findAllBooks()).pipe(
      Rx.map(BookListActions.fetchBookListFulfilled)
    )
  );

// --- Reducer ---
const initialState: BookListState = {
  books: [],
};

export const reducer = createReducer(initialState).on(
  BookListActions.fetchBookListFulfilled,
  (state, { books }) => {
    state.books = books;
  }
);

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
