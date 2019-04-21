import { GlobalState } from './interface';

// ログイン後のみ有効
export const userIdQuery = (state: GlobalState): string => state.user!.firebaseAuth.email!;
