import React from 'react';
import { Dashboard } from 'src/components/Dashboard';
import { Link } from 'src/components/Link';
import { useMappedState } from 'typeless';
import { BookBorrowForm, BookReturnForm } from 'src/components/Firestore';

export const BookListView = () => {
  const { books } = useMappedState(state => state.bookList);
  return (
    <Dashboard>
      {books.map(({ id, title, isbn, borrowedBy }) => (
        <div key={id}>
          {title}isbn: {isbn}
          {borrowedBy ? `, ${borrowedBy}が借りています` : ''}
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
