import { BookRepository } from './BookRepository';

type Book = { createdAt: Date };
type BookEntry = { id: string; data: Book };

// todo: 要リファクタ。テストがないので一旦ベタ移植だけにとどめた
export class BookRepositoryForBatch extends BookRepository {
  fetchCachedBookEntriesMapAsync = async (): Promise<BookEntry[]> => {
    const doc = await this.db
      .collection('bookLists')
      .doc('0') // 未来でページングするかも
      .get();
    const data = doc.data();
    return !data ? [] : (data as any).entries;
  };

  fetchFreshBookEntriesAsync = async (): Promise<BookEntry[]> => {
    const qs = await this.db
      .collection('books')
      .orderBy('createdAt')
      .get();
    return qs.docs.map(doc => ({ id: doc.id, data: doc.data() as any }));
  };
  writeBookEntries = async (bookEntries: BookEntry[]) => {
    return this.db
      .collection('bookLists')
      .doc('0')
      .set({ entries: bookEntries || [] });
  };

  writeAllBook = async () => {
    const bookEntries = await this.fetchFreshBookEntriesAsync();
    return this.writeBookEntries(bookEntries);
  };
}
