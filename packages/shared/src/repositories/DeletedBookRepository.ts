import { myFirestore } from 'firebase';
import { DeletedBook, DeletedBookEntry } from '../types';
import { bookFromDoc, BookRepository } from './BookRepository';

const deletedBookFromDoc = (doc: myFirestore.DocumentSnapshot): DeletedBook => {
  const data = doc.data()! as DeletedBookEntry;

  return {
    id: doc.id,
    isbn: data.isbn,
    title: data.title,
    deletedBy: data.deletedBy,
    updatedAt: data.updatedAt.toDate(),
    createdAt: data.createdAt.toDate(),
  };
};

export class DeletedBookRepository {
  protected collection = this.db.collection('deletedBooks');

  constructor(protected db: myFirestore.Firestore, private bookRepository: BookRepository) {}

  findAll = async (): Promise<DeletedBook[]> => {
    return this.collection.get().then(snapshot => snapshot.docs.map(deletedBookFromDoc));
  };

  deleteById = async (bookId: string, deletedBy: string) => {
    return this.db.runTransaction(async tx => {
      const bookRef = this.bookRepository.mkBookRefById(bookId);
      const target = await tx.get(bookRef).then(bookFromDoc);
      const { id, createdAt: _, updatedAt: _1, ...body } = target;

      const deletedBookRef = this.mkDeletedBookRefById(bookId);

      tx.delete(bookRef);
      const now = new Date();
      const deletedBookData: Omit<DeletedBook, 'id'> = {
        ...body,
        deletedBy,
        createdAt: now,
        updatedAt: now,
      };
      tx.set(deletedBookRef, deletedBookData);
      return target;
    });
  };

  bulkDelete = async (books: Omit<DeletedBook, 'createdAt' | 'updatedAt'>[]) => {
    await this.db.runTransaction(async tx => {
      books.forEach(book => {
        const { id, ...body } = book;
        const bookRef = this.bookRepository.mkBookRefById(id);
        const deletedBookRef = this.mkDeletedBookRefById(id);

        tx.delete(bookRef);
        const now = new Date();
        const deletedBookData: Omit<DeletedBook, 'id'> = {
          ...body,
          createdAt: now,
          updatedAt: now,
        };
        tx.set(deletedBookRef, deletedBookData);
      });
    });
  };

  private mkDeletedBookRefById = (bookId: string): myFirestore.DocumentReference =>
    this.collection.doc(bookId);
}
