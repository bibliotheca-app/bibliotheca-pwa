import React from 'react';
import { createEpic, createReducer, useModule } from 'typeless';
import { BookView } from './components/BookView';
import { BookActions, BookState, MODULE } from './interface';

// --- Epic ---
export const epic = createEpic(MODULE);

// --- Reducer ---
const initialState: BookState = {
  foo: 'bar',
};

export const reducer = createReducer(initialState);

// --- Module ---
export default () => {
  useModule({
    epic,
    reducer,
    reducerPath: ['book'],
    actions: BookActions,
  });
  return <BookView />;
};
