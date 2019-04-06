import React from 'react';
import { Dashboard } from 'src/components/Dashboard';
import { Link } from 'src/components/Link';
import { useActions, useMappedState } from 'typeless';
import { BookListActions } from '../interface';
import { BookBorrowAndReturnButton } from './BookBorrowAndReturnBottun';
import { BookBorrowForm, BookReturnForm } from './BorrowReturnForms';

export const BookListView = () => {
  const { books } = useMappedState(state => state.bookList);
  const userId = useMappedState(
    state => state.global.user!.firebaseAuth!.email!
  );
  const { borrowBookById, returnBookById } = useActions(BookListActions);

  return (
    <Dashboard>
      {books.map(book => (
        <div key={book.id}>
          {book.title}isbn: {book.isbn}
          <BookBorrowAndReturnButton
            book={book}
            userId={userId}
            onBorrow={borrowBookById}
            onReturn={returnBookById}
          />
        </div>
      ))}
      <br />
      <BookBorrowForm />
      <BookReturnForm />
      <Link href="/sample2">
        <button>登録</button>
      </Link>
    </Dashboard>
  );
};
