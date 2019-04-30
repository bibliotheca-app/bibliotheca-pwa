import { Button } from 'grommet';
import React from 'react';
import { BookDetail } from 'src/components/BookDetail';
import { BarcodeLoaderModule } from 'src/features/barcodeLoader/module';
import { Book } from 'src/types';

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
