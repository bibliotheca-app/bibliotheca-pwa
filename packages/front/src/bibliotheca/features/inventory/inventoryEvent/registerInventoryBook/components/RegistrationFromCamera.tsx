import { BookDetail } from 'bibliotheca/components/BookDetail';
import { BarcodeLoaderModule } from 'bibliotheca/features/barcodeLoader/module';
import { Book } from 'bibliotheca/types';
import { Button } from 'grommet';
import React from 'react';

// todo: combine register form's `RegistrationFromCamera` Component
export const RegistrationFromCamera = (props: { targetBook?: Book; submit: () => void }) => {
  return (
    <>
      <BarcodeLoaderModule />
      {props.targetBook ? (
        <>
          <BookDetail book={props.targetBook} />
          <Button type="button" primary label="登録" onClick={props.submit} />
        </>
      ) : null}
    </>
  );
};