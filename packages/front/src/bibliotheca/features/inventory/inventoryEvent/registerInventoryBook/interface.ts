import { Book } from 'bibliotheca/types';
import { createModule } from 'typeless';
import { RegisterInventoryBookSymbol } from './symbol';

// --- Actions ---
export const [handle, RegisterInventoryBookActions, getRegisterInventoryBookState] = createModule(
  RegisterInventoryBookSymbol,
)
  .withActions({
    $unmounting: null,
    fetchBookFullfilled: (book: Book, checkedAll: boolean) => ({ payload: { book, checkedAll } }),
    submit: null,
    submitFullfilled: null,
  })
  .withState<RegisterInventoryBookState>();

// --- Types ---
export interface RegisterInventoryBookState {
  registerBook?: Book;
  checkedAll: boolean;
  // todo: implements loading state
  isProcessingBook: boolean;
}
