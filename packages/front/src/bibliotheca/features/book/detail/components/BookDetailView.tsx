import { BookDetail } from 'bibliotheca/components/BookDetail';
import { Delay } from 'bibliotheca/components/Delay';
import { NotFoundError } from 'navi';
import React from 'react';
import { Instagram } from 'react-content-loader';
import { useCurrentRoute } from 'react-navi';
import { useMappedState } from 'typeless';

export const BookDetailView = () => {
  const { selectedBook: book, isProcessingBook } = useMappedState(state => state.bookDetail);
  const error = useMappedState(state => state.bookDetail.findBookError);
  const currentRoute = useCurrentRoute();

  if (error) {
    throw new NotFoundError(currentRoute.url.pathname);
  }

  if (!book) {
    return (
      <Delay wait={500}>
        <Instagram />
      </Delay>
    );
  }

  return <BookDetail book={book} isProcessingBook={isProcessingBook} />;
};
