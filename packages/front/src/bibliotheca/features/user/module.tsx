import { BookActions } from 'bibliotheca/features/book/interface';
import { GlobalActions } from 'bibliotheca/features/global/interface';
import { RouterActions } from 'bibliotheca/features/router/interface';
import * as Rx from 'bibliotheca/rx';
import { bookRepository } from 'bibliotheca/services/ServiceContainer';
import React, { useEffect } from 'react';
import { useActions } from 'typeless';
import { UserView } from './components/UserView';
import { handle, UserActions, UserState } from './interface';

// --- Epic ---
export const epic = handle.epic().on(UserActions.fetchBorrowedBooksByUserId, ({ userId }) => {
  return Rx.fromPromise(bookRepository.findBorrowedBooksByUserid(userId)).pipe(
    Rx.map(UserActions.fetchBorrowedBooksByUserIdFulfilled),
    Rx.catchLog(e => Rx.of(UserActions.fetchBorrowedBooksByUserIdFailure(e))),
    Rx.flatMap(fulfilledOrError => Rx.of(fulfilledOrError, GlobalActions.progressHide())),
  );
});

// --- Reducer ---
const initialState: UserState = {
  borrowedBooks: [],
};

export const reducer = handle
  .reducer(initialState)
  .on(RouterActions.locationChange, state => {
    state.borrowedBooks = [];
  })
  .on(UserActions.fetchBorrowedBooksByUserIdFulfilled, (state, { books }) => {
    state.borrowedBooks = books;
  })
  .on(BookActions.returnBookByIdFulfilled, (state, { book: returnedBook }) => {
    state.borrowedBooks = state.borrowedBooks.filter(book => book.id !== returnedBook.id);
  });

// --- Module ---
export const UserModule = ({ userId }: { userId: string }) => {
  handle();

  const { fetchBorrowedBooksByUserId } = useActions(UserActions);
  const { progressShow } = useActions(GlobalActions);
  useEffect(() => {
    fetchBorrowedBooksByUserId(userId);
    progressShow();
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps

  return <UserView userId={userId} />;
};
