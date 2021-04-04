import { BookBorrowAndReturnButton } from 'bibliotheca/features/book/components/BookBorrowAndReturnBottun';
import { BookActions } from 'bibliotheca/features/book/interface';
import { useActions } from 'typeless';
import { BarcodeProcessTarget } from '../interface';
import { BookDataViewTable } from 'bibliotheca/components/BookDataTable';
import { Box, Text } from 'grommet';

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
      <Box>
        <Text>この本は蔵書に登録されておりません</Text>
        <BookDataViewTable book={{ isbn: target.loadedCode }} />
      </Box>
    );
  }
  const book = target.book;
  return (
    <>
      {!!book.borrowedBy && book.borrowedBy !== userId ? <Text>在庫がありません</Text> : null}
      <BookBorrowAndReturnButton
        onBorrow={() => borrowBookById(book.id)}
        onReturn={() => returnBookById(book.id)}
        userId={userId}
        book={book}
        disabled={isProcessingBook}
      />
      <BookDataViewTable book={book} />
    </>
  );
};
