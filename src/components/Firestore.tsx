import React, { useState } from 'react';

import { bookRepository } from 'src/services/ServiceContainer';
import { useMappedState } from 'typeless';

export const BookBorrowForm = () => {
  const { user } = useMappedState(state => state.global);
  const [isbn, setIsbn] = useState('');
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
