import { Link } from 'bibliotheca/components/Link';
import { StyledDataTable } from 'bibliotheca/components/StyledDataTable';
import { BookBorrowAndReturnButton } from 'bibliotheca/features/book/components/BookBorrowAndReturnBottun';
import { BookActions } from 'bibliotheca/features/book/interface';
import { userIdQuery } from 'bibliotheca/features/global/query';
import { Book } from 'bibliotheca/types';
import { Text } from 'grommet';
import React from 'react';
import { useActions, useMappedState } from 'typeless';

export const BookListView = () => {
  const { books, isProcessingBook } = useMappedState(state => state.bookList);
  const userId = useMappedState(s => userIdQuery(s.global));
  const { borrowBookById, returnBookById } = useActions(BookActions);

  return (
    <>
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
                <Link href={`/books/detail/${book.id}`}>
                  <Text>{book.title}</Text>
                </Link>
              );
            },
          },
          { property: 'isbn', header: 'ISBN' },
          {
            property: 'borrowedBy',
            header: '貸借',
            search: true,
            render: (book: Book) => (
              <BookBorrowAndReturnButton
                book={book}
                userId={userId}
                onBorrow={borrowBookById}
                onReturn={returnBookById}
                disabled={isProcessingBook}
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
    </>
  );
};
