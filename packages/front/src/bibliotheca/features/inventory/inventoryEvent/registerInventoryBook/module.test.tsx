import { NotificationActions } from 'bibliotheca/features/notification/interface';
import { render } from 'bibliotheca/fixtures/helper';
import { bookRepository } from 'bibliotheca/services/ServiceContainer';
import { Book } from 'bibliotheca/types';
import { mocked } from 'ts-jest/utils';
import { ActionLike } from 'typeless';
import { handle as inventoryBookModule } from '../../inventoryBookModule/interface';
import { RegisterInventoryBookActions } from './interface';
import { onEmitBarcode } from './module';

jest.mock('bibliotheca/services/ServiceContainer');

describe('registerInventoryBook module', () => {
  describe('epic', () => {
    describe('no books in libraly', () => {
      it('should return NotifyMessage: nothing book', async () => {
        mocked(bookRepository).findBooksByIsbn.mockResolvedValue([]);

        const actual = await (onEmitBarcode({ barcode: '' }, null as any, null as any) as Promise<
          ActionLike
        >);

        expect(actual).toEqual(NotificationActions.notifyMessage('蔵書に存在しない本です'));
      });
    });
    describe('one book in library', () => {
      describe('which is unchecked', () => {
        it('should return fetchBookFullfilled with Book is marked `unchecked`', async () => {
          const book = { id: '1' } as Book;
          mocked(bookRepository).findBooksByIsbn.mockResolvedValue([book]);

          render(() => {
            inventoryBookModule.reducer({
              booksInList: [],
              event: { inventoryBooks: [], date: new Date(), status: 'doing' },
            });
            inventoryBookModule();
            return null;
          });

          const actual = await (onEmitBarcode({ barcode: '' }, null as any, null as any) as Promise<
            ActionLike
          >);
          expect(actual).toStrictEqual(
            RegisterInventoryBookActions.fetchBookFullfilled(book, false),
          );
        });
      });
      describe('which is checked', () => {
        it('should return fetchBookFullfilled with Book is marked `checked`', async () => {
          const book = { id: '1', isbn: 'isbn' } as Book;
          mocked(bookRepository).findBooksByIsbn.mockResolvedValue([book]);

          render(() => {
            inventoryBookModule.reducer({
              booksInList: [book],
              event: {
                inventoryBooks: [
                  {
                    bookId: book.id,
                    status: 'checked',
                    inventoriedAt: new Date(),
                    inventoriedBy: '',
                  },
                ],
                date: new Date(),
                status: 'doing',
              },
            });
            inventoryBookModule();
            return null;
          });

          const actual = await (onEmitBarcode(
            { barcode: book.isbn! },
            null as any,
            null as any,
          ) as Promise<ActionLike>);
          expect(actual).toStrictEqual(
            RegisterInventoryBookActions.fetchBookFullfilled(book, true),
          );
        });
      });
      describe('which is checked and exists two or more', () => {
        it('should return fetchBookFullfilled with Book is marked `checked`', async () => {
          const books = [{ id: '1', isbn: 'isbn' } as Book, { id: '2', isbn: 'isbn' } as Book];
          mocked(bookRepository).findBooksByIsbn.mockResolvedValue(books);

          render(() => {
            inventoryBookModule.reducer({
              booksInList: books,
              event: {
                inventoryBooks: [
                  {
                    bookId: books[0].id,
                    status: 'checked',
                    inventoriedAt: new Date(),
                    inventoriedBy: '',
                  },
                ],
                date: new Date(),
                status: 'doing',
              },
            });
            inventoryBookModule();
            return null;
          });

          const actual = await (onEmitBarcode(
            { barcode: books[1].isbn! },
            null as any,
            null as any,
          ) as Promise<ActionLike>);
          expect(actual).toStrictEqual(
            RegisterInventoryBookActions.fetchBookFullfilled(books[1], false),
          );
        });
      });
    });
  });
});
