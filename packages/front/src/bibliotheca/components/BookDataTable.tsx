import { BookData } from 'bibliotheca/types';
import { FormField, Image } from 'grommet';
import React, { useState } from 'react';
import { SimpleTable } from './SimpleTable';

const coverUrl = (isbn: string | null) => {
  if (isbn === null) {
    return '';
  }
  return `https://cover.openbd.jp/${isbn}.jpg`;
};

type ViewProps = {
  book: Partial<BookData>;
};

type EditProps = {};

export const BookDataViewTable: React.FC<ViewProps> = ({ book }) => {
  const rows = [
    {
      label: 'タイトル',
      render: book.title,
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

export const BookDataEditTable: React.FC<ViewProps & EditProps> = ({ book }) => {
  const [title, setTitle] = useState(book.title);
  const [isbn, setIsbn] = useState(book.isbn || '');

  const rows = [
    {
      label: 'タイトル',
      render: () => (
        <FormField
          type="text"
          name="title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
      ),
    },
    {
      label: '画像',
      render: () => <Image fit="contain" src={isbn.length === 13 ? coverUrl(isbn) : ''} />,
    },
    {
      label: 'ISBN (or JAN)',
      render: () => (
        <FormField type="text" name="isbn" value={isbn} onChange={e => setIsbn(e.target.value)} />
      ),
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
