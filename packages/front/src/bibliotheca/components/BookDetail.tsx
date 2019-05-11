import { BookBorrowAndReturnButton } from 'bibliotheca/features/book/components/BookBorrowAndReturnBottun';
import { BookActions } from 'bibliotheca/features/book/interface';
import { userIdQuery } from 'bibliotheca/features/global/query';
import { Book } from 'bibliotheca/types';
import { Box, Button } from 'grommet';
import {
  Edit as EditIcon,
  Trash as DeleteIcon,
  Save as SaveIcon,
  Close as CloseIcon,
} from 'grommet-icons';
import React, { useState } from 'react';
import { useActions, useMappedState } from 'typeless';
import { BookDataTable } from './BookDataTable';

export const BookDetail = ({ book }: { book: Book }) => {
  const { borrowBookById, returnBookById } = useActions(BookActions);
  const userId = useMappedState(s => userIdQuery(s.global));

  const [editMode, setEditMode] = useState(false);

  const Buttons = () =>
    !editMode ? (
      <Box fill gap="xsmall" justify="end" direction="row">
        <Button icon={<EditIcon />} plain={false} onClick={() => setEditMode(true)} />
        <Button icon={<DeleteIcon />} plain={false} onClick={() => console.log('delete')} />
      </Box>
    ) : (
      <Box fill gap="xsmall" justify="end" direction="row">
        <Button icon={<SaveIcon />} plain={false} onClick={() => setEditMode(false)} />
        <Button icon={<CloseIcon />} plain={false} onClick={() => setEditMode(false)} />
      </Box>
    );

  const Main = () =>
    !editMode ? (
      <>
        <BookDataTable book={book} />
        <BookBorrowAndReturnButton
          onBorrow={borrowBookById}
          onReturn={returnBookById}
          book={book}
          userId={userId}
        />
      </>
    ) : (
      <BookDataTable book={book} edit={editMode} />
    );

  return (
    <Box>
      <Box alignSelf="center" style={{ maxWidth: '500px' }}>
        <Buttons />
        <Main />
      </Box>
    </Box>
  );
};
