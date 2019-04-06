import React from 'react';
import * as Rx from 'src/rx';
import { bookRepository } from 'src/services/ServiceContainer';
import { createEpic, createReducer, useModule } from 'typeless';
import { userIdQuery } from '../global/query';
import { BookView } from './components/BookView';
import { BookActions, BookState, MODULE } from './interface';

// --- Epic ---
export const epic = createEpic(MODULE)
  .on(BookActions.borrowBookById, ({ bookId }, { getState }) => {
    const userId = userIdQuery(getState().global);
    return Rx.fromPromise(bookRepository.borrowBookById(bookId, userId)).pipe(
      Rx.map(BookActions.borrowBookByIdFulfilled)
    );
  })
  .on(BookActions.returnBookById, ({ bookId }, { getState }) => {
    const userId = userIdQuery(getState().global);
    return Rx.fromPromise(bookRepository.returnBookById(bookId, userId)).pipe(
      Rx.map(BookActions.returnBookByIdFulfilled)
    );
  })
  .on(BookActions.borrowBookByIsbn, ({ isbn }, { getState }) => {
    const userId = userIdQuery(getState().global);
    return Rx.fromPromise(bookRepository.borrowBookByIsbn(isbn, userId)).pipe(
      Rx.map(BookActions.borrowBookByIsbnFulfilled)
    );
  })
  .on(BookActions.returnBookByIsbn, ({ isbn }, { getState }) => {
    const userId = userIdQuery(getState().global);
    return Rx.fromPromise(bookRepository.returnBookByIsbn(isbn, userId)).pipe(
      Rx.map(BookActions.returnBookByIsbnFulfilled)
    );
  });

// --- Reducer ---
const initialState: BookState = {
  foo: 'bar',
};

export const reducer = createReducer(initialState);

// --- Module ---
export default () => {
  useModule({
    epic,
    reducer,
    reducerPath: ['book'],
    actions: BookActions,
  });
  return <BookView />;
};
