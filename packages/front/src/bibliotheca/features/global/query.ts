import { GlobalState } from './interface';

// TODO: 綺麗にかけるかも
export const userIdQuery = (state: GlobalState): string => {
  const user = state.user;
  if (!user) {
    return '';
  }
  return user.firebaseAuth.email || '';
};
