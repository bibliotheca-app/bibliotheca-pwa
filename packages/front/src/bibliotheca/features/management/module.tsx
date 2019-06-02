import React from 'react';
import { createEpic, createReducer, useModule } from 'typeless';
import * as Rx from 'typeless/rx';
import { ManagementView } from './components/ManagementView';
import { ManagementActions, ManagementState, MODULE } from './interface';
import { bookRepository } from 'bibliotheca/services/ServiceContainer';
import { Book } from 'bibliotheca/types';
import * as Papa from 'papaparse';

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
export const epic = createEpic(MODULE).on(ManagementActions.downloadBookListAsCsv, () => {
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

// --- Reducer ---
const initialState: ManagementState = {};

export const reducer = createReducer(initialState);

// --- Module ---
export const ManagementModule = () => {
  useModule({
    epic,
    reducer,
    reducerPath: ['management'],
    actions: ManagementActions,
  });
  return <ManagementView />;
};
