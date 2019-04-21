import React from 'react';
import { RouterActions } from 'src/features/router/interface';
import * as Rx from 'src/rx';
import { bookRepository } from 'src/services/ServiceContainer';
import { createEpic, createReducer, useModule } from 'typeless';
import { BookDetailView } from './components/BookDetailView';
import { BookDetailActions, BookDetailState, MODULE } from './interface';

// --- Epic ---
export const epic = createEpic(MODULE)
  .on(BookDetailActions.$mounted, (_, { getState }) => {
    const location = getState().router.location!;
    const param = new URLSearchParams(location.search);
    const bookId = param.get('bookId');
    return !bookId
      ? Rx.of(RouterActions.locationChange({ ...location, pathname: '/' }))
      : Rx.of(BookDetailActions.findBookById(bookId));
  })
  .on(BookDetailActions.findBookById, ({ bookId }) => {
    return Rx.fromPromise(bookRepository.findBookById(bookId)).pipe(
      Rx.map(BookDetailActions.findBookByIdFulfilled)
    );
  });

// --- Reducer ---
const initialState: BookDetailState = {};

export const reducer = createReducer(initialState)
  .on(BookDetailActions.$unmounting, state => {
    state.selectedBook = undefined;
  })
  .on(BookDetailActions.findBookByIdFulfilled, (state, { book }) => {
    state.selectedBook = book;
  });

// --- Module ---
export default () => {
  useModule({
    epic,
    reducer,
    reducerPath: ['bookDetail'],
    actions: BookDetailActions,
  });
  return <BookDetailView />;
};
