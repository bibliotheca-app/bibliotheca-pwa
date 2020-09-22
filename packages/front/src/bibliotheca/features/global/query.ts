import { GlobalState, getGlobalState } from './interface';
import { createSelector } from 'typeless';

// TODO: 綺麗にかけるかも
export const userIdQuery = (state: GlobalState): string => {
  const user = state.user;
  if (!user) {
    return '';
  }
  return user.firebaseAuth.email || '';
};

export const isLoggedInQuery = createSelector(
  [getGlobalState, state => state.user],
  user => user !== null,
);
