import { bookRepository } from 'bibliotheca/services/ServiceContainer';
import * as Rx from 'typeless/rx';
import { BarcodeLoaderActions } from '../barcodeLoader/interface';
import { BookActions } from '../book/interface';
import { userIdQuery } from '../global/query';
import { NotificationActions } from '../notification/interface';
import { BorrowOrReturnView } from './components/BorrowOrReturnView';
import { BorrowOrReturnActions, BorrowOrReturnState, handle } from './interface';
import { getGlobalState } from '../global/interface';
import { useBarcodeLoaderModule } from '../barcodeLoader/module';

// --- Epic ---
export const epic = handle
  .epic()
  .on(BarcodeLoaderActions.emitBarcode, ({ barcode }) => {
    return Rx.from(bookRepository.findBooksByIsbn(barcode)).pipe(
      Rx.map(books =>
        BorrowOrReturnActions.fetchBookFromBarcodeFullfilled(
          books,
          userIdQuery(getGlobalState()),
          barcode,
        ),
      ),
    );
  })
  .on(BookActions.borrowBookByIdFulfilled, ({ book }) => {
    return NotificationActions.notifyMessage(`${book.title}を借りました`);
  })
  .on(BookActions.returnBookByIdFulfilled, ({ book }) => {
    return NotificationActions.notifyMessage(`${book.title}を返却しました`);
  });

// --- Reducer ---
const initialState: BorrowOrReturnState = {
  target: undefined,
  isProcessingBook: false,
};

export const reducer = handle
  .reducer(initialState)
  .on(BorrowOrReturnActions.$mounted, state => {
    state.target = undefined;
    state.isProcessingBook = false;
  })
  .onMany([BookActions.borrowBookById, BookActions.returnBookById], state => {
    state.isProcessingBook = true;
  })
  .onMany([BookActions.borrowBookByIdFulfilled, BookActions.returnBookByIdFulfilled], state => {
    state.isProcessingBook = false;
    state.target = undefined;
  })
  .on(
    BorrowOrReturnActions.fetchBookFromBarcodeFullfilled,
    (state, { books, userId, loadedCode }) => {
      if (books.length === 0) {
        state.target = { existsBookInList: false, loadedCode };
      } else {
        const borrowedByMe = books.find(b => b.borrowedBy === userId);
        const stock = books.find(b => !b.borrowedBy);
        const unStock = books.find(b => !!b.borrowedBy);
        const book = !!borrowedByMe ? borrowedByMe : stock ? stock : unStock!;

        state.target = { book, loadedCode };
      }
    },
  );

// --- Module ---
export const BorrowOrReturnModule = () => {
  handle();
  useBarcodeLoaderModule();
  return <BorrowOrReturnView />;
};
