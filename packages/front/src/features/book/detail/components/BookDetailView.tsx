import React from 'react';
import { BookDetail } from 'src/components/BookDetail';
import { Dashboard } from 'src/components/Dashboard';
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
