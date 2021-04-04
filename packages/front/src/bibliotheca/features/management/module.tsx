import { bookRepository, deletedBookRepository } from 'bibliotheca/services/ServiceContainer';
import { Book } from 'bibliotheca/types';
import * as Papa from 'papaparse';
import * as Rx from 'typeless/rx';
import { ManagementView } from './components/ManagementView';
import { handle, ManagementActions } from './interface';
import { DeletedBook } from 'shared/lib/es';
import { downloadFile } from 'bibliotheca/services/downloadFile';

// --- Epic ---
export const epic = handle
  .epic()
  .on(ManagementActions.downloadBookListAsCsv, () => {
    return Rx.from(bookRepository.findAllCachedBooks()).pipe(
      Rx.map(books => {
        const fields = ['id', 'isbn', 'title', 'borrowedBy', 'updatedAt', 'createdAt'] as Array<
          keyof Book
        >;
        const csv = Papa.unparse({ fields: fields, data: books });
        downloadFile({
          content: csv,
          type: 'text/csv;charset=utf-8',
          fileName: 'book-list.csv',
        });

        return ManagementActions.downloadBookListAsCsvFulfilled();
      }),
    );
  })
  .on(ManagementActions.downloadDeletedBookListAsCsv, async () => {
    const books = await deletedBookRepository.findAll();
    const fields = ['id', 'isbn', 'title', 'createdAt', 'updatedAt'] as Array<keyof DeletedBook>;
    const csv = Papa.unparse({ fields, data: books });

    downloadFile({
      content: csv,
      type: 'text/csv;charset=utf-8',
      fileName: 'deleted-book-list.csv',
    });
    return ManagementActions.downloadDeletedBookListAsCsvFulfilled();
  });

// --- Module ---
export const ManagementModule = () => {
  handle();
  return <ManagementView />;
};
