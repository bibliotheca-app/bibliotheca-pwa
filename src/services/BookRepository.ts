import { firestore } from 'firebase';
import { Book } from 'src/types';

const bookFromDoc = (doc: firestore.DocumentSnapshot): Book => ({
  id: doc.id,
  ...(doc.data() as any),
});

export class BookRepository {
  private collection = this.db.collection('books');

  constructor(private db: firestore.Firestore) {}

  findAllBooks = async (): Promise<Book[]> => {
    const querySnapshot = await this.collection.get();

    return querySnapshot.docs.map(bookFromDoc);
  };

  findBooksByIsbn = async (isbn: number): Promise<Book[]> => {
    const querySnapshot = await this.collection.where('isbn', '==', isbn).get();

    return querySnapshot.docs.map(bookFromDoc);
  };

  borrowBook = async (isbn: number, userId: string) => {
    const bookIds = await this.findBooksByIsbn(isbn).then(books =>
      books.map(book => book.id)
    );

    const bookRef = await this.db.runTransaction<firestore.DocumentReference>(
      async tx => {
        const bookPromises = bookIds
          .map(this.mkBookRefById)
          .map(ref => tx.get(ref))
          .map(doc => doc.then(bookFromDoc));
        const books = await Promise.all(bookPromises);

        const borrowableBook = books.find(book => {
          // TODO: 一人が何冊借りることも許すか
          return !!book.borrowedBy ? false : true;
        });

        if (!borrowableBook) {
          throw new Error(`isbn(${isbn})は貸し出せません`);
        }

        const ref = this.mkBookRefById(borrowableBook.id);
        tx.update(ref, { borrowedBy: userId });
        return ref;
      }
    );

    return bookRef.get().then(bookFromDoc);
  };

  returnBook = async (isbn: number, userId: string) => {
    const bookIds = await this.findBooksByIsbn(isbn).then(books =>
      books.map(book => book.id)
    );

    const bookRef = await this.db.runTransaction<firestore.DocumentReference>(
      async tx => {
        const bookPromises = bookIds
          .map(this.mkBookRefById)
          .map(ref => tx.get(ref))
          .map(doc => doc.then(bookFromDoc));
        const books = await Promise.all(bookPromises);

        const borrowedBook = books.find(book => {
          return book.borrowedBy === userId;
        });

        if (!borrowedBook) {
          throw new Error(`isbn(${isbn})は貸し出していないので返せません`);
        }

        const bookRef = this.mkBookRefById(borrowedBook.id);
        tx.update(bookRef, { borrowedBy: null });
        return bookRef;
      }
    );

    return bookRef.get().then(bookFromDoc);
  };

  private mkBookRefById = (bookId: string): firestore.DocumentReference =>
    this.collection.doc(bookId);
}