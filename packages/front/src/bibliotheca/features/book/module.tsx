import * as Rx from 'bibliotheca/rx';
import { bookRepository } from 'bibliotheca/services/ServiceContainer';
import { userIdQuery } from '../global/query';
import { BookActions, handle } from './interface';
import { getGlobalState } from '../global/interface';

// --- Epic ---
export const epic = handle
  .epic()
  .on(BookActions.borrowBookById, ({ bookId }) => {
    const userId = userIdQuery(getGlobalState());
    return Rx.fromPromise(bookRepository.borrowBookById(bookId, userId)).pipe(
      Rx.map(BookActions.borrowBookByIdFulfilled),
    );
  })
  .on(BookActions.returnBookById, ({ bookId }) => {
    const userId = userIdQuery(getGlobalState());
    return Rx.fromPromise(bookRepository.returnBookById(bookId, userId)).pipe(
      Rx.map(BookActions.returnBookByIdFulfilled),
    );
  })
  .on(BookActions.borrowBookByIsbn, ({ isbn }) => {
    const userId = userIdQuery(getGlobalState());
    return Rx.fromPromise(bookRepository.borrowBookByIsbn(isbn, userId)).pipe(
      Rx.map(BookActions.borrowBookByIsbnFulfilled),
    );
  })
  .on(BookActions.returnBookByIsbn, ({ isbn }) => {
    const userId = userIdQuery(getGlobalState());
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

// --- Module ---
export const useBookModule = () => handle();
