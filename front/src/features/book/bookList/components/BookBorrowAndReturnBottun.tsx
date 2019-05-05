import { Button } from 'grommet';
import React from 'react';
import { Book } from 'shared/types';

const extractName = (email: string): string => email.split('@')[0];

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
    return <Button primary label="返却" onClick={() => onReturn(book.id)} disabled={disabled} />;
  } else if (!book.borrowedBy) {
    // 借りられていない時
    return <Button label="貸出" onClick={() => onBorrow(book.id)} disabled={disabled} />;
  } else {
    // 借りられている時
    return <Button disabled label={`${extractName(book.borrowedBy)} が借りています`} />;
  }
};
