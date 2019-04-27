import { Box, Image, Text } from 'grommet';
import React from 'react';

const coverUrl = (isbn: string) => `https://cover.openbd.jp/${isbn}.jpg`;

export const BookDetail = ({ book }: { book: { title: string; isbn?: string } }) => {
  return (
    <>
      <Text>{book.title}</Text>
      <Box>
        <Image fit="contain" src={coverUrl(book.isbn!)} />
      </Box>
    </>
  );
};
