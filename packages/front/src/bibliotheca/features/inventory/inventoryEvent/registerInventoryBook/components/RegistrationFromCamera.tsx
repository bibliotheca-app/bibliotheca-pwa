import { BookDataViewTable } from 'bibliotheca/components/BookDataTable';
import { BarcodeLoaderView } from 'bibliotheca/features/barcodeLoader/components/BarcodeLoaderView';
import { Book } from 'bibliotheca/types';
import { Button } from 'grommet';
import React from 'react';

export const RegistrationFromCamera = (props: { targetBook?: Book; submit: () => void }) => {
  return (
    <>
      <BarcodeLoaderView />
      {props.targetBook ? (
        <>
          <BookDataViewTable book={props.targetBook} />
          <Button type="button" fill primary label="チェック" onClick={props.submit} />
        </>
      ) : null}
    </>
  );
};
