import { BookActions } from 'bibliotheca/features/book/interface';
import { GlobalActions } from 'bibliotheca/features/global/interface';
import { NotificationActions } from 'bibliotheca/features/notification/interface';
import { RouterActions } from 'bibliotheca/features/router/interface';
import * as Rx from 'bibliotheca/rx';
import { bookRepository } from 'bibliotheca/services/ServiceContainer';
import React from 'react';
import { BookDetailView } from './components/BookDetailView';
import { BookDetailActions, BookDetailState, handle } from './interface';
import { useActions } from 'typeless';

// --- Epic ---
export const epic = handle
  .epic()
  .on(BookDetailActions.init, ({ bookId }) => {
    return !bookId
      ? Rx.of(RouterActions.navigate('/'))
      : Rx.of(BookDetailActions.findBookById(bookId), GlobalActions.progressShow());
  })
  .on(BookDetailActions.findBookById, ({ bookId }) => {
    return Rx.from(bookRepository.findBookById(bookId)).pipe(
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
const initialState: BookDetailState = { isProcessingBook: false };

export const reducer = handle
  .reducer(initialState)
  .on(BookDetailActions.$mounted, state => {
    state.isProcessingBook = false;
  })
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
  .onMany([BookActions.borrowBookById, BookActions.returnBookById, BookActions.editBook], state => {
    state.isProcessingBook = true;
  })
  .onMany(
    [
      BookActions.borrowBookByIdFulfilled,
      BookActions.returnBookByIdFulfilled,
      BookActions.editBookFulfilled,
    ],
    (state, { book }) => {
      state.isProcessingBook = false;
      state.selectedBook = book;
    },
  );

// --- Module ---
export const BookDetailModule = ({ bookId }: { bookId: string }) => {
  handle();

  const { init } = useActions(BookDetailActions);
  init(bookId);

  return <BookDetailView />;
};
