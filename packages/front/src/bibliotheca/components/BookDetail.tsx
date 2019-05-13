import { BookBorrowAndReturnButton } from 'bibliotheca/features/book/components/BookBorrowAndReturnBottun';
import { BookActions } from 'bibliotheca/features/book/interface';
import { userIdQuery } from 'bibliotheca/features/global/query';
import { useConfirm } from 'bibliotheca/hooks/useConfirm';
import { Book } from 'bibliotheca/types';
import { Box, Button, Form } from 'grommet';
import {
  Edit as EditIcon,
  Trash as DeleteIcon,
  Save as SaveIcon,
  Close as CloseIcon,
} from 'grommet-icons';
import React, { useState } from 'react';
import { useActions, useMappedState } from 'typeless';
import { BookDataViewTable, BookDataEditTable } from './BookDataTable';

export const BookDetail = ({ book }: { book: Book }) => {
  const { borrowBookById, returnBookById } = useActions(BookActions);
  const userId = useMappedState(s => userIdQuery(s.global));

  const { show: showDeleteConfirm, render: renderDeleteConfirm } = useConfirm({
    cancelButton: 'Cancel',
    confirmButton: 'Ok',
    content: `Delete book: ${book.title})`,
    onCancel: () => console.log('cancel'),
    onConfirm: () => console.log('confirm'),
    responsive: false,
  });

  const [editMode, setEditMode] = useState(false);

  return (
    <Box>
      <Box alignSelf="center" style={{ maxWidth: '500px' }}>
        {!editMode ? (
          <>
            <Box fill gap="xsmall" justify="end" direction="row">
              <Button icon={<EditIcon />} plain={false} onClick={() => setEditMode(true)} />
              <Button
                icon={<DeleteIcon />}
                plain={false}
                onClick={() => {
                  console.log('delete');
                  showDeleteConfirm();
                }}
              />
            </Box>
            {renderDeleteConfirm()}
            <BookDataViewTable book={book} />
            <BookBorrowAndReturnButton
              onBorrow={borrowBookById}
              onReturn={returnBookById}
              book={book}
              userId={userId}
            />
          </>
        ) : (
          <Form
            onSubmit={(e: any) => {
              console.log(e.value);
              setEditMode(false);
            }}
          >
            <Box fill gap="xsmall" justify="end" direction="row">
              <Button icon={<SaveIcon />} plain={false} type="submit" />
              <Button icon={<CloseIcon />} plain={false} onClick={() => setEditMode(false)} />
            </Box>
            <BookDataEditTable book={book} />
          </Form>
        )}
      </Box>
    </Box>
  );
};
