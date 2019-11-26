import * as Rx from 'bibliotheca/rx';
import { bookRepository, deletedBookRepository } from 'bibliotheca/services/ServiceContainer';
import { userIdQuery } from '../global/query';
import { BookActions, handle } from './interface';
import { getGlobalState } from '../global/interface';

// --- Epic ---
export const epic = handle
  .epic()
  .on(BookActions.borrowBookById, ({ bookId }) => {
    const userId = userIdQuery(getGlobalState());
    return Rx.from(bookRepository.borrowBookById(bookId, userId)).pipe(
      Rx.map(BookActions.borrowBookByIdFulfilled),
    );
  })
  .on(BookActions.returnBookById, ({ bookId }) => {
    const userId = userIdQuery(getGlobalState());
    return Rx.from(bookRepository.returnBookById(bookId, userId)).pipe(
      Rx.map(BookActions.returnBookByIdFulfilled),
    );
  })
  .on(BookActions.borrowBookByIsbn, ({ isbn }) => {
    const userId = userIdQuery(getGlobalState());
    return Rx.from(bookRepository.borrowBookByIsbn(isbn, userId)).pipe(
      Rx.map(BookActions.borrowBookByIsbnFulfilled),
    );
  })
  .on(BookActions.returnBookByIsbn, ({ isbn }) => {
    const userId = userIdQuery(getGlobalState());
    return Rx.from(bookRepository.returnBookByIsbn(isbn, userId)).pipe(
      Rx.map(BookActions.returnBookByIsbnFulfilled),
    );
  })
  .on(BookActions.registerBook, ({ bookData }) => {
    return Rx.from(bookRepository.registerBook(bookData)).pipe(
      Rx.map(BookActions.registerBookFulfilled),
    );
  })
  .on(BookActions.deleteBookById, ({ bookId }) => {
    return Rx.from(deletedBookRepository.deleteById(bookId)).pipe(
      Rx.map(BookActions.deleteBookByIdFulfilled),
    );
  })
  .on(BookActions.editBook, ({ bookEdit }) => {
    return Rx.from(bookRepository.editBookById(bookEdit)).pipe(
      Rx.map(BookActions.editBookFulfilled),
    );
  });

// --- Module ---
export const useBookModule = () => handle();
