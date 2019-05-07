import { GrommetFormHandler } from 'bibliotheca/types';
import { Button, Form, FormField } from 'grommet';
import React from 'react';
import { useActions, useMappedState } from 'typeless';
import { BookActions } from '../../interface';

export const RegistrationFromManual = () => {
  const { registerBook } = useActions(BookActions);
  const registeredBook = useMappedState(state => state.bookRegister.registeredBook);

  const handleSubmit: GrommetFormHandler<{
    title: string;
    isbn: string;
  }> = e => {
    e.preventDefault();
    registerBook(e.value);
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <FormField name="title" label="タイトル" required />
        <FormField
          name="isbn"
          label="ISBN"
          required
          validate={{
            regexp: /(978|979)[0-9]{10}/,
            message: '978または979のいずれかから始まる13桁の数値を入力してください',
          }}
        />
        <Button type="submit" primary label="登録" />
      </Form>
      {registeredBook ? JSON.stringify(registeredBook) : ''}
    </>
  );
};
