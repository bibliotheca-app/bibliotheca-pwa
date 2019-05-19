import { BookBorrowAndReturnButton } from 'bibliotheca/features/book/components/BookBorrowAndReturnBottun';
import { BookActions } from 'bibliotheca/features/book/interface';
import React from 'react';
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
    return (
      <>
        <div>この本は書籍一覧にありません</div>
        <div>isbn: {target.loadedCode}</div>
      </>
    );
  }
  const book = target.book;
  return (
    <>
      <div>
        book title: {book.title}, isbn: {book.isbn}
      </div>
      {!!book.borrowedBy && book.borrowedBy !== userId ? <div>在庫がありません</div> : null}
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
