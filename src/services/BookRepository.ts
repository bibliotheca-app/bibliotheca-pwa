import { firestore } from 'firebase';
import { Book, Omit } from 'src/types';

const bookFromDoc = (doc: firestore.DocumentSnapshot): Book => {
  const data = doc.data()!;

  return {
    id: doc.id,
    isbn: data.isbn,
    title: data.title,
    borrowedBy: data.borrowedBy,
    updatedAt: data.updatedAt.toDate(),
    createdAt: data.createdAt.toDate(),
  };
};

export class BookRepository {
  private collection = this.db.collection('books');

  constructor(private db: firestore.Firestore) {}

  findAllBooks = async (): Promise<Book[]> => {
    const querySnapshot = await this.collection.get();

    return querySnapshot.docs.map(bookFromDoc);
  };

  findBooks = async ({
    after,
    limit,
  }: {
    after?: Book;
    limit: number;
  }): Promise<Book[]> => {
    const orderField: keyof Book = 'createdAt';
    const orderedCollection = this.collection.limit(limit).orderBy(orderField);
    const offsetCollection = after
      ? orderedCollection.startAfter(after.id)
      : orderedCollection;
    return offsetCollection.get().then(qs => qs.docs.map(bookFromDoc));
  };

  findBooksByIsbn = async (isbn: string): Promise<Book[]> => {
    const querySnapshot = await this.collection.where('isbn', '==', isbn).get();

    return querySnapshot.docs.map(bookFromDoc);
  };

  borrowBookById = async (id: string, userId: string): Promise<Book> => {
    const ref = this.mkBookRefById(id);

    this.db.runTransaction(async tx => {
      const borrowableBook = await tx.get(ref).then(bookFromDoc);

      if (!!borrowableBook.borrowedBy) {
        throw new Error(`id(${id})は貸し出せません`);
      }

      tx.update(ref, { borrowedBy: userId, updatedAt: new Date() });
    });

    return ref.get().then(bookFromDoc);
  };

  returnBookById = async (id: string, userId: string): Promise<Book> => {
    const bookRef = await this.db.runTransaction<firestore.DocumentReference>(
      async tx => {
        const ref = this.mkBookRefById(id);
        const borrowedBook = await tx.get(ref).then(bookFromDoc);

        if (borrowedBook.borrowedBy !== userId) {
          throw new Error(`id(${id})は貸し出していないので返せません`);
        }

        tx.update(ref, { borrowedBy: null, updatedAt: new Date() });
        return ref;
      }
    );

    return bookRef.get().then(bookFromDoc);
  };

  borrowBookByIsbn = async (isbn: string, userId: string): Promise<Book> => {
    const bookIds = await this.findBooksByIsbn(isbn).then(books =>
      books.map(book => book.id)
    );

    const bookRef = await this.db.runTransaction<firestore.DocumentReference>(
      async tx => {
        const bookPromises = bookIds
          .map(this.mkBookRefById)
          .map(_ => tx.get(_))
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
        tx.update(ref, { borrowedBy: userId, updatedAt: new Date() });
        return ref;
      }
    );

    return bookRef.get().then(bookFromDoc);
  };

  returnBookByIsbn = async (isbn: string, userId: string): Promise<Book> => {
    const bookIds = await this.findBooksByIsbn(isbn).then(books =>
      books.map(book => book.id)
    );

    const bookRef = await this.db.runTransaction<firestore.DocumentReference>(
      async tx => {
        const bookPromises = bookIds
          .map(this.mkBookRefById)
          .map(_ => tx.get(_))
          .map(doc => doc.then(bookFromDoc));
        const books = await Promise.all(bookPromises);

        const borrowedBook = books.find(book => {
          return book.borrowedBy === userId;
        });

        if (!borrowedBook) {
          throw new Error(`isbn(${isbn})は貸し出していないので返せません`);
        }

        const ref = this.mkBookRefById(borrowedBook.id);
        tx.update(ref, { borrowedBy: null, updatedAt: new Date() });
        return ref;
      }
    );

    return bookRef.get().then(bookFromDoc);
  };

  registerBook = async (bookData: {
    title: string;
    isbn?: string;
  }): Promise<Book> => {
    const book: Omit<Book, 'id'> = {
      ...bookData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const bookRef = await this.collection.add(book);
    return bookRef.get().then(bookFromDoc);
  };

  // 取扱注意
  deleteBookById = async (bookId: string): Promise<Book> => {
    const bookRef = this.mkBookRefById(bookId);
    const book = await bookRef.get().then(bookFromDoc);
    await bookRef.delete();
    return book;
  };

  private mkBookRefById = (bookId: string): firestore.DocumentReference =>
    this.collection.doc(bookId);
}
