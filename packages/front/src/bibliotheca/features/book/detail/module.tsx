import { BookActions } from 'bibliotheca/features/book/interface';
import { GlobalActions } from 'bibliotheca/features/global/interface';
import { NotificationActions } from 'bibliotheca/features/notification/interface';
import { RouterActions } from 'bibliotheca/features/router/interface';
import * as Rx from 'bibliotheca/rx';
import { bookRepository } from 'bibliotheca/services/ServiceContainer';
import React from 'react';
import { createEpic, createReducer, useModule } from 'typeless';
import { BookDetailView } from './components/BookDetailView';
import { BookDetailActions, BookDetailState, MODULE } from './interface';

// --- Epic ---
export const epic = createEpic(MODULE)
  .on(BookDetailActions.$mounted, (_, { getState }) => {
    const location = getState().router.location!;
    const bookId = location.request!.params.bookId;
    return !bookId
      ? Rx.of(RouterActions.navigate('/'))
      : Rx.of(BookDetailActions.findBookById(bookId), GlobalActions.progressShow());
  })
  .on(BookDetailActions.findBookById, ({ bookId }) => {
    return Rx.fromPromise(bookRepository.findBookById(bookId)).pipe(
      Rx.map(BookDetailActions.findBookByIdFulfilled),
      Rx.catchLog(e => Rx.of(BookDetailActions.findBookByIdFailure(e))),
      Rx.flatMap(fulfilledOrError => Rx.of(fulfilledOrError, GlobalActions.progressHide())),
    );
  })
  .on(BookActions.editBookFulfilled, ({ book }) => {
    return NotificationActions.notifyMessage(`${book.title}の変更を保存しました`);
  })
  .on(BookActions.deleteBookByIdFulfilled, ({ book }) => {
    return Rx.of(
      NotificationActions.notifyMessage(`${book.title}を削除しました`),
      RouterActions.navigate('/books'),
    );
  });

// --- Reducer ---
const initialState: BookDetailState = {};

export const reducer = createReducer(initialState)
  .on(BookDetailActions.$unmounting, state => {
    state.selectedBook = undefined;
    state.findBookError = undefined;
  })
  .on(BookDetailActions.findBookByIdFulfilled, (state, { book }) => {
    state.selectedBook = book;
  })
  .on(BookDetailActions.findBookByIdFailure, (state, { error }) => {
    state.findBookError = error;
  })
  .onMany(
    [
      BookActions.borrowBookByIdFulfilled,
      BookActions.returnBookByIdFulfilled,
      BookActions.editBookFulfilled,
    ],
    (state, { book }) => {
      state.selectedBook = book;
    },
  );

// --- Module ---
export const BookDetailModule = () => {
  useModule({
    epic,
    reducer,
    reducerPath: ['bookDetail'],
    actions: BookDetailActions,
  });
  return <BookDetailView />;
};
