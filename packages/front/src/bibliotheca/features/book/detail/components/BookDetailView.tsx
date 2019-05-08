import { BookDetail } from 'bibliotheca/components/BookDetail';
import { Dashboard } from 'bibliotheca/components/Dashboard';
import React from 'react';
import { useMappedState } from 'typeless';

export const BookDetailView = () => {
  const book = useMappedState(state => state.bookDetail.selectedBook);

  if (!book) {
    return <Dashboard>loading</Dashboard>;
  }

  return (
    <Dashboard>
      <BookDetail book={book} />
    </Dashboard>
  );
};
