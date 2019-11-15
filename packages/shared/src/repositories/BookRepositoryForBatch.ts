import { BookRepository } from './BookRepository';

type Book = { createdAt: Date };
type BookEntry = { id: string; data: Book };
type BookList = { entries: BookEntry[] };

// todo: 要リファクタ。テストがないので一旦ベタ移植だけにとどめた
export class BookRepositoryForBatch extends BookRepository {
  private fetchFreshBookEntriesAsync = async (): Promise<BookEntry[]> => {
    const qs = await this.db
      .collection('books')
      .orderBy('createdAt')
      .get();
    return qs.docs.map(doc => ({ id: doc.id, data: doc.data() as any }));
  };
  private writeBookEntries = async (bookEntries: BookEntry[]) => {
    return this.db
      .collection('bookLists')
      .doc('0')
      .set({ entries: bookEntries || [] });
  };

  writeAllBook = async () => {
    const bookEntries = await this.fetchFreshBookEntriesAsync();
    return this.writeBookEntries(bookEntries);
  };

  addBookToChach = async (book: BookEntry) => {
    await this.db.runTransaction(async tx => {
      const cacheRef = this.bookListsCollection.doc('0');
      const cachedBooksDoc = await tx.get(cacheRef);
      const cachedBookEntries: BookEntry[] = cachedBooksDoc.data()?.entries ?? [];

      const newCache: BookList = {
        entries: [...cachedBookEntries, book],
      };
      tx.set(cacheRef, newCache);
    });
  };

  editBookInCache = async (book: BookEntry) => {
    await this.db.runTransaction(async tx => {
      const cacheRef = this.bookListsCollection.doc('0');
      const cachedBooksDoc = await tx.get(cacheRef);
      const cachedBookEntries: BookEntry[] = cachedBooksDoc.data()?.entries ?? [];

      const newCache: BookList = {
        entries: cachedBookEntries.map(entry => {
          if (entry.id === book.id) {
            return book;
          } else {
            return entry;
          }
        }),
      };
      tx.set(cacheRef, newCache);
    });
  };

  deleteBookFromCache = async (bookId: string) => {
    await this.db.runTransaction(async tx => {
      const cacheRef = this.bookListsCollection.doc('0');
      const cachedBooksDoc = await tx.get(cacheRef);
      const cachedBookEntries: BookEntry[] = cachedBooksDoc.data()?.entries ?? [];

      const newCache: BookList = { entries: cachedBookEntries.filter(e => e.id !== bookId) };
      tx.set(cacheRef, newCache);
    });
  };
}
