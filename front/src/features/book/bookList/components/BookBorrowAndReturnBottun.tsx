import React from 'react';
import { Book } from 'src/types';

interface Props {
  onBorrow: (bookId: string) => void;
  onReturn: (bookId: string) => void;
  book: Book;
  userId: string;
  disabled?: boolean;
}

export const BookBorrowAndReturnButton: React.SFC<Props> = ({
  onBorrow,
  onReturn,
  book,
  userId,
  disabled,
}) => {
  if (book.borrowedBy === userId) {
    // 借りている時
    return (
      <button onClick={() => onReturn(book.id)} disabled={disabled}>
        返却
      </button>
    );
  } else if (!book.borrowedBy) {
    // 借りられていない時
    return (
      <button onClick={() => onBorrow(book.id)} disabled={disabled}>
        貸出
      </button>
    );
  } else {
    // 借りられている時
    return <button disabled>{book.borrowedBy}が借りています</button>;
  }
};
