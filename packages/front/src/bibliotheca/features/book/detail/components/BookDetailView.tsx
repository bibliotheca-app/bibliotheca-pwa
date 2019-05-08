import { BookDetail } from 'bibliotheca/components/BookDetail';
import React from 'react';
import { useMappedState } from 'typeless';

export const BookDetailView = () => {
  const book = useMappedState(state => state.bookDetail.selectedBook);

  if (!book) {
    return <>loading</>;
  }

  return <BookDetail book={book} />;
};
