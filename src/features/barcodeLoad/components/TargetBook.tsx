import React from 'react';
import { BookBorrowAndReturnButton } from 'src/features/book/bookList/components/BookBorrowAndReturnBottun';
import { BookActions } from 'src/features/book/interface';
import { useActions } from 'typeless';
import { BarcodeProcessTarget } from '../interface';

export const TargetBook = ({
  target,
  userId,
  isProcessingBook,
}: {
  target: BarcodeProcessTarget | undefined;
  userId: string;
  isProcessingBook: boolean;
}) => {
  const { borrowBookById, returnBookById } = useActions(BookActions);

  if (!target) {
    return null;
  }

  if ('existsBookInList' in target) {
    return <div>この本は書籍一覧にありません</div>;
  }
  const book = target.book;
  return (
    <>
      <div>
        book title: {book.title}, isbn: {book.isbn}
      </div>
      {!!book.borrowedBy ? null : <div>在庫がありません</div>}
      <BookBorrowAndReturnButton
        onBorrow={() => borrowBookById(book.id)}
        onReturn={() => returnBookById(book.id)}
        userId={userId}
        book={book}
        disabled={isProcessingBook}
      />
    </>
  );
};
