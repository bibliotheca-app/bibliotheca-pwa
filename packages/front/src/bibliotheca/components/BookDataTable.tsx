import { BookData } from 'bibliotheca/types';
import { Image } from 'grommet';
import React from 'react';
import { SimpleTable } from './SimpleTable';

const coverUrl = (isbn: string | null) => {
  if (isbn === null) {
    return '';
  }
  return `https://cover.openbd.jp/${isbn}.jpg`;
};

interface Props {
  book: Partial<BookData>;
  edit?: boolean;
}

export const BookDataTable: React.SFC<Props> = ({ book, edit }) => {
  const rows = [
    {
      label: 'タイトル',
      render: !edit ? book.title : 'hi',
    },
    {
      label: '画像',
      render: () => <Image fit="contain" src={coverUrl(book.isbn!)} />,
    },
    {
      label: 'ISBN (or JAN)',
      render: book.isbn || '-',
    },
    {
      label: '貸借状態',
      render: book.borrowedBy || '-',
    },
    {
      label: '作成日',
      render: book.createdAt || '-',
    },
    {
      label: '更新日',
      render: book.updatedAt || '-',
    },
  ];

  return <SimpleTable rows={rows} />;
};
