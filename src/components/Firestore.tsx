import React, { useState } from 'react';

import { firebase } from '../services/firebase';
import { firestore } from 'firebase';
import { useMappedState } from 'typeless';

// 一通りの操作を実装するまでここで実験
type Book = {
  id: string;
  isbn?: number;
  title: string;
  borrowedBy?: string;
};

const bookFromDoc = (doc: firestore.DocumentSnapshot): Book => ({
  id: doc.id,
  ...(doc.data() as any),
});

class BookRepository {
  private collection = this.db.collection('books');

  constructor(private db: firestore.Firestore) {}

  findBooksByIsbn = async (isbn: number): Promise<Book[]> => {
    const querySnapshot = await this.collection.where('isbn', '==', isbn).get();

    return querySnapshot.docs.map(bookFromDoc);
  };

  private mkBookRefById = (bookId: string): firestore.DocumentReference =>
    this.collection.doc(bookId);

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

        const bookRef = this.mkBookRefById(borrowableBook.id);
        tx.update(bookRef, { borrowedBy: userId });
        return bookRef;
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
}

export const BookBorrowForm = () => {
  const { user } = useMappedState(state => state.global);
  const [isbn, setIsbn] = useState('');
  const [bookRepository] = useState(
    () => new BookRepository(firebase.firestore())
  );
  const handleSubmit: React.FormEventHandler = async e => {
    e.preventDefault();

    try {
      const book = await bookRepository.borrowBook(
        parseInt(isbn, 10),
        user!.firebaseAuth.email!
      );
      if (!!book) {
        console.log(book);
      }
    } catch (e) {
      console.error(e);
    }
  };
  const isFormValid = isbn.length > 0;

  return (
    <form onSubmit={handleSubmit}>
      貸出フォーム
      <input
        value={isbn}
        onChange={e => setIsbn(e.target.value)}
        placeholder="ISBN"
        type="text"
        name="isbn"
        required
      />
      <button type="submit" disabled={!isFormValid}>
        貸出
      </button>
    </form>
  );
};

export const BookReturnForm = () => {
  const { user } = useMappedState(state => state.global);
  const [isbn, setIsbn] = useState('');
  const [bookRepository] = useState(
    () => new BookRepository(firebase.firestore())
  );
  const handleSubmit: React.FormEventHandler = async e => {
    e.preventDefault();

    try {
      const book = await bookRepository.returnBook(
        parseInt(isbn, 10),
        user!.firebaseAuth.email!
      );
      if (!!book) {
        console.log(book);
      }
    } catch (e) {
      console.error(e);
    }
  };
  const isFormValid = isbn.length > 0;

  return (
    <form onSubmit={handleSubmit}>
      返却フォーム
      <input
        value={isbn}
        onChange={e => setIsbn(e.target.value)}
        placeholder="ISBN"
        type="text"
        name="isbn"
        required
      />
      <button type="submit" disabled={!isFormValid}>
        返却
      </button>
    </form>
  );
};
