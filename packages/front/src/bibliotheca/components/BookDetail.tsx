import { BookBorrowAndReturnButton } from 'bibliotheca/features/book/components/BookBorrowAndReturnBottun';
import { BookActions } from 'bibliotheca/features/book/interface';
import { userIdQuery } from 'bibliotheca/features/global/query';
import { BookData } from 'bibliotheca/types';
import { Box, Image, Table, TableBody, TableCell, TableRow, Text } from 'grommet';
import React from 'react';
import { useActions, useMappedState } from 'typeless';

const coverUrl = (isbn: string | null) => {
  if (isbn === null) {
    return '';
  }
  return `https://cover.openbd.jp/${isbn}.jpg`;
};

interface SimpleTableProps {
  rows: Array<{
    label: string;
    render: React.ReactNode | string;
  }>;
}

const SimpleTable: React.SFC<SimpleTableProps> = ({ rows }) => (
  <Table>
    <TableBody>
      {rows.map(row => (
        <TableRow key={row.label}>
          <TableCell scope="row">
            <Text weight="bold">{row.label}</Text>
          </TableCell>
          <TableCell>
            {typeof row.render === 'function' ? row.render() : <Text>{String(row.render)}</Text>}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export const BookDetail = ({ book }: { book: BookData }) => {
  const { borrowBookById, returnBookById } = useActions(BookActions);
  const userId = useMappedState(s => userIdQuery(s.global));

  const rows = [
    {
      label: 'タイトル',
      render: book.title,
    },
    {
      label: 'ISBN (or JAN)',
      render: book.isbn,
    },
    {
      label: '貸借',
      render: () => (
        <BookBorrowAndReturnButton
          onBorrow={borrowBookById}
          onReturn={returnBookById}
          book={book}
          userId={userId}
        />
      ),
    },
    {
      label: '作成日',
      render: book.createdAt,
    },
    {
      label: '更新日',
      render: book.updatedAt,
    },
  ];

  return (
    <Box align="center" justify="center">
      <SimpleTable rows={rows} />
      <Image fit="contain" src={coverUrl(book.isbn)} />
    </Box>
  );
};
