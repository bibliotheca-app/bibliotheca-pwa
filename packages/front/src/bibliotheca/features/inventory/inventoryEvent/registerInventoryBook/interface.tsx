import { Book } from 'bibliotheca/types';
import { createModule } from 'typeless';
import { RegisterInventoryBookSymbol } from './symbol';

// --- Actions ---
const modules = createModule(RegisterInventoryBookSymbol)
  .withActions({
    $unmounting: null,
    fetchBookFullfilled: (book: Book, checkedAll: boolean) => ({ payload: { book, checkedAll } }),
    submit: null,
    submitFullfilled: null,
  })
  .withState<RegisterInventoryBookState>();

export const handle = modules[0];
export const RegisterInventoryBookActions = modules[1];
export const getRegisterInventoryBookState = modules[2];

// --- Types ---
export interface RegisterInventoryBookState {
  registerBook?: Book;
  checkedAll: boolean;
  // todo: implements loading state
  isProcessingBook: boolean;
}
