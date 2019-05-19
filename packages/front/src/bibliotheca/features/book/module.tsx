import * as Rx from 'bibliotheca/rx';
import { bookRepository } from 'bibliotheca/services/ServiceContainer';
import { createEpic, createReducer, useModule } from 'typeless';
import { userIdQuery } from '../global/query';
import { BookActions, BookState, MODULE } from './interface';

// --- Epic ---
export const epic = createEpic(MODULE)
  .on(BookActions.borrowBookById, ({ bookId }, { getState }) => {
    const userId = userIdQuery(getState().global);
    return Rx.fromPromise(bookRepository.borrowBookById(bookId, userId)).pipe(
      Rx.map(BookActions.borrowBookByIdFulfilled),
    );
  })
  .on(BookActions.returnBookById, ({ bookId }, { getState }) => {
    const userId = userIdQuery(getState().global);
    return Rx.fromPromise(bookRepository.returnBookById(bookId, userId)).pipe(
      Rx.map(BookActions.returnBookByIdFulfilled),
    );
  })
  .on(BookActions.borrowBookByIsbn, ({ isbn }, { getState }) => {
    const userId = userIdQuery(getState().global);
    return Rx.fromPromise(bookRepository.borrowBookByIsbn(isbn, userId)).pipe(
      Rx.map(BookActions.borrowBookByIsbnFulfilled),
    );
  })
  .on(BookActions.returnBookByIsbn, ({ isbn }, { getState }) => {
    const userId = userIdQuery(getState().global);
    return Rx.fromPromise(bookRepository.returnBookByIsbn(isbn, userId)).pipe(
      Rx.map(BookActions.returnBookByIsbnFulfilled),
    );
  })
  .on(BookActions.registerBook, ({ bookData }) => {
    return Rx.fromPromise(bookRepository.registerBook(bookData)).pipe(
      Rx.map(BookActions.registerBookFulfilled),
    );
  })
  .on(BookActions.deleteBookById, ({ bookId }) => {
    return Rx.fromPromise(bookRepository.deleteBookById(bookId)).pipe(
      Rx.map(BookActions.deleteBookByIdFulfilled),
    );
  })
  .on(BookActions.editBook, ({ bookEdit }) => {
    return Rx.fromPromise(bookRepository.editBookById(bookEdit)).pipe(
      Rx.map(BookActions.editBookFulfilled),
    );
  });

// --- Reducer ---
const initialState: BookState = {};

export const reducer = createReducer(initialState);

// --- Module ---
export const useBookModule = () =>
  useModule({
    epic,
    reducer,
    reducerPath: ['book'],
    actions: BookActions,
  });
