import { Button, Form, FormField } from 'grommet';
import React from 'react';
import { Dashboard } from 'src/components/Dashboard';
import { GrommetFormHandler } from 'src/types';
import { useActions, useMappedState } from 'typeless';
import { BookActions } from '../../interface';

export const BookRegisterView = () => {
  const { registerBook } = useActions(BookActions);
  const registeredBook = useMappedState(
    state => state.bookRegister.registeredBook
  );

  const handleSubmit: GrommetFormHandler<{
    title: string;
    isbn: string;
  }> = e => {
    e.preventDefault();
    registerBook(e.value);
  };

  return (
    <Dashboard>
      <Form onSubmit={handleSubmit}>
        蔵書登録フォーム
        <FormField name="title" label="タイトル" required />
        <FormField
          name="isbn"
          label="ISBN"
          required
          validate={{
            regexp: /(978|979)[0-9]{10}/,
            message:
              '978または979のいずれかから始まる13桁の数値を入力してください',
          }}
        />
        <Button type="submit" primary label="登録" />
      </Form>
      {registeredBook ? JSON.stringify(registeredBook) : ''}
    </Dashboard>
  );
};
