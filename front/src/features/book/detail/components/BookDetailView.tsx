import { Box, Image, Text } from 'grommet';
import React from 'react';
import { Dashboard } from 'src/components/Dashboard';
import { useMappedState } from 'typeless';

const coverUrl = (isbn: string) => `https://cover.openbd.jp/${isbn}.jpg`;

export const BookDetailView = () => {
  const book = useMappedState(state => state.bookDetail.selectedBook);

  if (!book) {
    return <Dashboard>loading</Dashboard>;
  }

  return (
    <Dashboard>
      <Box>
        <Image fit="contain" src={coverUrl(book.isbn!)} />
      </Box>
      <Text>{JSON.stringify(book, null, 2)}</Text>
    </Dashboard>
  );
};
