import { Book } from 'bibliotheca/types';
import { Button, Text } from 'grommet';
import { Link } from 'react-navi';
import { User as UserIcon } from 'grommet-icons';
import * as React from 'react';
import { BORROWABLE } from '../book';

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
    return <Button primary label="返す" onClick={() => onReturn(book.id)} disabled={disabled} />;
  } else if (!book.borrowedBy || book.borrowedBy === BORROWABLE) {
    // 借りられていない時
    return <Button label="借りる" onClick={() => onBorrow(book.id)} disabled={disabled} />;
  } else {
    // 借りられている時
    return (
      <Link href={`/user/${book.borrowedBy}`}>
        <UserIcon />
        <Text>{`${extractName(book.borrowedBy)} が借りています`}</Text>
      </Link>
    );
  }
};
