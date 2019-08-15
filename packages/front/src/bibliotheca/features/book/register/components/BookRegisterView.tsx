import { SimpleTable } from 'bibliotheca/components/SimpleTable';
import { BarcodeLoaderModule } from 'bibliotheca/features/barcodeLoader/module';
import { Box, Button, Form, FormField, Image } from 'grommet';
import React from 'react';
import { useActions } from 'typeless';
import { BookRegisterActions, getBookRegisterState } from '../interface';
import { openBdRepository } from 'bibliotheca/services/OpenBdRepository';

export const BookRegisterView = () => {
  const {
    bookData: { title, isbn },
    resetButtonRef,
  } = getBookRegisterState.useState();
  const { changeFormValue, submit } = useActions(BookRegisterActions);

  const rows = [
    {
      label: 'タイトル',
      render: () => (
        <FormField
          type="text"
          name="title"
          value={title}
          onChange={e => changeFormValue('title', e.target.value)}
        />
      ),
    },
    {
      label: '画像',
      render: () =>
        isbn ? <Image fit="contain" src={openBdRepository.coverUrl(isbn)} /> : <div>not found</div>,
    },
    {
      label: 'ISBN (or JAN)',
      render: () => (
        <FormField
          type="text"
          name="isbn"
          value={isbn!}
          onChange={e => changeFormValue('isbn', e.target.value)}
        />
      ),
    },
  ];
  return (
    <>
      蔵書登録フォーム
      <Box align="center" justify="center">
        <BarcodeLoaderModule />
        <Form>
          <SimpleTable rows={rows} />
          <Button type="button" primary label="登録" onClick={submit} />
          <button type="reset" ref={resetButtonRef} style={{ display: 'none' }} />
        </Form>
      </Box>
    </>
  );
};
