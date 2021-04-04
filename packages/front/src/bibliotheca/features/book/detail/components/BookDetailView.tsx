import { BookDetail } from 'bibliotheca/components/BookDetail';
import { Delay } from 'bibliotheca/components/Delay';
import { NotFoundError } from 'navi';
import { Instagram } from 'react-content-loader';
import { useCurrentRoute } from 'react-navi';
import { getBookDetailState } from '../interface';

export const BookDetailView = () => {
  const {
    selectedBook: book,
    isProcessingBook,
    findBookError: error,
  } = getBookDetailState.useState();
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
