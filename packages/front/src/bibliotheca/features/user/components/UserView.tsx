import { BookActions } from 'bibliotheca/features/book/interface';
import React from 'react';
import { useActions, useMappedState } from 'typeless';
import { Box, Heading, Button } from 'grommet';
import { Link } from 'react-navi';

const BookReturnButton = ({ onBookReturn }: { onBookReturn: () => void }) => (
  <Button primary label="返す" onClick={onBookReturn} />
);

export const UserView = ({ userId: targetUserId }: { userId: string }) => {
  const { userId, borrowedBooks } = useMappedState(state => ({
    userId: state.global.user!.email,
    borrowedBooks: state.user.borrowedBooks,
  }));
  const { returnBookById } = useActions(BookActions);

  return (
    <Box alignSelf="center">
      <Heading level="2">ユーザー: {targetUserId}</Heading>
      <Box>
        <Heading level="3">借りている本</Heading>
        <ol>
          {borrowedBooks.map(book => (
            <li key={book.id}>
              <Link href={`/books/${book.id}`}>{book.title}</Link>
              {userId === targetUserId && (
                <BookReturnButton onBookReturn={() => returnBookById(book.id)} />
              )}
            </li>
          ))}
        </ol>
      </Box>
    </Box>
  );
};
