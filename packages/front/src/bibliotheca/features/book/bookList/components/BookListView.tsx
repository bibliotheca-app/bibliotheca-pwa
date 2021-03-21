import { Link } from 'bibliotheca/components/Link';
import { StyledDataTable } from 'bibliotheca/components/StyledDataTable';
import { BookBorrowAndReturnButton } from 'bibliotheca/features/book/components/BookBorrowAndReturnBottun';
import { BookActions } from 'bibliotheca/features/book/interface';
import { getGlobalState } from 'bibliotheca/features/global/interface';
import { userIdQuery } from 'bibliotheca/features/global/query';
import { Book, isBook } from 'bibliotheca/types';
import { Box, CheckBox, ResponsiveContext, Text } from 'grommet';
import { useState } from 'react';
import { useActions } from 'typeless';
import { getBookListState } from '../interface';

export const BookListView = () => {
  const { books, isProcessingBook } = getBookListState.useState();
  const userId = userIdQuery(getGlobalState.useState());
  const { borrowBookById, returnBookById } = useActions(BookActions);

  const [groupBy, setGroupBy] = useState<string | undefined>();
  const groupByBorrowedUser = () => setGroupBy('borrowedBy');
  const unsetGroupBy = () => setGroupBy(undefined);

  return (
    <Box>
      <ResponsiveContext.Consumer>
        {size =>
          // StyledDataTable の MediaQuery と若干ずれてしまうのでそのうちどちらかに寄せる必要がありそう
          (size === 'large' || size === 'medium') && (
            <CheckBox
              checked={groupBy !== undefined}
              onChange={(ev: any) => (ev.target.checked ? groupByBorrowedUser() : unsetGroupBy())}
              label="ユーザーでグループ化"
            />
          )
        }
      </ResponsiveContext.Consumer>
      <StyledDataTable
        size={groupBy ? '' : 'large'} // groupBy の際にこの項目が指定されていると適切に表を表示するために各セルの width を自前で調整する必要が出てきてしまう
        primaryKey="id"
        data={books}
        groupBy={groupBy}
        columns={[
          {
            property: 'title',
            header: 'タイトル',
            search: true,
            render: (book: Partial<Book>) =>
              isBook(book) && (
                <Link href={`/books/${book.id}`}>
                  <Text>{book.title}</Text>
                </Link>
              ),
          },
          { property: 'isbn', header: 'ISBN' },
          {
            property: 'borrowedBy',
            header: 'ユーザー',
            search: true,
            render: (book: Partial<Book>) =>
              !isBook(book) ? (
                book.borrowedBy // groupBy の際に使われる
              ) : (
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
              createdAt &&
              `${createdAt.getFullYear()}/${createdAt.getMonth() + 1}/${createdAt.getDate()}`,
          },
        ]}
        sortable
      />
    </Box>
  );
};
