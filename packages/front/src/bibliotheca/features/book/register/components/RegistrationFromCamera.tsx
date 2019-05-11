import { BookDataTable } from 'bibliotheca/components/BookDataTable';
import { BarcodeLoaderModule } from 'bibliotheca/features/barcodeLoader/module';
import { Button } from 'grommet';
import React from 'react';
import { useActions, useMappedState } from 'typeless';
import { BookRegisterActions } from '../interface';

export const RegistrationFromCamera = () => {
  const { bookData } = useMappedState(state => state.bookRegister);
  const { submit } = useActions(BookRegisterActions);

  return (
    <>
      <BarcodeLoaderModule />
      {bookData ? (
        <>
          <BookDataTable book={bookData} />
          <Button type="button" primary label="登録" onClick={submit} />
        </>
      ) : null}
    </>
  );
};
