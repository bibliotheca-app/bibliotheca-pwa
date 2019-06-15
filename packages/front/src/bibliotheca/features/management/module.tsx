import { bookRepository } from 'bibliotheca/services/ServiceContainer';
import { Book } from 'bibliotheca/types';
import * as Papa from 'papaparse';
import React from 'react';
import * as Rx from 'typeless/rx';
import { ManagementView } from './components/ManagementView';
import { handle, ManagementActions } from './interface';

const fields = ['id', 'isbn', 'title', 'borrowedBy', 'updatedAt', 'createdAt'] as Array<keyof Book>;

const downloadFile = (args: { content: string; type: string; fileName: string }) => {
  const { content, type: mimeType, fileName } = args;

  const file = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(file);
  const a = document.createElement('a');
  a.download = fileName;
  a.href = url;

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  // このタイミングでいいのか？
  URL.revokeObjectURL(url);
};

// --- Epic ---
export const epic = handle.epic().on(ManagementActions.downloadBookListAsCsv, () => {
  return Rx.fromPromise(bookRepository.findAllCachedBooks()).pipe(
    Rx.map(books => {
      const csv = Papa.unparse({ fields: fields, data: books });
      downloadFile({
        content: csv,
        type: 'text/csv;charset=utf-8',
        fileName: 'book-list.csv',
      });

      return ManagementActions.downloadBookListAsCsvFulfilled();
    }),
  );
});

// --- Module ---
export const ManagementModule = () => {
  handle();
  return <ManagementView />;
};
