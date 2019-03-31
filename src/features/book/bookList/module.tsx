import React from 'react';
import { createEpic, createReducer, useModule } from 'typeless';
import { BookListView } from './components/BookListView';
import { BookListActions, BookListState, MODULE } from './interface';

// --- Epic ---
export const epic = createEpic(MODULE);

// --- Reducer ---
const initialState: BookListState = {
  books: [
    {
      title: 'JUnit実践入門',
      isbn: 9784774153773,
    },
    {
      title: 'カイゼンジャーニー',
      isbn: 9784798153346,
    },
  ],
};

export const reducer = createReducer(initialState);

// --- Module ---
export default () => {
  useModule({
    epic,
    reducer,
    reducerPath: ['bookList'],
    actions: BookListActions,
  });
  return <BookListView />;
};
