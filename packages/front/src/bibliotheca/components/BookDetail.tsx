import { Form } from 'bibliotheca/components/Form';
import { BookBorrowAndReturnButton } from 'bibliotheca/features/book/components/BookBorrowAndReturnBottun';
import { BookActions } from 'bibliotheca/features/book/interface';
import { userIdQuery } from 'bibliotheca/features/global/query';
import { useConfirm } from 'bibliotheca/hooks/useConfirm';
import { Book, BookEditData, Omit } from 'bibliotheca/types';
import { Box, Button } from 'grommet';
import {
  Close as CloseIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Trash as DeleteIcon,
} from 'grommet-icons';
import React, { useState } from 'react';
import { useActions, useMappedState } from 'typeless';
import { BookDataEditTable, BookDataViewTable } from './BookDataTable';
import { useConfirmWithData } from 'bibliotheca/hooks/useConfirmWithData';

export const BookDetail = ({ book }: { book: Book }) => {
  const { borrowBookById, returnBookById, deleteBookById, editBook } = useActions(BookActions);
  const userId = useMappedState(s => userIdQuery(s.global));

  const { show: showDeleteConfirm, render: renderDeleteConfirm } = useConfirm({
    cancelButton: '取り消し',
    confirmButton: '削除',
    content: `次の本を削除しますか: ${book.title}`,
    onCancel: () => console.log('cancel: delete'),
    onConfirm: () => deleteBookById(book.id),
    responsive: false,
  });

  const { show: showSaveConfirm, render: renderShowConfirm } = useConfirmWithData<
    Omit<BookEditData, 'id'>
  >({
    cancelButton: '取り消し',
    confirmButton: '保存',
    content: `次の本の内容を保存しますか: ${book.title}`,
    onCancel: () => {
      console.log('cancel: save');
    },
    onConfirm: data => {
      editBook({ ...data, id: book.id });
      setEditMode(false);
    },
    responsive: false,
  });

  const [editMode, setEditMode] = useState(false);

  return (
    <Box>
      <Box alignSelf="center" style={{ maxWidth: '500px' }}>
        {!editMode ? (
          <>
            {renderDeleteConfirm()}
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
              showSaveConfirm(e.value);
            }}
          >
            {renderShowConfirm()}
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
