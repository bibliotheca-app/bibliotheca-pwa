import React from 'react';
import { Dashboard } from 'src/components/Dashboard';
import { Link } from 'src/components/Link';
import { useMappedState } from 'typeless';

export const BookListView = () => {
  const { books } = useMappedState(state => state.bookList);
  return (
    <Dashboard>
      {books.map(({ title, isbn }, i) => (
        <div key={`books_${i}`}>
          {title}isbn: {isbn}
        </div>
      ))}
      <br />
      <Link href="/sample2">
        <button>登録</button>
      </Link>
    </Dashboard>
  );
};
