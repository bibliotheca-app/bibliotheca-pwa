import { DataTable } from 'grommet';
import React from 'react';
import { Dashboard } from 'src/components/Dashboard';
import { Link } from 'src/components/Link';
import { BookActions } from 'src/features/book/interface';
import { userIdQuery } from 'src/features/global/query';
import { Book } from 'src/types';
import { useActions, useMappedState } from 'typeless';
import { BookBorrowAndReturnButton } from './BookBorrowAndReturnBottun';
import { BookBorrowForm, BookReturnForm } from './BorrowReturnForms';

export const BookListView = () => {
  const { books } = useMappedState(state => state.bookList);
  const userId = useMappedState(s => userIdQuery(s.global));
  const { borrowBookById, returnBookById } = useActions(BookActions);

  return (
    <Dashboard>
      <BookBorrowForm />
      <BookReturnForm />
      <Link href="/sample2">
        <button>登録</button>
      </Link>
      <br />
      <DataTable
        size="large"
        primaryKey="id"
        data={books}
        columns={[
          { property: 'title', header: 'タイトル' },
          { property: 'isbn', header: 'ISBN' },
          {
            property: 'borrowedBy',
            render: (book: Book) => (
              <BookBorrowAndReturnButton
                book={book}
                userId={userId}
                onBorrow={borrowBookById}
                onReturn={returnBookById}
              />
            ),
          },
        ]}
      />
    </Dashboard>
  );
};
