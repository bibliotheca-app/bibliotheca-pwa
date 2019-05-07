import { BookActions } from 'bibliotheca/features/book/interface';
import React, { useState } from 'react';
import { useActions } from 'typeless';

export const BookBorrowForm = () => {
  const [isbn, setIsbn] = useState('');
  const { borrowBookByIsbn } = useActions(BookActions);

  const handleSubmit: React.FormEventHandler = async e => {
    e.preventDefault();
    borrowBookByIsbn(isbn);
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
  const [isbn, setIsbn] = useState('');
  const { returnBookByIsbn } = useActions(BookActions);

  const handleSubmit: React.FormEventHandler = async e => {
    e.preventDefault();
    returnBookByIsbn(isbn);
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
