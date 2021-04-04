import { NotificationActions } from 'bibliotheca/features/notification/interface';
import { bookRepository, inventoryEventRepository } from 'bibliotheca/services/ServiceContainer';
import { InventoryEventDoing } from 'bibliotheca/types';
import { EpicHandler } from 'typeless';
import { BarcodeLoaderActions } from '../../../barcodeLoader/interface';
import { getInventoryBookModuleState } from '../../inventoryBookModule/interface';
import { useInventoryBookModule } from '../../inventoryBookModule/module';
import { RegisterInventoryBookView } from './components/RegisterInventoryBookView';
import {
  getRegisterInventoryBookState,
  handle,
  RegisterInventoryBookActions,
  RegisterInventoryBookState,
} from './interface';
import { userIdQuery } from 'bibliotheca/features/global/query';
import { getGlobalState } from 'bibliotheca/features/global/interface';

// --- Epic ---

export const onEmitBarcode: EpicHandler<typeof BarcodeLoaderActions.emitBarcode> = async ({
  barcode,
}) => {
  const books = await bookRepository.findBooksByIsbn(barcode);
  if (books.length === 0) {
    return NotificationActions.notifyMessage('蔵書に存在しない本です');
  } else {
    const { event, booksInList } = getInventoryBookModuleState();

    const checkedBookIds = (event as InventoryEventDoing).inventoryBooks
      .filter(b => b.status === 'checked')
      .map(b => b.bookId);
    const checkedBooks = checkedBookIds
      .map(bid => booksInList.find(b => b.id === bid)!)
      .filter(b => b != null && b.isbn === barcode);

    const checkedAll = books.length === checkedBooks.length;
    const uncheckedBook = books.find(b => !!checkedBookIds.find(bid => bid !== b.id));
    const target = uncheckedBook ? uncheckedBook : books[0];
    return RegisterInventoryBookActions.fetchBookFullfilled(target, checkedAll);
  }
};

export const epic = handle
  .epic()
  .on(BarcodeLoaderActions.emitBarcode, onEmitBarcode)
  .on(RegisterInventoryBookActions.submit, async () => {
    const userId = userIdQuery(getGlobalState());
    const { registerBook } = getRegisterInventoryBookState();
    await inventoryEventRepository.addInventoryBook({
      status: 'checked',
      bookId: registerBook!.id,
      inventoriedAt: new Date(),
      inventoriedBy: userId,
    });
    return NotificationActions.notifyMessage('登録しました');
  });

// --- Reducer ---
const initialState: RegisterInventoryBookState = {
  isProcessingBook: false,
  checkedAll: false,
};

export const reducer = handle
  .reducer(initialState)
  .on(RegisterInventoryBookActions.fetchBookFullfilled, (state, { book, checkedAll }) => {
    state.registerBook = book;
    state.checkedAll = checkedAll;
  })
  .onMany(
    [RegisterInventoryBookActions.$unmounting, RegisterInventoryBookActions.submitFullfilled],
    state => {
      state.registerBook = undefined;
    },
  );

// --- Module ---
export const RegisterInventoryBookModule = () => {
  useInventoryBookModule();
  handle();
  return <RegisterInventoryBookView />;
};
