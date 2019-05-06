import { DataTable, Text } from 'grommet';
import React from 'react';
import { Dashboard } from 'src/components/Dashboard';
import { Link } from 'src/components/Link';
import { BookActions } from 'src/features/book/interface';
import { userIdQuery } from 'src/features/global/query';
import { Book } from 'src/types';
import styled from 'styled-components';
import { useActions, useMappedState } from 'typeless';
import { BookBorrowAndReturnButton } from './BookBorrowAndReturnBottun';
import { BookBorrowForm, BookReturnForm } from './BorrowReturnForms';

const StyledDataTable = styled(DataTable)`
  tbody tr:nth-of-type(2n) {
    background-color: #fff;
  }
  tbody tr:nth-of-type(2n + 1) {
    background-color: #f9f9f9;
  }
  tbody tr:hover {
    background-color: #f0f0f0;
  }
`;

export const BookListView = () => {
  const { books } = useMappedState(state => state.bookList);
  const userId = useMappedState(s => userIdQuery(s.global));
  const { borrowBookById, returnBookById } = useActions(BookActions);

  return (
    <Dashboard>
      <BookBorrowForm />
      <BookReturnForm />
      <Link href="/book-register">
        <button>登録</button>
      </Link>
      <br />
      <StyledDataTable
        size="large"
        primaryKey="id"
        data={books}
        columns={[
          {
            property: 'title',
            header: 'タイトル',
            search: true,
            render: (book: Book) => {
              return (
                <Link href={`/book-detail?bookId=${book.id}`}>
                  <Text>{book.title}</Text>
                </Link>
              );
            },
          },
          { property: 'isbn', header: 'ISBN' },
          {
            property: 'borrowedBy',
            search: true,
            render: (book: Book) => (
              <BookBorrowAndReturnButton
                book={book}
                userId={userId}
                onBorrow={borrowBookById}
                onReturn={returnBookById}
              />
            ),
          },
          {
            property: 'createdAt',
            header: '登録日',
            render: ({ createdAt }: Book) =>
              `${createdAt.getFullYear()}/${createdAt.getMonth() + 1}/${createdAt.getDate()}`,
          },
        ]}
        sortable
      />
    </Dashboard>
  );
};
