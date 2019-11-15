import { myFirestore } from 'firebase';
import { DeletedBook, BookData, BookEditData, DeletedBookEntry, Book } from '../types';
import { BookRepository } from './BookRepository';

const deletedBookFromDoc = (doc: myFirestore.DocumentSnapshot): DeletedBook => {
  const data = doc.data()! as DeletedBookEntry;

  return {
    id: doc.id,
    isbn: data.isbn,
    title: data.title,
    updatedAt: data.updatedAt.toDate(),
    createdAt: data.createdAt.toDate(),
    deletedAt: data.deletedAt.toDate(),
  };
};

export class DeletedBookRepository {
  protected collection = this.db.collection('deletedBooks');

  constructor(protected db: myFirestore.Firestore, private bookRepository: BookRepository) {}

  bulkDelete = async (books: Book[]) => {
    await this.db.runTransaction(async tx => {
      books.forEach(book => {
        const { id, createdAt: _, updatedAt: _1, deletedAt: _2, ...body } = book;
        const bookRef = this.bookRepository.mkBookRefById(id);
        tx.delete(bookRef);

        const deletedBookRef = this.mkDeletedBookRefById(id);
        const deletedBookData: Omit<DeletedBook, 'id'> = {
          ...body,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: new Date(),
        };
        tx.set(deletedBookRef, deletedBookData);
      });
    });
  };

  private mkDeletedBookRefById = (bookId: string): myFirestore.DocumentReference =>
    this.collection.doc(bookId);
}
