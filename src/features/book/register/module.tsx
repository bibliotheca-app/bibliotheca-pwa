import React from 'react';
import { createEpic, createReducer, useModule } from 'typeless';
import { BookActions } from '../interface';
import { BookRegisterView } from './components/BookRegisterView';
import { BookRegisterActions, BookRegisterState, MODULE } from './interface';

// --- Epic ---
export const epic = createEpic(MODULE);

// --- Reducer ---
const initialState: BookRegisterState = {};

export const reducer = createReducer(initialState)
  .on(BookRegisterActions.$mounted, state => {
    state.registeredBook = undefined;
  })
  .on(BookActions.registerBookFulfilled, (state, { book }) => {
    state.registeredBook = book;
  });

// --- Module ---
export default () => {
  useModule({
    epic,
    reducer,
    reducerPath: ['bookRegister'],
    actions: BookRegisterActions,
  });
  return <BookRegisterView />;
};
