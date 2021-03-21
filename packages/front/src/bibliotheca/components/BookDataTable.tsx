import { BookData } from 'bibliotheca/types';
import { FormField, Image } from 'grommet';
import { useState } from 'react';
import * as React from 'react';
import { SimpleTable } from './SimpleTable';
import { openBdRepository } from 'bibliotheca/services/OpenBdRepository';

type ViewProps = {
  book: Partial<BookData>;
};

type EditProps = {};

export const BookDataViewTable: React.FC<ViewProps> = ({ book }) => {
  const rows = [
    {
      label: 'タイトル',
      render: book.title || '-',
    },
    {
      label: '画像',
      render: () => <Image fit="contain" src={openBdRepository.coverUrl(book.isbn!)} />,
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
      render: () => <Image fit="contain" src={openBdRepository.coverUrl(isbn)} />,
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
