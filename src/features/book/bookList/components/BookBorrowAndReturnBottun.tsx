import React from 'react';
import { Book } from 'src/types';

interface Props {
  onBorrow: (bookId: string) => void;
  onReturn: (bookId: string) => void;
  book: Book;
  userId: string;
}

export const BookBorrowAndReturnButton: React.SFC<Props> = ({
  onBorrow,
  onReturn,
  book,
  userId,
}) => {
  if (book.borrowedBy === userId) {
    // 借りている時
    return <button onClick={() => onReturn(book.id)}>返却</button>;
  } else if (!book.borrowedBy) {
    // 借りられていない時
    return <button onClick={() => onBorrow(book.id)}>貸出</button>;
  } else {
    // 借りられている時
    return <button disabled>{book.borrowedBy}が借りています</button>;
  }
};
